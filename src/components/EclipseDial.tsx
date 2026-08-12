'use client';

import { motion } from 'framer-motion';
import { impactParameter, moonTrackX, obscuration } from '@/lib/eclipseGeometry';
import { useCopy } from '@/lib/LanguageProvider';
import type { EclipseState } from '@/lib/time';
import { cn } from '@/lib/utils';

const BOX = 96;
const C = BOX / 2;
/** Solar radius in px. The frame must hold the Moon at first contact too. */
const R_SUN = 21;
const R_MOON = R_SUN * 1.04;

/**
 * A small live picture of the eclipse, sitting next to the countdown.
 *
 * Every position comes from the clock through `eclipseGeometry`, so the Moon
 * really does enter on one side, cross, and leave on the other, with the four
 * contacts landing on their published seconds. The Sun is drawn through a
 * mask: the covered part becomes genuinely transparent, letting the glass
 * behind show through instead of being painted over with a fake background.
 */
export default function EclipseDial({ state }: { state: EclipseState }) {
  const { t } = useCopy();

  const x = moonTrackX(state.now);
  const covered = obscuration(state.now);
  const total = state.stage === 'totality';
  const idle = state.stage === 'before' || state.stage === 'after';

  const moonX = C + x * R_SUN;
  const moonY = C + impactParameter() * R_SUN;

  return (
    <div className="flex shrink-0 flex-col items-center gap-1" aria-hidden="false">
      <svg
        viewBox={`0 0 ${BOX} ${BOX}`}
        className="size-[76px]"
        role="img"
        aria-label={`${t.dial.covered}: ${Math.round(covered * 100)}%`}
      >
        <defs>
          {/* Whatever the Moon overlaps is punched out of the Sun. */}
          <mask id="dial-moon-mask">
            <rect x="0" y="0" width={BOX} height={BOX} fill="white" />
            <circle cx={moonX} cy={moonY} r={R_MOON} fill="black" />
          </mask>
          <radialGradient id="dial-glow" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#FFD66B" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFD66B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dial-corona" cx="50%" cy="50%" r="50%">
            <stop offset="45%" stopColor="#DCE4E8" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#DCE4E8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#DCE4E8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow fades as the Sun is eaten: the sky really does dim. */}
        <circle
          cx={C}
          cy={C}
          r={R_SUN * 2}
          fill="url(#dial-glow)"
          opacity={total ? 0 : 1 - covered * 0.85}
          style={{ transition: 'opacity 1.5s linear' }}
        />

        {/* Corona, only while the disk is fully covered */}
        {total && (
          <motion.circle
            cx={C}
            cy={C}
            r={R_SUN * 1.95}
            fill="url(#dial-corona)"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            style={{ transformOrigin: `${C}px ${C}px` }}
            className="animate-sun-breathe"
          />
        )}

        {/* Faint ring marking where the full Sun would be */}
        <circle
          cx={C}
          cy={C}
          r={R_SUN}
          fill="none"
          stroke="#DCE4E8"
          strokeOpacity={total ? 0.35 : 0.12}
          strokeWidth="1"
          strokeDasharray={total ? undefined : '2 4'}
        />

        {/* The Sun, minus the Moon */}
        <circle cx={C} cy={C} r={R_SUN} fill="#FFD66B" mask="url(#dial-moon-mask)" />

        {/* The Moon's own edge, so it is legible before it touches the Sun */}
        <circle
          cx={moonX}
          cy={moonY}
          r={R_MOON}
          fill="none"
          stroke="#9CB5C3"
          strokeOpacity={idle ? 0.22 : 0.38}
          strokeWidth="1"
        />
      </svg>

      <p
        className={cn(
          'numeric text-xs leading-none font-bold tabular-nums',
          total ? 'text-moon' : covered > 0 ? 'text-corona' : 'text-muted-foreground',
        )}
      >
        {Math.round(covered * 100)}%
      </p>
      <p className="text-muted-foreground text-[0.55rem] leading-none tracking-wide uppercase">
        {t.dial.covered}
      </p>
    </div>
  );
}
