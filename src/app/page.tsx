'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import Compass from '@/components/Compass';
import EclipseHero from '@/components/EclipseHero';
import EclipseTimeline from '@/components/EclipseTimeline';
import { staggerVariants, revealVariants } from '@/components/GlassCard';
import HorizonView from '@/components/HorizonView';
import LanguageToggle from '@/components/LanguageToggle';
import ObservationSpots from '@/components/ObservationSpots';
import SafetyNotice from '@/components/SafetyNotice';
import WeatherCard from '@/components/WeatherCard';
import { eclipseEvent } from '@/data/eventData';
import { getSunPosition } from '@/lib/sun';
import { deviceTimezoneMismatch, getEclipseState, type EclipseStage } from '@/lib/time';
import { useCopy } from '@/lib/LanguageProvider';
import { useNow } from '@/lib/useNow';

const { lat, lng } = eclipseEvent.location.coordinates;

function LoadingState() {
  return (
    <div className="space-y-4" aria-hidden>
      <Skeleton className="h-28 rounded-3xl" />
      <Skeleton className="h-24 rounded-3xl" />
      <Skeleton className="h-96 rounded-3xl" />
    </div>
  );
}

export default function Home() {
  const { t } = useCopy();
  const now = useNow();
  const [tzMismatch, setTzMismatch] = useState<string | null>(null);
  const previousStage = useRef<EclipseStage | null>(null);

  useEffect(() => setTzMismatch(deviceTimezoneMismatch()), []);

  const state = now === null ? null : getEclipseState(now);
  const stage = state?.stage ?? null;

  // A phase change is the one moment the user must not miss, even with the
  // phone in a pocket: announce it, and buzz on the two that affect the eyes.
  useEffect(() => {
    if (!stage) return;
    if (previousStage.current === null) {
      previousStage.current = stage;
      return;
    }
    if (previousStage.current === stage) return;
    previousStage.current = stage;

    toast(t.stage[stage], {
      description: t.status[stage],
      duration: 12000,
    });

    if (stage === 'totality' || stage === 'partial-falling') {
      navigator.vibrate?.([120, 60, 120, 60, 240]);
    }
  }, [stage, t]);

  // Before and after the eclipse the useful direction is the one at maximum:
  // pointing at the Sun's real position at 11:00 would answer the wrong question.
  const projected = !state || state.stage === 'before' || state.stage === 'after';
  const sun = state ? getSunPosition(state.now, lat, lng) : null;
  const azimuth = projected || !sun ? eclipseEvent.direction.azimuth : sun.azimuth;
  const altitude = projected || !sun ? eclipseEvent.direction.altitudeAtMaximum : sun.altitude;

  return (
    <main className="pt-safe mx-auto w-full max-w-xl px-3 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3 flex items-center justify-between px-1 pt-2"
      >
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold tracking-[0.18em] uppercase">
          <CloudSun size={14} className="text-corona" aria-hidden />
          {t.appName}
        </p>
        <LanguageToggle />
      </motion.div>

      {state === null ? (
        <LoadingState />
      ) : (
        <motion.div
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <EclipseHero state={state} />
          <Compass azimuth={azimuth} isLive={!projected} />
          <HorizonView state={state} altitude={altitude} isLive={!projected} />
          <EclipseTimeline state={state} />
          <SafetyNotice state={state} variant="card" />
          <ObservationSpots />
          <WeatherCard />

          <motion.footer
            variants={revealVariants}
            className="text-muted-foreground/70 space-y-2 px-1 pt-2 text-xs leading-snug"
          >
            {tzMismatch && (
              <Alert className="glass-inset text-sunset rounded-2xl border-0 ring-0">
                <AlertDescription className="text-sunset">
                  {t.footer.timezoneWarning} ({tzMismatch})
                </AlertDescription>
              </Alert>
            )}
            <p className="flex items-center gap-1.5">
              <WifiOff size={12} aria-hidden />
              {t.footer.offline}
            </p>
            <p>{t.footer.disclaimer}</p>
          </motion.footer>

          <SafetyNotice state={state} variant="bar" />
        </motion.div>
      )}
    </main>
  );
}
