import { useState, useEffect, useRef } from 'react';
import { searchLocations } from '../services/geocoding';
import type { GeocodeResult } from '../types';

interface UseGeocodingOptions {
  enabled?: boolean;
  debounceMs?: number;
}

export function useGeocoding({ enabled = true, debounceMs = 250 }: UseGeocodingOptions = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleQueryChange = (nextQuery: string) => {
    setQuery(nextQuery);
    if (nextQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!enabled || query.trim().length < 2) return;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchLocations(query);
        setResults(data);
        setIsOpen(data.length > 0);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, enabled, debounceMs]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return {
    query,
    setQuery: handleQueryChange,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    containerRef,
    clear,
  };
}
