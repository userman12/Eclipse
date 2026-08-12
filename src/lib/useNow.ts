'use client';

import { useEffect, useState } from 'react';
import { eclipseEvent } from '@/data/eventData';
import { zonedWallTimeToUtc } from '@/lib/time';

/**
 * Time simulation for testing the five temporal states without waiting for
 * the eclipse. Add `?t=20:27:30` (event-local wall clock) to the URL and the
 * clock starts there and keeps running in real time. `?t=` is ignored in the
 * absence of a valid HH:MM[:SS] value.
 */
function simulationOffsetMs(): number {
  if (typeof window === 'undefined') return 0;
  const raw = new URLSearchParams(window.location.search).get('t');
  if (!raw || !/^\d{1,2}:\d{2}(:\d{2})?$/.test(raw)) return 0;
  const [h, m, s = '0'] = raw.split(':');
  const target = zonedWallTimeToUtc(
    eclipseEvent.date,
    `${h.padStart(2, '0')}:${m}:${s.padStart(2, '0')}`,
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
