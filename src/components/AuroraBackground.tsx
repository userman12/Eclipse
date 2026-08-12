/**
 * The layer the glass refracts.
 *
 * Liquid glass only reads as glass when there is something moving behind it,
 * so the whole app sits on a slow Atlantic dusk: three drifting light fields,
 * a warm glow low on the horizon, and a fine grain that keeps the large
 * gradients from banding on OLED screens.
 *
 * Pure CSS on purpose — it animates on the compositor and never touches the
 * main thread, which matters on a phone that is also running the countdown.
 */

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-atlantic" />

      {/* Deep water light, upper half */}
      <div
        className="absolute -top-[30vh] left-1/2 h-[85vh] w-[130vw] -translate-x-1/2 rounded-full opacity-70 blur-[90px]"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, #123a52 90%, transparent), transparent)',
          animation: 'blob-drift-a 34s ease-in-out infinite',
        }}
      />

      {/* Corona light, drifting west */}
      <div
        className="absolute top-[18vh] -right-[20vw] h-[55vh] w-[75vw] rounded-full opacity-30 blur-[100px]"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, #ffd66b 62%, transparent), transparent)',
          animation: 'blob-drift-b 46s ease-in-out infinite',
        }}
      />

      {/* Sunset over the Atlantic, low and warm */}
      <div
        className="absolute -bottom-[18vh] left-[-15vw] h-[60vh] w-[95vw] rounded-full opacity-40 blur-[110px]"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in oklab, #e8794c 55%, transparent), transparent)',
          animation: 'blob-drift-c 52s ease-in-out infinite',
        }}
      />

      {/* Horizon band: the sea line the whole app is about */}
      <div
        className="absolute inset-x-0 bottom-0 h-[38vh]"
        style={{
          background: 'linear-gradient(to top, #04121c 0%, rgba(4, 18, 28, 0.35) 55%, transparent 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}
