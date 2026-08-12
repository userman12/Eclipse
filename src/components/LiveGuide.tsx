'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Eye, EyeOff, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { City } from '@/data/cities';
import { useCopy } from '@/lib/LanguageProvider';
import {
  currentStep,
  formatOffset,
  isScriptLive,
  nextStep,
  offsetSeconds,
  stepProgress,
} from '@/lib/totality';
import { getPhaseTimestamp, type EclipseState } from '@/lib/time';
import { cn } from '@/lib/utils';

/**
 * The live box that sits directly under the countdown.
 *
 * Totality is 76 seconds long: there is no time to scroll, change tab, or
 * read a list and decide. Everything needed in the moment — glasses on or
 * off, what to look at, what comes next — has to be visible without a single
 * tap, immediately below the clock the user is already staring at.
 *
 * Only rendered for total-eclipse cities — callers must check
 * `city.type === 'total'` first, since this whole choreography assumes a
 * totality window that partial-only cities don't have.
 */
export default function LiveGuide({
  city,
  state,
  onOpenScript,
}: {
  city: City;
  state: EclipseState;
  /** Jump to the full script; optional, the box works on its own. */
  onOpenScript?: () => void;
}) {
  const { t } = useCopy();

  const totalityStart = getPhaseTimestamp(city, 'totality-start');
  const offset = offsetSeconds(state.now, totalityStart);
  const live = isScriptLive(offset);
  const step = live ? currentStep(offset) : null;
  const next = live ? nextStep(offset) : null;

  // Outside the script window the safety bar and ContextualStatus already
  // carry the message; a second copy here would just be noise.
  if (!live || !step) return null;

  const steps = t.script.steps as Record<string, { title: string; body: string }>;
  const copy = steps[step.id];
  const nextCopy = next ? steps[next.id] : null;

  const glassesOff = step.glasses === 'off';
  const progress = stepProgress(step, offset);
  // Priority-1 steps are the ones where getting it wrong hurts your eyes.
  const critical = step.priority === 1;

  return (
    <div className="mt-4">
      {/* Glasses state: the single most important bit, so it gets a full-width
          block of solid colour rather than a subtle badge. */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.glasses}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className={cn(
            'flex items-center gap-2.5 rounded-t-2xl px-4 py-2.5',
            glassesOff ? 'bg-moon text-atlantic' : 'bg-corona text-atlantic',
          )}
        >
          <motion.span
            animate={critical ? { scale: [1, 1.16, 1] } : { scale: 1 }}
            transition={{ duration: 1.2, repeat: critical ? Infinity : 0 }}
            className="flex shrink-0"
          >
            {glassesOff ? <EyeOff size={20} strokeWidth={2.4} aria-hidden /> : <Eye size={20} strokeWidth={2.4} aria-hidden />}
          </motion.span>

          <span className="flex-1 text-sm font-bold tracking-wide uppercase">
            {glassesOff ? t.script.glassesOff : t.script.glassesOn}
          </span>

          <span className="numeric shrink-0 text-sm font-bold tabular-nums opacity-70">
            {formatOffset(offset)}
          </span>
        </motion.div>
      </AnimatePresence>

      <div className="glass-inset rounded-b-2xl px-4 pt-3 pb-3">
        {/* Progress through the current instruction */}
        <div className="bg-moon/10 h-0.5 w-full overflow-hidden rounded-full">
          <motion.div
            className={cn('h-full rounded-full', glassesOff ? 'bg-moon' : 'bg-corona')}
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4, ease: 'linear' }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="mt-2.5"
            role="status"
            aria-live={critical ? 'assertive' : 'polite'}
          >
            <h3 className="font-display text-xl leading-tight">{copy.title}</h3>
            <p className="text-foreground/85 mt-1 text-[0.95rem] leading-snug">{copy.body}</p>
          </motion.div>
        </AnimatePresence>

        {nextCopy && next && (
          <p className="text-muted-foreground mt-3 flex items-center gap-1.5 truncate text-xs">
            <ChevronRight size={13} className="shrink-0" aria-hidden />
            <span className="numeric shrink-0 font-semibold">{formatOffset(next.from)}</span>
            <span className="truncate">{nextCopy.title}</span>
          </p>
        )}

        {onOpenScript && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenScript}
            className="text-muted-foreground hover:text-foreground mt-2 h-7 w-full justify-center gap-1.5 text-xs"
          >
            <ListOrdered aria-hidden />
            {t.script.title}
          </Button>
        )}
      </div>
    </div>
  );
}
