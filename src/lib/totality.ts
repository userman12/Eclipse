/**
 * Shared logic for the 76-second script.
 *
 * Lives outside the components because two of them need exactly the same
 * answer at the same instant: the live box under the countdown and the full
 * list in the Totality tab. Any disagreement between the two would be a
 * safety bug, not a cosmetic one.
 */

import { totalityScript, type ScriptStep } from '@/data/eventData';

/**
 * The window in which the script has something to say — derived from the
 * steps themselves, so it can never drift out of sync with them and leave
 * dead seconds where the live box is "on" but empty.
 */
export const SCRIPT_START = Math.min(...totalityScript.map((s) => s.from));
export const SCRIPT_END = Math.max(...totalityScript.map((s) => s.to));

/**
 * Signed seconds relative to the start of totality (negative = before).
 * Only meaningful for total-eclipse cities — callers must check
 * `city.type === 'total'` before using this, since partial-only cities have
 * no totality-start instant to measure from.
 */
export const offsetSeconds = (now: number, totalityStart: number) =>
  (now - totalityStart) / 1000;

export const isScriptLive = (offset: number) =>
  offset >= SCRIPT_START && offset < SCRIPT_END;

export const isActive = (step: ScriptStep, offset: number) =>
  offset >= step.from && offset < step.to;

/**
 * Several steps overlap on purpose (the diamond ring starts while Baily's
 * beads are still running, the corona while the glasses have just come off),
 * so "the current step" cannot be the first match in the list. Pick the most
 * important one — lowest priority number — and among equals the one that
 * started most recently, which is always the more specific instruction.
 */
export function currentStep(offset: number): ScriptStep | null {
  const active = totalityScript.filter((step) => isActive(step, offset));
  if (active.length === 0) return null;
  return active.sort((a, b) => a.priority - b.priority || b.from - a.from)[0];
}

/** The next step to begin, so the user can see what is coming. */
export function nextStep(offset: number): ScriptStep | null {
  const upcoming = totalityScript
    .filter((step) => step.from > offset)
    .sort((a, b) => a.from - b.from || a.priority - b.priority);
  return upcoming[0] ?? null;
}

/** 0 → 1 progress through the current step. */
export function stepProgress(step: ScriptStep, offset: number): number {
  const span = step.to - step.from;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (offset - step.from) / span));
}

/** "−20s" / "+34s" — matches what a stopwatch would read. */
export const formatOffset = (seconds: number) =>
  `${seconds < 0 ? '−' : '+'}${Math.abs(Math.round(seconds))}s`;
