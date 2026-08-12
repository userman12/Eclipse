/**
 * Weather seam.
 *
 * Today this returns the local mock. When a real provider is wired up, only
 * `fetchWeather` changes: map the provider payload onto `WeatherSnapshot` and
 * the UI keeps working, mock badge included (set `isMock: false`).
 *
 * Example, Open-Meteo (no API key required):
 *   https://api.open-meteo.com/v1/forecast
 *     ?latitude=43.3623&longitude=-8.4115
 *     &hourly=cloud_cover,cloud_cover_low,visibility,temperature_2m,wind_speed_10m
 *     &timezone=Europe%2FMadrid
 */

import { mockWeather, type WeatherSnapshot } from '@/data/eventData';

export async function fetchWeather(): Promise<WeatherSnapshot> {
  return mockWeather;
}

export type WeatherVerdict = 'good' | 'mixed' | 'poor';

/**
 * With the Sun 12° above the horizon, low cloud on the western sea horizon
 * matters far more than total cover overhead, so it is weighted double.
 */
export function assessWeather(w: WeatherSnapshot): WeatherVerdict {
  const score = w.lowCloudPercent * 2 + w.cloudCoverPercent;
  if (score <= 90) return 'good';
  if (score <= 180) return 'mixed';
  return 'poor';
}
