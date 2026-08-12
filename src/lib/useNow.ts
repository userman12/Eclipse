'use client';

import { useEffect, useState } from 'react';
import { ECLIPSE_DATE } from '@/data/cities';
import { zonedWallTimeToUtc } from '@/lib/time';

/**
 * Time simulation for testing without waiting for the actual eclipse.
 * Add `?t=20:27:30` to the URL and the clock starts there (interpreted as
 * Europe/Madrid wall-clock time, regardless of which city is selected — a
 * fixed reference so the same URL always simulates the same real moment)
 * and keeps running in real time. `?t=` is ignored without a valid
 * HH:MM[:SS] value.
 */
function simulationOffsetMs(): number {
  if (typeof window === 'undefined') return 0;
  const raw = new URLSearchParams(window.location.search).get('t');
  if (!raw || !/^\d{1,2}:\d{2}(:\d{2})?$/.test(raw)) return 0;
  const [h, m, s = '0'] = raw.split(':');
  const target = zonedWallTimeToUtc(
    ECLIPSE_DATE,
    `${h.padStart(2, '0')}:${m}:${s.padStart(2, '0')}`,
    'Europe/Madrid',
  );
  return target - Date.now();
}

/**
 * Current instant, ticking. Returns `null` on the server and on the very
 * first client render so that time-dependent UI never hydrates with a
 * mismatched value.
 */
export function useNow(intervalMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const offset = simulationOffsetMs();
    const tick = () => setNow(Date.now() + offset);
    tick();

    const id = window.setInterval(tick, intervalMs);
    // A backgrounded tab throttles timers; resync as soon as it is visible.
    const onVisible = () => document.visibilityState === 'visible' && tick();
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [intervalMs]);

  return now;
}
