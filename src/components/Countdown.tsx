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

function Unit({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('text-muted-foreground shrink-0 font-semibold tracking-[0.12em] uppercase', className)}>
      {children}
    </span>
  );
}

/**
 * How big the digits get depends on how many groups share the row, tuned so
 * each tier fills the space next to the EclipseDial on a 360–390px phone
 * without overflowing it — not just "safe", but sized to use the room that's
 * actually there. Each tier also carries its own gap: a fixed few pixels
 * between digit and unit reads as generous at a small size and as a
 * collision at a large one, so the gap scales with the tier too.
 */
type Tier = { digitClass: string; unitClass: string; gap: string };

const TIERS = {
  solo: { digitClass: 'text-countdown font-display', unitClass: 'text-xs sm:text-sm', gap: 'gap-2 sm:gap-3' },
  pair: { digitClass: 'text-countdown-pair font-display', unitClass: 'text-xs sm:text-sm', gap: 'gap-1.5 sm:gap-2' },
  triple: { digitClass: 'text-countdown-triple font-display', unitClass: 'text-[0.65rem]', gap: 'gap-1.5' },
  quad: { digitClass: 'text-countdown-quad font-display', unitClass: 'text-[0.55rem]', gap: 'gap-1' },
} as const satisfies Record<string, Tier>;

const GROUP_GAP: Record<'pair' | 'triple' | 'quad', string> = {
  pair: 'gap-x-4 gap-y-1',
  triple: 'gap-x-3 gap-y-1',
  quad: 'gap-x-2 gap-y-1',
};

function Group({ value, unit, tier }: { value: number; unit: string; tier: Tier }) {
  return (
    <span className={cn('flex items-end', tier.gap)}>
      <Rolling value={String(value).padStart(2, '0')} className={tier.digitClass} />
      <Unit className={tier.unitClass}>{unit}</Unit>
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

  const tierKey = groups.length >= 4 ? 'quad' : groups.length === 3 ? 'triple' : 'pair';
  const tier = TIERS[tierKey];

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
        className={cn('mt-1.5 flex flex-wrap items-end', GROUP_GAP[tierKey], toneClass[tone])}
      >
        {finalCountdown ? (
          <motion.span
            className={cn('flex items-end', TIERS.solo.gap)}
            animate={tone === 'critical' ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
            transition={{ duration: 1, repeat: tone === 'critical' ? Infinity : 0 }}
          >
            <Rolling value={String(totalSeconds)} className={TIERS.solo.digitClass} />
            <Unit className={TIERS.solo.unitClass}>{c.seconds}</Unit>
          </motion.span>
        ) : (
          groups.map((g, i) => <Group key={i} value={g.value} unit={g.unit} tier={tier} />)
        )}
      </motion.div>
    </div>
  );
}
