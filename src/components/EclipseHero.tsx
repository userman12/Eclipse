'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import GlassCard, { revealVariants } from '@/components/GlassCard';
import Countdown from '@/components/Countdown';
import ContextualStatus from '@/components/ContextualStatus';
import { eclipseEvent } from '@/data/eventData';
import { useCopy } from '@/lib/LanguageProvider';
import { formatEventClock, type EclipseState } from '@/lib/time';

const tones = {
  before: 'calm',
  'partial-rising': 'active',
  totality: 'critical',
  'partial-falling': 'active',
  after: 'calm',
} as const;

export default function EclipseHero({ state }: { state: EclipseState }) {
  const { lang, t } = useCopy();

  const dateLabel = new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: eclipseEvent.location.timezone,
  }).format(new Date(`${eclipseEvent.date}T12:00:00Z`));

  const countdownLabel =
    state.stage === 'totality'
      ? t.countdown.glassesBackOn
      : state.target
        ? `${t.countdown.to} ${t.phases[state.target.id]}`
        : t.countdown.done;

  return (
    <header className="space-y-4">
      <motion.div
        variants={revealVariants}
        className="flex items-start justify-between gap-3 px-1"
      >
        <div className="min-w-0">
          <p className="eyebrow flex items-center gap-1.5">
            <MapPin size={13} aria-hidden />
            {eclipseEvent.location.name}, {eclipseEvent.location.country}
          </p>
          <h1 className="font-display mt-1.5 text-2xl leading-tight tracking-tight">
            {eclipseEvent.title}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{dateLabel}</p>
        </div>

        <div className="shrink-0 text-right">
          <p className="numeric font-display text-xl leading-none">
            {formatEventClock(state.now)}
          </p>
          <p className="text-muted-foreground mt-1 text-[0.62rem] tracking-widest uppercase">
            {t.liveClock}
          </p>
        </div>
      </motion.div>

      <GlassCard live>
        <CardContent>
          {state.target ? (
            <Countdown
              ms={state.msToTarget}
              tone={tones[state.stage]}
              label={countdownLabel}
              targetTime={state.target.time}
            />
          ) : (
            <p className="text-muted-foreground font-display py-2 text-2xl">{t.countdown.done}</p>
          )}

          <Progress
            value={state.progress * 100}
            className="mt-4 h-1"
            aria-label={t.timeline.title}
          />
        </CardContent>
      </GlassCard>

      <motion.div variants={revealVariants}>
        <ContextualStatus state={state} />
      </motion.div>
    </header>
  );
}
