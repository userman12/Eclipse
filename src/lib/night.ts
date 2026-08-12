/**
 * Twilight ladder and Perseid radiant altitude, computed per city.
 *
 * Replaces a static table that only ever described A Coruña. Reuses the
 * already-verified solar position formula (src/lib/sun.ts) for sunset and
 * the three twilight stages, and the same equatorial→horizontal conversion
 * used for the sky map (src/lib/skyObjects.ts) for the Perseid radiant,
 * which sits at RA 03h13m, Dec +58° (constellation Perseus).
 *
 * Solar altitude through a summer night is NOT monotonic — it falls at dusk,
 * bottoms out around solar midnight, then rises again at dawn — so a naive
 * bisection across the whole night can converge on the wrong (dawn) crossing,
 * or wrongly report "never gets dark" if its search window happens to end
 * after sunrise. Every crossing here is anchored to the actual solar-midnight
 * instant, found first, and bisected only across the strictly descending
 * half of the night.
 */

import { getSunPosition } from '@/lib/sun';
import type { City } from '@/data/cities';
import { ECLIPSE_DATE } from '@/data/cities';
import { zonedWallTimeToUtc } from '@/lib/time';

const PERSEID_RADIANT = { ra: 48.25, dec: 58 }; // 03h13m → 48.25°

/** Coarse scan + ternary-search refinement for the night's minimum Sun altitude. */
function findSolarMidnight(lat: number, lng: number, from: number, to: number): number {
  const steps = 200;
  let bestT = from;
  let bestAlt = Infinity;
  for (let i = 0; i <= steps; i++) {
    const t = from + ((to - from) * i) / steps;
    const alt = getSunPosition(t, lat, lng).altitude;
    if (alt < bestAlt) {
      bestAlt = alt;
      bestT = t;
    }
  }

  const span = (to - from) / steps;
  let lo = bestT - span;
  let hi = bestT + span;
  for (let i = 0; i < 40; i++) {
    const t1 = lo + (hi - lo) / 3;
    const t2 = hi - (hi - lo) / 3;
    if (getSunPosition(t1, lat, lng).altitude < getSunPosition(t2, lat, lng).altitude) hi = t2;
    else lo = t1;
  }
  return (lo + hi) / 2;
}

/** Bisects the strictly-descending half of the night; null if it never reaches `targetAltitude`. */
function findDescendingCrossing(
  targetAltitude: number,
  lat: number,
  lng: number,
  from: number,
  solarMidnight: number,
): number | null {
  if (getSunPosition(solarMidnight, lat, lng).altitude > targetAltitude) return null;
  let lo = from;
  let hi = solarMidnight;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    if (getSunPosition(mid, lat, lng).altitude > targetAltitude) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export type TwilightLadder = {
  sunset: number | null;
  civilEnd: number | null;
  nauticalEnd: number | null;
  /** Null at high summer latitudes where the sky never gets fully dark. */
  astronomicalEnd: number | null;
};

/** All instants as absolute UTC timestamps; format with the city's own timezone. */
export function computeTwilight(city: City): TwilightLadder {
  const { lat, lng } = city.coordinates;
  const noon = zonedWallTimeToUtc(ECLIPSE_DATE, '12:00:00', city.timezone);
  const nextMorning = zonedWallTimeToUtc('2026-08-13', '11:00:00', city.timezone);
  const solarMidnight = findSolarMidnight(lat, lng, noon, nextMorning);

  const sunset = findDescendingCrossing(-0.833, lat, lng, noon, solarMidnight);
  const civilEnd = sunset && findDescendingCrossing(-6, lat, lng, sunset, solarMidnight);
  const nauticalEnd = civilEnd && findDescendingCrossing(-12, lat, lng, civilEnd, solarMidnight);
  const astronomicalEnd =
    nauticalEnd && findDescendingCrossing(-18, lat, lng, nauticalEnd, solarMidnight);

  return {
    sunset,
    civilEnd,
    nauticalEnd: nauticalEnd ?? null,
    astronomicalEnd: astronomicalEnd ?? null,
  };
}

const DEG = Math.PI / 180;
const norm360 = (d: number) => ((d % 360) + 360) % 360;

function altitudeOf(raDeg: number, decDeg: number, instant: number, lat: number, lng: number): number {
  const J = instant / 86_400_000 + 2440587.5;
  const gmst = norm360(280.46061837 + 360.98564736629 * (J - 2451545.0));
  const H = (gmst + lng - raDeg) * DEG;
  const p = lat * DEG;
  const d = decDeg * DEG;
  return Math.asin(Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H)) / DEG;
}

export type RadiantPoint = { hour: number; time: string; altitude: number };

/** Perseid radiant altitude at fixed local clock hours through the night. */
export function computeRadiantAltitude(city: City): RadiantPoint[] {
  const { lat, lng } = city.coordinates;
  const hours = [22, 23, 0, 1, 2, 3, 4, 5];

  return hours.map((hour) => {
    const date = hour < 22 ? '2026-08-13' : ECLIPSE_DATE;
    const time = `${String(hour).padStart(2, '0')}:00:00`;
    const instant = zonedWallTimeToUtc(date, time, city.timezone);
    const altitude = altitudeOf(PERSEID_RADIANT.ra, PERSEID_RADIANT.dec, instant, lat, lng);
    return { hour, time: time.slice(0, 5), altitude: Math.max(0, Math.round(altitude)) };
  });
}

/** True if the radiant never sets from this latitude (true for all 16 cities on this list). */
export const isRadiantCircumpolar = (city: City) =>
  PERSEID_RADIANT.dec > 90 - Math.abs(city.coordinates.lat);
