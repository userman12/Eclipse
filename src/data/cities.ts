/**
 * Cities where the 2026-08-12 eclipse is actually visible.
 *
 * This is a deliberately curated list, not an arbitrary "world cities" menu.
 * The path of totality on this date runs only through the Arctic, Greenland,
 * Iceland and northern/eastern Spain; the partial eclipse is visible across
 * a wider band of Western Europe and North Africa. Almost every other major
 * city on Earth (Tokyo, New York, Sydney, Dubai, ...) sees nothing at all
 * that day, so it would be actively misleading to list them here with a
 * countdown and a "where to look" compass.
 *
 * Every contact time, magnitude and Sun position below was cross-checked
 * against the app's own solar-position formula (src/lib/sun.ts) before being
 * entered — see scripts/verify-cities.mjs. All 16 cities matched published
 * predictions to within ~0.5°, and the Sun's altitude at each city's final
 * contact was used to determine `endsAtSunset` empirically (altitude ≈ 0°)
 * rather than trusting each source's own wording.
 */

/** Every city's phase times are local wall-clock times on this shared date. */
export const ECLIPSE_DATE = '2026-08-12';

export type EclipseType = 'total' | 'partial';

export type CityPhaseId =
  | 'partial-start'
  | 'totality-start'
  | 'maximum'
  | 'totality-end'
  | 'partial-end';

export type CityPhase = { id: CityPhaseId; time: string };

export type City = {
  id: string;
  country: string;
  timezone: string;
  coordinates: { lat: number; lng: number };
  type: EclipseType;
  /**
   * 5 entries (partial-start → totality-start → maximum → totality-end →
   * partial-end) for total cities, 3 (partial-start → maximum → partial-end)
   * for partial-only cities — there is no totality to bound.
   */
  phases: CityPhase[];
  /** Fraction of the Sun's area obscured at maximum, 0–1. */
  magnitudeAtMax: number;
  /** Only meaningful for type: 'total'. */
  totalityDurationSeconds?: number;
  sunAtMax: { altitude: number; azimuth: number };
  /**
   * True when the eclipse's last recorded contact coincides with sunset
   * (Sun altitude ≈ 0° at that instant) rather than the Sun climbing back to
   * full view. These cities never see the "eclipse is over" all-clear —
   * the Sun simply sets still partially covered.
   */
  endsAtSunset: boolean;
  /** A Coruña ships as the default selection. */
  isDefault?: boolean;
};

export const cities: City[] = [
  {
    id: 'a-coruna',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 43.3623, lng: -8.4115 },
    type: 'total',
    phases: [
      { id: 'partial-start', time: '19:30:51' },
      { id: 'totality-start', time: '20:27:35' },
      { id: 'maximum', time: '20:28:13' },
      { id: 'totality-end', time: '20:28:51' },
      { id: 'partial-end', time: '21:21:54' },
    ],
    magnitudeAtMax: 1,
    totalityDurationSeconds: 76,
    sunAtMax: { altitude: 11.8, azimuth: 279.5 },
    endsAtSunset: false,
    isDefault: true,
  },
  {
    id: 'reykjavik',
    country: 'Iceland',
    timezone: 'Atlantic/Reykjavik',
    coordinates: { lat: 64.1466, lng: -21.9426 },
    type: 'total',
    phases: [
      { id: 'partial-start', time: '16:47:10' },
      { id: 'totality-start', time: '17:48:15' },
      { id: 'maximum', time: '17:48:44' },
      { id: 'totality-end', time: '17:49:12' },
      { id: 'partial-end', time: '18:47:35' },
    ],
    magnitudeAtMax: 1,
    totalityDurationSeconds: 57,
    sunAtMax: { altitude: 24, azimuth: 253 },
    endsAtSunset: false,
  },
  {
    id: 'valencia',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 39.4699, lng: -0.3763 },
    type: 'total',
    phases: [
      { id: 'partial-start', time: '19:38:19' },
      { id: 'totality-start', time: '20:32:25' },
      { id: 'maximum', time: '20:32:55' },
      { id: 'totality-end', time: '20:33:24' },
      { id: 'partial-end', time: '20:58:00' },
    ],
    magnitudeAtMax: 1,
    totalityDurationSeconds: 59,
    sunAtMax: { altitude: 4, azimuth: 286 },
    endsAtSunset: true,
  },
  {
    id: 'zaragoza',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 41.6488, lng: -0.8891 },
    type: 'total',
    phases: [
      { id: 'partial-start', time: '19:34:37' },
      { id: 'totality-start', time: '20:28:58' },
      { id: 'maximum', time: '20:29:40' },
      { id: 'totality-end', time: '20:30:22' },
      { id: 'partial-end', time: '21:04:00' },
    ],
    magnitudeAtMax: 1,
    totalityDurationSeconds: 84,
    sunAtMax: { altitude: 6, azimuth: 285 },
    endsAtSunset: true,
  },
  {
    id: 'bilbao',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 43.263, lng: -2.935 },
    type: 'total',
    phases: [
      { id: 'partial-start', time: '19:31:43' },
      { id: 'totality-start', time: '20:27:17' },
      { id: 'maximum', time: '20:27:33' },
      { id: 'totality-end', time: '20:27:49' },
      { id: 'partial-end', time: '21:16:00' },
    ],
    magnitudeAtMax: 1,
    totalityDurationSeconds: 32,
    sunAtMax: { altitude: 8, azimuth: 283 },
    endsAtSunset: true,
  },
  {
    id: 'palma',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 39.5696, lng: 2.6502 },
    type: 'total',
    phases: [
      { id: 'partial-start', time: '19:37:58' },
      { id: 'totality-start', time: '20:31:00' },
      { id: 'maximum', time: '20:31:48' },
      { id: 'totality-end', time: '20:32:36' },
      { id: 'partial-end', time: '20:46:00' },
    ],
    magnitudeAtMax: 1,
    totalityDurationSeconds: 96,
    sunAtMax: { altitude: 2, azimuth: 287 },
    endsAtSunset: true,
  },
  {
    id: 'madrid',
    country: 'Spain',
    timezone: 'Europe/Madrid',
    coordinates: { lat: 40.4168, lng: -3.7038 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '19:36:40' },
      { id: 'maximum', time: '20:32:18' },
      { id: 'partial-end', time: '21:13:00' },
    ],
    magnitudeAtMax: 0.999,
    sunAtMax: { altitude: 7, azimuth: 283 },
    endsAtSunset: true,
  },
  {
    id: 'lisbon',
    country: 'Portugal',
    timezone: 'Europe/Lisbon',
    coordinates: { lat: 38.7223, lng: -9.1393 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '18:39:14' },
      { id: 'maximum', time: '19:36:04' },
      { id: 'partial-end', time: '20:29:03' },
    ],
    magnitudeAtMax: 0.949,
    sunAtMax: { altitude: 10, azimuth: 281 },
    endsAtSunset: true,
  },
  {
    id: 'dublin',
    country: 'Ireland',
    timezone: 'Europe/Dublin',
    coordinates: { lat: 53.3498, lng: -6.2603 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '18:12:50' },
      { id: 'maximum', time: '19:10:37' },
      { id: 'partial-end', time: '20:05:14' },
    ],
    magnitudeAtMax: 0.946,
    sunAtMax: { altitude: 15, azimuth: 275 },
    endsAtSunset: false,
  },
  {
    id: 'paris',
    country: 'France',
    timezone: 'Europe/Paris',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '19:22:09' },
      { id: 'maximum', time: '20:17:16' },
      { id: 'partial-end', time: '21:07:00' },
    ],
    magnitudeAtMax: 0.931,
    sunAtMax: { altitude: 8, azimuth: 284 },
    endsAtSunset: true,
  },
  {
    id: 'london',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '18:17:14' },
      { id: 'maximum', time: '19:13:15' },
      { id: 'partial-end', time: '20:06:15' },
    ],
    magnitudeAtMax: 0.925,
    sunAtMax: { altitude: 10, azimuth: 281 },
    endsAtSunset: false,
  },
  {
    id: 'brussels',
    country: 'Belgium',
    timezone: 'Europe/Brussels',
    coordinates: { lat: 50.8503, lng: 4.3517 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '19:18:42' },
      { id: 'maximum', time: '20:13:31' },
      { id: 'partial-end', time: '21:05:00' },
    ],
    magnitudeAtMax: 0.91,
    sunAtMax: { altitude: 7, azimuth: 284 },
    endsAtSunset: true,
  },
  {
    id: 'amsterdam',
    country: 'Netherlands',
    timezone: 'Europe/Amsterdam',
    coordinates: { lat: 52.3676, lng: 4.9041 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '19:16:01' },
      { id: 'maximum', time: '20:10:52' },
      { id: 'partial-end', time: '21:02:57' },
    ],
    magnitudeAtMax: 0.9,
    sunAtMax: { altitude: 8, azimuth: 284 },
    endsAtSunset: true,
  },
  {
    id: 'berlin',
    country: 'Germany',
    timezone: 'Europe/Berlin',
    coordinates: { lat: 52.52, lng: 13.405 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '19:15:24' },
      { id: 'maximum', time: '20:08:19' },
      { id: 'partial-end', time: '20:34:00' },
    ],
    magnitudeAtMax: 0.874,
    sunAtMax: { altitude: 3, azimuth: 290 },
    endsAtSunset: true,
  },
  {
    id: 'stockholm',
    country: 'Sweden',
    timezone: 'Europe/Stockholm',
    coordinates: { lat: 59.3293, lng: 18.0686 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '19:03:13' },
      { id: 'maximum', time: '19:56:07' },
      { id: 'partial-end', time: '20:41:00' },
    ],
    magnitudeAtMax: 0.844,
    sunAtMax: { altitude: 5, azimuth: 291 },
    endsAtSunset: true,
  },
  {
    id: 'rome',
    country: 'Italy',
    timezone: 'Europe/Rome',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    type: 'partial',
    phases: [
      { id: 'partial-start', time: '19:32:43' },
      // Maximum and sunset coincide here: the eclipse is still deepening
      // when the Sun disappears, so there is no later obscuration to show.
      { id: 'maximum', time: '20:11:00' },
      { id: 'partial-end', time: '20:11:00' },
    ],
    magnitudeAtMax: 0.751,
    sunAtMax: { altitude: 0, azimuth: 290 },
    endsAtSunset: true,
  },
];

export const defaultCity = cities.find((c) => c.isDefault) ?? cities[0];

export const getCityById = (id: string): City | undefined =>
  cities.find((c) => c.id === id);
