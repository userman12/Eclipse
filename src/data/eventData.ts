/**
 * EventData — single source of truth for the event.
 * All data is static and local: the app works with no network at all.
 * Times are LOCAL WALL-CLOCK times in the event timezone (Europe/Madrid).
 */

export const eclipseEvent = {
  id: 'solar-eclipse-2026-08-12-coruna',
  location: {
    name: 'A Coruña',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: {
      lat: 43.3623,
      lng: -8.4115,
    },
  },
  title: 'Eclipse total de Sol',
  date: '2026-08-12',
  direction: {
    label: 'Oeste',
    azimuth: 279,
    altitudeAtMaximum: 12,
    note: 'El Sol estará muy bajo sobre el horizonte.',
  },
  phases: [
    { id: 'partial-start', label: 'Comienza el eclipse', time: '19:30:51' },
    { id: 'totality-start', label: 'Comienza la totalidad', time: '20:27:35' },
    { id: 'maximum', label: 'Máximo', time: '20:28:13' },
    { id: 'totality-end', label: 'Finaliza la totalidad', time: '20:28:51' },
    { id: 'partial-end', label: 'Finaliza el eclipse', time: '21:21:54' },
  ],
  totalityDurationSeconds: 76,
} as const;

export type EclipseEvent = typeof eclipseEvent;
export type PhaseId = EclipseEvent['phases'][number]['id'];
export type Phase = { id: PhaseId; label: string; time: string };

/**
 * Observation spots.
 * These are suggestions, not a guarantee of visibility: the western horizon
 * must always be verified on site.
 */
export type SpotKind = 'coast' | 'viewpoint' | 'beach' | 'promenade';

/** How open the western horizon is — indicative only, always verify on site. */
export type WestHorizon = 'open' | 'partial' | 'limited';

export type ObservationSpot = {
  id: string;
  name: string;
  kind: SpotKind;
  /** i18n key suffix for the "why it may work" reason */
  reasonKey: string;
  westHorizon: WestHorizon;
  coordinates: { lat: number; lng: number };
  /** Rough walking/driving hint from the city centre, purely indicative. */
  distanceFromCenterKm: number;
};

export const observationSpots: ObservationSpot[] = [
  {
    id: 'o-portino',
    name: 'O Portiño',
    kind: 'coast',
    reasonKey: 'oPortino',
    westHorizon: 'open',
    coordinates: { lat: 43.3639, lng: -8.4331 },
    distanceFromCenterKm: 4.2,
  },
  {
    id: 'monte-san-pedro',
    name: 'Monte de San Pedro',
    kind: 'viewpoint',
    reasonKey: 'monteSanPedro',
    westHorizon: 'open',
    coordinates: { lat: 43.3767, lng: -8.4318 },
    distanceFromCenterKm: 4.8,
  },
  {
    id: 'playa-riazor',
    name: 'Playa de Riazor',
    kind: 'beach',
    reasonKey: 'riazor',
    westHorizon: 'partial',
    coordinates: { lat: 43.3702, lng: -8.4109 },
    distanceFromCenterKm: 1.6,
  },
  {
    id: 'playa-orzan',
    name: 'Playa de Orzán',
    kind: 'beach',
    reasonKey: 'orzan',
    westHorizon: 'partial',
    coordinates: { lat: 43.3722, lng: -8.4045 },
    distanceFromCenterKm: 1.3,
  },
  {
    id: 'o-parrote',
    name: 'O Parrote',
    kind: 'promenade',
    reasonKey: 'oParrote',
    westHorizon: 'limited',
    coordinates: { lat: 43.3661, lng: -8.3931 },
    distanceFromCenterKm: 0.8,
  },
];

/* ---------------------------------------------------------------------------
   The sky during totality
   Positions computed for A Coruña (43.3623, -8.4115) at maximum eclipse,
   2026-08-12 20:28:13 Europe/Madrid, using JPL approximate planetary elements
   and J2000 star coordinates. See scripts/verify-sky.mjs to re-derive them.

   The Sun sits at altitude 11.8°, azimuth 279.5°.
--------------------------------------------------------------------------- */

export type SkyObjectKind = 'planet' | 'star';

export type SkyObject = {
  id: string;
  kind: SkyObjectKind;
  /** Apparent visual magnitude — lower is brighter. */
  magnitude: number;
  /** Degrees above the horizon at maximum. */
  altitude: number;
  /** Degrees clockwise from true North at maximum. */
  azimuth: number;
  /** Angular distance from the eclipsed Sun, in degrees. */
  separationFromSun: number;
  /**
   * True when the object is normally lost in the Sun's glare and only becomes
   * visible because the disk is covered — the rarest sight of the whole event.
   */
  onlyDuringTotality?: boolean;
};

export const sunAtMaximum = { altitude: 11.8, azimuth: 279.5 };

export const skyDuringTotality: SkyObject[] = [
  // Planets, brightest first
  {
    id: 'venus',
    kind: 'planet',
    magnitude: -2.8,
    altitude: 28.2,
    azimuth: 233.5,
    separationFromSun: 45.9,
  },
  {
    id: 'jupiter',
    kind: 'planet',
    magnitude: -1.8,
    altitude: 6.9,
    azimuth: 288.9,
    separationFromSun: 10.5,
    onlyDuringTotality: true,
  },
  {
    id: 'mercury',
    kind: 'planet',
    magnitude: -1.0,
    altitude: 4.7,
    azimuth: 292.7,
    separationFromSun: 14.9,
    onlyDuringTotality: true,
  },
  // Stars, brightest first
  {
    id: 'arcturus',
    kind: 'star',
    magnitude: -0.05,
    altitude: 62.4,
    azimuth: 214.0,
    separationFromSun: 68.3,
  },
  {
    id: 'vega',
    kind: 'star',
    magnitude: 0.03,
    altitude: 53.0,
    azimuth: 79.8,
    separationFromSun: 113.1,
  },
  {
    id: 'altair',
    kind: 'star',
    magnitude: 0.77,
    altitude: 22.1,
    azimuth: 98.9,
    separationFromSun: 146.1,
  },
  {
    id: 'spica',
    kind: 'star',
    magnitude: 0.97,
    altitude: 29.6,
    azimuth: 212.6,
    separationFromSun: 64.2,
  },
  {
    id: 'antares',
    kind: 'star',
    magnitude: 1.09,
    altitude: 18.4,
    azimuth: 163.5,
    separationFromSun: 110.0,
  },
  {
    id: 'deneb',
    kind: 'star',
    magnitude: 1.25,
    altitude: 34.9,
    azimuth: 57.8,
    separationFromSun: 118.9,
  },
  {
    id: 'regulus',
    kind: 'star',
    magnitude: 1.35,
    altitude: 17.0,
    azimuth: 270.5,
    separationFromSun: 10.1,
    onlyDuringTotality: true,
  },
];

/* ---------------------------------------------------------------------------
   The 76 seconds
   A second-by-second plan. Totality is desperately short and the single most
   common regret is spending it fumbling with a phone, so each step says one
   thing to do and whether the glasses are on or off.

   `from` / `to` are seconds relative to the START of totality (20:27:35);
   negative values are before it. Totality ends at +76.
--------------------------------------------------------------------------- */

export type GlassesState = 'on' | 'off';

export type ScriptStep = {
  id: string;
  from: number;
  to: number;
  glasses: GlassesState;
  /** 1 = do not miss this, 3 = nice to have. */
  priority: 1 | 2 | 3;
};

export const totalityScript: ScriptStep[] = [
  { id: 'approach', from: -180, to: -20, glasses: 'on', priority: 2 },
  { id: 'shadow-bands', from: -90, to: -10, glasses: 'on', priority: 3 },
  { id: 'beads', from: -20, to: -3, glasses: 'on', priority: 2 },
  { id: 'diamond-in', from: -5, to: 0, glasses: 'on', priority: 1 },
  { id: 'glasses-off', from: 0, to: 4, glasses: 'off', priority: 1 },
  { id: 'corona', from: 2, to: 18, glasses: 'off', priority: 1 },
  { id: 'prominences', from: 6, to: 22, glasses: 'off', priority: 2 },
  { id: 'look-around', from: 22, to: 44, glasses: 'off', priority: 2 },
  { id: 'planets', from: 30, to: 50, glasses: 'off', priority: 2 },
  { id: 'corona-again', from: 48, to: 62, glasses: 'off', priority: 1 },
  { id: 'glasses-on', from: 62, to: 76, glasses: 'on', priority: 1 },
  { id: 'diamond-out', from: 72, to: 82, glasses: 'on', priority: 2 },
];

/* ---------------------------------------------------------------------------
   Phenomena reference
   What each thing actually is, so it can be recognised rather than merely
   waited for. Read before the event; during it, follow the script above.
--------------------------------------------------------------------------- */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type LookDirection = 'sun' | 'horizon' | 'ground' | 'around' | 'self';

export type Phenomenon = {
  id: string;
  difficulty: Difficulty;
  direction: LookDirection;
  /** Seconds relative to the start of totality. */
  window: [number, number];
  /** Visible without eye protection (i.e. only inside totality). */
  nakedEye: boolean;
};

export const phenomena: Phenomenon[] = [
  { id: 'umbra-approach', difficulty: 'medium', direction: 'horizon', window: [-120, -5], nakedEye: false },
  { id: 'shadow-bands', difficulty: 'hard', direction: 'ground', window: [-90, 90], nakedEye: false },
  { id: 'temperature', difficulty: 'easy', direction: 'self', window: [-900, 300], nakedEye: false },
  { id: 'wildlife', difficulty: 'easy', direction: 'around', window: [-120, 120], nakedEye: false },
  { id: 'diamond-ring', difficulty: 'easy', direction: 'sun', window: [-5, 5], nakedEye: false },
  { id: 'baily-beads', difficulty: 'medium', direction: 'sun', window: [-15, 5], nakedEye: false },
  { id: 'corona', difficulty: 'easy', direction: 'sun', window: [0, 76], nakedEye: true },
  { id: 'chromosphere', difficulty: 'medium', direction: 'sun', window: [0, 15], nakedEye: true },
  { id: 'prominences', difficulty: 'medium', direction: 'sun', window: [0, 76], nakedEye: true },
  { id: 'horizon-360', difficulty: 'easy', direction: 'horizon', window: [0, 76], nakedEye: true },
];

/* ---------------------------------------------------------------------------
   The rest of the night
   The eclipse ends 19 minutes before sunset, and the same night happens to be
   the Perseid peak. A solar eclipse means a new Moon, so the sky is as dark as
   it ever gets — the two best nights of the year land on the same date.
--------------------------------------------------------------------------- */

export const twilight = {
  /** Wall-clock times, Europe/Madrid, 12 August 2026. */
  sunset: '21:41',
  civilEnd: '22:12',
  nauticalEnd: '22:50',
  astronomicalEnd: '23:32',
};

export const perseids = {
  peakNight: '12–13',
  /** New Moon: guaranteed by the eclipse itself. */
  moonIllumination: 0,
  radiant: { constellation: 'Perseus', ra: '03h13m', dec: 58 },
  /** The radiant never sets from A Coruña (dec 58° > 90° − 43.4°). */
  circumpolar: true,
  /** Zenithal hourly rate under a perfect sky; real counts are lower. */
  zhr: 100,
  /** Radiant altitude through the night, local time. */
  radiantAltitude: [
    { time: '22:00', altitude: 13 },
    { time: '23:00', altitude: 17 },
    { time: '00:00', altitude: 21 },
    { time: '01:00', altitude: 27 },
    { time: '02:00', altitude: 33 },
    { time: '03:00', altitude: 40 },
    { time: '04:00', altitude: 48 },
    { time: '05:00', altitude: 56 },
  ],
};

/**
 * Weather — MOCK data.
 * Shaped like a real forecast payload so it can be swapped for an API
 * response (AEMET / Open-Meteo) without touching the UI.
 * See src/lib/weather.ts for the fetch seam.
 */
export type WeatherSnapshot = {
  source: string;
  isMock: boolean;
  observedAt: string; // wall-clock time in event timezone
  temperatureC: number;
  cloudCoverPercent: number;
  lowCloudPercent: number;
  visibilityKm: number;
  windKmh: number;
  windDirection: number;
  /** Hourly cloud cover around the event window. */
  hourly: { time: string; cloudCoverPercent: number }[];
};

export const mockWeather: WeatherSnapshot = {
  source: 'mock',
  isMock: true,
  observedAt: '18:00',
  temperatureC: 21,
  cloudCoverPercent: 35,
  lowCloudPercent: 20,
  visibilityKm: 18,
  windKmh: 14,
  windDirection: 300,
  hourly: [
    { time: '18:00', cloudCoverPercent: 45 },
    { time: '19:00', cloudCoverPercent: 40 },
    { time: '20:00', cloudCoverPercent: 30 },
    { time: '21:00', cloudCoverPercent: 25 },
    { time: '22:00', cloudCoverPercent: 35 },
  ],
};
