'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Link2, RefreshCw, Unlink, Activity, Clock, Mountain, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/lib/hooks/use-translation';

interface StravaSummary {
  totalActivities: number;
  totalDistance: number;
  totalTime: number;
  totalElevation: number;
  byType: Record<string, { count: number; distance: number; time: number }>;
}

interface StravaStatus {
  connected: boolean;
  athleteId: number | null;
  lastSync: string | null;
  connectedAt: string | null;
  scope: string | null;
  summary: StravaSummary | null;
}

interface SyncResult {
  success: boolean;
  synced: number;
  total: number;
}

export function StravaConnect() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<StravaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/strava/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        throw new Error('Failed to fetch status');
      }
    } catch {
      setError('Failed to check Strava connection status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    
    // Check URL params for callback results
    const params = new URLSearchParams(window.location.search);
    if (params.get('strava_connected') === 'true') {
      setSyncResult({ success: true, synced: 0, total: 0 });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (params.get('strava_error')) {
      setError(`Connection failed: ${params.get('strava_error')}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [fetchStatus]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);
      const response = await fetch('/api/strava/auth');
      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        throw new Error('Failed to get auth URL');
      }
    } catch {
      setError('Failed to connect to Strava');
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      setError(null);
      setSyncResult(null);
      const response = await fetch('/api/strava/sync', { method: 'POST' });
      if (response.ok) {
        const result = await response.json();
        setSyncResult(result);
        await fetchStatus();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Sync failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync with Strava');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect from Strava? Your synced activities will remain.')) {
      return;
    }
    
    try {
      setDisconnecting(true);
      setError(null);
      const response = await fetch('/api/strava/disconnect', { method: 'POST' });
      if (response.ok) {
        setStatus({ connected: false, athleteId: null, lastSync: null, connectedAt: null, scope: null, summary: null });
        setSyncResult(null);
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch {
      setError('Failed to disconnect from Strava');
    } finally {
      setDisconnecting(false);
    }
  };

  const formatDistance = (meters: number) => {
    const km = meters / 1000;
    return km >= 1000 ? `${(km / 1000).toFixed(1)}k km` : `${km.toFixed(1)} km`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const formatElevation = (meters: number) => {
    return meters >= 1000 ? `${(meters / 1000).toFixed(1)}k m` : `${Math.round(meters)} m`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FC4C02]">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-lg">{t('settings.integrations.strava.title')}</CardTitle>
            <CardDescription>
              {status?.connected
                ? t('settings.integrations.strava.connected')
                : t('settings.integrations.strava.description')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {syncResult && syncResult.success && (
          <Alert>
            <AlertDescription>
              {syncResult.synced > 0
                ? `Successfully synced ${syncResult.synced} new activities. Total: ${syncResult.total}`
                : 'Sync complete. No new activities found.'}
            </AlertDescription>
          </Alert>
        )}

        {status?.connected ? (
          <>
            {/* Stats Summary */}
            {status.summary && status.summary.totalActivities > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs">{t('settings.integrations.strava.activities')}</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold">
                    {status.summary.totalActivities}
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs">{t('settings.integrations.strava.distance')}</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold">
                    {formatDistance(status.summary.totalDistance)}
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">{t('settings.integrations.strava.time')}</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold">
                    {formatTime(status.summary.totalTime)}
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mountain className="h-4 w-4" />
                    <span className="text-xs">{t('settings.integrations.strava.elevation')}</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold">
                    {formatElevation(status.summary.totalElevation)}
                  </p>
                </div>
              </div>
            )}

            {/* Activity breakdown by type */}
            {status.summary && Object.keys(status.summary.byType).length > 0 && (
              <div className="rounded-lg border p-3">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  {t('settings.integrations.strava.activityBreakdown')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(status.summary.byType)
                    .sort((a, b) => b[1].count - a[1].count)
                    .slice(0, 5)
                    .map(([type, data]) => (
                      <div
                        key={type}
                        className="flex items-center gap-2 rounded-full bg-muted px-3 py-1"
                      >
                        <span className="text-sm font-medium">{type}</span>
                        <span className="text-xs text-muted-foreground">
                          {data.count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Last sync info */}
            {status.lastSync && (
              <p className="text-sm text-muted-foreground">
                {t('settings.integrations.strava.lastSync')}: {new Date(status.lastSync).toLocaleString()}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSync} disabled={syncing}>
                {syncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('settings.integrations.strava.syncing')}
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('settings.integrations.strava.importLatest')}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={disconnecting}
              >
                {disconnecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Unlink className="mr-2 h-4 w-4" />
                )}
                {t('settings.integrations.strava.disconnect')}
              </Button>
            </div>
          </>
        ) : (
          <Button onClick={handleConnect} disabled={connecting} className="bg-[#FC4C02] hover:bg-[#e34402]">
            {connecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('settings.integrations.strava.connecting')}
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                {t('settings.integrations.strava.connect')}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
