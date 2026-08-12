# Coruña Eclipse Navigator

Web app / PWA mobile-first per l'**eclissi totale di Sole del 12 agosto 2026** vista da **A Coruña** (Spagna).

🔗 **[userman12.github.io/Eclipse](https://userman12.github.io/Eclipse/)**

L'app esiste per un motivo preciso: la totalità dura **76 secondi**, con il Sole a **12° sull'orizzonte**.
Hai un solo tentativo, e l'errore più comune non è sbagliare direzione — è arrivare alla fine senza
aver guardato le cose giuste. Quindi risponde a quattro domande, in quest'ordine:

1. **Dove devo guardare adesso?** — bussola, altezza del Sole, countdown
2. **Cosa devo fare in quei 76 secondi?** — una scaletta secondo per secondo che si illumina da sola
3. **Cosa vedrò?** — pianeti e stelle che compaiono solo durante la totalità, fenomeni da riconoscere
4. **E dopo?** — la stessa notte è il picco delle Perseidi, senza Luna

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
    TotalityScript.tsx         i 76 secondi, passo per passo, con step live
    PhenomenaGuide.tsx         glossario dei fenomeni: cosa sono e come riconoscerli
    SkyDuringTotality.tsx      mappa del cielo a Ovest + pianeti e stelle visibili
    PerseidNight.tsx           crepuscolo, Perseidi al picco, altezza del radiante
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
scripts/
  generate-icons.mjs           icone PWA come PNG reali, senza dipendenze
  verify-sky.mjs               ricalcola le posizioni di pianeti e stelle
public/
  manifest.webmanifest, sw.js, icons/
```

## Il cielo durante la totalità

Tutte le posizioni in `eventData.ts` sono **calcolate**, non copiate: elementi planetari approssimati
JPL (Standish) per i pianeti, coordinate J2000 per le stelle, formule di Meeus per le magnitudini.
`npm run verify:sky` le rigenera, così i numeri si controllano invece di crederci.

Cosa emerge, per A Coruña al massimo (20:28:13):

| Oggetto | Magnitudine | Altezza | Distanza dal Sole |
|---|---|---|---|
| Venere | −2,8 | 28° | 46° |
| Giove | −1,8 | 7° | **10,5°** |
| Mercurio | −1,0 | 5° | **14,9°** |
| Regolo | +1,4 | 17° | **10,1°** |
| Arturo | −0,05 | 62° | 68° |

Giove, Mercurio e Regolo sono a pochi gradi dal Sole: in qualsiasi altra sera di agosto sono
annegati nel bagliore e invisibili. La totalità è l'unica finestra dell'anno per vederli, ed è per
questo che l'app li segnala con un badge dedicato.

## La notte, non solo l'eclissi

L'eclissi finisce alle 21:21:54, **19 minuti prima del tramonto** (21:41). Ma un'eclissi solare
avviene per definizione con la Luna nuova — e il 12 agosto è il picco delle **Perseidi**. Significa
che la notte migliore dell'anno per le meteore capita senza un filo di luce lunare, la stessa sera
dell'eclissi. Il buio astronomico arriva alle 23:32 e il radiante, circumpolare da questa latitudine,
sale da 13° a 56° entro le 05:00.

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
