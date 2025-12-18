import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { PolymarketEvent } from '@/types/api';

interface UseEventsOptions {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  autoFetch?: boolean;
  ascending?: boolean;
}

export function useEvents(options: UseEventsOptions = {}) {
  const { limit = 20, offset = 0, active = true, autoFetch = true, ascending = true, closed = false } = options;

  const [events, setEvents] = useState<PolymarketEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getEvents({ limit, offset, active, closed, ascending });

      if (response.success && response.data?.events) {
        setEvents(response.data.events);
      } else {
        setError(response.error?.message || 'Failed to load events');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to load events';
      setError(errorMessage);
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      loadEvents();
    }
  }, [limit, offset, active, autoFetch]);

  return {
    events,
    loading,
    error,
    refresh: loadEvents
  };
}

export function useEventBySlug(slug: string, autoFetch: boolean = true) {
  const [event, setEvent] = useState<PolymarketEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvent = async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getEventBySlug(slug);

      if (response.success && response.data) {
        setEvent(response.data);
      } else {
        setError(response.error?.message || 'Failed to load event');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to load event';
      setError(errorMessage);
      console.error('Error loading event:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && slug) {
      loadEvent();
    }
  }, [slug, autoFetch]);

  return {
    event,
    loading,
    error,
    refresh: loadEvent
  };
}
