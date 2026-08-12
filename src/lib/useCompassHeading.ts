'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type PermissionState = 'unsupported' | 'prompt' | 'granted' | 'denied';

type DeviceOrientationEventIOS = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

type CompassReading = {
  /** Degrees clockwise from North, or null if unknown. */
  heading: number | null;
  /** True when the reading is referenced to true/magnetic north (not relative). */
  absolute: boolean;
  permission: PermissionState;
  request: () => Promise<void>;
};

/** Circular smoothing: averaging 359° and 1° must give 0°, not 180°. */
function smooth(previous: number | null, next: number, factor = 0.25): number {
  if (previous === null) return next;
  const delta = ((next - previous + 540) % 360) - 180;
  return (previous + delta * factor + 360) % 360;
}

export function useCompassHeading(): CompassReading {
  const [heading, setHeading] = useState<number | null>(null);
  const [absolute, setAbsolute] = useState(false);
  const [permission, setPermission] = useState<PermissionState>('prompt');
  const smoothed = useRef<number | null>(null);

  const handle = useCallback((event: DeviceOrientationEvent) => {
    // iOS exposes a ready-made compass heading; elsewhere alpha is measured
    // counter-clockwise from North, so it has to be inverted.
    const webkitHeading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
      .webkitCompassHeading;

    let value: number | null = null;
    let isAbsolute = false;

    if (typeof webkitHeading === 'number' && !Number.isNaN(webkitHeading)) {
      value = webkitHeading;
      isAbsolute = true;
    } else if (typeof event.alpha === 'number') {
      value = (360 - event.alpha) % 360;
      isAbsolute = event.absolute === true;
    }

    if (value === null) return;
    smoothed.current = smooth(smoothed.current, value);
    setHeading(smoothed.current);
    setAbsolute(isAbsolute);
  }, []);

  const attach = useCallback(() => {
    window.addEventListener('deviceorientationabsolute', handle as EventListener, true);
    window.addEventListener('deviceorientation', handle as EventListener, true);
  }, [handle]);

  const request = useCallback(async () => {
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
      setPermission('unsupported');
      return;
    }
    const iosEvent = DeviceOrientationEvent as DeviceOrientationEventIOS;
    if (typeof iosEvent.requestPermission === 'function') {
      try {
        const result = await iosEvent.requestPermission();
        setPermission(result === 'granted' ? 'granted' : 'denied');
        if (result === 'granted') attach();
      } catch {
        setPermission('denied');
      }
      return;
    }
    setPermission('granted');
    attach();
  }, [attach]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof DeviceOrientationEvent === 'undefined') {
      setPermission('unsupported');
      return;
    }
    // Browsers without the iOS permission gate can start listening right away.
    const iosEvent = DeviceOrientationEvent as DeviceOrientationEventIOS;
    if (typeof iosEvent.requestPermission !== 'function') {
      setPermission('granted');
      attach();
    }
    return () => {
      window.removeEventListener('deviceorientationabsolute', handle as EventListener, true);
      window.removeEventListener('deviceorientation', handle as EventListener, true);
    };
  }, [attach, handle]);

  return { heading, absolute, permission, request };
}
