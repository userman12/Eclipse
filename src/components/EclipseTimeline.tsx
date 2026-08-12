'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GlassCard from '@/components/GlassCard';
import { eclipseEvent } from '@/data/eventData';
import { fill } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';
import { timedPhases, toHM, type EclipseState } from '@/lib/time';
import { cn } from '@/lib/utils';

const TOTALITY_IDS = new Set(['totality-start', 'maximum', 'totality-end']);

export default function EclipseTimeline({ state }: { state: EclipseState }) {
  const { t } = useCopy();
  const nextIndex = timedPhases.findIndex((p) => p.timestamp > state.now);

  return (
    <GlassCard aria-labelledby="timeline-title">
      <CardHeader>
        <p className="eyebrow">{t.timeline.subtitle}</p>
        <CardTitle id="timeline-title" className="font-display text-xl tracking-tight">
          {t.timeline.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ol className="relative mt-1">
          <span className="bg-border absolute top-3 bottom-3 left-[7px] w-px" aria-hidden />
          <motion.span
            className="from-corona to-sunset absolute top-3 left-[7px] w-px origin-top bg-gradient-to-b"
            style={{ height: 'calc(100% - 1.5rem)' }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: state.progress }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            aria-hidden
          />

          {timedPhases.map((phase, index) => {
            const isPast = phase.timestamp <= state.now;
            const isNext = index === nextIndex;
            const inTotality = TOTALITY_IDS.has(phase.id);

            return (
              <li key={phase.id} className="relative flex items-center gap-4 py-2.5 pl-7">
                <span
                  className={cn(
                    'absolute left-0 flex size-[15px] items-center justify-center rounded-full border-2 transition-colors duration-500',
                    isNext
                      ? 'border-corona bg-background'
                      : isPast
                        ? 'border-corona bg-corona'
                        : 'border-border bg-background',
                  )}
                  aria-hidden
                >
                  {isNext && (
                    <motion.span
                      className="bg-corona size-[7px] rounded-full"
                      animate={{ opacity: [1, 0.2, 1], scale: [1, 0.8, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </span>

                <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                  <span
                    className={cn(
                      'truncate text-[0.95rem] transition-colors',
                      inTotality
                        ? 'text-foreground font-semibold'
                        : isPast
                          ? 'text-muted-foreground'
                          : 'text-foreground/85',
                    )}
                  >
                    {t.phases[phase.id]}
                  </span>
                  <span
                    className={cn(
                      'numeric shrink-0 text-sm',
                      isNext
                        ? 'text-corona font-bold'
                        : isPast
                          ? 'text-muted-foreground/70'
                          : 'text-muted-foreground',
                    )}
                  >
                    {inTotality ? phase.time : toHM(phase.time)}
                  </span>
                </div>

                {isNext && (
                  <motion.span
                    layoutId="timeline-next"
                    className="absolute -top-1 right-0"
                    transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                  >
                    <Badge className="bg-corona/15 text-corona h-4 px-2 text-[0.6rem] font-bold tracking-widest uppercase">
                      {t.timeline.next}
                    </Badge>
                  </motion.span>
                )}
              </li>
            );
          })}
        </ol>

        <Separator className="my-4" />

        <p className="text-muted-foreground text-sm">
          {fill(t.timeline.totalityDuration, { n: eclipseEvent.totalityDurationSeconds })}
        </p>
      </CardContent>
    </GlassCard>
  );
}
