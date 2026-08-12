'use client';

import { motion } from 'framer-motion';
import { LifeBuoy, MapPin } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CardContent } from '@/components/ui/card';
import { observationSpots, type WestHorizon } from '@/data/eventData';
import GlassCard, { staggerVariants } from '@/components/GlassCard';
import ObservationSpotCard from '@/components/ObservationSpotCard';
import { useCopy } from '@/lib/LanguageProvider';

/** Most open western horizon first — that is the deciding factor at 12°. */
const rank: Record<WestHorizon, number> = { open: 0, partial: 1, limited: 2 };
const sorted = [...observationSpots].sort((a, b) => rank[a.westHorizon] - rank[b.westHorizon]);

export default function ObservationSpots() {
  const { t } = useCopy();

  return (
    <motion.section
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="space-y-4"
      aria-labelledby="spots-title"
    >
      <header className="px-1">
        <p className="eyebrow flex items-center gap-1.5">
          <MapPin size={13} aria-hidden />
          {t.spots.title}
        </p>
        <h2 id="spots-title" className="sr-only">
          {t.spots.title}
        </h2>
        <p className="text-muted-foreground mt-1.5 text-sm leading-snug">{t.spots.subtitle}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {sorted.map((spot) => (
          <ObservationSpotCard key={spot.id} spot={spot} />
        ))}
      </div>

      <GlassCard>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="fallback">
            <AccordionItem value="fallback" className="border-b-0">
              <AccordionTrigger className="font-display py-0 text-lg hover:no-underline">
                <span className="flex items-center gap-2">
                  <LifeBuoy size={18} className="text-corona" aria-hidden />
                  {t.spots.fallbackTitle}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <ol className="space-y-3">
                  {t.spots.fallbackSteps.map((step, index) => (
                    <li
                      key={step}
                      className="text-foreground/85 flex gap-3 text-[0.95rem] leading-snug"
                    >
                      <span className="numeric text-corona font-display mt-0.5 shrink-0 text-sm">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </GlassCard>
    </motion.section>
  );
}
