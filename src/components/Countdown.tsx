'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { breakdown } from '@/lib/time';
import { useCopy } from '@/lib/LanguageProvider';
import { cn } from '@/lib/utils';

type Tone = 'calm' | 'active' | 'critical';

const toneClass: Record<Tone, string> = {
  calm: 'text-moon',
  active: 'text-corona',
  critical: 'text-sunset',
};

const digitSpring = { type: 'spring', stiffness: 320, damping: 30, mass: 0.7 } as const;

/** A single digit that rolls vertically when it changes. */
function Digit({ char }: { char: string }) {
  return (
    <span className="relative inline-block h-[1.05em] w-[0.62em] overflow-hidden align-baseline">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={char}
          initial={{ y: '95%', opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-95%', opacity: 0, filter: 'blur(4px)' }}
          transition={digitSpring}
          className="absolute inset-0 flex items-center justify-center"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Rolling({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn('numeric inline-flex', className)}>
      {value.split('').map((char, index) => (
        <Digit key={`${index}-${value.length}`} char={char} />
      ))}
    </span>
  );
}

function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
      {children}
    </span>
  );
}

function Group({
  value,
  unit,
  size,
}: {
  value: number;
  unit: string;
  size: 'lg' | 'md';
}) {
  return (
    <span className="flex items-baseline gap-1">
      <Rolling
        value={String(value).padStart(2, '0')}
        className={cn('font-display', size === 'lg' ? 'text-countdown' : 'text-5xl')}
      />
      <Unit>{unit}</Unit>
    </span>
  );
}

export default function Countdown({
  ms,
  tone = 'calm',
  label,
  targetTime,
}: {
  ms: number;
  tone?: Tone;
  label: string;
  targetTime?: string;
}) {
  const { t } = useCopy();
  const { days, hours, minutes, seconds, totalSeconds } = breakdown(ms);
  const c = t.countdown;

  // Under two minutes the seconds are the whole story: show them alone, huge.
  const finalCountdown = totalSeconds < 120;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">{label}</p>
        {targetTime && (
          <Badge variant="outline" className="numeric border-border/60 tracking-wide">
            {targetTime}
          </Badge>
        )}
      </div>

      <motion.div
        layout
        className={cn(
          'mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1',
          toneClass[tone],
        )}
      >
        {finalCountdown ? (
          <motion.span
            className="flex items-baseline gap-2"
            animate={tone === 'critical' ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
            transition={{ duration: 1, repeat: tone === 'critical' ? Infinity : 0 }}
          >
            <Rolling value={String(totalSeconds)} className="text-countdown font-display" />
            <Unit>{c.seconds}</Unit>
          </motion.span>
        ) : (
          <>
            {days > 0 && <Group value={days} unit={c.days} size="lg" />}
            {(days > 0 || hours > 0) && (
              <Group value={hours} unit={c.hours} size={days === 0 ? 'lg' : 'md'} />
            )}
            <Group value={minutes} unit={c.minutes} size={days === 0 && hours === 0 ? 'lg' : 'md'} />
            {days === 0 && <Group value={seconds} unit={c.seconds} size="md" />}
          </>
        )}
      </motion.div>
    </div>
  );
}
