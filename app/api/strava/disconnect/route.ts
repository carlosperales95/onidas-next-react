import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient();

    // Get athlete profile to get athlete_id
    console.log('[v0] Fetching athlete profile');
    const { data: athleteProfile, error: profileError } = await supabase
      .from('athlete_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (profileError || !athleteProfile) {
      console.error('[v0] Failed to find athlete profile:', profileError);
      return NextResponse.json(
        { error: 'Athlete profile not found' },
        { status: 404 }
      );
    }

    // Delete Strava tokens
    console.log('[v0] Deleting tokens for athlete:', athleteProfile.id);
    const { error: deleteError } = await supabase
      .from('strava_tokens')
      .delete()
      .eq('athlete_id', athleteProfile.id);

    if (deleteError) {
      console.error('[v0] Failed to delete tokens:', deleteError);
      return NextResponse.json(
        { error: 'Failed to disconnect' },
        { status: 500 }
      );
    }

    console.log('[v0] Strava disconnected successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Strava disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect from Strava' },
      { status: 500 }
    );
  }
}
