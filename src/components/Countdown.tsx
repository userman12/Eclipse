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
    <span className="relative inline-block h-[1.15em] w-[0.68em] overflow-hidden align-bottom">
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

function Unit({ children, size }: { children: React.ReactNode; size: 'lg' | 'sm' }) {
  return (
    <span
      className={cn(
        'text-muted-foreground shrink-0 font-semibold tracking-[0.12em] uppercase',
        size === 'lg' ? 'text-xs sm:text-sm' : 'text-[0.6rem] sm:text-[0.65rem]',
      )}
    >
      {children}
    </span>
  );
}

/**
 * A digit block, plus a unit label with a gap sized relative to the digits
 * (not a fixed pixel value) — at large sizes a fixed 4px gap reads as no gap
 * at all, and the unit visually collides with the digit's edge.
 */
function Group({
  value,
  unit,
  digitClass,
  size,
}: {
  value: number;
  unit: string;
  digitClass: string;
  size: 'lg' | 'sm';
}) {
  return (
    <span className={cn('flex items-end', size === 'lg' ? 'gap-1.5 sm:gap-2' : 'gap-1')}>
      <Rolling value={String(value).padStart(2, '0')} className={cn('font-display', digitClass)} />
      <Unit size={size}>{unit}</Unit>
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

  const showDays = days > 0;
  const showHours = days > 0 || hours > 0;
  const showSeconds = days === 0;

  const groups = finalCountdown
    ? []
    : [
        ...(showDays ? [{ value: days, unit: c.days }] : []),
        ...(showHours ? [{ value: hours, unit: c.hours }] : []),
        { value: minutes, unit: c.minutes },
        ...(showSeconds ? [{ value: seconds, unit: c.seconds }] : []),
      ];

  // Two groups (the common case, minutes+seconds) get the larger
  // text-countdown-pair digits. Three or four groups (hours or days still
  // showing) share a smaller, fixed, viewport-independent size instead of
  // mixing one huge group with smaller ones — that mismatch is what caused
  // digits to overflow their row and collide with their unit label on
  // narrow phones.
  const compact = groups.length > 2;
  const digitClass = compact ? 'text-2xl sm:text-3xl' : 'text-countdown-pair';
  const groupGap = compact ? 'gap-x-3 gap-y-1' : 'gap-x-4 gap-y-1';

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
        className={cn('mt-1.5 flex flex-wrap items-end', groupGap, toneClass[tone])}
      >
        {finalCountdown ? (
          <motion.span
            className="flex items-end gap-2 sm:gap-3"
            animate={tone === 'critical' ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
            transition={{ duration: 1, repeat: tone === 'critical' ? Infinity : 0 }}
          >
            <Rolling value={String(totalSeconds)} className="text-countdown font-display" />
            <Unit size="lg">{c.seconds}</Unit>
          </motion.span>
        ) : (
          groups.map((g, i) => (
            <Group
              key={i}
              value={g.value}
              unit={g.unit}
              digitClass={digitClass}
              size={compact ? 'sm' : 'lg'}
            />
          ))
        )}
      </motion.div>
    </div>
  );
}
