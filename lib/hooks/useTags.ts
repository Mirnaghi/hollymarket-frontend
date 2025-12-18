import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { PolymarketTag } from '@/types/api';

interface UseTagsReturn {
  tags: PolymarketTag[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useTags(): UseTagsReturn {
  const [tags, setTags] = useState<PolymarketTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTags = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getTags();

      if (response.success && response.data?.tags) {
        setTags(response.data.tags);
      } else {
        setError(response.error?.message || 'Failed to load tags');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to load tags';
      setError(errorMessage);
      console.error('Error loading tags:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return {
    tags,
    loading,
    error,
    refresh: loadTags
  };
}
