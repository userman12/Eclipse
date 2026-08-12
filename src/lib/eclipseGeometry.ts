/**
 * Geometry of the eclipse, expressed in solar radii.
 *
 * The Moon crosses the Sun along a nearly straight track. Modelling that
 * track lets every drawing in the app derive from the clock instead of
 * guessing: the Moon enters on one side, passes through, and leaves on the
 * other — and each of the four contacts lands exactly on its published time.
 *
 * Coordinates: the Sun sits at the origin with radius 1. `x` runs along the
 * Moon's track (negative before maximum, positive after) and `y` is the fixed
 * impact parameter — the closest the two centres ever get.
 */

import { T } from '@/lib/time';

/** Moon/Sun apparent radius ratio. Above 1, which is why totality is total. */
export const MOON_SUN_RATIO = 1.04;

const K = MOON_SUN_RATIO;
/** Separation at first/fourth contact (external tangency). */
const D_PARTIAL = K + 1;
/** Separation at second/third contact (internal tangency). */
const D_TOTAL = K - 1;

/**
 * Impact parameter, derived from how long totality lasts relative to the
 * whole eclipse — a shorter totality means a less central passage.
 */
const IMPACT = (() => {
  const totalityHalf = (T.totalityStart - T.maximum) / 1000; // negative
  const partialHalf = (T.partialStart - T.maximum) / 1000; // negative
  const ratio = totalityHalf / partialHalf;
  const b2 = (D_TOTAL ** 2 - ratio ** 2 * D_PARTIAL ** 2) / (1 - ratio ** 2);
  // Clamp: a degenerate ratio must never produce NaN in a drawing routine.
  return Math.sqrt(Math.max(0, Math.min(b2, D_TOTAL ** 2 * 0.999)));
})();

/** Track position at each contact, from the geometry above. */
const X_PARTIAL = Math.sqrt(Math.max(0, D_PARTIAL ** 2 - IMPACT ** 2));
const X_TOTAL = Math.sqrt(Math.max(0, D_TOTAL ** 2 - IMPACT ** 2));

/**
 * Anchors tying wall-clock instants to positions along the track.
 * Interpolating between them keeps all four contacts exact, which a single
 * constant velocity cannot do — the real eclipse is slightly asymmetric
 * (56 minutes of partial phase before maximum, 54 after).
 */
const ANCHORS: { t: number; x: number }[] = [
  { t: T.partialStart, x: -X_PARTIAL },
  { t: T.totalityStart, x: -X_TOTAL },
  { t: T.maximum, x: 0 },
  { t: T.totalityEnd, x: X_TOTAL },
  { t: T.partialEnd, x: X_PARTIAL },
];

/** Signed position of the Moon's centre along its track, in solar radii. */
export function moonTrackX(now: number): number {
  if (now <= ANCHORS[0].t) return -X_PARTIAL;
  if (now >= ANCHORS[ANCHORS.length - 1].t) return X_PARTIAL;

  for (let i = 1; i < ANCHORS.length; i++) {
    const a = ANCHORS[i - 1];
    const b = ANCHORS[i];
    if (now <= b.t) {
      const f = (now - a.t) / (b.t - a.t);
      return a.x + (b.x - a.x) * f;
    }
  }
  return X_PARTIAL;
}

export const impactParameter = () => IMPACT;

/** Centre-to-centre separation of Sun and Moon, in solar radii. */
export const separation = (now: number) => Math.hypot(moonTrackX(now), IMPACT);

/**
 * Fraction of the Sun's *area* hidden by the Moon, 0 → 1.
 * (Obscuration, not magnitude: this is what the eye actually responds to.)
 */
export function obscuration(now: number): number {
  const d = separation(now);
  if (d >= D_PARTIAL) return 0;
  if (d <= D_TOTAL) return 1;

  const r = 1;
  const R = K;
  // Standard two-circle lens area.
  const a1 = Math.acos(clampCos((d * d + r * r - R * R) / (2 * d * r)));
  const a2 = Math.acos(clampCos((d * d + R * R - r * r) / (2 * d * R)));
  const tri = Math.sqrt(
    Math.max(0, (-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R)),
  );
  const lens = r * r * a1 + R * R * a2 - tri / 2;
  return Math.min(1, Math.max(0, lens / (Math.PI * r * r)));
}

const clampCos = (v: number) => Math.min(1, Math.max(-1, v));
