/**
 * Time utilities.
 *
 * Everything about the eclipse is defined as wall-clock time in the EVENT
 * timezone (Europe/Madrid). The device may be in any timezone — or have a
 * wrong one — so we never rely on the local timezone for logic. We convert
 * the event's wall-clock times into absolute UTC instants once, and compare
 * against Date.now() from there.
 */

import { eclipseEvent, type Phase } from '@/data/eventData';

const TZ = eclipseEvent.location.timezone;

/** Offset of `timeZone` from UTC, in ms, at the given instant (DST-aware). */
function zoneOffsetMs(instant: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(new Date(instant));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? '0');
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return asUtc - instant;
}

/**
 * Convert a wall-clock date+time in the event timezone to a UTC timestamp.
 * Two-pass, so it stays correct across DST boundaries.
 */
export function zonedWallTimeToUtc(
  dateISO: string,
  timeHMS: string,
  timeZone: string = TZ,
): number {
  const [y, m, d] = dateISO.split('-').map(Number);
  const [hh, mm, ss = 0] = timeHMS.split(':').map(Number);
  const naive = Date.UTC(y, m - 1, d, hh, mm, ss);
  const firstGuess = naive - zoneOffsetMs(naive, timeZone);
  const refined = naive - zoneOffsetMs(firstGuess, timeZone);
  return refined;
}

export type TimedPhase = Phase & { timestamp: number };

/** Event phases resolved to absolute UTC instants, in chronological order. */
export const timedPhases: TimedPhase[] = eclipseEvent.phases.map((p) => ({
  ...p,
  timestamp: zonedWallTimeToUtc(eclipseEvent.date, p.time),
}));

export const phaseAt = (id: Phase['id']): TimedPhase =>
  timedPhases.find((p) => p.id === id)!;

export const T = {
  partialStart: phaseAt('partial-start').timestamp,
  totalityStart: phaseAt('totality-start').timestamp,
  maximum: phaseAt('maximum').timestamp,
  totalityEnd: phaseAt('totality-end').timestamp,
  partialEnd: phaseAt('partial-end').timestamp,
};

export type EclipseStage = 'before' | 'partial-rising' | 'totality' | 'partial-falling' | 'after';

/** Whether eye protection is mandatory right now. */
export type SafetyLevel = 'glasses-required' | 'glasses-off' | 'no-eclipse';

export type EclipseState = {
  now: number;
  stage: EclipseStage;
  safety: SafetyLevel;
  /** Next boundary the user must care about (null once the eclipse is over). */
  target: TimedPhase | null;
  /** Milliseconds until `target`. */
  msToTarget: number;
  /** 0 → 1 progress across the whole eclipse (partial start → partial end). */
  progress: number;
  /** Seconds of totality left; 0 outside totality. */
  totalitySecondsLeft: number;
  /** True for the first 90s after totality ends — glasses back on, urgently. */
  isJustAfterTotality: boolean;
  /** True in the last 15s before totality begins / ends. */
  isImminent: boolean;
};

export function getEclipseState(now: number): EclipseState {
  let stage: EclipseStage;
  let target: TimedPhase | null;

  if (now < T.partialStart) {
    stage = 'before';
    target = phaseAt('partial-start');
  } else if (now < T.totalityStart) {
    stage = 'partial-rising';
    target = phaseAt('totality-start');
  } else if (now < T.totalityEnd) {
    stage = 'totality';
    // During totality the only deadline that matters is putting the glasses
    // back on before the Sun reappears.
    target = phaseAt('totality-end');
  } else if (now < T.partialEnd) {
    stage = 'partial-falling';
    target = phaseAt('partial-end');
  } else {
    stage = 'after';
    target = null;
  }

  const safety: SafetyLevel =
    stage === 'totality'
      ? 'glasses-off'
      : stage === 'partial-rising' || stage === 'partial-falling'
        ? 'glasses-required'
        : 'no-eclipse';

  const span = T.partialEnd - T.partialStart;
  const progress = Math.min(1, Math.max(0, (now - T.partialStart) / span));
  const msToTarget = target ? Math.max(0, target.timestamp - now) : 0;

  return {
    now,
    stage,
    safety,
    target,
    msToTarget,
    progress,
    totalitySecondsLeft:
      stage === 'totality' ? Math.max(0, Math.ceil((T.totalityEnd - now) / 1000)) : 0,
    isJustAfterTotality: now >= T.totalityEnd && now < T.totalityEnd + 90_000,
    isImminent:
      (now < T.totalityStart && T.totalityStart - now <= 15_000) ||
      (stage === 'totality' && T.totalityEnd - now <= 15_000),
  };
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
};

export function breakdown(ms: number): Countdown {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
  };
}

const clockFormatter = new Intl.DateTimeFormat('es-ES', {
  timeZone: TZ,
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** Current wall-clock time in the event timezone, e.g. "20:27:35". */
export const formatEventClock = (instant: number) => clockFormatter.format(new Date(instant));

/** "19:30:51" → "19:30" for compact display. */
export const toHM = (time: string) => time.slice(0, 5);

/** True when the device timezone differs from the event timezone. */
export function deviceTimezoneMismatch(): string | null {
  const device = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!device || device === TZ) return null;
  const now = Date.now();
  return zoneOffsetMs(now, device) === zoneOffsetMs(now, TZ) ? null : device;
}
