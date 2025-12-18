import { AxiosError } from 'axios';

export function handleApiError(error: any): string {
  if (error.response) {
    // Server responded with error
    const apiError = error.response.data?.error;
    return apiError?.message || 'An error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
}
