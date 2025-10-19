
import { useState, useEffect, useCallback } from 'react';

const API_URL_STORAGE_KEY = 'arkham_api_url';
const PRODUCTION_API_URL = 'https://arkham-obsidian.onrender.com';
const LOCAL_API_URL = 'http://localhost:8080';

const getInitialApiUrl = () => {
  if (typeof window === 'undefined') {
    return PRODUCTION_API_URL;
  }
  const storedUrl = localStorage.getItem(API_URL_STORAGE_KEY);
  if (storedUrl) {
    return storedUrl;
  }
  return window.location.hostname === 'localhost' ? LOCAL_API_URL : PRODUCTION_API_URL;
};

export function useApiUrl() {
  const [apiUrl, setApiUrl] = useState<string>(getInitialApiUrl);

  const updateApiUrl = useCallback((newUrl: string) => {
    if (newUrl) {
      localStorage.setItem(API_URL_STORAGE_KEY, newUrl);
      setApiUrl(newUrl);
    } else {
      localStorage.removeItem(API_URL_STORAGE_KEY);
      const defaultUrl = window.location.hostname === 'localhost' ? LOCAL_API_URL : PRODUCTION_API_URL;
      setApiUrl(defaultUrl);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setApiUrl(getInitialApiUrl());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { apiUrl, updateApiUrl };
}
