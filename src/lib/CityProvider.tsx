'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cities, defaultCity, getCityById, type City } from '@/data/cities';

const STORAGE_KEY = 'cen.city';

type CityContextValue = {
  city: City;
  setCityId: (id: string) => void;
  cities: City[];
};

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [city, setCity] = useState<City>(defaultCity);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const found = stored ? getCityById(stored) : undefined;
    if (found) setCity(found);
  }, []);

  const setCityId = useCallback((id: string) => {
    const found = getCityById(id);
    if (!found) return;
    setCity(found);
    window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const value = useMemo(() => ({ city, setCityId, cities }), [city, setCityId]);

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity(): CityContextValue {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error('useCity must be used inside <CityProvider>');
  return ctx;
}
