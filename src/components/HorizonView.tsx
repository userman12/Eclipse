'use client';

import { motion } from 'framer-motion';
import { TriangleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GlassCard from '@/components/GlassCard';
import type { City } from '@/data/cities';
import { impactParameter, moonTrackX } from '@/lib/eclipseGeometry';
import { fistsAboveHorizon } from '@/lib/sun';
import { fill } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';
import type { EclipseState } from '@/lib/time';

const W = 320;
const H = 190;
const HORIZON_Y = 142;
const TOP_ALT = 35; // degrees mapped to the top of the frame
const SUN_X = 208;
const SUN_R = 17;
const MOON_R = SUN_R * 1.04; // slightly larger than the Sun

const altToY = (alt: number) =>
  HORIZON_Y - (Math.max(0, Math.min(TOP_ALT, alt)) / TOP_ALT) * (HORIZON_Y - 26);

/** Sky palette per stage — the sky really does go dark during totality. */
const sky = {
  before: ['#1B4A66', '#2D6076'],
  'partial-rising': ['#153E58', '#2A5871'],
  totality: ['#04121C', '#0B2637'],
  'partial-falling': ['#123A52', '#24506A'],
  after: ['#0A2436', '#143B52'],
} as const;

export default function HorizonView({
  city,
  state,
  altitude,
  isLive,
}: {
  city: City;
  state: EclipseState;
  /** Sun altitude in degrees — live during the eclipse, at maximum otherwise. */
  altitude: number;
  isLive: boolean;
}) {
  const { t } = useCopy();
  const [skyTop, skyBottom] = sky[state.stage];

  const sunY = altToY(altitude);
  // Signed: the Moon enters on one side and leaves on the other.
  const moonOffsetX = moonTrackX(city, state.now) * SUN_R;
  const moonTrackY = impactParameter(city) * SUN_R;
  const isTotal = state.stage === 'totality';
  const belowHorizon = altitude < 0;

  return (
    <GlassCard aria-labelledby="horizon-title" live={isTotal}>
      <CardHeader>
        <p className="eyebrow">
          {t.horizon.title} · {isLive ? t.compass.live : t.compass.atMaximum}
        </p>
        <CardTitle id="horizon-title" className="font-display text-xl tracking-tight">
          {belowHorizon ? (
            t.horizon.belowHorizon
          ) : (
            <>
              <span className="numeric text-corona text-2xl">{altitude.toFixed(1)}°</span>{' '}
              <span className="text-muted-foreground text-base font-normal">
                {t.horizon.aboveHorizon}
              </span>
            </>
          )}
        </CardTitle>
        {!belowHorizon && (
          <CardAction>
            <Badge variant="outline" className="h-auto max-w-[9rem] py-1 text-right leading-snug whitespace-normal">
              {fill(t.horizon.fists, { n: fistsAboveHorizon(altitude).toFixed(1) })}
            </Badge>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="px-0">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-hidden="true">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={skyTop} style={{ transition: 'stop-color 2s linear' }} />
              <stop
                offset="100%"
                stopColor={skyBottom}
                style={{ transition: 'stop-color 2s linear' }}
              />
            </linearGradient>
            <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B2A3E" />
              <stop offset="100%" stopColor="#061622" />
            </linearGradient>
            <radialGradient id="halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD66B" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FFD66B" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="glint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8794C" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#E8794C" stopOpacity="0" />
            </linearGradient>
            <clipPath id="sky-clip">
              <rect x="0" y="0" width={W} height={HORIZON_Y} />
            </clipPath>
            <clipPath id="sea-clip">
              <rect x="0" y={HORIZON_Y} width={W} height={H - HORIZON_Y} />
            </clipPath>
          </defs>

          <rect x="0" y="0" width={W} height={HORIZON_Y} fill="url(#sky)" />

          <g clipPath="url(#sky-clip)">
            {[10, 20, 30].map((deg) => (
              <g key={deg}>
                <line
                  x1="0"
                  y1={altToY(deg)}
                  x2={W}
                  y2={altToY(deg)}
                  stroke="#DCE4E8"
                  strokeOpacity="0.1"
                  strokeDasharray="2 6"
                />
                <text x="6" y={altToY(deg) - 4} fontSize="9" fill="#9CB5C3" fillOpacity="0.75">
                  {deg}°
                </text>
              </g>
            ))}

            {/* Line of sight from the observer to the Sun: what must stay clear. */}
            <line
              x1="14"
              y1={HORIZON_Y}
              x2={SUN_X}
              y2={sunY}
              stroke="#FFD66B"
              strokeOpacity="0.25"
              strokeDasharray="3 5"
            />

            {!belowHorizon && (
              <g>
                <circle
                  cx={SUN_X}
                  cy={sunY}
                  r={isTotal ? SUN_R * 3.4 : SUN_R * 2.6}
                  fill="url(#halo)"
                  className="animate-sun-breathe"
                />
                {isTotal && (
                  <motion.circle
                    cx={SUN_X}
                    cy={sunY}
                    r={SUN_R * 1.5}
                    fill="none"
                    stroke="#DCE4E8"
                    strokeOpacity="0.45"
                    strokeWidth="6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ transformOrigin: `${SUN_X}px ${sunY}px` }}
                    transition={{ duration: 0.8 }}
                  />
                )}
                <motion.circle
                  cx={SUN_X}
                  animate={{ cy: sunY }}
                  transition={{ type: 'spring', stiffness: 40, damping: 22 }}
                  r={SUN_R}
                  fill="#FFD66B"
                />
                {/* The Moon, crossing the disk along its real track */}
                <motion.circle
                  animate={{ cx: SUN_X + moonOffsetX, cy: sunY + moonTrackY }}
                  transition={{ type: 'spring', stiffness: 40, damping: 22 }}
                  r={MOON_R}
                  fill={isTotal ? '#04121C' : skyTop}
                  style={{ transition: 'fill 1.5s linear' }}
                />
              </g>
            )}
          </g>

          <rect x="0" y={HORIZON_Y} width={W} height={H - HORIZON_Y} fill="url(#sea)" />
          <line
            x1="0"
            y1={HORIZON_Y}
            x2={W}
            y2={HORIZON_Y}
            stroke="#DCE4E8"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <g clipPath="url(#sea-clip)">
            {!belowHorizon && (
              <rect
                x={SUN_X - 14}
                y={HORIZON_Y}
                width="28"
                height={H - HORIZON_Y}
                fill="url(#glint)"
                opacity={isTotal ? 0.15 : 1}
                style={{ transition: 'opacity 2s linear' }}
              />
            )}
            {[0, 1, 2].map((row) => (
              <motion.g
                key={row}
                animate={{ x: [0, -80] }}
                transition={{ duration: 14 + row * 6, repeat: Infinity, ease: 'linear' }}
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <line
                    key={i}
                    x1={i * 80 - 40}
                    y1={HORIZON_Y + 9 + row * 12}
                    x2={i * 80 + 18}
                    y2={HORIZON_Y + 9 + row * 12}
                    stroke="#9CB5C3"
                    strokeOpacity={0.18 - row * 0.04}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ))}
              </motion.g>
            ))}
          </g>
        </svg>
      </CardContent>

      <CardContent className="space-y-2">
        <p className="text-muted-foreground flex gap-2 text-sm leading-snug">
          <TriangleAlert size={16} className="text-sunset mt-0.5 shrink-0" aria-hidden />
          {t.horizon.warning}
        </p>
        <p className="text-muted-foreground/70 text-xs">
          {fill(t.horizon.atMax, {
            alt: city.sunAtMax.altitude,
            az: city.sunAtMax.azimuth,
          })}
        </p>
      </CardContent>
    </GlassCard>
  );
}
