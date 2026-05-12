import { toast } from 'sonner';

const originalFetch = window.fetch;

export const setupFetchInterceptor = () => {
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args);
      
      if (!response.ok) {
        // We only intercept API calls
        const url = typeof args[0] === 'string' ? args[0] : (args[0] instanceof Request ? args[0].url : '');
        if (url.includes('/api/')) {
          // Clone the response so we don't consume the body
          const clone = response.clone();
          try {
            const data = await clone.json();
            const message = data?.message || data?.error || `HTTP Error ${response.status}`;
            toast.error(`API Error: ${message}`);
          } catch (e) {
            toast.error(`HTTP Error ${response.status}`);
          }
        }
      }
      return response;
    } catch (error: any) {
      toast.error(`Network Error: ${error.message}`);
      throw error;
    }
  };
};
