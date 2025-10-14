
import { useState, useEffect, useCallback } from 'react';

const API_URL_STORAGE_KEY = 'arkham_api_url';
const DEFAULT_API_URL = 'https://arkham-obsidian.onrender.com';

export function useApiUrl() {
  const [apiUrl, setApiUrl] = useState<string>(DEFAULT_API_URL);

  useEffect(() => {
    const storedUrl = localStorage.getItem(API_URL_STORAGE_KEY);
    if (storedUrl) {
      setApiUrl(storedUrl);
    } else {
      // For local development, default to localhost if nothing is set
      if (window.location.hostname === 'localhost') {
        setApiUrl('http://localhost:8080');
      }
    }
  }, []);

  const updateApiUrl = useCallback((newUrl: string) => {
    if (newUrl) {
      localStorage.setItem(API_URL_STORAGE_KEY, newUrl);
      setApiUrl(newUrl);
    } else {
      // Reset to default
      localStorage.removeItem(API_URL_STORAGE_KEY);
      const defaultUrl = window.location.hostname === 'localhost' ? 'http://localhost:8080' : DEFAULT_API_URL;
      setApiUrl(defaultUrl);
    }
  }, []);

  return { apiUrl, updateApiUrl };
}
