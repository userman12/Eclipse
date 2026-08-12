# Coruña Eclipse Navigator

A mobile-first web app / PWA for the **12 August 2026 solar eclipse**, with data computed and
cross-checked for **16 cities** where it's actually visible — from totality in A Coruña and
Reykjavík to the deep partial phases in London, Paris or Rome. Available in **Italian, Spanish
and English**.

🔗 **[userman12.github.io/Eclipse](https://userman12.github.io/Eclipse/)**

The app exists for one precise reason: totality lasts **76 seconds**, with the Sun at **12° above
the horizon** (in A Coruña — it varies elsewhere). You get one attempt, and the most common
mistake isn't looking the wrong way — it's reaching the end without having looked at the right
things. So it answers four questions, in this order:

1. **Where do I look right now?** — compass, Sun altitude, countdown
2. **What do I do in those 76 seconds?** — a second-by-second script that highlights itself *(total-eclipse cities only)*
3. **What will I actually see?** — planets and stars that only appear during totality, phenomena worth recognising
4. **What about after?** — that same night is the Perseid peak, with no Moon, everywhere on the list

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other commands:

```bash
npm run build                 # production build
npm run start                 # production server
npm run typecheck              # tsc --noEmit
npm run icons                  # regenerate PWA icons (real PNGs, no dependencies)
npm run verify:cities          # cross-check all 16 cities against the app's own solar formula
npm run verify:sky             # recompute planet/star positions for A Coruña at maximum
npm run verify:dial            # render the Sun/Moon dial to PNG for a visual check
npm run verify:countdown-fit   # re-derive the countdown's container-query font-size formulas
```

## Trying out the temporal states

Every city computes its own state from its own local time, not the device's. To avoid waiting for
the actual eclipse, add `?t=HH:MM:SS` to the URL — interpreted as Europe/Madrid wall-clock time,
always the same regardless of which city is selected in the UI, so the same URL always simulates
the same real-world instant. The clock starts there and keeps running in real time. The table below
is tuned to the default city (A Coruña, in totality); pick a different city from the selector after
load to see its own state at that same instant.

| URL | State (A Coruña) |
| --- | --- |
| `/?t=18:00:00` | Before the eclipse |
| `/?t=19:45:00` | Partial phase — glasses required |
| `/?t=20:27:40` | **Totality** — glasses removable, critical countdown |
| `/?t=20:29:00` | Right after totality — glasses back on |
| `/?t=21:30:00` | Eclipse over |

## 16 cities, not the whole world

The 12 August 2026 eclipse is visible only along a narrow band: totality across Greenland, Iceland
and north-eastern Spain; partial visibility across much of Europe, North Africa and the Arctic.
Tokyo, New York, Sydney or Dubai see nothing at all that day. That's why the city selector (top of
the screen, next to the language picker) isn't a generic "top world cities" list — it's **16
curated cities** where something actually happens, each with contact times and coverage percentage
computed for its own real coordinates, not an approximation interpolated between two known points.

The underlying data (contact times, magnitude, Sun altitude/azimuth) comes from published eclipse
predictions, **cross-checked against the app's own verified solar formula**: for every one of the
16 cities, the internally computed Sun position at its reported maximum matches the published value
to within half a degree — see `npm run verify:cities`. The Sun's altitude at each city's final
contact is also used to determine, empirically, which eclipses actually end at sunset (11 of the
16) rather than completing with the Sun still up.

**Safety for partial-eclipse cities.** 6 cities reach totality (A Coruña, Reykjavík, Valencia,
Zaragoza, Bilbao, Palma de Mallorca); the other 10 stay partial even at maximum, several above 90%
(Madrid 99.9%, Lisbon 94.9%, Dublin 94.6%). In a partial-eclipse city the Sun is **never** fully
covered, so removing your glasses is never safe — and that isn't guaranteed by copy alone. The
state machine in `src/lib/time.ts` has two structurally different code paths for `type: 'total'`
and `type: 'partial'`: for a partial city, the `'totality'` stage and `safety: 'glasses-off'` level
aren't merely unlikely to occur — they're a code branch that doesn't exist. The Totality and Sky
tabs show an honest explainer instead of fabricated content wherever they don't apply.

**No invented observation spots.** A Coruña has 5 checked spots (below). The other 15 cities don't
get fabricated named viewpoints — instead the app shows the computed direction to look plus a
genuine Maps search link, not a made-up pin.

## Stack

Next.js 15 (App Router) · TypeScript · **Tailwind CSS v4** · **shadcn/ui** (on Radix) ·
Framer Motion · Lucide · inline SVG · CSS container queries · PWA with a service worker.

## Structure

```
src/
  app/
    layout.tsx                 metadata, fonts, providers, PWA, Toaster
    page.tsx                   home composition + toast on phase change
    globals.css                design system: palette, shadcn tokens, liquid glass
    ServiceWorkerRegistrar.tsx registers the service worker (production only)
  components/
    ui/                        shadcn primitives (button, card, badge, alert,
                               progress, drawer, accordion, separator, skeleton,
                               scroll-area, tabs, toggle-group, sonner)
    AuroraBackground.tsx       the animated backdrop the glass refracts
    GlassCard.tsx              shadcn Card rendered as liquid glass + shared reveal variants
    CitySelector.tsx           the 16-city picker, grouped total/partial, drawer-based
    LanguagePicker.tsx         IT / ES / EN picker, same drawer pattern as CitySelector
    EclipseHero.tsx            city, clock, countdown, contextual status
    Countdown.tsx              container-query-sized rolling-digit countdown
    ContextualStatus.tsx       the message that changes with time (and total/partial)
    Compass.tsx                SVG compass rose + device orientation sensor
    HorizonView.tsx            sea horizon, low Sun, altitude in degrees
    EclipseTimeline.tsx        the phases with the selected city's own local times
    SafetyNotice.tsx           persistent safety pill + Drawer with the full rules
    EclipseDial.tsx            live Sun/Moon disk next to the countdown
    LiveGuide.tsx              live box under the countdown (total-eclipse cities only)
    TotalityScript.tsx         the 76 seconds, step by step (total-eclipse cities only)
    PartialCityNotice.tsx      honest explainer in the Totality/Sky tabs for partial cities
    PhenomenaGuide.tsx         glossary of phenomena: what they are, how to recognise them
    SkyDuringTotality.tsx      western-sky map + live-computed planets and stars
    PerseidNight.tsx           twilight ladder, Perseid peak, radiant altitude — per city
    ObservationSpots.tsx       curated spots (A Coruña only) or the generic fallback elsewhere
    ObservationSpotCard.tsx    card with a pointer-tracking specular highlight + directions CTA
    GenericSpotGuidance.tsx    honest fallback: direction + Maps search, no invented pin
    WeatherCard.tsx            weather and cloud cover (mock data, varied per city)
  data/
    cities.ts                  the 16 cities: coordinates, phases, magnitude, total/partial type
    eventData.ts               shared content: A Coruña spots, 76s script, phenomena, Perseids
  lib/
    CityProvider.tsx           React context for the selected city (persisted)
    time.ts                    phases → UTC instants, per-city temporal state, countdown
    sun.ts                     solar position (NOAA low-precision)
    skyObjects.ts              planets and stars computed live for any city/instant
    night.ts                   twilight ladder and Perseid radiant altitude, computed per city
    weather.ts                 seam for a future weather API, mock varied per city
    eclipseGeometry.ts         Moon transit and Sun-coverage fraction, per city
    totality.ts                shared logic for the 76-second script
    i18n.ts                    IT / ES / EN dictionaries
    utils.ts                   shadcn's cn()
    useCompassHeading.ts       orientation sensors (with iOS permission prompt)
    useNow.ts                  live clock + ?t= simulation (always against Europe/Madrid)
scripts/
  generate-icons.mjs           PWA icons as real PNGs, no dependencies
  verify-sky.mjs               recomputes planet/star positions for A Coruña
  verify-dial.mjs              renders the Sun/Moon dial to PNG for a visual check
  verify-cities.mjs            cross-checks all 16 cities against the app's own solar formula
  verify-countdown-fit.mjs     re-derives the countdown's container-query font-size formulas
public/
  manifest.webmanifest, sw.js, icons/
```

## The Sun/Moon dial

Next to the countdown sits a disk that shows, live, how much of the Sun is covered, with the
percentage underneath. It isn't an illustration: every position comes from the clock through
`src/lib/eclipseGeometry.ts`, which models the Moon as a disk of radius 1.04 crossing the Sun
along a straight track.

The four contacts land **exactly** (0% → 100% → 100% → 0% at their published seconds), because
position is interpolated between the five known instants instead of assuming constant velocity —
the real eclipse is asymmetric, 57 minutes of partial phase before maximum and 54 after. The Sun
is drawn through an SVG mask, so the covered part becomes genuinely transparent and lets the glass
behind it show through.

`npm run verify:dial` renders an eight-phase PNG strip, so a graphic that otherwise couldn't be
checked can be checked by eye. What to look for: the bite starts on one side, passes through the
corona, and reopens on the **opposite** side. The Moon crosses through — it doesn't back out the
way it came.

The same geometry drives the sea-horizon view in the *Now* tab, where the Moon used to retreat
back the way it arrived. The transit direction is illustrative; timing and coverage are exact.

## The live guide

There's no time to navigate during the 76 seconds — no scrolling, switching tabs, or reading a
list and deciding. So from three minutes before totality, a box appears on its own under the
countdown: a full-width **glasses on/off** indicator (yellow = on, white = removable), the current
instruction, a progress bar for that step, and a preview of what's next. All without a single tap.

The live box and the full script in the *Totality* tab share `src/lib/totality.ts`: if they ever
disagreed, that would be a safety bug, not a cosmetic one. Step windows overlap on purpose, so the
current step is chosen by **priority**, and among ties by the most recent start — otherwise at −5s
"Baily's beads" would cover "diamond ring: keep your glasses on".

Invariants verified across the whole window, second by second: glasses on until 0s, off exactly at
the start of totality, back on at **+62s** (a 14-second margin before the Sun reappears at +76s),
no uncovered instant.

## The sky during totality

Every position in `src/lib/skyObjects.ts` is **computed**, not copied: approximate JPL planetary elements
(Standish) for the planets, J2000 coordinates for the stars, Meeus' formulae for magnitude. It's
computed live for whichever total-eclipse city is selected — `npm run verify:sky` recomputes the
reference values for A Coruña so the numbers can be checked instead of trusted.

What comes out of it, for A Coruña at maximum (20:28:13):

| Object | Magnitude | Altitude | Distance from the Sun |
|---|---|---|---|
| Venus | −2.8 | 28° | 46° |
| Jupiter | −1.8 | 7° | **10.5°** |
| Mercury | −1.0 | 5° | **14.9°** |
| Regulus | +1.4 | 17° | **10.1°** |
| Arcturus | −0.05 | 62° | 68° |

Jupiter, Mercury and Regulus sit only a few degrees from the Sun: on any other August evening
they're drowned in glare and invisible. Totality is the only window all year to see them, which is
why the app flags them with a dedicated badge — and, since not every total-eclipse city has them
above the horizon (Mercury dips below it from Valencia, Zaragoza and Palma; Jupiter from Valencia
and Palma), the sky map filters to what's actually visible from the selected city rather than
repeating this table everywhere.

## The night, not just the eclipse

In A Coruña the eclipse ends at 21:21:54, **19 minutes before sunset** (21:41). But a solar eclipse
happens, by definition, at new Moon — and 12 August is the **Perseid** peak. That means the best
meteor night of the year happens with not a sliver of moonlight, the same evening as the eclipse,
at every city on the list. Twilight timing and radiant altitude are computed live per city in
`src/lib/night.ts` rather than hardcoded for one location; in A Coruña, astronomical darkness
arrives at 23:32 and the radiant, circumpolar at this latitude, climbs from 13° to 56° by 05:00.

## The material: liquid glass

Defined entirely in `globals.css`, in three layers:

- `.glass` — the main surface. Refraction (`backdrop-filter: blur + saturate`), a body tint that's
  brighter where the light hits, a 1px specular rim drawn with a mask (bright top-left, almost
  invisible bottom-right), and an ambient shadow that lifts the panel off the background.
- `.glass-live` — adds a slowly rotating specular sweep. Reserved for the countdown and the
  compass: putting it everywhere would make the whole page shimmer.
- `.glass-inset` — for panels nested inside another glass panel. **No** `backdrop-filter`: glass
  behind glass re-refracts an already-blurred layer, costing a second GPU pass per element while
  muddying the result.

Glass needs something to refract: `AuroraBackground` is a drifting Atlantic dusk (three light
fields adrift, a warm glow low on the horizon, fine grain to avoid banding on OLED). It's pure CSS,
animated on the compositor, so it never steals main-thread time from the countdown.

The shadcn tokens (`--card`, `--primary`, `--muted-foreground`…) are mapped onto the coastal
palette, so every Radix primitive inherits the right colours without scattered overrides.

## Animations

Springs, not curves: every section enters with a shared reveal (rises, sharpens, settles),
staggered from its container. The countdown's digits roll vertically one at a time. Spot cards
carry a specular highlight that follows the pointer. A phase change fires a toast (sonner) and, on
the two transitions that affect the eyes, a vibration. Everything respects
`prefers-reduced-motion`.

## Technical choices

**Times.** Every city's phases are defined as wall-clock time in *that city's own* timezone and
converted once into UTC instants (`zonedWallTimeToUtc`, DST-aware via `Intl`). If the phone is on a
different timezone the app flags it, but keeps showing the selected city's own local times.

**Sun position.** Genuinely computed (`src/lib/sun.ts`), never hardcoded: for A Coruña at maximum
it returns **11.96° altitude, azimuth 279.1°**, matching the source data. Before and after the
eclipse the compass points at the direction of maximum (that's what matters for picking a spot);
during the eclipse it shows the real-time position, updated every second.

**Compass.** Uses `webkitCompassHeading` on iOS (with an explicit permission prompt) and
`deviceorientationabsolute` elsewhere, with circular smoothing. Without sensors, the rose stays
North-up and the Sun's direction is still shown.

**Countdown sizing.** The countdown shares its row with the live Sun/Moon dial, so its available
width is never the full screen. Its wrapper is a CSS `@container`, and every
`--text-countdown-*` token is sized in `cqw` — percent of that container's own width, not the
viewport — with the pair/triple/quad tiers solved algebraically (`npm run verify:countdown-fit`)
so digits, gaps and unit labels always add up to (container width − a small safety margin), on any
phone from 320px to 430px wide, instead of a value tuned by eye against one test device.

**Safety.** The bottom pill is always visible and changes colour and text with the phase: yellow
("glasses required"), white during totality with the seconds remaining, orange as soon as totality
ends. Tapping it opens a Drawer with the four full rules, also present as a card on the page. It's
deliberately the one element that stays solid rather than glass: in direct sunlight, legibility
comes before material.

**Weather.** `src/lib/weather.ts` is the integration seam: today it returns a per-city mock, and
wiring up a real provider (e.g. Open-Meteo, endpoint documented in the file) only means mapping its
response onto the `WeatherSnapshot` type and setting `isMock: false`. Low cloud is weighted double
in the assessment, because with the Sun this low it's what actually ruins the view.

**Offline.** The service worker (`public/sw.js`) caches the app shell: after the first visit it
keeps working with no signal at all, the likely condition on a cliff at O Portiño.

**Touch targets.** The city and language picker chips in the header are the app's primary
navigation controls, so they get a real 44px touch target (`h-11`) rather than just enough padding
to look right — a WCAG 2.5.5 / Apple HIG minimum that matters more, not less, when the app is used
outdoors with imprecise finger contact.

## A note on observation spots

The list isn't a guarantee of visibility. Spots are ranked by how open the western horizon is
(`open` / `partial` / `limited`): O Portiño and Monte de San Pedro face the open Atlantic, Riazor
and Orzán are convenient but face Northwest, O Parrote is accessible but has the city in front of
it. Every card repeats the warning to verify the horizon on site, and a dedicated section explains
what to do if the chosen spot turns out to be blocked.
