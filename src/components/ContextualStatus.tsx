'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Glasses, Sparkles, Telescope } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

/**
 * The one sentence that says what is happening and what to do about it,
 * driven purely by the current time in Europe/Madrid.
 */
export default function ContextualStatus({ state }: { state: EclipseState }) {
  const { t } = useCopy();
  const { Icon, tint, wash } = stageStyle[state.stage];
  const urgent = state.stage === 'totality' || state.isJustAfterTotality;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={state.stage}
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
            {t.status[state.stage]}
          </AlertDescription>
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
}
