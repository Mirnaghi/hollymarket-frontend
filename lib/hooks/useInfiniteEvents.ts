import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { PolymarketEvent } from '@/types/api';

interface UseInfiniteEventsOptions {
  limit?: number;
  active?: boolean;
  autoFetch?: boolean;
  tag_id?: string;
}

interface UseInfiniteEventsReturn {
  events: PolymarketEvent[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function useInfiniteEvents(options: UseInfiniteEventsOptions = {}): UseInfiniteEventsReturn {
  const { limit = 20, active = true, autoFetch = true, tag_id } = options;

  const [events, setEvents] = useState<PolymarketEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadEvents = useCallback(async (currentOffset: number, isRefresh: boolean = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getEvents({
        limit,
        offset: currentOffset,
        active,
        tag_id
      });

      if (response.success && response.data?.events) {
        const newEvents = response.data.events;

        if (isRefresh) {
          setEvents(newEvents);
        } else {
          setEvents((prev) => [...prev, ...newEvents]);
        }

        // Check if there are more events to load
        setHasMore(newEvents.length === limit);
      } else {
        setError(response.error?.message || 'Failed to load events');
        setHasMore(false);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to load events';
      setError(errorMessage);
      console.error('Error loading events:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [limit, active, tag_id, loading]);

  // Load more events
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const newOffset = offset + limit;
      setOffset(newOffset);
      loadEvents(newOffset, false);
    }
  }, [loading, hasMore, offset, limit, loadEvents]);

  // Refresh events from the beginning
  const refresh = useCallback(() => {
    setOffset(0);
    setHasMore(true);
    loadEvents(0, true);
  }, [loadEvents]);

  // Initial load
  useEffect(() => {
    if (autoFetch && events.length === 0) {
      loadEvents(0, true);
    }
  }, [autoFetch]);

  return {
    events,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
}
