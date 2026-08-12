'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import GlassCard, { revealVariants } from '@/components/GlassCard';
import Countdown from '@/components/Countdown';
import ContextualStatus from '@/components/ContextualStatus';
import EclipseDial from '@/components/EclipseDial';
import LiveGuide from '@/components/LiveGuide';
import { ECLIPSE_DATE } from '@/data/cities';
import { useCity } from '@/lib/CityProvider';
import { cityLabel } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';
import { formatEventClock, type EclipseState } from '@/lib/time';

const tones = {
  before: 'calm',
  'partial-rising': 'active',
  totality: 'critical',
  'partial-falling': 'active',
  after: 'calm',
} as const;

export default function EclipseHero({
  state,
  onOpenScript,
}: {
  state: EclipseState;
  /** Lets the live box jump to the full script in the Totalità tab. */
  onOpenScript?: () => void;
}) {
  const { lang, t } = useCopy();
  const { city } = useCity();
  const label = cityLabel(t, city.id);

  const localeTag = { it: 'it-IT', es: 'es-ES', en: 'en-GB' }[lang];
  const dateLabel = new Intl.DateTimeFormat(localeTag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: city.timezone,
  }).format(new Date(`${ECLIPSE_DATE}T12:00:00Z`));

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
            {label.name}, {label.country}
          </p>
          <h1 className="font-display mt-1.5 text-2xl leading-tight tracking-tight">
            {city.type === 'total' ? t.eclipseTitle.total : t.eclipseTitle.partial}
          </h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{dateLabel}</p>
        </div>

        <div className="shrink-0 text-right">
          <p className="numeric font-display text-xl leading-none">
            {formatEventClock(state.now, city.timezone)}
          </p>
          <p className="text-muted-foreground mt-1 text-[0.62rem] tracking-widest uppercase">
            {t.liveClock}
          </p>
        </div>
      </motion.div>

      <GlassCard live>
        <CardContent>
          {/* items-center, not items-start: EclipseDial (icon + percentage
              + label, ~109px tall) is taller than the countdown's own
              content, so top-aligning left the digits sitting high with a
              dead gap beneath them before the progress bar. Centering the
              two blocks against each other uses that space instead of
              leaving it empty. */}
          <div className="flex items-center justify-between gap-3">
            {/* A container-query context: the countdown's digits are sized
                in cqw (percent of THIS box's actual width), not vw (percent
                of the full viewport). vw has no way to know EclipseDial and
                the card padding already ate part of the row, so at some
                phone widths it either overflowed or left the row half
                empty; cqw measures the real remaining space directly. */}
            <div className="min-w-0 flex-1 @container">
              {state.target ? (
                <Countdown
                  ms={state.msToTarget}
                  tone={tones[state.stage]}
                  label={countdownLabel}
                  targetTime={state.target.time}
                />
              ) : (
                <p className="text-muted-foreground font-display py-2 text-2xl">
                  {t.countdown.done}
                </p>
              )}
            </div>

            {/* Live Sun/Moon geometry, driven by the same clock as the countdown. */}
            <EclipseDial city={city} state={state} />
          </div>

          <Progress
            value={state.progress * 100}
            className="mt-4 h-1"
            aria-label={t.timeline.title}
          />

          {/* Renders only inside the script window, and only for total-eclipse
              cities; silent the rest of the time. */}
          {city.type === 'total' && (
            <LiveGuide city={city} state={state} onOpenScript={onOpenScript} />
          )}
        </CardContent>
      </GlassCard>

      <motion.div variants={revealVariants}>
        <ContextualStatus city={city} state={state} />
      </motion.div>
    </header>
  );
}
