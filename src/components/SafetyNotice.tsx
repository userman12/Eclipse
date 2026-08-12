'use client';

import { motion } from 'framer-motion';
import { ChevronUp, Glasses, ShieldAlert, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import GlassCard from '@/components/GlassCard';
import { fill } from '@/lib/i18n';
import { useCopy } from '@/lib/LanguageProvider';
import type { EclipseState } from '@/lib/time';
import { cn } from '@/lib/utils';

type Banner = {
  Icon: typeof Glasses;
  text: string;
  className: string;
  pulse: boolean;
};

/** Colour and wording of the persistent bar, derived from the current stage. */
function bannerFor(state: EclipseState, t: ReturnType<typeof useCopy>['t']): Banner {
  if (state.stage === 'totality') {
    return {
      Icon: Sparkles,
      text: fill(t.safety.bannerOff, { n: state.totalitySecondsLeft }),
      className: 'bg-moon text-atlantic',
      pulse: true,
    };
  }
  if (state.isJustAfterTotality) {
    return {
      Icon: ShieldAlert,
      text: t.safety.bannerBackOn,
      className: 'bg-sunset text-atlantic',
      pulse: true,
    };
  }
  if (state.safety === 'glasses-required') {
    return {
      Icon: Glasses,
      text: t.safety.bannerRequired,
      className: 'bg-corona text-atlantic',
      pulse: false,
    };
  }
  return { Icon: ShieldAlert, text: t.safety.bannerNone, className: 'glass-solid', pulse: false };
}

function Rules() {
  const { t } = useCopy();
  return (
    <ul className="space-y-3">
      {t.safety.rules.map((rule, index) => (
        <motion.li
          key={rule}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.06 * index, type: 'spring', stiffness: 200, damping: 22 }}
          className="text-foreground/90 flex gap-3 text-[0.95rem] leading-snug"
        >
          <Badge
            variant="outline"
            className="border-sunset/40 text-sunset numeric mt-0.5 size-5 shrink-0 rounded-full p-0 text-[0.65rem] font-bold"
          >
            {index + 1}
          </Badge>
          {rule}
        </motion.li>
      ))}
    </ul>
  );
}

/**
 * `card` — the full rules, always present in the page flow.
 * `bar`  — a fixed pill at the bottom of the viewport that states, at every
 *          moment, whether the glasses go on or can come off. Tapping it opens
 *          a drawer with the complete rules.
 */
export default function SafetyNotice({
  state,
  variant = 'card',
}: {
  state: EclipseState;
  variant?: 'card' | 'bar';
}) {
  const { t } = useCopy();

  if (variant === 'card') {
    return (
      <GlassCard
        aria-labelledby="safety-title"
        className="from-sunset/12 bg-gradient-to-br to-transparent"
      >
        <CardHeader>
          <CardTitle
            id="safety-title"
            className="font-display flex items-center gap-2 text-xl tracking-tight"
          >
            <ShieldAlert size={20} className="text-sunset" aria-hidden />
            {t.safety.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Rules />
        </CardContent>
      </GlassCard>
    );
  }

  const banner = bannerFor(state, t);
  const { Icon } = banner;

  return (
    <Drawer>
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 px-3">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 180, damping: 22 }}
        >
          <DrawerTrigger asChild>
            <Button
              size="lg"
              className={cn(
                'h-14 w-full justify-start gap-3 rounded-3xl px-4 text-left shadow-[0_20px_40px_-20px_rgba(0,0,0,0.9)]',
                banner.className,
              )}
            >
              <motion.span
                animate={banner.pulse ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                transition={{ duration: 1.2, repeat: banner.pulse ? Infinity : 0 }}
                className="flex shrink-0 items-center"
              >
                <Icon className="size-6!" strokeWidth={2.2} aria-hidden />
              </motion.span>
              <span className="min-w-0 flex-1 text-[0.95rem] font-bold whitespace-normal">
                {banner.text}
              </span>
              <ChevronUp className="shrink-0 opacity-70" aria-hidden />
            </Button>
          </DrawerTrigger>
        </motion.div>
      </div>

      <DrawerContent className="glass-solid rounded-t-3xl border-white/15">
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-display flex items-center gap-2 text-xl">
            <ShieldAlert size={20} className="text-sunset" aria-hidden />
            {t.safety.title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">{t.safety.rules[0]}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4">
          <Rules />
        </div>

        <div className="pb-safe px-4 pt-5">
          <Alert className="glass-inset rounded-2xl border-0 ring-0">
            <Icon className="text-corona" aria-hidden />
            <AlertTitle className="text-corona font-bold">{banner.text}</AlertTitle>
            <AlertDescription>{t.stage[state.stage]}</AlertDescription>
          </Alert>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
