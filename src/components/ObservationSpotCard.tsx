'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Eye, Footprints, Navigation, TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ObservationSpot, WestHorizon } from '@/data/eventData';
import { revealVariants } from '@/components/GlassCard';
import { fill } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';
import { cn } from '@/lib/utils';

const horizonStyle: Record<WestHorizon, string> = {
  open: 'bg-corona/18 text-corona',
  partial: 'bg-moon/12 text-moon',
  limited: 'bg-sunset/18 text-sunset',
};

/** Universal maps link: opens the native app on mobile, the web map otherwise. */
const directionsUrl = (spot: ObservationSpot) =>
  `https://www.google.com/maps/dir/?api=1&destination=${spot.coordinates.lat},${spot.coordinates.lng}&travelmode=walking`;

export default function ObservationSpotCard({ spot }: { spot: ObservationSpot }) {
  const { t } = useCopy();
  const reasons = t.spots.reasons as Record<string, string>;

  // A specular highlight that follows the pointer, so the pane reads as glass
  // being tilted under a light rather than as a flat translucent rectangle.
  const rawX = useMotionValue(50);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 20 });
  const y = useSpring(rawY, { stiffness: 150, damping: 20 });
  const highlight = useMotionTemplate`radial-gradient(220px circle at ${x}% ${y}%, color-mix(in oklab, var(--color-moon) 14%, transparent), transparent 70%)`;

  return (
    <motion.article
      variants={revealVariants}
      whileTap={{ scale: 0.985 }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        rawX.set(((event.clientX - rect.left) / rect.width) * 100);
        rawY.set(((event.clientY - rect.top) / rect.height) * 100);
      }}
      className="h-full"
    >
      <Card className="glass relative h-full gap-3 rounded-3xl border-0 py-4 ring-0">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: highlight }}
        />

        <CardHeader>
          <CardTitle className="font-display text-lg leading-tight">{spot.name}</CardTitle>
          <p className="text-muted-foreground text-sm">{t.spots.kinds[spot.kind]}</p>
          <CardAction>
            <Badge
              className={cn(
                'h-auto py-1 text-[0.65rem] font-bold tracking-wide uppercase',
                horizonStyle[spot.westHorizon],
              )}
            >
              {t.spots.horizon[spot.westHorizon]}
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-foreground/85 text-[0.95rem] leading-snug">
            {reasons[spot.reasonKey]}
          </p>

          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Footprints size={13} aria-hidden />
            {fill(t.spots.distance, { n: spot.distanceFromCenterKm })}
            <span className="mx-1 opacity-40">·</span>
            <Eye size={13} aria-hidden />
            {t.spots.horizonLabel}
          </p>

          <Button
            asChild
            size="lg"
            className="bg-corona text-atlantic hover:bg-corona/85 h-12 w-full rounded-2xl text-[0.95rem] font-bold"
          >
            <a href={directionsUrl(spot)} target="_blank" rel="noopener noreferrer">
              <Navigation strokeWidth={2.4} aria-hidden />
              {t.spots.cta}
            </a>
          </Button>

          <p className="text-muted-foreground flex gap-2 text-xs leading-snug">
            <TriangleAlert size={13} className="text-sunset mt-0.5 shrink-0" aria-hidden />
            {t.spots.warning}
          </p>
        </CardContent>
      </Card>
    </motion.article>
  );
}
