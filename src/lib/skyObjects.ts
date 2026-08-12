/**
 * Live planet and star positions for the sky map during totality.
 *
 * Ported from scripts/verify-sky.mjs so the numbers are computed for
 * whichever total-eclipse city is selected, at that city's own totality
 * maximum — rather than a table baked in for A Coruña alone. Method: JPL
 * approximate planetary elements (Standish, valid 1800–2050), J2000 star
 * catalogue positions, and Meeus' magnitude formulae. Accuracy is far better
 * than the ~1° a person can point at.
 */

import { getSunPosition } from '@/lib/sun';

const DEG = Math.PI / 180;
const norm360 = (d: number) => ((d % 360) + 360) % 360;

type OrbitalElements = {
  a: [number, number];
  e: [number, number];
  I: [number, number];
  L: [number, number];
  w: [number, number];
  O: [number, number];
};

const PLANETS: Record<string, OrbitalElements> = {
  mercury: {
    a: [0.38709927, 0.00000037],
    e: [0.20563593, 0.00001906],
    I: [7.00497902, -0.00594749],
    L: [252.2503235, 149472.67411175],
    w: [77.45779628, 0.16047689],
    O: [48.33076593, -0.12534081],
  },
  venus: {
    a: [0.72333566, 0.0000039],
    e: [0.00677672, -0.00004107],
    I: [3.39467605, -0.0007889],
    L: [181.9790995, 58517.81538729],
    w: [131.60246718, 0.00268329],
    O: [76.67984255, -0.27769418],
  },
  earth: {
    a: [1.00000261, 0.00000562],
    e: [0.01671123, -0.00004392],
    I: [-0.00001531, -0.01294668],
    L: [100.46457166, 35999.37244981],
    w: [102.93768193, 0.32327364],
    O: [0, 0],
  },
  jupiter: {
    a: [5.202887, -0.00011607],
    e: [0.04838624, -0.00013253],
    I: [1.30439695, -0.00183714],
    L: [34.39644051, 3034.74612775],
    w: [14.72847983, 0.21252668],
    O: [100.47390909, 0.20469106],
  },
};

function heliocentric(p: OrbitalElements, T: number) {
  const a = p.a[0] + p.a[1] * T;
  const e = p.e[0] + p.e[1] * T;
  const I = (p.I[0] + p.I[1] * T) * DEG;
  const L = p.L[0] + p.L[1] * T;
  const w = p.w[0] + p.w[1] * T;
  const O = (p.O[0] + p.O[1] * T) * DEG;
  const wp = (w - (p.O[0] + p.O[1] * T)) * DEG; // argument of perihelion

  let M = norm360(L - w);
  if (M > 180) M -= 360;
  const Mrad = M * DEG;

  let E = Mrad;
  for (let i = 0; i < 12; i++) E = E - (E - e * Math.sin(E) - Mrad) / (1 - e * Math.cos(E));

  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cw = Math.cos(wp);
  const sw = Math.sin(wp);
  const cO = Math.cos(O);
  const sO = Math.sin(O);
  const ci = Math.cos(I);
  const si = Math.sin(I);

  return {
    x: (cw * cO - sw * sO * ci) * xp + (-sw * cO - cw * sO * ci) * yp,
    y: (cw * sO + sw * cO * ci) * xp + (-sw * sO + cw * cO * ci) * yp,
    z: sw * si * xp + cw * si * yp,
  };
}

const julianDay = (instant: number) => instant / 86_400_000 + 2440587.5;

function eqToAltAz(raDeg: number, decDeg: number, instant: number, lat: number, lng: number) {
  const J = julianDay(instant);
  const gmst = norm360(280.46061837 + 360.98564736629 * (J - 2451545.0));
  const H = (gmst + lng - raDeg) * DEG;
  const p = lat * DEG;
  const d = decDeg * DEG;
  const alt = Math.asin(Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H));
  const az = Math.atan2(
    -Math.cos(d) * Math.sin(H),
    Math.sin(d) * Math.cos(p) - Math.cos(d) * Math.sin(p) * Math.cos(H),
  );
  return { altitude: alt / DEG, azimuth: norm360(az / DEG) };
}

function planetGeocentric(name: keyof typeof PLANETS, instant: number) {
  const J = julianDay(instant);
  const T = (J - 2451545.0) / 36525;
  const P = heliocentric(PLANETS[name], T);
  const E = heliocentric(PLANETS.earth, T);
  const x = P.x - E.x;
  const y = P.y - E.y;
  const z = P.z - E.z;

  const eps = 23.43928 * DEG;
  const xe = x;
  const ye = y * Math.cos(eps) - z * Math.sin(eps);
  const ze = y * Math.sin(eps) + z * Math.cos(eps);

  const ra = norm360(Math.atan2(ye, xe) / DEG);
  const dec = Math.atan2(ze, Math.hypot(xe, ye)) / DEG;
  const dist = Math.hypot(x, y, z);
  const sunDist = Math.hypot(P.x, P.y, P.z);
  return { ra, dec, dist, sunDist };
}

/** Meeus' visual-magnitude formulae, needing distance from Sun/Earth and phase angle. */
const magnitudeFormula: Record<'mercury' | 'venus' | 'jupiter', (r: number, d: number, a: number) => number> = {
  mercury: (r, d, a) => -0.36 + 5 * Math.log10(r * d) + 0.038 * a - 0.000273 * a * a + 2.0e-6 * a * a * a,
  venus: (r, d, a) => -4.47 + 5 * Math.log10(r * d) + 0.0103 * a + 2.3e-4 * a * a + 4.87e-7 * a * a * a,
  jupiter: (r, d) => -9.4 + 5 * Math.log10(r * d),
};

function planetMagnitude(name: 'mercury' | 'venus' | 'jupiter', instant: number): number {
  const J = julianDay(instant);
  const T = (J - 2451545.0) / 36525;
  const earthSunDist = Math.hypot(...Object.values(heliocentric(PLANETS.earth, T)));
  const { dist: d, sunDist: r } = planetGeocentric(name, instant);
  const cosPhase = (r * r + d * d - earthSunDist * earthSunDist) / (2 * r * d);
  const phaseAngle = Math.acos(Math.min(1, Math.max(-1, cosPhase))) / DEG;
  return magnitudeFormula[name](r, d, phaseAngle);
}

/** J2000 RA/Dec (degrees) of bright stars near the ecliptic at a Northern-summer dusk. */
const STARS: { id: string; ra: number; dec: number; magnitude: number }[] = [
  { id: 'arcturus', ra: 213.915417, dec: 19.1825, magnitude: -0.05 },
  { id: 'vega', ra: 279.234583, dec: 38.783611, magnitude: 0.03 },
  { id: 'altair', ra: 297.695833, dec: 8.868333, magnitude: 0.77 },
  { id: 'spica', ra: 201.298333, dec: -11.161389, magnitude: 0.97 },
  { id: 'antares', ra: 247.352083, dec: -26.431944, magnitude: 1.09 },
  { id: 'deneb', ra: 310.357917, dec: 45.280278, magnitude: 1.25 },
  { id: 'regulus', ra: 152.092917, dec: 11.967222, magnitude: 1.35 },
];

export type SkyObjectKind = 'planet' | 'star';

export type SkyObject = {
  id: string;
  kind: SkyObjectKind;
  magnitude: number;
  altitude: number;
  azimuth: number;
  separationFromSun: number;
  /** Normally lost in the Sun's glare; totality is the only time it can be seen. */
  onlyDuringTotality: boolean;
};

const angularSeparation = (
  alt1: number,
  az1: number,
  alt2: number,
  az2: number,
): number =>
  Math.acos(
    Math.min(
      1,
      Math.max(
        -1,
        Math.sin(alt1 * DEG) * Math.sin(alt2 * DEG) +
          Math.cos(alt1 * DEG) * Math.cos(alt2 * DEG) * Math.cos((az1 - az2) * DEG),
      ),
    ),
  ) / DEG;

/**
 * Planets and bright stars visible at `instant`, from `lat`/`lng` — meant to
 * be called with a total-eclipse city's own totality-maximum instant.
 */
export function getSkyObjects(instant: number, lat: number, lng: number): SkyObject[] {
  const sun = getSunPosition(instant, lat, lng);

  const planets: SkyObject[] = (['venus', 'jupiter', 'mercury'] as const).map((id) => {
    const { ra, dec } = planetGeocentric(id, instant);
    const { altitude, azimuth } = eqToAltAz(ra, dec, instant, lat, lng);
    const separationFromSun = angularSeparation(altitude, azimuth, sun.altitude, sun.azimuth);
    return {
      id,
      kind: 'planet',
      magnitude: planetMagnitude(id, instant),
      altitude,
      azimuth,
      separationFromSun,
      onlyDuringTotality: separationFromSun < 20,
    };
  });

  const stars: SkyObject[] = STARS.map(({ id, ra, dec, magnitude }) => {
    const { altitude, azimuth } = eqToAltAz(ra, dec, instant, lat, lng);
    const separationFromSun = angularSeparation(altitude, azimuth, sun.altitude, sun.azimuth);
    return {
      id,
      kind: 'star',
      magnitude,
      altitude,
      azimuth,
      separationFromSun,
      onlyDuringTotality: separationFromSun < 20,
    };
  });

  return [...planets, ...stars].sort((a, b) => a.magnitude - b.magnitude);
}
