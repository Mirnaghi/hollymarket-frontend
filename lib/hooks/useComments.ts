import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Comment } from '@/types/api';

interface UseCommentsOptions {
  parentEntityId: string | number;
  parentEntityType: 'Event' | 'Market';
  limit?: number;
}

interface UseCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  count: number;
}

export function useComments(options: UseCommentsOptions): UseCommentsReturn {
  const { parentEntityId, parentEntityType, limit = 50 } = options;

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadComments = async () => {
      if (!parentEntityId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.getComments({
          parent_entity_id: parentEntityId,
          parent_entity_type: parentEntityType,
          limit
        });

        if (response.success && response.data?.comments) {
          setComments(response.data.comments);
          setCount(response.data.count || 0);
        } else {
          setError(response.error?.message || 'Failed to load comments');
        }
      } catch (err: any) {
        const errorMessage = err.response?.data?.error?.message || 'Failed to load comments';
        setError(errorMessage);
        console.error('Error loading comments:', err);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [parentEntityId, parentEntityType, limit]);

  return {
    comments,
    loading,
    error,
    count
  };
}
