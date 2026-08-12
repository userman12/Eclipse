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
