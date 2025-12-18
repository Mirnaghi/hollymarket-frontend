import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { PolymarketMarket } from '@/types/api';

interface UseMarketsOptions {
  limit?: number;
  offset?: number;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  tag?: string;
  autoFetch?: boolean;
}

export function useMarkets(options: UseMarketsOptions = {}) {
  const {
    limit = 50,
    offset = 0,
    active = true,
    closed = false,
    archived = false,
    tag,
    autoFetch = true
  } = options;

  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMarkets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getMarkets({
        limit,
        offset,
        active,
        closed,
        archived,
        tag
      });

      if (response.success && response.data?.markets) {
        setMarkets(response.data.markets);
      } else {
        setError(response.error?.message || 'Failed to load markets');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to load markets';
      setError(errorMessage);
      console.error('Error loading markets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      loadMarkets();
    }
  }, [limit, offset, active, closed, archived, tag, autoFetch]);

  return {
    markets,
    loading,
    error,
    refresh: loadMarkets
  };
}

export function useFeaturedMarkets(autoFetch: boolean = true) {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMarkets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getFeaturedMarkets();

      if (response.success && response.data?.markets) {
        setMarkets(response.data.markets);
      } else {
        setError(response.error?.message || 'Failed to load featured markets');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to load featured markets';
      setError(errorMessage);
      console.error('Error loading featured markets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      loadMarkets();
    }
  }, [autoFetch]);

  return {
    markets,
    loading,
    error,
    refresh: loadMarkets
  };
}

export function useTrendingMarkets(autoFetch: boolean = true) {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMarkets = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getTrendingMarkets();

      if (response.success && response.data?.markets) {
        setMarkets(response.data.markets);
      } else {
        setError(response.error?.message || 'Failed to load trending markets');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to load trending markets';
      setError(errorMessage);
      console.error('Error loading trending markets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      loadMarkets();
    }
  }, [autoFetch]);

  return {
    markets,
    loading,
    error,
    refresh: loadMarkets
  };
}

export function useMarketBySlug(slug: string, autoFetch: boolean = true) {
  const [market, setMarket] = useState<PolymarketMarket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMarket = async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getMarketBySlug(slug);

      if (response.success && response.data) {
        setMarket(response.data);
      } else {
        setError(response.error?.message || 'Failed to load market');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to load market';
      setError(errorMessage);
      console.error('Error loading market:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && slug) {
      loadMarket();
    }
  }, [slug, autoFetch]);

  return {
    market,
    loading,
    error,
    refresh: loadMarket
  };
}

export function useSearchMarkets(query: string, autoFetch: boolean = false) {
  const [markets, setMarkets] = useState<PolymarketMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchMarkets = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;

    if (!searchTerm || searchTerm.trim().length < 2) {
      setMarkets([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.searchMarkets(searchTerm);

      if (response.success && response.data?.markets) {
        setMarkets(response.data.markets);
      } else {
        setError(response.error?.message || 'Failed to search markets');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to search markets';
      setError(errorMessage);
      console.error('Error searching markets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && query && query.trim().length >= 2) {
      const timeoutId = setTimeout(() => {
        searchMarkets();
      }, 300); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [query, autoFetch]);

  return {
    markets,
    loading,
    error,
    search: searchMarkets
  };
}
