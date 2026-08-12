'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GlassCard from '@/components/GlassCard';
import { totalityScript, type ScriptStep } from '@/data/eventData';
import { useCopy } from '@/lib/LanguageProvider';
import {
  currentStep,
  formatOffset,
  isScriptLive,
  offsetSeconds,
} from '@/lib/totality';
import type { EclipseState } from '@/lib/time';
import { cn } from '@/lib/utils';

function GlassesTag({ state }: { state: ScriptStep['glasses'] }) {
  const { t } = useCopy();
  const on = state === 'on';
  return (
    <Badge
      className={cn(
        'h-auto shrink-0 gap-1 py-1 text-[0.62rem] font-bold tracking-wide uppercase',
        on ? 'bg-corona/20 text-corona' : 'bg-moon/20 text-moon',
      )}
    >
      {on ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
      {on ? t.script.glassesOn : t.script.glassesOff}
    </Badge>
  );
}

/**
 * The full choreography of totality.
 *
 * Reading material before the event; during it, the same step that the live
 * box under the countdown is showing gets highlighted and scrolled to — both
 * views share `currentStep` so they can never disagree.
 */
export default function TotalityScript({ state }: { state: EclipseState }) {
  const { t } = useCopy();
  const offset = offsetSeconds(state.now);
  const live = isScriptLive(offset);
  const activeRef = useRef<HTMLLIElement | null>(null);

  const steps = t.script.steps as Record<string, { title: string; body: string }>;
  const activeId = live ? (currentStep(offset)?.id ?? null) : null;

  // Keep the current instruction on screen without the user touching anything.
  useEffect(() => {
    if (!live || !activeRef.current) return;
    activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeId, live]);

  return (
    <GlassCard live={live} aria-labelledby="script-title">
      <CardHeader>
        <p className="eyebrow">{t.script.title}</p>
        <CardTitle id="script-title" className="font-display text-xl tracking-tight">
          {t.script.subtitle}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ol className="space-y-2">
          {totalityScript.map((step) => {
            const active = step.id === activeId;
            const past = live && offset >= step.to;
            const copy = steps[step.id];

            return (
              <li
                key={step.id}
                ref={active ? activeRef : null}
                className={cn(
                  'relative rounded-2xl p-3 transition-colors duration-500',
                  active
                    ? 'bg-corona/15 ring-corona/50 ring-2'
                    : past
                      ? 'opacity-45'
                      : 'glass-inset',
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'numeric shrink-0 text-xs font-bold',
                      active ? 'text-corona' : 'text-muted-foreground',
                    )}
                  >
                    {formatOffset(step.from)}
                  </span>

                  {step.priority === 1 && !active && (
                    <span
                      className="bg-sunset size-1.5 shrink-0 rounded-full"
                      title={t.script.priorityLabel}
                      aria-label={t.script.priorityLabel}
                    />
                  )}

                  <AnimatePresence>
                    {active && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge className="bg-corona text-atlantic h-5 animate-pulse px-2 text-[0.6rem] font-bold tracking-widest uppercase">
                          {t.script.liveNow}
                        </Badge>
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <span className="ml-auto">
                    <GlassesTag state={step.glasses} />
                  </span>
                </div>

                <h3
                  className={cn(
                    'font-display mt-1.5 leading-tight',
                    active ? 'text-corona text-lg' : 'text-foreground text-base',
                  )}
                >
                  {copy.title}
                </h3>
                <p className="text-foreground/80 mt-1 text-sm leading-snug">{copy.body}</p>
              </li>
            );
          })}
        </ol>

        <p className="text-muted-foreground mt-4 flex gap-2 text-xs leading-snug">
          <Lightbulb size={14} className="text-corona mt-0.5 shrink-0" aria-hidden />
          {t.script.tip}
        </p>
      </CardContent>
    </GlassCard>
  );
}
