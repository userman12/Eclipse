/**
 * Low-precision solar position (NOAA / Astronomical Almanac "low precision"
 * formulae). Accurate to roughly ±0.1°, far beyond what is needed to point a
 * phone at the right patch of sky — and it needs no network and no library.
 */

const DEG = Math.PI / 180;
const norm360 = (d: number) => ((d % 360) + 360) % 360;

export type SunPosition = {
  /** Degrees above the horizon. Negative once the Sun has set. */
  altitude: number;
  /** Degrees clockwise from true North (0 = N, 90 = E, 180 = S, 270 = W). */
  azimuth: number;
};

export function getSunPosition(instant: number, lat: number, lng: number): SunPosition {
  // Days since J2000.0
  const n = instant / 86_400_000 + 2440587.5 - 2451545.0;

  const meanLongitude = norm360(280.46 + 0.9856474 * n);
  const meanAnomaly = norm360(357.528 + 0.9856003 * n) * DEG;

  // Ecliptic longitude (equation of centre applied to the mean longitude)
  const lambda =
    (meanLongitude + 1.915 * Math.sin(meanAnomaly) + 0.02 * Math.sin(2 * meanAnomaly)) * DEG;
  const obliquity = (23.439 - 0.0000004 * n) * DEG;

  const rightAscension = Math.atan2(Math.cos(obliquity) * Math.sin(lambda), Math.cos(lambda));
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(lambda));

  // Greenwich mean sidereal time → local hour angle
  const gmstHours = 18.697374558 + 24.06570982441908 * n;
  const localSiderealDeg = norm360(gmstHours * 15 + lng);
  const hourAngle = (localSiderealDeg - rightAscension / DEG) * DEG;

  const latRad = lat * DEG;
  const altitude = Math.asin(
    Math.sin(latRad) * Math.sin(declination) +
      Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngle),
  );
  const azimuth = Math.atan2(
    -Math.cos(declination) * Math.sin(hourAngle),
    Math.sin(declination) * Math.cos(latRad) -
      Math.cos(declination) * Math.sin(latRad) * Math.cos(hourAngle),
  );

  return { altitude: altitude / DEG, azimuth: norm360(azimuth / DEG) };
}

/** Shortest signed angle from `from` to `to`, in [-180, 180]. */
export function angleDelta(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180;
}

const CARDINALS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'] as const;

/** Compass point label using Spanish/Italian cardinals (O = Ovest/Oeste). */
export const cardinal = (azimuth: number) =>
  CARDINALS[Math.round(norm360(azimuth) / 22.5) % 16];

/**
 * How high 12° actually is, expressed in a way a human can act on:
 * an outstretched fist at arm's length spans roughly 10°.
 */
export const fistsAboveHorizon = (altitudeDeg: number) =>
  Math.max(0, Math.round((altitudeDeg / 10) * 10) / 10);
