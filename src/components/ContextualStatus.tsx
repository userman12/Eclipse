'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Glasses, Sparkles, Telescope } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { City } from '@/data/cities';
import { useCopy } from '@/lib/LanguageProvider';
import type { EclipseState } from '@/lib/time';
import { cn } from '@/lib/utils';

const stageStyle = {
  before: { Icon: Telescope, tint: 'text-mist', wash: 'from-mist/12' },
  'partial-rising': { Icon: Glasses, tint: 'text-corona', wash: 'from-corona/20' },
  totality: { Icon: Sparkles, tint: 'text-moon', wash: 'from-moon/25' },
  'partial-falling': { Icon: EyeOff, tint: 'text-sunset', wash: 'from-sunset/25' },
  after: { Icon: Eye, tint: 'text-mist', wash: 'from-mist/12' },
} as const;

/** For a partial-only city, "put them back on" (EyeOff/urgent) is the wrong
 *  register — nothing was just removed, the eclipse is simply waning. */
const partialFallingOnly = { Icon: Glasses, tint: 'text-corona', wash: 'from-corona/20' } as const;

/**
 * The one sentence that says what is happening and what to do about it,
 * driven purely by the current time in the selected city's own timezone.
 *
 * `city.type` changes which copy key is used for the 'partial-falling'
 * stage: a total-eclipse city just had its glasses off and needs the urgent
 * "put them back on" message, while a partial-only city never took them off
 * in the first place — reusing that message there would be false and
 * confusing, not just imprecise.
 */
export default function ContextualStatus({ city, state }: { city: City; state: EclipseState }) {
  const { t } = useCopy();
  const partialOnly = city.type === 'partial';
  const usePartialFallingCopy = partialOnly && state.stage === 'partial-falling';

  const { Icon, tint, wash } = usePartialFallingCopy ? partialFallingOnly : stageStyle[state.stage];
  const urgent = state.stage === 'totality' || state.isJustAfterTotality;

  const message = usePartialFallingCopy ? t.status.partialFallingOnly : t.status[state.stage];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${state.stage}-${usePartialFallingCopy}`}
        initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
        transition={{ type: 'spring', stiffness: 140, damping: 20 }}
      >
        <Alert
          className={cn(
            'glass items-start gap-x-3.5 gap-y-1 rounded-3xl border-0 bg-gradient-to-br to-transparent p-4 ring-0',
            wash,
            "*:[svg:not([class*='size-'])]:size-6",
          )}
          role="status"
          aria-live={urgent ? 'assertive' : 'polite'}
        >
          <Icon
            strokeWidth={1.75}
            aria-hidden
            className={cn(tint, urgent && 'animate-pulse')}
          />
          <AlertTitle className={cn('eyebrow', tint)}>{t.stage[state.stage]}</AlertTitle>
          <AlertDescription className="text-foreground text-[1.05rem] leading-snug font-medium">
            {message}
          </AlertDescription>

          {partialOnly && (state.stage === 'partial-rising' || state.stage === 'partial-falling') && (
            <p className="text-muted-foreground col-start-2 mt-1 text-xs leading-snug">
              {t.status.neverTotalReminder}
            </p>
          )}
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
