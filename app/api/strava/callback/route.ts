import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { exchangeCodeForTokens } from '@/lib/strava/client';

export async function GET(request: NextRequest) {
  console.log('[v0] Strava callback route called');
  
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  console.log('[v0] Callback params - code:', !!code, 'state:', state, 'error:', error);

  // Handle user denial
  if (error) {
    console.log('[v0] User denied access, redirecting with error');
    return NextResponse.redirect(
      new URL('/settings?strava_error=access_denied', request.url)
    );
  }

  if (!code || !state) {
    console.log('[v0] Missing code or state, redirecting with error');
    return NextResponse.redirect(
      new URL('/settings?strava_error=invalid_request', request.url)
    );
  }

  try {
    console.log('[v0] Exchanging code for tokens');
    const clerkUserId = state;

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    console.log('[v0] Tokens received, athlete ID:', tokens.athlete?.id);

    const supabase = await createServerClient();

    // Step 1: Ensure athlete profile exists
    console.log('[v0] Creating/updating athlete profile');
    const { data: athleteProfile, error: profileError } = await supabase
      .from('athlete_profiles')
      .upsert(
        {
          clerk_user_id: clerkUserId,
          strava_athlete_id: tokens.athlete?.id || null,
          username: tokens.athlete?.username || null,
          firstname: tokens.athlete?.firstname || null,
          lastname: tokens.athlete?.lastname || null,
          sex: tokens.athlete?.sex === 'M' ? 'M' : tokens.athlete?.sex === 'F' ? 'F' : null,
          country: tokens.athlete?.country || null,
          city: tokens.athlete?.city || null,
          state: tokens.athlete?.state || null,
          profile_medium: tokens.athlete?.profile_medium || null,
          profile: tokens.athlete?.profile || null,
          premium: false,
          summit: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'clerk_user_id' }
      )
      .select()
      .single();

    if (profileError || !athleteProfile) {
      console.error('[v0] Failed to create/update athlete profile:', profileError);
      return NextResponse.redirect(
        new URL('/settings?strava_error=profile_creation', request.url)
      );
    }

    console.log('[v0] Athlete profile created/updated, ID:', athleteProfile.id);

    // Step 2: Store tokens in strava_tokens table
    console.log('[v0] Storing Strava tokens');
    const { error: tokenError } = await supabase
      .from('strava_tokens')
      .upsert(
        {
          clerk_user_id: clerkUserId,
          athlete_id: athleteProfile.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: new Date(tokens.expires_at * 1000).toISOString(),
          token_type: 'Bearer',
          strava_athlete_id: tokens.athlete?.id || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'clerk_user_id' }
      );

    if (tokenError) {
      console.error('[v0] Failed to store tokens:', tokenError);
      return NextResponse.redirect(
        new URL('/settings?strava_error=token_storage', request.url)
      );
    }

    console.log('[v0] Tokens stored successfully');

    // Step 3: Initialize sync state for the athlete
    console.log('[v0] Creating sync state for athlete');
    await supabase
      .from('strava_sync_state')
      .upsert(
        {
          athlete_id: athleteProfile.id,
          sync_status: 'pending',
          initial_backfill_completed: false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'athlete_id' }
      );

    console.log('[v0] Strava connection setup complete, redirecting to settings');
    // Redirect to settings with success message
    return NextResponse.redirect(
      new URL('/settings?strava_connected=true', request.url)
    );
  } catch (err) {
    console.error('[v0] Strava callback error:', err);
    return NextResponse.redirect(
      new URL(`/settings?strava_error=exchange_failed&details=${encodeURIComponent(err instanceof Error ? err.message : 'Unknown error')}`, request.url)
    );
  }
}
