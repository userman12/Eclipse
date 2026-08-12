'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudSun, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CitySelector from '@/components/CitySelector';
import Compass from '@/components/Compass';
import EclipseHero from '@/components/EclipseHero';
import EclipseTimeline from '@/components/EclipseTimeline';
import { staggerVariants } from '@/components/GlassCard';
import HorizonView from '@/components/HorizonView';
import LanguageToggle from '@/components/LanguageToggle';
import ObservationSpots from '@/components/ObservationSpots';
import PartialCityNotice from '@/components/PartialCityNotice';
import PerseidNight from '@/components/PerseidNight';
import PhenomenaGuide from '@/components/PhenomenaGuide';
import SafetyNotice from '@/components/SafetyNotice';
import SkyDuringTotality from '@/components/SkyDuringTotality';
import TotalityScript from '@/components/TotalityScript';
import WeatherCard from '@/components/WeatherCard';
import { useCity } from '@/lib/CityProvider';
import { cityLabel, fill } from '@/lib/i18n';
import { getSunPosition } from '@/lib/sun';
import { deviceTimezoneMismatch, getEclipseState, type EclipseStage } from '@/lib/time';
import { useCopy } from '@/lib/LanguageProvider';
import { useNow } from '@/lib/useNow';

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
  const { city } = useCity();
  const now = useNow();
  const [tzMismatch, setTzMismatch] = useState<string | null>(null);
  const [tab, setTab] = useState('now');
  const previousStage = useRef<EclipseStage | null>(null);
  const previousCityId = useRef(city.id);

  useEffect(() => setTzMismatch(deviceTimezoneMismatch(city.timezone)), [city.timezone]);

  const state = now === null ? null : getEclipseState(city, now);
  const stage = state?.stage ?? null;

  // A phase change is the one moment the user must not miss, even with the
  // phone in a pocket: announce it, and buzz on the transitions that affect
  // the eyes. Switching cities also changes `stage` instantly (a different
  // city can be at a completely different point in its own eclipse) — that
  // is a navigation action, not a real-world event, so it must never fire a
  // toast or a buzz.
  useEffect(() => {
    if (previousCityId.current !== city.id) {
      previousCityId.current = city.id;
      previousStage.current = stage;
      return;
    }
    if (!stage) return;
    if (previousStage.current === null) {
      previousStage.current = stage;
      return;
    }
    if (previousStage.current === stage) return;
    previousStage.current = stage;

    toast(t.stage[stage], { description: t.status[stage], duration: 12000 });

    // Only total-eclipse cities have a glasses-off/glasses-on transition to
    // buzz for; a partial-only city's 'partial-falling' is just the eclipse
    // waning, nothing changes about eye safety at that boundary.
    if (stage === 'totality' || (stage === 'partial-falling' && city.type === 'total')) {
      navigator.vibrate?.([120, 60, 120, 60, 240]);
    }
  }, [stage, t, city.id, city.type]);

  // Before and after the eclipse the useful direction is the one at maximum:
  // pointing at the Sun's real position at 11:00 would answer the wrong question.
  const projected = !state || state.stage === 'before' || state.stage === 'after';
  const sun = state ? getSunPosition(state.now, city.coordinates.lat, city.coordinates.lng) : null;
  const azimuth = projected || !sun ? city.sunAtMax.azimuth : sun.azimuth;
  const altitude = projected || !sun ? city.sunAtMax.altitude : sun.altitude;

  return (
    <main className="pt-safe mx-auto w-full max-w-xl px-3 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3 flex items-center justify-between gap-2 px-1 pt-2"
      >
        <p className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-xs font-semibold tracking-[0.18em] uppercase">
          <CloudSun size={14} className="text-corona" aria-hidden />
          {t.appName}
        </p>
        <div className="flex items-center gap-2">
          <CitySelector />
          <LanguageToggle />
        </div>
      </motion.div>

      {state === null ? (
        <LoadingState />
      ) : (
        <>
          {/* The hero stays above the tabs: countdown and current instruction
              must never be a tap away, whatever section is open. */}
          <motion.div
            key={city.id}
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
          >
            <EclipseHero state={state} onOpenScript={() => setTab('totality')} />
          </motion.div>

          <Tabs value={tab} onValueChange={setTab} className="mt-4">
            <TabsList className="glass h-11 w-full rounded-2xl p-1">
              <TabsTrigger value="now" className="rounded-xl text-xs">
                {t.tabs.now}
              </TabsTrigger>
              <TabsTrigger value="totality" className="rounded-xl text-xs">
                {t.tabs.totality}
              </TabsTrigger>
              <TabsTrigger value="sky" className="rounded-xl text-xs">
                {t.tabs.sky}
              </TabsTrigger>
              <TabsTrigger value="places" className="rounded-xl text-xs">
                {t.tabs.places}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="now" asChild>
              <motion.div
                key={city.id}
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <Compass azimuth={azimuth} isLive={!projected} />
                <HorizonView city={city} state={state} altitude={altitude} isLive={!projected} />
                <EclipseTimeline city={city} state={state} />
                <SafetyNotice state={state} variant="card" />
              </motion.div>
            </TabsContent>

            <TabsContent value="totality" asChild>
              <motion.div
                key={city.id}
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {city.type === 'total' ? (
                  <>
                    <TotalityScript city={city} state={state} />
                    <PhenomenaGuide />
                  </>
                ) : (
                  <PartialCityNotice city={city} variant="totality" />
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="sky" asChild>
              <motion.div
                key={city.id}
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {city.type === 'total' ? (
                  <SkyDuringTotality city={city} />
                ) : (
                  <PartialCityNotice city={city} variant="sky" />
                )}
                <PerseidNight city={city} />
              </motion.div>
            </TabsContent>

            <TabsContent value="places" asChild>
              <motion.div
                key={city.id}
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <ObservationSpots city={city} />
                <WeatherCard city={city} />
              </motion.div>
            </TabsContent>
          </Tabs>

          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground/70 mt-6 space-y-2 px-1 text-xs leading-snug"
          >
            {tzMismatch && (
              <Alert className="glass-inset text-sunset rounded-2xl border-0 ring-0">
                <AlertDescription className="text-sunset">
                  {fill(t.footer.timezoneWarning, { city: cityLabel(t, city.id).name })} ({tzMismatch})
                </AlertDescription>
              </Alert>
            )}
            <p className="flex items-center gap-1.5">
              <WifiOff size={12} aria-hidden />
              {t.footer.offline}
            </p>
            <p>
              {fill(t.footer.disclaimer, {
                city: cityLabel(t, city.id).name,
                lat: city.coordinates.lat,
                lng: city.coordinates.lng,
              })}
            </p>
            <p>{t.footer.sources}</p>
          </motion.footer>

          <SafetyNotice state={state} variant="bar" />
        </>
      )}
    </main>
  );
}
