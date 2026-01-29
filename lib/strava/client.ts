// Strava API Client Utilities
// Handles OAuth flow and API interactions

const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  athlete?: StravaAthlete;
}

export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  profile: string;
  profile_medium: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  average_watts?: number;
  kilojoules?: number;
  calories?: number;
  description?: string;
  workout_type?: number;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: string;
  gear_id?: string;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map?: {
    id: string;
    summary_polyline: string;
    polyline?: string;
  };
  suffer_score?: number;
}

export interface StravaAthleteStats {
  biggest_ride_distance: number;
  biggest_climb_elevation_gain: number;
  recent_ride_totals: StravaTotals;
  recent_run_totals: StravaTotals;
  recent_swim_totals: StravaTotals;
  ytd_ride_totals: StravaTotals;
  ytd_run_totals: StravaTotals;
  ytd_swim_totals: StravaTotals;
  all_ride_totals: StravaTotals;
  all_run_totals: StravaTotals;
  all_swim_totals: StravaTotals;
}

export interface StravaTotals {
  count: number;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  elevation_gain: number;
  achievement_count?: number;
}

/**
 * Generate the Strava OAuth authorization URL
 */
export function getStravaAuthUrl(state: string): string {
  const clientId = process.env.NEXT_STRAVA_CLIENT_ID;
  const redirectUri = process.env.NEXT_STRAVA_REDIRECT_URI;
  
  console.log('[v0] Strava config check - clientId:', clientId ? 'present' : 'missing');
  console.log('[v0] Strava config check - redirectUri:', redirectUri ? redirectUri : 'missing');
  
  if (!clientId || !redirectUri) {
    throw new Error(`Missing Strava configuration: clientId=${!!clientId}, redirectUri=${!!redirectUri}`);
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'read,activity:read_all,profile:read_all',
    state: state,
  });

  return `${STRAVA_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<StravaTokens> {
  const clientId = process.env.NEXT_STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Strava configuration');
  }

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  return response.json();
}

/**
 * Refresh expired access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<StravaTokens> {
  const clientId = process.env.NEXT_STRAVA_CLIENT_ID;
  const clientSecret = process.env.NEXT_STRAVA_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Strava configuration');
  }

  const response = await fetch(STRAVA_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}

/**
 * Make authenticated request to Strava API
 */
export async function stravaApiRequest<T>(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${STRAVA_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Strava API error: ${error}`);
  }

  return response.json();
}

/**
 * Get authenticated athlete profile
 */
export async function getAthlete(accessToken: string): Promise<StravaAthlete> {
  return stravaApiRequest<StravaAthlete>('/athlete', accessToken);
}

/**
 * Get athlete statistics
 */
export async function getAthleteStats(
  athleteId: number,
  accessToken: string
): Promise<StravaAthleteStats> {
  return stravaApiRequest<StravaAthleteStats>(
    `/athletes/${athleteId}/stats`,
    accessToken
  );
}

/**
 * Get activities with pagination
 */
export async function getActivities(
  accessToken: string,
  options: {
    before?: number;
    after?: number;
    page?: number;
    perPage?: number;
  } = {}
): Promise<StravaActivity[]> {
  const params = new URLSearchParams();
  
  if (options.before) params.set('before', options.before.toString());
  if (options.after) params.set('after', options.after.toString());
  if (options.page) params.set('page', options.page.toString());
  if (options.perPage) params.set('per_page', options.perPage.toString());

  const query = params.toString();
  const endpoint = `/athlete/activities${query ? `?${query}` : ''}`;
  
  return stravaApiRequest<StravaActivity[]>(endpoint, accessToken);
}

/**
 * Get all activities (handles pagination automatically)
 */
export async function getAllActivities(
  accessToken: string,
  options: { after?: number; before?: number } = {}
): Promise<StravaActivity[]> {
  const allActivities: StravaActivity[] = [];
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  while (hasMore) {
    const activities = await getActivities(accessToken, {
      ...options,
      page,
      perPage,
    });

    allActivities.push(...activities);
    hasMore = activities.length === perPage;
    page++;

    // Safety limit to prevent infinite loops
    if (page > 100) break;
  }

  return allActivities;
}

/**
 * Get detailed activity by ID
 */
export async function getActivity(
  activityId: number,
  accessToken: string
): Promise<StravaActivity> {
  return stravaApiRequest<StravaActivity>(`/activities/${activityId}`, accessToken);
}

/**
 * Check if token is expired (with 5 minute buffer)
 */
export function isTokenExpired(expiresAt: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now >= expiresAt - 300; // 5 minute buffer
}

/**
 * Get valid access token (refreshes if needed)
 */
export async function getValidAccessToken(
  accessToken: string,
  refreshToken: string,
  expiresAt: number
): Promise<{ accessToken: string; refreshToken: string; expiresAt: number; refreshed: boolean }> {
  if (!isTokenExpired(expiresAt)) {
    return { accessToken, refreshToken, expiresAt, refreshed: false };
  }

  const newTokens = await refreshAccessToken(refreshToken);
  return {
    accessToken: newTokens.access_token,
    refreshToken: newTokens.refresh_token,
    expiresAt: newTokens.expires_at,
    refreshed: true,
  };
}
