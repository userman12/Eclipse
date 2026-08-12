/**
 * Derives the `calc(A*cqw - Bpx)` font-size formulas used by
 * --text-countdown-pair/-triple/-quad in src/app/globals.css, and verifies
 * they fill (not overflow, not leave a dead gap in) the countdown's own
 * container at any width.
 *
 * Why this exists: the countdown shares its row with the live EclipseDial,
 * so its available width is never the full viewport — sizing digits with
 * plain `vw` either overflowed on some phones or left a visibly empty gap
 * on others (see the CSS comment for the incident). The fix is a
 * `@container` on the countdown's wrapper (EclipseHero.tsx) plus font sizes
 * expressed in `cqw` (percent of that container, not the viewport) — this
 * script solves the exact linear formula so digits + gaps + unit labels add
 * up to (container width − a small safety margin) no matter how wide the
 * container turns out to be, instead of a value hand-tuned against one
 * test device and hoped to generalise.
 *
 * Re-run (`node scripts/verify-countdown-fit.mjs`) and copy the printed
 * formulas into globals.css whenever Countdown.tsx changes: the digit box
 * ratio (0.68em), a tier's gap, or a unit label's font size/tracking.
 */

const DIGIT_EM = 0.68; // width of one rolling digit box, from Countdown.tsx
const CHAR_ADVANCE = 0.62; // rough average glyph advance width, in em

function unitWidth(chars, fontPx, trackingEm) {
  return chars * fontPx * (CHAR_ADVANCE + trackingEm);
}

/**
 * @param groups   digit-count per group (always 2, but kept explicit)... in
 *                 practice all groups are 2-digit (padStart), so pass the
 *                 unit's character count per group instead.
 */
function solveTier({ unitChars, unitFontPx, trackingEm, gapPx, interPx, marginPx }) {
  const n = unitChars.length;
  const a = n * 2 * DIGIT_EM; // coefficient of font-size F
  const unitSum = unitChars.reduce((s, chars) => s + unitWidth(chars, unitFontPx, trackingEm), 0);
  const b = n * gapPx + unitSum + (n - 1) * interPx; // constant term
  // a*F + b = 100cqw - marginPx  =>  F = (100/a)cqw - (marginPx+b)/a
  const coeffCqw = 100 / a;
  const constPx = (marginPx + b) / a;
  return { a, b, coeffCqw, constPx };
}

function totalWidthAt(tier, unitChars, unitFontPx, trackingEm, gapPx, interPx, avail) {
  const F = (tier.coeffCqw / 100) * avail - tier.constPx;
  const n = unitChars.length;
  const unitSum = unitChars.reduce((s, chars) => s + unitWidth(chars, unitFontPx, trackingEm), 0);
  const total = n * 2 * DIGIT_EM * F + n * gapPx + unitSum + (n - 1) * interPx;
  return { F, total };
}

// Unit labels are identical across it/es/en: days 1 char, hours 1 char,
// minutes 3 chars ("min"), seconds 1 char — see src/lib/i18n.ts `countdown`.
const TIERS = {
  pair: { unitChars: [3, 1], unitFontPx: 12, trackingEm: 0.12, gapPx: 6, interPx: 16, marginPx: 14 },
  triple: { unitChars: [1, 3, 1], unitFontPx: 10.4, trackingEm: 0.12, gapPx: 6, interPx: 12, marginPx: 14 },
  quad: { unitChars: [1, 1, 3, 1], unitFontPx: 8.8, trackingEm: 0.12, gapPx: 4, interPx: 8, marginPx: 14 },
};

console.log('Formulas (copy into --text-countdown-* in src/app/globals.css):\n');
for (const [name, cfg] of Object.entries(TIERS)) {
  const t = solveTier(cfg);
  console.log(`  ${name}: calc(${t.coeffCqw.toFixed(2)}cqw - ${t.constPx.toFixed(1)}px)`);
}

console.log('\nVerification — total width vs container width, at realistic phone sizes:');
console.log('(avail = container width AFTER EclipseDial + card/page padding are subtracted)\n');

// avail(viewport) = viewport - 24 (page px-3) - 32 (card padding) - 76 (dial) - 12 (dial gap)
const OVERHEAD = 24 + 32 + 76 + 12;
const VIEWPORTS = [320, 360, 375, 390, 414, 430];

for (const vp of VIEWPORTS) {
  const avail = vp - OVERHEAD;
  const results = Object.entries(TIERS).map(([name, cfg]) => {
    const t = solveTier(cfg);
    const { total } = totalWidthAt(t, cfg.unitChars, cfg.unitFontPx, cfg.trackingEm, cfg.gapPx, cfg.interPx, avail);
    const slack = avail - total;
    const ok = slack >= 0;
    return `${name}: slack=${slack.toFixed(1)}px ${ok ? 'OK' : 'OVERFLOW'}`;
  });
  console.log(`viewport=${vp}px  avail=${avail}px   ${results.join('   ')}`);
}
