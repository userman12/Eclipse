/**
 * Time utilities, parametrized by city.
 *
 * Every phase time is defined as wall-clock time in THAT CITY's own
 * timezone. The device may be in any timezone — or have a wrong one — so we
 * never rely on the local timezone for logic. We convert each phase's
 * wall-clock time into an absolute UTC instant, and compare against
 * Date.now() from there.
 *
 * `city.type` drives two structurally different state machines:
 *   - 'total': before → partial-rising → totality → partial-falling → after
 *   - 'partial': before → partial-rising → partial-falling → after
 * A partial-only city's stage can NEVER become 'totality' and its safety
 * level can NEVER become 'glasses-off' — that is enforced by which branch
 * runs below, not by copy or by a zero-width time window, so there is no
 * code path that tells someone in Rome or London it is safe to look up.
 */

import { ECLIPSE_DATE, type City, type CityPhaseId } from '@/data/cities';

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
 * Convert a wall-clock date+time in a given timezone to a UTC timestamp.
 * Two-pass, so it stays correct across DST boundaries.
 */
export function zonedWallTimeToUtc(dateISO: string, timeHMS: string, timeZone: string): number {
  const [y, m, d] = dateISO.split('-').map(Number);
  const [hh, mm, ss = 0] = timeHMS.split(':').map(Number);
  const naive = Date.UTC(y, m - 1, d, hh, mm, ss);
  const firstGuess = naive - zoneOffsetMs(naive, timeZone);
  const refined = naive - zoneOffsetMs(firstGuess, timeZone);
  return refined;
}

export type TimedPhase = { id: CityPhaseId; time: string; timestamp: number };

/** A city's phases resolved to absolute UTC instants, in chronological order. */
export function getTimedPhases(city: City): TimedPhase[] {
  return city.phases.map((p) => ({
    ...p,
    timestamp: zonedWallTimeToUtc(ECLIPSE_DATE, p.time, city.timezone),
  }));
}

const phaseAt = (phases: TimedPhase[], id: CityPhaseId): TimedPhase =>
  phases.find((p) => p.id === id)!;

/** The UTC instant of a specific named phase for a city, e.g. its totality start. */
export function getPhaseTimestamp(city: City, id: CityPhaseId): number {
  return phaseAt(getTimedPhases(city), id).timestamp;
}

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
  /** Seconds of totality left; always 0 for partial-only cities. */
  totalitySecondsLeft: number;
  /** True for the first 90s after totality ends — glasses back on, urgently. Always false for partial-only cities. */
  isJustAfterTotality: boolean;
  /** True in the last 15s before totality begins / ends. Always false for partial-only cities. */
  isImminent: boolean;
};

export function getEclipseState(city: City, now: number): EclipseState {
  const phases = getTimedPhases(city);
  const partialStart = phaseAt(phases, 'partial-start');
  const maximum = phaseAt(phases, 'maximum');
  const partialEnd = phaseAt(phases, 'partial-end');

  let stage: EclipseStage;
  let target: TimedPhase | null;
  let totalitySecondsLeft = 0;
  let isJustAfterTotality = false;
  let isImminent = false;

  if (city.type === 'total') {
    const totalityStart = phaseAt(phases, 'totality-start');
    const totalityEnd = phaseAt(phases, 'totality-end');

    if (now < partialStart.timestamp) {
      stage = 'before';
      target = partialStart;
    } else if (now < totalityStart.timestamp) {
      stage = 'partial-rising';
      target = totalityStart;
    } else if (now < totalityEnd.timestamp) {
      stage = 'totality';
      // During totality the only deadline that matters is putting the
      // glasses back on before the Sun reappears.
      target = totalityEnd;
    } else if (now < partialEnd.timestamp) {
      stage = 'partial-falling';
      target = partialEnd;
    } else {
      stage = 'after';
      target = null;
    }

    totalitySecondsLeft =
      stage === 'totality' ? Math.max(0, Math.ceil((totalityEnd.timestamp - now) / 1000)) : 0;
    isJustAfterTotality = now >= totalityEnd.timestamp && now < totalityEnd.timestamp + 90_000;
    isImminent =
      (now < totalityStart.timestamp && totalityStart.timestamp - now <= 15_000) ||
      (stage === 'totality' && totalityEnd.timestamp - now <= 15_000);
  } else {
    // Partial-only city: the Sun is never fully covered, so 'totality' and
    // 'glasses-off' are simply not reachable states. The midpoint is
    // 'maximum' instead of a totality window — it changes the message
    // ("deepening" vs "waning"), never the safety requirement.
    if (now < partialStart.timestamp) {
      stage = 'before';
      target = partialStart;
    } else if (now < maximum.timestamp) {
      stage = 'partial-rising';
      target = maximum;
    } else if (now < partialEnd.timestamp) {
      stage = 'partial-falling';
      target = partialEnd;
    } else {
      stage = 'after';
      target = null;
    }
  }

  const safety: SafetyLevel =
    stage === 'totality'
      ? 'glasses-off'
      : stage === 'partial-rising' || stage === 'partial-falling'
        ? 'glasses-required'
        : 'no-eclipse';

  const span = partialEnd.timestamp - partialStart.timestamp;
  const progress = Math.min(1, Math.max(0, (now - partialStart.timestamp) / span));
  const msToTarget = target ? Math.max(0, target.timestamp - now) : 0;

  return {
    now,
    stage,
    safety,
    target,
    msToTarget,
    progress,
    totalitySecondsLeft,
    isJustAfterTotality,
    isImminent,
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

const clockFormatterCache = new Map<string, Intl.DateTimeFormat>();

/** Current wall-clock time in a given timezone, e.g. "20:27:35". */
export function formatEventClock(instant: number, timezone: string): string {
  let formatter = clockFormatterCache.get(timezone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    clockFormatterCache.set(timezone, formatter);
  }
  return formatter.format(new Date(instant));
}

/** "19:30:51" → "19:30" for compact display. */
export const toHM = (time: string) => time.slice(0, 5);

/** True when the device timezone differs from a given timezone. */
export function deviceTimezoneMismatch(timezone: string): string | null {
  const device = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!device || device === timezone) return null;
  const now = Date.now();
  return zoneOffsetMs(now, device) === zoneOffsetMs(now, timezone) ? null : device;
}
