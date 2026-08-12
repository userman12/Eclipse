'use client';

import { motion } from 'framer-motion';
import { Moon, MoonStar, Sparkles, Sunset } from 'lucide-react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GlassCard from '@/components/GlassCard';
import { perseids, twilight } from '@/data/eventData';
import { useCopy } from '@/lib/LanguageProvider';

const TWILIGHT_KEYS = ['sunset', 'civilEnd', 'nauticalEnd', 'astronomicalEnd'] as const;

/** Peak radiant altitude, used to scale the bars. */
const PEAK_ALTITUDE = Math.max(...perseids.radiantAltitude.map((r) => r.altitude));

export default function PerseidNight() {
  const { t } = useCopy();

  return (
    <GlassCard aria-labelledby="night-title">
      <CardHeader>
        <p className="eyebrow">{t.night.title}</p>
        <CardTitle id="night-title" className="font-display text-xl tracking-tight">
          {t.night.perseidsTitle}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="text-muted-foreground text-sm leading-snug">{t.night.subtitle}</p>

        {/* Twilight ladder */}
        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <Sunset size={12} aria-hidden />
            {t.night.twilightTitle}
          </p>
          <ul className="mt-2 space-y-1.5">
            {TWILIGHT_KEYS.map((key, index) => (
              <li
                key={key}
                className="glass-inset flex items-baseline justify-between gap-3 rounded-xl px-3 py-2"
              >
                <span className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      // Each step is a darker slice of the same dusk.
                      background: `color-mix(in oklab, var(--color-atlantic) ${index * 28}%, var(--color-sunset))`,
                    }}
                    aria-hidden
                  />
                  {t.night.twilight[key]}
                </span>
                <span className="numeric text-corona shrink-0 text-sm font-semibold">
                  {twilight[key]}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground/70 mt-2 text-xs leading-snug">
            {t.night.twilightNote}
          </p>
        </div>

        <Separator />

        {/* Why this night is special */}
        <div className="glass-inset border-corona/25 rounded-2xl p-3.5">
          <div className="flex items-start gap-2.5">
            <MoonStar size={18} className="text-corona mt-0.5 shrink-0" aria-hidden />
            <p className="text-foreground/85 text-sm leading-snug">{t.night.perseidsBody}</p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="glass-inset rounded-xl px-2.5 py-2">
              <p className="text-muted-foreground flex items-center gap-1 text-[0.6rem] tracking-wide uppercase">
                <Sparkles size={10} aria-hidden />
                {t.night.zhrLabel}
              </p>
              <p className="numeric mt-0.5 text-lg font-semibold">~{perseids.zhr}</p>
            </div>
            <div className="glass-inset rounded-xl px-2.5 py-2">
              <p className="text-muted-foreground flex items-center gap-1 text-[0.6rem] tracking-wide uppercase">
                <Moon size={10} aria-hidden />
                {t.night.moonLabel}
              </p>
              <p className="numeric text-corona mt-0.5 text-lg font-semibold">
                {perseids.moonIllumination}%
              </p>
            </div>
            <div className="glass-inset rounded-xl px-2.5 py-2">
              <p className="text-muted-foreground text-[0.6rem] tracking-wide uppercase">
                {t.night.bestWindow}
              </p>
              <p className="mt-0.5 text-xs leading-tight font-semibold">
                {t.night.bestWindowValue}
              </p>
            </div>
          </div>

          <p className="text-muted-foreground/70 mt-2 text-xs leading-snug">{t.night.zhrNote}</p>
        </div>

        {/* Radiant altitude through the night */}
        <div>
          <p className="eyebrow">{t.night.radiantTitle}</p>
          <div className="mt-2 flex items-end gap-1.5">
            {perseids.radiantAltitude.map((point, index) => (
              <div key={point.time} className="flex flex-1 flex-col items-center gap-1">
                <span className="numeric text-muted-foreground text-[0.6rem]">
                  {point.altitude}°
                </span>
                <div className="bg-moon/5 flex h-20 w-full items-end overflow-hidden rounded-md">
                  <motion.div
                    className="from-deep to-corona/70 w-full rounded-md bg-gradient-to-t"
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(point.altitude / PEAK_ALTITUDE) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{
                      type: 'spring',
                      stiffness: 90,
                      damping: 18,
                      delay: index * 0.06,
                    }}
                  />
                </div>
                <span className="numeric text-muted-foreground text-[0.58rem]">
                  {point.time.slice(0, 2)}
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground/70 mt-2 text-xs leading-snug">
            {t.night.radiantNote}
          </p>
        </div>

        <Separator />

        <div>
          <p className="eyebrow">{t.night.tipsTitle}</p>
          <ul className="mt-2 space-y-2">
            {t.night.tips.map((tip, index) => (
              <li
                key={tip}
                className="text-foreground/85 flex gap-2.5 text-[0.9rem] leading-snug"
              >
                <span className="numeric text-corona font-display mt-0.5 shrink-0 text-xs">
                  {index + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </GlassCard>
  );
}
