'use client';

import { Compass, LifeBuoy, Navigation, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GlassCard from '@/components/GlassCard';
import type { City } from '@/data/cities';
import { cardinal } from '@/lib/sun';
import { useCopy } from '@/lib/LanguageProvider';
import { fill } from '@/lib/i18n';

/**
 * The honest fallback for the 15 cities that don't have curated named spots.
 *
 * A Coruña gets five specific, checked locations (ObservationSpots.tsx).
 * Fabricating equivalent named viewpoints for Reykjavik, Madrid, London and
 * the rest — without ever having verified them — would be worse than not
 * having spot suggestions at all, so this instead gives the one fact that
 * generalises safely (the direction to look) and a genuine search, not a pin.
 */
export default function GenericSpotGuidance({ city }: { city: City }) {
  const { t } = useCopy();
  const { lat, lng } = city.coordinates;
  const direction = cardinal(city.sunAtMax.azimuth);

  const searchUrl = (query: string) =>
    `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${lat},${lng},12z`;

  return (
    <GlassCard aria-labelledby="generic-spots-title">
      <CardHeader>
        <p className="eyebrow flex items-center gap-1.5">
          <Compass size={13} aria-hidden />
          {fill(t.spots.genericSubtitle, { az: Math.round(city.sunAtMax.azimuth), dir: direction })}
        </p>
        <CardTitle id="generic-spots-title" className="font-display text-xl tracking-tight">
          {t.spots.genericTitle}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-foreground/85 text-[0.95rem] leading-snug">{t.spots.genericBody}</p>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="glass-inset h-12 rounded-2xl text-sm font-semibold"
          >
            <a href={searchUrl(t.spots.searchViewpoint)} target="_blank" rel="noopener noreferrer">
              <Navigation strokeWidth={2.2} aria-hidden />
              {t.spots.searchViewpointCta}
            </a>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="glass-inset h-12 rounded-2xl text-sm font-semibold"
          >
            <a href={searchUrl(t.spots.searchOpenSpace)} target="_blank" rel="noopener noreferrer">
              <Navigation strokeWidth={2.2} aria-hidden />
              {t.spots.searchOpenSpaceCta}
            </a>
          </Button>
        </div>

        <p className="text-muted-foreground flex gap-2 text-xs leading-snug">
          <TriangleAlert size={13} className="text-sunset mt-0.5 shrink-0" aria-hidden />
          {t.spots.warning}
        </p>

        <div className="border-border/60 border-t pt-4">
          <h3 className="font-display flex items-center gap-2 text-base">
            <LifeBuoy size={16} className="text-corona" aria-hidden />
            {t.spots.fallbackTitle}
          </h3>
          <ol className="mt-3 space-y-2.5">
            {t.spots.fallbackSteps.map((step, index) => (
              <li key={step} className="text-foreground/80 flex gap-2.5 text-sm leading-snug">
                <span className="numeric text-corona font-display mt-0.5 shrink-0 text-xs">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </GlassCard>
  );
}
