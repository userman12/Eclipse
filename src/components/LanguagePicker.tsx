'use client';

import { Check, ChevronDown, Globe } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { LANGS, LANG_NATIVE_NAME, type Lang } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';
import { cn } from '@/lib/utils';

/**
 * Replaces the old inline IT/ES/EN toggle, which — three tap targets wide,
 * always fully expanded — was one of the things competing for room in the
 * header on a narrow phone. This collapses to a single chip showing the
 * current language, opening the same kind of drawer as the city picker.
 */
export default function LanguagePicker() {
  const { lang, setLang, t } = useCopy();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="glass-inset flex items-center gap-1.5 rounded-full px-3 py-1.5 text-left"
          aria-label={t.langLabel}
        >
          <Globe size={13} className="text-corona shrink-0" aria-hidden />
          <span className="text-sm font-semibold uppercase">{lang}</span>
          <ChevronDown size={14} className="text-muted-foreground shrink-0" aria-hidden />
        </button>
      </DrawerTrigger>

      <DrawerContent className="glass-solid rounded-t-3xl border-white/15">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-display text-xl">{t.langLabel}</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-1 px-4 pb-4">
          {LANGS.map((code) => {
            const selected = code === lang;
            return (
              <DrawerClose key={code} asChild>
                <button
                  type="button"
                  onClick={() => setLang(code as Lang)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition',
                    selected ? 'bg-corona/15 ring-corona/40 ring-1' : 'active:bg-moon/5',
                  )}
                  aria-pressed={selected}
                >
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase',
                      selected ? 'bg-corona text-atlantic' : 'bg-moon/10 text-moon',
                    )}
                    aria-hidden
                  >
                    {code}
                  </span>
                  <span className="font-display flex-1 text-base leading-tight">
                    {LANG_NATIVE_NAME[code]}
                  </span>
                  {selected && (
                    <Check size={16} className="text-corona shrink-0" strokeWidth={3} aria-hidden />
                  )}
                </button>
              </DrawerClose>
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
