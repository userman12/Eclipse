'use client';

import { Check, ChevronDown, MapPin, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import type { City } from '@/data/cities';
import { useCity } from '@/lib/CityProvider';
import { cityLabel } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';
import { cn } from '@/lib/utils';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m${String(s).padStart(2, '0')}s` : `${s}s`;
}

function CityRow({ city, selected, onSelect }: { city: City; selected: boolean; onSelect: () => void }) {
  const { t } = useCopy();
  const label = cityLabel(t, city.id);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition',
        selected ? 'bg-corona/15 ring-corona/40 ring-1' : 'active:bg-moon/5',
      )}
      aria-pressed={selected}
    >
      <div className="min-w-0 flex-1">
        <p className="font-display text-base leading-tight">{label.name}</p>
        <p className="text-muted-foreground text-xs">{label.country}</p>
      </div>

      <Badge
        className={cn(
          'h-auto shrink-0 gap-1 py-1 text-[0.68rem] font-bold',
          city.type === 'total' ? 'bg-corona/20 text-corona' : 'bg-moon/12 text-moon',
        )}
      >
        {city.type === 'total' ? (
          <>
            <Sparkles size={11} aria-hidden />
            {formatDuration(city.totalityDurationSeconds ?? 0)}
          </>
        ) : (
          `${Math.round(city.magnitudeAtMax * 100)}%`
        )}
      </Badge>

      {selected && <Check size={16} className="text-corona shrink-0" strokeWidth={3} aria-hidden />}
    </button>
  );
}

export default function CitySelector() {
  const { t } = useCopy();
  const { city, cities, setCityId } = useCity();
  const label = cityLabel(t, city.id);

  const totalCities = cities.filter((c) => c.type === 'total');
  const partialCities = [...cities.filter((c) => c.type === 'partial')].sort(
    (a, b) => b.magnitudeAtMax - a.magnitudeAtMax,
  );

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {/* h-11 (44px): this is a primary navigation control, so it gets a
            real touch target, not just enough padding to look right. */}
        <button
          type="button"
          className="glass-inset flex h-11 items-center gap-1.5 rounded-full px-3.5 text-left"
        >
          <MapPin size={13} className="text-corona shrink-0" aria-hidden />
          <span className="max-w-[6rem] truncate text-sm font-semibold">{label.name}</span>
          <ChevronDown size={14} className="text-muted-foreground shrink-0" aria-hidden />
        </button>
      </DrawerTrigger>

      <DrawerContent className="glass-solid max-h-[85vh] rounded-t-3xl border-white/15">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-display text-xl">{t.cityPicker.title}</DrawerTitle>
          <DrawerDescription>{t.cityPicker.subtitle}</DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-4">
          <p className="eyebrow px-1 py-1.5">{t.cityPicker.totalGroup}</p>
          <div className="space-y-1">
            {totalCities.map((c) => (
              <DrawerClose key={c.id} asChild>
                <div>
                  <CityRow city={c} selected={c.id === city.id} onSelect={() => setCityId(c.id)} />
                </div>
              </DrawerClose>
            ))}
          </div>

          <p className="eyebrow px-1 py-1.5 pt-4">{t.cityPicker.partialGroup}</p>
          <div className="space-y-1">
            {partialCities.map((c) => (
              <DrawerClose key={c.id} asChild>
                <div>
                  <CityRow city={c} selected={c.id === city.id} onSelect={() => setCityId(c.id)} />
                </div>
              </DrawerClose>
            ))}
          </div>

          <p className="text-muted-foreground/70 mt-4 px-1 text-xs leading-snug">
            {t.cityPicker.scopeNote}
          </p>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
