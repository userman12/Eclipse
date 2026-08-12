'use client';

import {
  Compass,
  Eye,
  EyeOff,
  Footprints,
  Sun,
  Thermometer,
  Waves,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GlassCard from '@/components/GlassCard';
import { phenomena, type Difficulty, type LookDirection } from '@/data/eventData';
import { useCopy } from '@/lib/LanguageProvider';
import { cn } from '@/lib/utils';

const directionIcon: Record<LookDirection, typeof Sun> = {
  sun: Sun,
  horizon: Waves,
  ground: Footprints,
  around: Compass,
  self: Thermometer,
};

const difficultyStyle: Record<Difficulty, string> = {
  easy: 'bg-corona/18 text-corona',
  medium: 'bg-moon/12 text-moon',
  hard: 'bg-sunset/18 text-sunset',
};

/** Reference glossary: what each phenomenon is, so it can be recognised. */
export default function PhenomenaGuide() {
  const { t } = useCopy();
  const items = t.phenomena.items as Record<string, { title: string; body: string }>;

  return (
    <GlassCard aria-labelledby="phenomena-title">
      <CardHeader>
        <p className="eyebrow">{t.phenomena.title}</p>
        <CardTitle id="phenomena-title" className="font-display text-xl tracking-tight">
          {t.phenomena.subtitle}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {phenomena.map((item) => {
            const Icon = directionIcon[item.direction];
            const copy = items[item.id];

            return (
              <li key={item.id} className="glass-inset rounded-2xl p-3.5">
                <div className="flex items-start gap-2.5">
                  <Icon size={17} className="text-corona mt-0.5 shrink-0" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base leading-tight">{copy.title}</h3>
                    <p className="text-foreground/80 mt-1 text-sm leading-snug">{copy.body}</p>
                  </div>
                </div>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <Badge
                    className={cn(
                      'h-auto py-0.5 text-[0.6rem] font-bold tracking-wide uppercase',
                      difficultyStyle[item.difficulty],
                    )}
                  >
                    {t.phenomena.difficulty[item.difficulty]}
                  </Badge>
                  <Badge variant="outline" className="h-auto py-0.5 text-[0.6rem]">
                    {t.phenomena.direction[item.direction]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      'h-auto gap-1 py-0.5 text-[0.6rem]',
                      item.nakedEye ? 'border-moon/40 text-moon' : 'border-corona/40 text-corona',
                    )}
                  >
                    {item.nakedEye ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
                    {item.nakedEye ? t.phenomena.nakedEye : t.phenomena.withGlasses}
                  </Badge>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </GlassCard>
  );
}
