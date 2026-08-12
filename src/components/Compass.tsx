'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Compass as CompassIcon, MoveLeft, MoveRight, RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GlassCard from '@/components/GlassCard';
import { angleDelta, cardinal } from '@/lib/sun';
import { useCompassHeading } from '@/lib/useCompassHeading';
import { useCopy } from '@/lib/LanguageProvider';

const CX = 120;
const CY = 120;
const R_RING = 112;

const polar = (radius: number, deg: number) => ({
  x: CX + radius * Math.sin((deg * Math.PI) / 180),
  y: CY - radius * Math.cos((deg * Math.PI) / 180),
});

const arcPath = (radius: number, from: number, to: number) => {
  const a = polar(radius, from);
  const b = polar(radius, to);
  const large = (to - from + 360) % 360 > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${large} 1 ${b.x} ${b.y}`;
};

/** Keeps a rotation continuous so 359° → 1° turns 2°, not -358°. */
function useUnwrappedAngle(target: number) {
  const [value, setValue] = useState(target);
  const accumulated = useRef(target);

  useEffect(() => {
    const delta = ((target - accumulated.current + 540) % 360) - 180;
    accumulated.current += delta;
    setValue(accumulated.current);
  }, [target]);

  return value;
}

const CARDINALS = [
  { label: 'N', deg: 0 },
  { label: 'NE', deg: 45 },
  { label: 'E', deg: 90 },
  { label: 'SE', deg: 135 },
  { label: 'S', deg: 180 },
  { label: 'SO', deg: 225 },
  { label: 'O', deg: 270 },
  { label: 'NO', deg: 315 },
];

const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);

export default function Compass({
  azimuth,
  isLive,
}: {
  /** Where the Sun is (live) or will be (at maximum), in degrees from North. */
  azimuth: number;
  /** True when `azimuth` is the Sun's current position rather than the maximum. */
  isLive: boolean;
}) {
  const { t } = useCopy();
  const { heading, permission, request } = useCompassHeading();

  const hasHeading = heading !== null;
  const rotation = useUnwrappedAngle(hasHeading ? -heading : 0);
  const delta = hasHeading ? angleDelta(heading, azimuth) : 0;
  const aligned = hasHeading && Math.abs(delta) <= 6;

  const sun = polar(R_RING - 18, azimuth);
  const needle = polar(R_RING - 34, azimuth);

  return (
    <GlassCard live aria-labelledby="compass-title">
      <CardHeader>
        <p className="eyebrow">{t.compass.title}</p>
        <CardTitle id="compass-title" className="font-display text-xl tracking-tight">
          {t.compass.lookToward} {t.compass.west}
        </CardTitle>
        <CardAction className="text-right">
          <motion.p
            key={Math.round(azimuth)}
            initial={{ opacity: 0.4, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="numeric text-corona font-display text-3xl leading-none"
          >
            {Math.round(azimuth)}°
          </motion.p>
          <p className="text-muted-foreground mt-1 text-[0.65rem] tracking-widest uppercase">
            {t.compass.azimuth}
          </p>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="relative mx-auto w-full max-w-[22rem]">
          <svg
            viewBox="0 0 240 240"
            className="w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.55)]"
            role="img"
            aria-label={`${t.compass.lookToward} ${Math.round(azimuth)}°`}
          >
            <defs>
              {/* The dial itself is a piece of glass: bright at the top-left
                  edge, translucent in the body, dark at the bottom. */}
              <radialGradient id="dial-body" cx="38%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#DCE4E8" stopOpacity="0.16" />
                <stop offset="45%" stopColor="#123A52" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#04121C" stopOpacity="0.55" />
              </radialGradient>
              <linearGradient id="dial-rim" x1="0.15" y1="0" x2="0.85" y2="1">
                <stop offset="0%" stopColor="#DCE4E8" stopOpacity="0.75" />
                <stop offset="38%" stopColor="#DCE4E8" stopOpacity="0.08" />
                <stop offset="72%" stopColor="#DCE4E8" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#DCE4E8" stopOpacity="0.35" />
              </linearGradient>
              <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFD66B" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#FFD66B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFD66B" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="west-band" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFD66B" stopOpacity="0" />
                <stop offset="50%" stopColor="#FFD66B" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#FFD66B" stopOpacity="0" />
              </linearGradient>
            </defs>

            <circle cx={CX} cy={CY} r={R_RING + 8} fill="url(#dial-body)" />
            <circle
              cx={CX}
              cy={CY}
              r={R_RING + 7}
              fill="none"
              stroke="url(#dial-rim)"
              strokeWidth="1.5"
            />
            <circle cx={CX} cy={CY} r={R_RING - 30} fill="none" stroke="#DCE4E8" strokeOpacity="0.07" />

            {/* Everything inside this group is expressed in true azimuth. */}
            <motion.g
              animate={{ rotate: rotation }}
              transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.6 }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              {/* The 40° window that must stay free of buildings. */}
              <path
                d={arcPath(R_RING, azimuth - 20, azimuth + 20)}
                fill="none"
                stroke="url(#west-band)"
                strokeWidth="9"
                strokeLinecap="round"
              />

              {TICKS.map((deg) => {
                const isCardinal = deg % 45 === 0;
                const isMajor = deg % 15 === 0;
                const length = isCardinal ? 14 : isMajor ? 9 : 5;
                const outer = polar(R_RING - 6, deg);
                const inner = polar(R_RING - 6 - length, deg);
                return (
                  <line
                    key={deg}
                    x1={outer.x}
                    y1={outer.y}
                    x2={inner.x}
                    y2={inner.y}
                    stroke={isCardinal ? '#DCE4E8' : '#9CB5C3'}
                    strokeOpacity={isCardinal ? 0.85 : isMajor ? 0.5 : 0.28}
                    strokeWidth={isCardinal ? 2 : 1}
                    strokeLinecap="round"
                  />
                );
              })}

              {CARDINALS.map(({ label, deg }) => {
                const p = polar(R_RING - 32, deg);
                const isWest = label === 'O';
                const isNorth = label === 'N';
                return (
                  <text
                    key={label}
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={isWest || isNorth ? 17 : 12}
                    fontWeight={isWest || isNorth ? 700 : 500}
                    fill={isWest ? '#FFD66B' : isNorth ? '#DCE4E8' : '#9CB5C3'}
                    fillOpacity={isWest || isNorth ? 1 : 0.75}
                  >
                    {label}
                  </text>
                );
              })}

              <line
                x1={CX}
                y1={CY}
                x2={needle.x}
                y2={needle.y}
                stroke="#FFD66B"
                strokeWidth="3"
                strokeLinecap="round"
                strokeOpacity="0.9"
              />
              <circle
                cx={sun.x}
                cy={sun.y}
                r="26"
                fill="url(#sun-glow)"
                className="animate-sun-breathe"
              />
              <circle cx={sun.x} cy={sun.y} r="9" fill="#FFD66B" />
              <circle cx={sun.x} cy={sun.y} r="9" fill="none" stroke="#071B2B" strokeOpacity="0.35" />
            </motion.g>

            {/* Fixed device pointer: the direction the phone is facing. */}
            <AnimatePresence>
              {hasHeading && (
                <motion.g
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  <path d={`M ${CX} 6 l 7 13 h -14 z`} fill="#DCE4E8" fillOpacity="0.9" />
                  <line
                    x1={CX}
                    y1={22}
                    x2={CX}
                    y2={40}
                    stroke="#DCE4E8"
                    strokeOpacity="0.35"
                    strokeWidth="1.5"
                  />
                </motion.g>
              )}
            </AnimatePresence>

            <circle cx={CX} cy={CY} r="4" fill="#DCE4E8" fillOpacity="0.7" />
          </svg>

          {/* Alignment readout, centred and never rotating. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[24%] flex justify-center">
            <AnimatePresence mode="wait">
              {hasHeading && (
                <motion.div
                  key={aligned ? 'aligned' : delta > 0 ? 'right' : 'left'}
                  initial={{ opacity: 0, scale: 0.9, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  {aligned ? (
                    <Badge className="bg-corona text-atlantic h-8 gap-1.5 px-4 text-sm font-bold shadow-lg">
                      <Check strokeWidth={3} aria-hidden />
                      {t.compass.onTarget}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="glass-solid h-8 gap-1.5 px-4 text-sm font-semibold"
                    >
                      {delta > 0 ? <MoveRight aria-hidden /> : <MoveLeft aria-hidden />}
                      {delta > 0 ? t.compass.turnRight : t.compass.turnLeft}
                      <span className="numeric text-corona">{Math.abs(Math.round(delta))}°</span>
                    </Badge>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <CompassIcon size={15} aria-hidden />
            {isLive ? t.compass.live : t.compass.atMaximum}
            <span className="text-foreground">· {cardinal(azimuth)}</span>
          </p>

          {hasHeading ? (
            <p className="text-muted-foreground/80 text-xs">
              {t.compass.yourHeading}{' '}
              <span className="numeric text-foreground">{Math.round(heading)}°</span> ·{' '}
              {t.compass.magneticNote}
            </p>
          ) : permission === 'unsupported' ? (
            <p className="text-muted-foreground/80 text-xs">{t.compass.unavailable}</p>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={request}
                variant="secondary"
                size="lg"
                className="glass-inset h-12 w-full rounded-2xl text-sm font-semibold"
              >
                <RotateCw aria-hidden />
                {t.compass.enable}
              </Button>
              <p className="text-muted-foreground/80 text-xs">
                {permission === 'denied' ? t.compass.unavailable : t.compass.enableHint}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </GlassCard>
  );
}
