'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LANGS, type Lang } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';

export default function LanguageToggle() {
  const { lang, setLang, t } = useCopy();

  return (
    <ToggleGroup
      type="single"
      value={lang}
      onValueChange={(value) => value && setLang(value as Lang)}
      variant="outline"
      size="sm"
      aria-label={t.langLabel}
      className="glass rounded-full border-0 p-0.5"
    >
      {LANGS.map((code) => (
        <ToggleGroupItem
          key={code}
          value={code}
          aria-label={code}
          className="data-[state=on]:bg-moon data-[state=on]:text-atlantic rounded-full border-0 px-3 text-xs font-bold uppercase"
        >
          {code}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
