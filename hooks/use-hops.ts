import { useState, useEffect, useCallback } from 'react';

const HOPS_STORAGE_KEY = 'arkham_hops';
const DEFAULT_HOPS = '1';

export function useHops() {
  const [hops, setHops] = useState<string>(DEFAULT_HOPS);

  useEffect(() => {
    const storedHops = localStorage.getItem(HOPS_STORAGE_KEY);
    if (storedHops) {
      setHops(storedHops);
    }
  }, []);

  const updateHops = useCallback((newHops: string) => {
    if (newHops) {
      localStorage.setItem(HOPS_STORAGE_KEY, newHops);
      setHops(newHops);
    } else {
      localStorage.removeItem(HOPS_STORAGE_KEY);
      setHops(DEFAULT_HOPS);
    }
  }, []);

  return { hops, updateHops };
}
