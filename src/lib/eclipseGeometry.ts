/**
 * Geometry of the eclipse at a given city, expressed in solar radii.
 *
 * The Moon crosses the Sun along a nearly straight track. Modelling that
 * track lets every drawing in the app derive from the clock instead of
 * guessing: the Moon enters on one side, passes through, and leaves on the
 * other — and each known contact lands exactly on its published time.
 *
 * Coordinates: the Sun sits at the origin with radius 1. `x` runs along the
 * Moon's track (negative before maximum, positive after) and `y` is the fixed
 * impact parameter — the closest the two centres ever get, which is reached
 * at the "maximum" instant by definition (x = 0 there, always).
 *
 * Two cases:
 *   - total cities have 5 known contacts, so both the impact parameter and
 *     the track positions of every contact are determined exactly.
 *   - partial-only cities have 3 known contacts (start / maximum / end) plus
 *     a known peak magnitude (fraction of the Sun's area covered at max).
 *     The impact parameter is recovered by inverting the same area formula
 *     used to draw the disks, then the track positions of first/last contact
 *     follow from it.
 */

import type { City } from '@/data/cities';
import { getTimedPhases } from '@/lib/time';

/** Moon/Sun apparent radius ratio. Above 1, which is why total eclipses are total. */
export const MOON_SUN_RATIO = 1.04;

const K = MOON_SUN_RATIO;
/** Separation at first/fourth contact (external tangency) — 0% obscuration. */
const D_PARTIAL = K + 1;
/** Separation at second/third contact (internal tangency) — 100% obscuration. */
const D_TOTAL = K - 1;

const clampCos = (v: number) => Math.min(1, Math.max(-1, v));

/**
 * Fraction of the Sun's *area* hidden by the Moon, 0 → 1, for a given
 * centre-to-centre separation `d` (in solar radii).
 * (Obscuration, not magnitude: this is what the eye actually responds to.)
 */
function obscurationAt(d: number): number {
  if (d >= D_PARTIAL) return 0;
  if (d <= D_TOTAL) return 1;

  const r = 1;
  const R = K;
  const a1 = Math.acos(clampCos((d * d + r * r - R * R) / (2 * d * r)));
  const a2 = Math.acos(clampCos((d * d + R * R - r * r) / (2 * d * R)));
  const tri = Math.sqrt(Math.max(0, (-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R)));
  const lens = r * r * a1 + R * R * a2 - tri / 2;
  return Math.min(1, Math.max(0, lens / (Math.PI * r * r)));
}

/** Inverts `obscurationAt`: what separation produces this much obscuration? */
function separationForObscuration(target: number): number {
  let lo = D_TOTAL;
  let hi = D_PARTIAL;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    // obscurationAt is monotonically decreasing in d.
    if (obscurationAt(mid) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

type Anchor = { t: number; x: number };

type CityGeometry = {
  impact: number;
  anchors: Anchor[];
};

const cache = new Map<string, CityGeometry>();

function buildGeometry(city: City): CityGeometry {
  const phases = getTimedPhases(city);
  const at = (id: string) => phases.find((p) => p.id === id)!.timestamp;

  let impact: number;
  let anchors: Anchor[];

  if (city.type === 'total') {
    const partialStart = at('partial-start');
    const totalityStart = at('totality-start');
    const maximum = at('maximum');
    const totalityEnd = at('totality-end');
    const partialEnd = at('partial-end');

    // Impact parameter from how long totality lasts relative to the whole
    // eclipse — a shorter totality means a less central passage.
    const totalityHalf = totalityStart - maximum; // negative
    const partialHalf = partialStart - maximum; // negative
    const ratio = totalityHalf / partialHalf;
    const b2 = (D_TOTAL ** 2 - ratio ** 2 * D_PARTIAL ** 2) / (1 - ratio ** 2);
    impact = Math.sqrt(Math.max(0, Math.min(b2, D_TOTAL ** 2 * 0.999)));

    const xPartial = Math.sqrt(Math.max(0, D_PARTIAL ** 2 - impact ** 2));
    const xTotal = Math.sqrt(Math.max(0, D_TOTAL ** 2 - impact ** 2));

    anchors = [
      { t: partialStart, x: -xPartial },
      { t: totalityStart, x: -xTotal },
      { t: maximum, x: 0 },
      { t: totalityEnd, x: xTotal },
      { t: partialEnd, x: xPartial },
    ];
  } else {
    const partialStart = at('partial-start');
    const maximum = at('maximum');
    const partialEnd = at('partial-end');

    // The Moon never reaches full coverage; recover how close it gets from
    // the published peak magnitude instead of a totality window.
    impact = separationForObscuration(city.magnitudeAtMax);
    const xPartial = Math.sqrt(Math.max(0, D_PARTIAL ** 2 - impact ** 2));

    anchors = [
      { t: partialStart, x: -xPartial },
      { t: maximum, x: 0 },
      { t: partialEnd, x: xPartial },
    ];
  }

  // A handful of cities (Rome) have their published end coincide with
  // maximum, because sunset — not the Moon — cuts the eclipse off. Collapse
  // any zero-width segment so interpolation never divides by zero.
  anchors = anchors.filter((a, i) => i === 0 || a.t !== anchors[i - 1].t);

  return { impact, anchors };
}

function geometryFor(city: City): CityGeometry {
  let g = cache.get(city.id);
  if (!g) {
    g = buildGeometry(city);
    cache.set(city.id, g);
  }
  return g;
}

/** Signed position of the Moon's centre along its track, in solar radii. */
export function moonTrackX(city: City, now: number): number {
  const { anchors } = geometryFor(city);
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (now <= first.t) return first.x;
  if (now >= last.t) return last.x;

  for (let i = 1; i < anchors.length; i++) {
    const a = anchors[i - 1];
    const b = anchors[i];
    if (now <= b.t) {
      const f = (now - a.t) / (b.t - a.t);
      return a.x + (b.x - a.x) * f;
    }
  }
  return last.x;
}

/** The impact parameter (fixed perpendicular offset of the Moon's track). */
export const impactParameter = (city: City) => geometryFor(city).impact;

/** Centre-to-centre separation of Sun and Moon, in solar radii. */
export const separation = (city: City, now: number) =>
  Math.hypot(moonTrackX(city, now), impactParameter(city));

/** Fraction of the Sun's area hidden by the Moon, 0 → 1. */
export const obscuration = (city: City, now: number) => obscurationAt(separation(city, now));
