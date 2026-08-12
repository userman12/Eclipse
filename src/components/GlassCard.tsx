'use client';

import { motion, type Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/** Shared reveal: rises, sharpens, settles. Used by every section. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9 },
  },
};

export const staggerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

/**
 * A shadcn `Card` rendered as liquid glass.
 * `live` adds the slow specular sweep — keep it to the two or three surfaces
 * that are genuinely alive, otherwise the page starts to shimmer everywhere.
 */
export default function GlassCard({
  children,
  className,
  live = false,
  padded = true,
  ...props
}: Omit<React.ComponentProps<typeof motion.section>, 'children'> & {
  children?: React.ReactNode;
  live?: boolean;
  padded?: boolean;
}) {
  return (
    <motion.section variants={revealVariants} {...props}>
      <Card
        className={cn(
          'glass rounded-3xl border-0 ring-0',
          live && 'glass-live',
          padded ? 'gap-4 py-5' : 'gap-0 py-0',
          className,
        )}
      >
        {children}
      </Card>
    </motion.section>
  );
}
