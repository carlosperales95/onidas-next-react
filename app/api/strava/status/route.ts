import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('[v0] Strava status route called');
    
    const { userId } = await auth();
    console.log('[v0] User ID from auth:', userId);

    if (!userId) {
      console.log('[v0] No user ID, returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient();

    // Step 1: Get athlete profile
    console.log('[v0] Fetching athlete profile for user:', userId);
    const { data: athleteProfile, error: profileError } = await supabase
      .from('athlete_profiles')
      .select('id, strava_athlete_id, firstname, lastname, profile_medium')
      .eq('clerk_user_id', userId)
      .single();

    if (profileError || !athleteProfile) {
      console.log('[v0] No athlete profile found');
      return NextResponse.json({
        connected: false,
        lastSync: null,
        athleteId: null,
        athleteName: null,
        athleteImage: null,
        summary: null,
      });
    }

    // Step 2: Get Strava connection status
    console.log('[v0] Fetching strava_tokens for athlete:', athleteProfile.id);
    const { data: tokenData, error: tokenError } = await supabase
      .from('strava_tokens')
      .select('access_token')
      .eq('athlete_id', athleteProfile.id)
      .single();

    if (tokenError) {
      console.error('[v0] Error fetching tokens:', tokenError);
    }
    console.log('[v0] Token data:', tokenData ? 'found' : 'not found');

    if (!tokenData || !tokenData.access_token) {
      console.log('[v0] No valid token, returning not connected');
      return NextResponse.json({
        connected: false,
        lastSync: null,
        athleteId: null,
        athleteName: null,
        athleteImage: null,
        summary: null,
      });
    }

    // Step 3: Get sync state for last sync time
    console.log('[v0] Fetching sync state');
    const { data: syncState } = await supabase
      .from('strava_sync_state')
      .select('last_synced_at')
      .eq('athlete_id', athleteProfile.id)
      .single();

    // Step 4: Get activity summary
    console.log('[v0] Fetching activities for athlete');
    const { data: activities, count, error: activitiesError } = await supabase
      .from('activities')
      .select('type, distance, moving_time, total_elevation_gain', { count: 'exact' })
      .eq('athlete_id', athleteProfile.id);

    if (activitiesError) {
      console.error('[v0] Error fetching activities:', activitiesError);
    }
    console.log('[v0] Activities count:', count || 0);

    // Calculate summary stats
    const summary = {
      totalActivities: count || 0,
      totalDistance: 0,
      totalTime: 0,
      totalElevation: 0,
      byType: {} as Record<string, { count: number; distance: number; time: number }>,
    };

    if (activities) {
      activities.forEach((activity) => {
        summary.totalDistance += activity.distance || 0;
        summary.totalTime += activity.moving_time || 0;
        summary.totalElevation += activity.total_elevation_gain || 0;

        const type = activity.type || 'Other';
        if (!summary.byType[type]) {
          summary.byType[type] = { count: 0, distance: 0, time: 0 };
        }
        summary.byType[type].count += 1;
        summary.byType[type].distance += activity.distance || 0;
        summary.byType[type].time += activity.moving_time || 0;
      });
    }

    const athleteName = [athleteProfile.firstname, athleteProfile.lastname]
      .filter(Boolean)
      .join(' ') || 'Athlete';

    console.log('[v0] Returning connected status for athlete:', athleteProfile.strava_athlete_id);
    return NextResponse.json({
      connected: true,
      athleteId: athleteProfile.strava_athlete_id,
      athleteName,
      athleteImage: athleteProfile.profile_medium,
      lastSync: syncState?.last_synced_at,
      summary,
    });
  } catch (error) {
    console.error('[v0] Strava status error:', error);
    return NextResponse.json(
      { error: 'Failed to get Strava status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
