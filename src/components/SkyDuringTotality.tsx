'use client';

import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GlassCard from '@/components/GlassCard';
import type { City } from '@/data/cities';
import { fill } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';
import { getSunPosition } from '@/lib/sun';
import { getSkyObjects, type SkyObject } from '@/lib/skyObjects';
import { formatEventClock, getPhaseTimestamp } from '@/lib/time';
import { cn } from '@/lib/utils';

/* The map frames the western sky: wide enough to hold Venus on one side and
   Mercury on the other, low enough that the horizon line stays meaningful. */
const AZ_MIN = 225;
const AZ_MAX = 300;
const ALT_MAX = 35;

const W = 340;
const H = 205;
const HORIZON_Y = 176;
const TOP_Y = 22;

const px = (azimuth: number) => ((azimuth - AZ_MIN) / (AZ_MAX - AZ_MIN)) * W;
const py = (altitude: number) => HORIZON_Y - (altitude / ALT_MAX) * (HORIZON_Y - TOP_Y);

const inFrame = (o: SkyObject) =>
  o.azimuth >= AZ_MIN && o.azimuth <= AZ_MAX && o.altitude <= ALT_MAX;

/** Brighter objects are drawn larger — the way they actually look. */
const radiusFor = (magnitude: number) =>
  Math.min(6.2, Math.max(2.1, 2.2 + (1.5 - magnitude) * 0.9));

const AZ_MARKS = [
  { az: 225, label: 'SO' },
  { az: 247.5, label: 'OSO' },
  { az: 270, label: 'O' },
  { az: 292.5, label: 'ONO' },
];

function ObjectRow({ object }: { object: SkyObject }) {
  const { t } = useCopy();
  const copy = (t.sky.objects as Record<string, { name: string; note: string }>)[object.id];

  return (
    <li className="glass-inset rounded-2xl p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="font-display text-base leading-tight">{copy.name}</h4>
        {object.onlyDuringTotality && (
          <Badge className="bg-corona/20 text-corona h-auto shrink-0 gap-1 py-0.5 text-[0.6rem] font-bold tracking-wide uppercase">
            <Sparkles aria-hidden />
            {t.sky.onlyNow}
          </Badge>
        )}
      </div>

      <p className="text-muted-foreground numeric mt-1 text-xs">
        {t.sky.magnitude} {object.magnitude.toFixed(1)}
        <span className="mx-1.5 opacity-40">·</span>
        {t.sky.altitudeShort} {object.altitude.toFixed(0)}°
        <span className="mx-1.5 opacity-40">·</span>
        {object.separationFromSun.toFixed(0)}° {t.sky.fromSun}
      </p>

      <p className="text-foreground/80 mt-1.5 text-sm leading-snug">{copy.note}</p>
    </li>
  );
}

/**
 * Only meaningful for total-eclipse cities: partial eclipses never darken
 * the sky enough for planets or stars to appear. Callers must check
 * `city.type === 'total'` before rendering this.
 */
export default function SkyDuringTotality({ city }: { city: City }) {
  const { t } = useCopy();

  const maximum = getPhaseTimestamp(city, 'maximum');
  const { lat, lng } = city.coordinates;
  // With the Sun this low, an object just a few degrees away can be below
  // the horizon even while the Sun is briefly still up — Mercury in
  // particular sets close to the Sun from some of these cities. Anything
  // with altitude ≤ 0 is not actually visible, whatever its magnitude.
  const sky = getSkyObjects(maximum, lat, lng).filter((o) => o.altitude > 0);
  const sun = getSunPosition(maximum, lat, lng);

  const mapped = sky.filter(inFrame);
  const planets = sky.filter((o) => o.kind === 'planet');
  const elsewhere = sky.filter((o) => o.kind === 'star' && !inFrame(o));

  const sunX = px(sun.azimuth);
  const sunY = py(sun.altitude);

  return (
    <GlassCard live aria-labelledby="sky-title">
      <CardHeader>
        <p className="eyebrow">{t.sky.mapTitle}</p>
        <CardTitle id="sky-title" className="font-display text-xl tracking-tight">
          {t.sky.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-snug">
          {fill(t.sky.subtitle, { time: formatEventClock(maximum, city.timezone) })}
        </p>

        <div className="-mx-2">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={t.sky.mapHint}
          >
            <defs>
              <linearGradient id="totality-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#04121C" />
                <stop offset="70%" stopColor="#0B2637" />
                <stop offset="100%" stopColor="#1E4257" />
              </linearGradient>
              <radialGradient id="corona-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#DCE4E8" stopOpacity="0.55" />
                <stop offset="45%" stopColor="#DCE4E8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#DCE4E8" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="totality-sea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#08202F" />
                <stop offset="100%" stopColor="#040F18" />
              </linearGradient>
            </defs>

            <rect x="0" y="0" width={W} height={HORIZON_Y} fill="url(#totality-sky)" />

            {/* Altitude grid */}
            {[10, 20, 30].map((deg) => (
              <g key={deg}>
                <line
                  x1="0"
                  y1={py(deg)}
                  x2={W}
                  y2={py(deg)}
                  stroke="#DCE4E8"
                  strokeOpacity="0.08"
                  strokeDasharray="2 7"
                />
                <text x="4" y={py(deg) - 3} fontSize="8" fill="#9CB5C3" fillOpacity="0.6">
                  {deg}°
                </text>
              </g>
            ))}

            {/* The eclipsed Sun: black disk inside a corona */}
            <circle cx={sunX} cy={sunY} r="30" fill="url(#corona-halo)" className="animate-sun-breathe" />
            <circle cx={sunX} cy={sunY} r="11" fill="none" stroke="#DCE4E8" strokeOpacity="0.5" strokeWidth="3.5" />
            <circle cx={sunX} cy={sunY} r="9" fill="#04121C" />
            <text
              x={sunX}
              y={sunY + 26}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="#DCE4E8"
              fillOpacity="0.85"
            >
              {t.sky.eclipsedSun}
            </text>

            {/* Planets and stars inside the frame */}
            {mapped.map((object, index) => {
              const x = px(object.azimuth);
              const y = py(object.altitude);
              const r = radiusFor(object.magnitude);
              const copy = (t.sky.objects as Record<string, { name: string }>)[object.id];
              // Keep labels away from the right edge of the frame.
              const flip = x > W - 60;

              return (
                <motion.g
                  key={object.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + index * 0.12, duration: 0.6 }}
                >
                  <circle cx={x} cy={y} r={r * 2.6} fill="#FFD66B" fillOpacity="0.12" />
                  <circle cx={x} cy={y} r={r} fill={object.kind === 'planet' ? '#FFD66B' : '#DCE4E8'} />
                  <text
                    x={flip ? x - r - 5 : x + r + 5}
                    y={y + 3}
                    textAnchor={flip ? 'end' : 'start'}
                    fontSize="9.5"
                    fontWeight="600"
                    fill={object.kind === 'planet' ? '#FFD66B' : '#DCE4E8'}
                  >
                    {copy.name}
                  </text>
                </motion.g>
              );
            })}

            {/* Sea and horizon */}
            <rect x="0" y={HORIZON_Y} width={W} height={H - HORIZON_Y} fill="url(#totality-sea)" />
            <line x1="0" y1={HORIZON_Y} x2={W} y2={HORIZON_Y} stroke="#DCE4E8" strokeOpacity="0.3" />

            {AZ_MARKS.map(({ az, label }) => (
              <g key={label}>
                <line
                  x1={px(az)}
                  y1={HORIZON_Y}
                  x2={px(az)}
                  y2={HORIZON_Y + 5}
                  stroke="#9CB5C3"
                  strokeOpacity="0.5"
                />
                <text
                  x={px(az)}
                  y={H - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={label === 'O' ? '#FFD66B' : '#9CB5C3'}
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
          <p className="text-muted-foreground/70 px-2 text-xs">{t.sky.mapHint}</p>
        </div>

        <Separator />

        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <Sparkles size={12} aria-hidden />
            {t.sky.planets}
          </p>
          <ul className="mt-2 space-y-2">
            {planets.map((object) => (
              <ObjectRow key={object.id} object={object} />
            ))}
          </ul>
          <p className="text-muted-foreground/70 mt-2 text-xs leading-snug">
            {t.sky.onlyNowExplain}
          </p>
        </div>

        <div>
          <p className="eyebrow flex items-center gap-1.5">
            <Star size={12} aria-hidden />
            {t.sky.behindYou}
          </p>
          <p className="text-muted-foreground mt-1.5 text-xs leading-snug">
            {t.sky.behindYouHint}
          </p>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {elsewhere.map((object) => {
              const copy = (t.sky.objects as Record<string, { name: string }>)[object.id];
              return (
                <li
                  key={object.id}
                  className={cn(
                    'glass-inset flex items-baseline justify-between gap-2 rounded-xl px-3 py-2',
                  )}
                >
                  <span className="text-sm font-medium">{copy.name}</span>
                  <span className="numeric text-muted-foreground text-xs">
                    {object.magnitude.toFixed(1)} · {object.altitude.toFixed(0)}°
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </GlassCard>
  );
}
