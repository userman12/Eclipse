'use client';

import { Info } from 'lucide-react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GlassCard from '@/components/GlassCard';
import type { City } from '@/data/cities';
import { cityLabel, fill } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';

/**
 * What the Totality and Sky tabs show instead of their real content when
 * the selected city never reaches totality. Both depend on the Sun being
 * fully covered — a 76-second script to follow, a sky dark enough for
 * planets to appear — neither of which happens during even a 99.9% partial
 * eclipse. Explaining why is more honest than hiding the tab outright.
 */
export default function PartialCityNotice({
  city,
  variant,
}: {
  city: City;
  variant: 'totality' | 'sky';
}) {
  const { t } = useCopy();
  const copy = t.partialNotice[variant];
  const cityName = cityLabel(t, city.id).name;

  return (
    <GlassCard aria-labelledby={`partial-notice-${variant}`}>
      <CardHeader>
        <p className="eyebrow flex items-center gap-1.5">
          <Info size={13} aria-hidden />
          {t.partialNotice.eyebrow}
        </p>
        <CardTitle id={`partial-notice-${variant}`} className="font-display text-xl tracking-tight">
          {copy.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/85 text-[0.95rem] leading-snug">
          {fill(copy.body, { city: cityName, magnitude: Math.round(city.magnitudeAtMax * 100) })}
        </p>
      </CardContent>
    </GlassCard>
  );
}
