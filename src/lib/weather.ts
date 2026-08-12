/**
 * Weather seam.
 *
 * Today this returns a deterministic mock per city. When a real provider is
 * wired up, only `fetchWeather` changes: map the provider payload onto
 * `WeatherSnapshot` for the given city's coordinates and timezone, and the
 * UI keeps working, mock badge included (set `isMock: false`).
 *
 * Example, Open-Meteo (no API key required):
 *   https://api.open-meteo.com/v1/forecast
 *     ?latitude={lat}&longitude={lng}
 *     &hourly=cloud_cover,cloud_cover_low,visibility,temperature_2m,wind_speed_10m
 *     &timezone={timezone}
 */

import type { City } from '@/data/cities';
import type { WeatherSnapshot } from '@/data/eventData';

/** Deterministic 0..1 value from a city id, so the mock varies but is stable per city. */
function seedFor(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return (hash % 1000) / 1000;
}

export async function fetchWeather(city: City): Promise<WeatherSnapshot> {
  const seed = seedFor(city.id);
  // A mild latitude effect (further north/inland → a little cooler), plus a
  // per-city deterministic wobble so the mock doesn't look identical everywhere.
  const cloudCover = Math.round(20 + seed * 55);
  const lowCloud = Math.round(cloudCover * (0.35 + seed * 0.4));
  const temperature = Math.round(24 - Math.abs(city.coordinates.lat - 40) * 0.25 - seed * 4);

  return {
    source: 'mock',
    isMock: true,
    observedAt: '18:00',
    temperatureC: temperature,
    cloudCoverPercent: cloudCover,
    lowCloudPercent: Math.min(cloudCover, lowCloud),
    visibilityKm: Math.round(12 + (1 - seed) * 20),
    windKmh: Math.round(6 + seed * 22),
    windDirection: Math.round(260 + seed * 60),
    hourly: [18, 19, 20, 21, 22].map((h, i) => ({
      time: `${h}:00`,
      cloudCoverPercent: Math.max(
        0,
        Math.min(100, Math.round(cloudCover + Math.sin(seed * 10 + i) * 15)),
      ),
    })),
  };
}

export type WeatherVerdict = 'good' | 'mixed' | 'poor';

/**
 * With the Sun very low on the horizon at every one of these cities, low
 * cloud on the western horizon matters far more than total cover overhead,
 * so it is weighted double.
 */
export function assessWeather(w: WeatherSnapshot): WeatherVerdict {
  const score = w.lowCloudPercent * 2 + w.cloudCoverPercent;
  if (score <= 90) return 'good';
  if (score <= 180) return 'mixed';
  return 'poor';
}
