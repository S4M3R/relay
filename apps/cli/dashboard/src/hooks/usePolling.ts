import { useState, useEffect, useRef, useCallback } from 'react';
import { apiGet } from '../lib/api';

interface UsePollingOptions {
  /** API endpoint path to poll */
  endpoint: string;
  /** Polling interval in milliseconds */
  interval: number;
  /** Whether polling is enabled (defaults to true) */
  enabled?: boolean;
}

interface UsePollingResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Trigger an immediate refresh */
  refresh: () => void;
}

const BASE_INTERVAL_MULTIPLIER = 1;
const MAX_BACKOFF_MS = 30_000;

/**
 * Generic polling hook that fetches data at regular intervals.
 * Pauses when the browser tab is hidden (document.visibilitychange).
 * Implements exponential backoff on consecutive failures (max 30s).
 */
export function usePolling<T>(options: UsePollingOptions): UsePollingResult<T> {
  const { endpoint, interval, enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const consecutiveFailures = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVisible = useRef(true);
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await apiGet<T>(endpoint);
      if (!isMounted.current) return;
      setData(result);
      setError(null);
      setLoading(false);
      consecutiveFailures.current = 0;
    } catch (err) {
      if (!isMounted.current) return;
      consecutiveFailures.current += 1;
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      setLoading(false);
    }
  }, [endpoint]);

  const scheduleNext = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    if (!enabled || !isVisible.current) return;

    const backoffMultiplier = Math.pow(
      2,
      Math.min(consecutiveFailures.current, 10),
    );
    const nextInterval = Math.min(
      interval * BASE_INTERVAL_MULTIPLIER * backoffMultiplier,
      MAX_BACKOFF_MS,
    );

    timerRef.current = setTimeout(async () => {
      await fetchData();
      if (isMounted.current) {
        scheduleNext();
      }
    }, nextInterval);
  }, [enabled, interval, fetchData]);

  const refresh = useCallback(() => {
    consecutiveFailures.current = 0;
    fetchData();
  }, [fetchData]);

  // Handle visibility changes
  useEffect(() => {
    function handleVisibilityChange() {
      isVisible.current = document.visibilityState === 'visible';
      if (isVisible.current && enabled) {
        // Immediately fetch when tab becomes visible again
        fetchData().then(() => {
          if (isMounted.current) scheduleNext();
        });
      } else {
        if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, fetchData, scheduleNext]);

  // Main polling lifecycle
  useEffect(() => {
    isMounted.current = true;

    if (!enabled) {
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchData().then(() => {
      if (isMounted.current) scheduleNext();
    });

    return () => {
      isMounted.current = false;
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, fetchData, scheduleNext]);

  return { data, loading, error, refresh };
}
