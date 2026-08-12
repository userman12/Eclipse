'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Eye, FlaskConical, Thermometer, Wind } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import GlassCard from '@/components/GlassCard';
import type { WeatherSnapshot } from '@/data/eventData';
import { assessWeather, fetchWeather, type WeatherVerdict } from '@/lib/weather';
import { cardinal } from '@/lib/sun';
import { useCopy } from '@/lib/LanguageProvider';
import { cn } from '@/lib/utils';

const verdictStyle: Record<WeatherVerdict, string> = {
  good: 'text-corona',
  mixed: 'text-moon',
  poor: 'text-sunset',
};

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-inset rounded-2xl px-3 py-2.5">
      <p className="text-muted-foreground flex items-center gap-1.5 text-[0.65rem] tracking-wide uppercase">
        {icon}
        {label}
      </p>
      <p className="numeric text-foreground mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

export default function WeatherCard() {
  const { t } = useCopy();
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    let active = true;
    fetchWeather().then((data) => active && setWeather(data));
    return () => {
      active = false;
    };
  }, []);

  if (!weather) {
    return (
      <GlassCard>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </GlassCard>
    );
  }

  const verdict = assessWeather(weather);
  const peak = Math.max(...weather.hourly.map((h) => h.cloudCoverPercent), 100);

  return (
    <GlassCard aria-labelledby="weather-title">
      <CardHeader>
        <p className="eyebrow">
          {t.weather.observedAt} {weather.observedAt}
        </p>
        <CardTitle id="weather-title" className="font-display text-xl tracking-tight">
          {t.weather.title}
        </CardTitle>
        {weather.isMock && (
          <CardAction>
            <Badge variant="outline" className="gap-1.5">
              <FlaskConical aria-hidden />
              {t.weather.mock}
            </Badge>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm">{t.weather.cloudCover}</p>
            <p className="numeric font-display text-5xl leading-none">
              {weather.cloudCoverPercent}
              <span className="text-muted-foreground text-2xl">%</span>
            </p>
          </div>
          <p className={cn('text-right text-sm font-semibold', verdictStyle[verdict])}>
            {t.weather.verdict[verdict]}
          </p>
        </div>

        <Progress value={weather.cloudCoverPercent} className="h-1.5" />

        <div className="glass-inset border-sunset/25 rounded-2xl p-3">
          <div className="flex items-baseline justify-between">
            <p className="flex items-center gap-1.5 text-sm">
              <Cloud size={14} className="text-sunset" aria-hidden />
              {t.weather.lowClouds}
            </p>
            <p className="numeric text-sunset text-lg font-bold">{weather.lowCloudPercent}%</p>
          </div>
          <p className="text-muted-foreground mt-1 text-xs leading-snug">
            {t.weather.lowCloudsNote}
          </p>
        </div>

        <div>
          <p className="eyebrow">{t.weather.hourly}</p>
          <div className="mt-2 flex items-end gap-2">
            {weather.hourly.map((hour, index) => (
              <div key={hour.time} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="bg-moon/5 flex h-16 w-full items-end overflow-hidden rounded-lg">
                  <motion.div
                    className="from-deep to-mist/60 w-full rounded-lg bg-gradient-to-t"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(hour.cloudCoverPercent / peak) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 90,
                      damping: 18,
                      delay: index * 0.07,
                    }}
                  />
                </div>
                <span className="numeric text-muted-foreground text-[0.65rem]">{hour.time}</span>
                <span className="numeric text-foreground/70 text-[0.65rem] font-semibold">
                  {hour.cloudCoverPercent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat
            icon={<Eye size={12} aria-hidden />}
            label={t.weather.visibility}
            value={`${weather.visibilityKm} km`}
          />
          <Stat
            icon={<Wind size={12} aria-hidden />}
            label={t.weather.wind}
            value={`${weather.windKmh} ${cardinal(weather.windDirection)}`}
          />
          <Stat
            icon={<Thermometer size={12} aria-hidden />}
            label={t.weather.temperature}
            value={`${weather.temperatureC}°`}
          />
        </div>

        {weather.isMock && (
          <p className="text-muted-foreground/70 text-xs">{t.weather.mockNote}</p>
        )}
      </CardContent>
    </GlassCard>
  );
}
