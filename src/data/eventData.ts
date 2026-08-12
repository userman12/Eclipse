/**
 * EventData — content shared across every city, plus A Coruña's curated
 * observation spots. City-specific facts (phase times, Sun position, sky
 * objects, twilight) live in src/data/cities.ts and are computed in
 * src/lib/eclipseGeometry.ts, src/lib/skyObjects.ts and src/lib/night.ts.
 */

/**
 * Observation spots — A Coruña only.
 * These are suggestions, not a guarantee of visibility: the western horizon
 * must always be verified on site. Other cities don't get fabricated named
 * spots; see ObservationSpots.tsx for the generic fallback shown instead.
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
   The 76 seconds
   A second-by-second plan, universal to any total-eclipse city: the offsets
   are relative to THAT city's own totality start/end (src/lib/time.ts),
   so the same script applies whether totality lasts 32s (Bilbao) or 96s
   (Palma) — only steps whose window fits are ever reached.

   Totality is desperately short and the single most common regret is
   spending it fumbling with a phone, so each step says one thing to do and
   whether the glasses are on or off.
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
   Universal to any total-eclipse city.
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
   Perseids — generic facts, true for every city on the list.
   Location-specific numbers (twilight ladder, radiant altitude through the
   night) are computed live in src/lib/night.ts instead of hardcoded here.
--------------------------------------------------------------------------- */

export const perseids = {
  peakNight: '12–13',
  /** New Moon: guaranteed by the eclipse itself, everywhere on Earth. */
  moonIllumination: 0,
  radiant: { constellation: 'Perseus', ra: '03h13m', dec: 58 },
  /** Zenithal hourly rate under a perfect sky; real counts are lower. */
  zhr: 100,
};

/**
 * Weather — MOCK data.
 * Shaped like a real forecast payload so it can be swapped for an API
 * response (AEMET / Open-Meteo / Met Éireann / DWD...) without touching the
 * UI. See src/lib/weather.ts for the fetch seam and per-city variation.
 */
export type WeatherSnapshot = {
  source: string;
  isMock: boolean;
  observedAt: string; // wall-clock time in the city's own timezone
  temperatureC: number;
  cloudCoverPercent: number;
  lowCloudPercent: number;
  visibilityKm: number;
  windKmh: number;
  windDirection: number;
  /** Hourly cloud cover around the event window. */
  hourly: { time: string; cloudCoverPercent: number }[];
};
