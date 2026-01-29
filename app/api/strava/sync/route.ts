import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerClient } from '@/lib/supabase/server';
import {
  getValidAccessToken,
  getAllActivities,
  getAthleteStats,
  getActivity,
  type StravaActivity,
} from '@/lib/strava/client';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createServerClient();

    // Step 1: Get athlete profile by clerk_user_id
    console.log('[v0] Fetching athlete profile for user:', userId);
    const { data: athleteProfile, error: profileError } = await supabase
      .from('athlete_profiles')
      .select('id, strava_athlete_id')
      .eq('clerk_user_id', userId)
      .single();

    if (profileError || !athleteProfile) {
      console.error('[v0] Failed to find athlete profile:', profileError);
      return NextResponse.json(
        { error: 'Athlete profile not found' },
        { status: 404 }
      );
    }

    const athleteId = athleteProfile.id;
    console.log('[v0] Found athlete profile:', athleteId);

    // Step 2: Get stored tokens
    console.log('[v0] Fetching Strava tokens');
    const { data: tokenData, error: tokenError } = await supabase
      .from('strava_tokens')
      .select('*')
      .eq('athlete_id', athleteId)
      .single();

    if (tokenError || !tokenData) {
      console.error('[v0] Failed to fetch Strava tokens:', tokenError);
      return NextResponse.json(
        { error: 'Strava not connected. Please connect your Strava account first.' },
        { status: 400 }
      );
    }

    // Step 3: Get valid access token (refresh if needed)
    console.log('[v0] Validating access token');
    const expiresAtTimestamp = Math.floor(
      new Date(tokenData.token_expires_at).getTime() / 1000
    );
    
    const { accessToken, refreshToken, expiresAt, refreshed } =
      await getValidAccessToken(
        tokenData.access_token,
        tokenData.refresh_token,
        expiresAtTimestamp
      );

    // Update tokens if refreshed
    if (refreshed) {
      console.log('[v0] Tokens refreshed, updating in database');
      await supabase
        .from('strava_tokens')
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          token_expires_at: new Date(expiresAt * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('athlete_id', athleteId);
    }

    // Step 4: Get sync state to determine what to fetch
    console.log('[v0] Fetching sync state');
    const { data: syncState } = await supabase
      .from('strava_sync_state')
      .select('*')
      .eq('athlete_id', athleteId)
      .single();

    const afterTimestamp = syncState?.last_synced_at
      ? Math.floor(new Date(syncState.last_synced_at).getTime() / 1000)
      : undefined;

    // Step 5: Fetch activities from Strava
    console.log('[v0] Fetching activities from Strava, after:', afterTimestamp);
    const activities = await getAllActivities(accessToken, {
      after: afterTimestamp,
    });

    console.log('[v0] Fetched', activities.length, 'activities from Strava');

    // Step 6: Transform and save activities
    if (activities.length > 0) {
      const transformedActivities = activities.map((activity: StravaActivity) => ({
        athlete_id: athleteId,
        strava_activity_id: activity.id,
        name: activity.name,
        type: activity.type,
        sport_type: activity.sport_type,
        description: activity.description || null,
        start_date: activity.start_date,
        start_date_local: activity.start_date_local,
        timezone: activity.timezone,
        moving_time: activity.moving_time,
        elapsed_time: activity.elapsed_time,
        distance: activity.distance,
        total_elevation_gain: activity.total_elevation_gain,
        average_speed: activity.average_speed,
        max_speed: activity.max_speed,
        average_heartrate: activity.average_heartrate || null,
        max_heartrate: activity.max_heartrate || null,
        average_cadence: activity.average_cadence || null,
        average_watts: activity.average_watts || null,
        max_watts: activity.max_watts || null,
        kilojoules: activity.kilojoules || null,
        calories: activity.calories || null,
        suffer_score: activity.suffer_score || null,
        gear_id: activity.gear_id || null,
        trainer: activity.trainer || false,
        commute: activity.commute || false,
        manual: activity.manual || false,
        private: activity.private || false,
        achievement_count: activity.achievement_count || 0,
        kudos_count: activity.kudos_count || 0,
        comment_count: activity.comment_count || 0,
        athlete_count: activity.athlete_count || 0,
        photo_count: activity.photo_count || 0,
        map_summary_polyline: activity.map?.summary_polyline || null,
        updated_at: new Date().toISOString(),
      }));

      // Batch upsert activities
      console.log('[v0] Upserting', transformedActivities.length, 'activities');
      const { error: upsertError } = await supabase
        .from('activities')
        .upsert(transformedActivities, {
          onConflict: 'strava_activity_id',
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error('[v0] Failed to upsert activities:', upsertError);
        return NextResponse.json(
          { error: 'Failed to save activities' },
          { status: 500 }
        );
      }

      // Step 7: Create training logs from synced activities
      console.log('[v0] Creating training logs from synced activities');
      const trainingLogs = transformedActivities.map((activity) => ({
        athlete_id: athleteId,
        log_date: activity.start_date,
        activity_name: activity.name,
        activity_type: activity.type,
        duration_minutes: Math.round(activity.moving_time / 60),
        distance_km: activity.distance ? activity.distance / 1000 : null,
        elevation_gain_m: activity.total_elevation_gain || null,
        average_heart_rate: activity.average_heartrate ? Math.round(activity.average_heartrate) : null,
        max_heart_rate: activity.max_heartrate || null,
        average_power_watts: activity.average_watts || null,
        max_power_watts: activity.max_watts || null,
        calories_burned: activity.calories || null,
        synced_from_strava: true,
        strava_activity_id: activity.strava_activity_id,
        updated_at: new Date().toISOString(),
      }));

      const { error: logsError } = await supabase
        .from('training_logs')
        .upsert(trainingLogs, {
          onConflict: 'strava_activity_id',
          ignoreDuplicates: false,
        });

      if (logsError) {
        console.error('[v0] Failed to upsert training logs:', logsError);
        // Don't fail the sync just because training logs failed
      }
    }

    // Step 8: Update sync state
    console.log('[v0] Updating sync state');
    await supabase
      .from('strava_sync_state')
      .update({
        last_synced_at: new Date().toISOString(),
        sync_status: 'completed',
        last_error: null,
        error_count: 0,
        initial_backfill_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('athlete_id', athleteId);

    // Step 9: Get activity summary
    const { count } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', athleteId);

    console.log('[v0] Sync completed successfully');
    return NextResponse.json({
      success: true,
      synced: activities.length,
      total: count,
    });
  } catch (error) {
    console.error('[v0] Strava sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync with Strava' },
      { status: 500 }
    );
  }
}
