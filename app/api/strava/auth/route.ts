import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getStravaAuthUrl } from '@/lib/strava/client';

export async function GET() {
  try {
    console.log('[v0] Strava auth route called');
    
    const { userId } = await auth();
    console.log('[v0] User ID from auth:', userId);

    if (!userId) {
      console.log('[v0] No user ID found, returning 401');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use user ID as state to verify callback
    const state = userId;
    console.log('[v0] Generating Strava auth URL with state:', state);
    
    const authUrl = getStravaAuthUrl(state);
    console.log('[v0] Generated auth URL:', authUrl);

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('[v0] Strava auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate auth URL', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
