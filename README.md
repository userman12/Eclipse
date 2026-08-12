# Coruña Eclipse Navigator

Web app / PWA mobile-first per l'**eclissi totale di Sole del 12 agosto 2026** vista da **A Coruña** (Spagna).

Risponde a una sola domanda, subito: **dove devo guardare adesso?**

## Avvio

```bash
npm install
npm run dev          # http://localhost:3000
```

Altri comandi:

```bash
npm run build        # build di produzione
npm run start        # server di produzione
npm run typecheck    # tsc --noEmit
npm run icons        # rigenera le icone PWA (PNG, senza dipendenze)
```

## Come provare i cinque stati temporali

Tutta la logica dipende dall'ora locale di `Europe/Madrid`, non da quella del dispositivo.
Per non aspettare l'eclissi, aggiungi il parametro `?t=HH:MM:SS` (ora locale dell'evento):
l'orologio parte da lì e continua a scorrere in tempo reale.

| URL | Stato |
| --- | --- |
| `/?t=18:00:00` | Prima dell'eclissi |
| `/?t=19:45:00` | Fase parziale — occhiali obbligatori |
| `/?t=20:27:40` | **Totalità** — occhiali rimovibili, countdown critico |
| `/?t=20:29:00` | Subito dopo la totalità — rimetti gli occhiali |
| `/?t=21:30:00` | Eclissi terminata |

## Stack

Next.js 15 (App Router) · TypeScript · **Tailwind CSS v4** · **shadcn/ui** (su Radix) ·
Framer Motion · Lucide · SVG inline · PWA con service worker.

## Struttura

```
src/
  app/
    layout.tsx                 metadata, font, provider lingua, PWA, Toaster
    page.tsx                   composizione della home + toast al cambio fase
    globals.css                design system: palette, token shadcn, liquid glass
    ServiceWorkerRegistrar.tsx registrazione del service worker (solo in produzione)
  components/
    ui/                        primitive shadcn (button, card, badge, alert,
                               progress, drawer, accordion, separator, skeleton,
                               scroll-area, tabs, toggle-group, sonner)
    AuroraBackground.tsx       il fondale animato che il vetro rifrange
    GlassCard.tsx              Card shadcn resa in liquid glass + varianti di reveal
    EclipseHero.tsx            località, orologio, countdown, stato contestuale
    Countdown.tsx              countdown a cifre rotanti
    ContextualStatus.tsx       il messaggio che cambia con l'orario
    Compass.tsx                rosa dei venti SVG + bussola del dispositivo
    HorizonView.tsx            orizzonte marino, Sole basso, altezza in gradi
    EclipseTimeline.tsx        le cinque fasi con orari locali
    SafetyNotice.tsx           pill di sicurezza persistente + Drawer con le regole
    ObservationSpots.tsx       elenco punti + piano B se l'orizzonte è coperto
    ObservationSpotCard.tsx    card con specular highlight e CTA "Apri indicazioni"
    WeatherCard.tsx            meteo e nuvolosità (dati mock)
    LanguageToggle.tsx         IT / ES
  data/
    eventData.ts               EventData: eclissi, punti, meteo mock
  lib/
    time.ts                    fasi → istanti UTC, stato temporale, countdown
    sun.ts                     posizione solare (NOAA low-precision)
    weather.ts                 seam per una futura API meteo
    i18n.ts                    dizionari IT / ES
    utils.ts                   cn() di shadcn
    useCompassHeading.ts       sensori di orientamento (con permesso iOS)
    useNow.ts                  orologio + simulazione via ?t=
public/
  manifest.webmanifest, sw.js, icons/
```

## Il materiale: liquid glass

Definito interamente in `globals.css`, in tre livelli:

- `.glass` — la superficie principale. Rifrazione (`backdrop-filter: blur + saturate`), un corpo
  con tinta direzionale più chiaro dove batte la luce, un bordo speculare di 1px disegnato con una
  maschera (brillante in alto a sinistra, quasi invisibile in basso a destra) e un'ombra ambientale
  che stacca il pannello dal fondo.
- `.glass-live` — aggiunge il riflesso speculare che ruota lentamente. Riservato a countdown e
  bussola: se lo mettessi ovunque la pagina luccicherebbe tutta.
- `.glass-inset` — per i pannelli dentro un altro pannello di vetro. **Senza** `backdrop-filter`:
  vetro dietro vetro rifrange un layer già sfocato, costa un secondo passaggio GPU per elemento e
  intorbida il risultato.

Il vetro ha bisogno di qualcosa da rifrangere: `AuroraBackground` è un tramonto atlantico in
movimento (tre campi luminosi alla deriva, un bagliore caldo basso sull'orizzonte, una grana fine
che evita il banding su OLED). È CSS puro, animato dal compositor, così non ruba main thread al
countdown.

I token shadcn (`--card`, `--primary`, `--muted-foreground`…) sono mappati sulla palette coastal,
quindi ogni primitiva Radix eredita i colori giusti senza override sparsi.

## Animazioni

Molle, non curve: ogni sezione entra con un reveal condiviso (sale, si mette a fuoco, si assesta)
in stagger dal contenitore. Il countdown ha cifre che ruotano verticalmente una per una. Le card dei
punti hanno un riflesso speculare che segue il dito. Al cambio di fase parte un toast (sonner) e,
sulle due transizioni che riguardano gli occhi, una vibrazione. Tutto rispetta
`prefers-reduced-motion`.

## Scelte tecniche

**Orari.** Le fasi sono definite come ora "da orologio" di `Europe/Madrid` e convertite una sola
volta in istanti UTC (`zonedWallTimeToUtc`, DST-aware via `Intl`). Se il telefono ha un altro fuso,
l'app lo segnala ma continua a mostrare gli orari di A Coruña.

**Posizione del Sole.** Calcolata realmente (`src/lib/sun.ts`), non hardcoded: al massimo restituisce
**11.96° di altezza e azimut 279.1°**, coerente con i dati forniti. Prima e dopo l'eclissi la bussola
mostra la direzione del massimo (è quella che serve per scegliere il punto); durante l'eclissi mostra
la posizione reale, aggiornata ogni secondo.

**Bussola.** Usa `webkitCompassHeading` su iOS (con richiesta esplicita di permesso) e
`deviceorientationabsolute` altrove, con smoothing circolare. Senza sensori la rosa resta con il
Nord in alto e la direzione del Sole è comunque indicata.

**Sicurezza.** La pill in basso è sempre visibile e cambia colore e testo con la fase: giallo
("occhiali obbligatori"), bianco durante la totalità con i secondi che restano, arancione appena la
totalità finisce. Toccandola si apre un Drawer con le quattro regole complete, presenti anche come
card in pagina. È volutamente l'unico elemento a fondo pieno e non di vetro: in pieno sole la
leggibilità viene prima del materiale.

**Meteo.** `src/lib/weather.ts` è il punto di innesto: oggi restituisce il mock di `eventData.ts`,
domani basta mappare la risposta di un'API (es. Open-Meteo, endpoint già documentato nel file) sul
tipo `WeatherSnapshot` e mettere `isMock: false`. Le nubi basse pesano il doppio nella valutazione,
perché con il Sole a 12° sono quelle che rovinano l'osservazione.

**Offline.** Il service worker (`public/sw.js`) mette in cache lo shell dell'app: dopo la prima
visita funziona senza rete, che è la condizione probabile su una scogliera a O Portiño.

## Nota sui punti di osservazione

L'elenco non è una garanzia di visibilità. I punti sono ordinati per apertura dell'orizzonte a Ovest
(`open` / `partial` / `limited`): O Portiño e Monte de San Pedro guardano l'Atlantico aperto, Riazor e
Orzán sono comode ma orientate a Nord-Ovest, O Parrote è accessibile ma ha la città davanti. Ogni card
ripete l'avviso di verificare l'orizzonte sul posto, e una sezione dedicata spiega cosa fare se il
punto scelto risulta coperto.
