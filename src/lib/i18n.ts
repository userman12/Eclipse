/**
 * Minimal three-language dictionary (no i18n library).
 * Italian is the default UI language; Spanish and English are available
 * because the app is used across 16 cities in six countries.
 */

export type Lang = 'it' | 'es' | 'en';

export const LANGS: Lang[] = ['it', 'es', 'en'];

/** Each language's own name, in its own language — never translated. */
export const LANG_NATIVE_NAME: Record<Lang, string> = {
  it: 'Italiano',
  es: 'Español',
  en: 'English',
};

const it = {
  liveClock: 'Ora locale',
  langLabel: 'Lingua',

  stage: {
    before: 'Prima dell’eclissi',
    'partial-rising': 'Fase parziale',
    totality: 'Totalità',
    'partial-falling': 'Fase parziale finale',
    after: 'Eclissi terminata',
  },

  // Verbatim contextual messages
  status: {
    before: 'Preparati. Scegli un punto con vista completamente libera verso Ovest.',
    'partial-rising':
      'L’eclissi è iniziata. Guarda verso Ovest usando esclusivamente occhiali da eclissi certificati.',
    totality:
      'TOTALITÀ. Il Sole è completamente coperto. Puoi togliere gli occhiali solo durante questa fase.',
    'partial-falling': 'Rimetti subito gli occhiali certificati: il Sole è tornato visibile.',
    after: 'L’eclissi è terminata.',
    // Used instead of 'partial-falling' above when the city never reaches
    // totality: nothing was removed, so "rimetti" (put back on) would be
    // false. The eclipse is simply past its peak and still ongoing.
    partialFallingOnly: 'L’eclissi ha superato il massimo e sta calando. Occhiali sempre indossati.',
    neverTotalReminder:
      'In questa città l’eclissi resta parziale: il Sole non sarà mai completamente coperto, quindi gli occhiali restano obbligatori per tutta la durata.',
  },

  countdown: {
    to: 'Mancano a',
    glassesBackOn: 'Rimetti gli occhiali fra',
    done: 'Tutte le fasi sono concluse',
    days: 'g',
    hours: 'h',
    minutes: 'min',
    seconds: 's',
  },

  phases: {
    'partial-start': 'Inizio dell’eclissi',
    'totality-start': 'Inizio della totalità',
    maximum: 'Massimo',
    'totality-end': 'Fine della totalità',
    'partial-end': 'Fine dell’eclissi',
  },

  compass: {
    title: 'Dove guardare adesso',
    lookToward: 'Guarda verso',
    west: 'Ovest',
    azimuth: 'azimut',
    live: 'Posizione reale del Sole',
    atMaximum: 'Al massimo dell’eclissi',
    enable: 'Attiva la bussola',
    enableHint: 'Serve il permesso per i sensori di orientamento.',
    unavailable: 'Bussola non disponibile: la rosa è orientata con il Nord in alto.',
    yourHeading: 'Il telefono punta a',
    turnRight: 'Ruota a destra',
    turnLeft: 'Ruota a sinistra',
    onTarget: 'Sei allineato con il Sole',
    magneticNote: 'La bussola del telefono può sbagliare di qualche grado.',
  },

  horizon: {
    title: 'Altezza del Sole',
    aboveHorizon: 'sopra l’orizzonte',
    fists: 'circa {n} pugni a braccio teso',
    belowHorizon: 'Il Sole è sotto l’orizzonte',
    warning:
      'Il Sole sarà molto basso: serve un orizzonte completamente libero verso Ovest, senza edifici, alberi o rilievi.',
    atMax: 'Al massimo: {alt}° di altezza, azimut {az}°',
  },

  timeline: {
    title: 'Fasi dell’eclissi',
    subtitle: 'Orari locali di {city} ({timezone})',
    totalityDuration: 'Durata della totalità: {n} secondi',
    maxCoverage: 'Copertura massima del Sole: {n}%',
    next: 'prossima',
  },

  safety: {
    title: 'Sicurezza degli occhi',
    rules: [
      'Durante le fasi parziali usa solo occhiali da eclissi omologati ISO 12312-2.',
      'Non usare occhiali da sole, filtri improvvisati, radiografie o vetri anneriti.',
      'Puoi togliere gli occhiali soltanto durante la totalità, quando il disco solare è completamente coperto.',
      'Rimettili prima della fine della totalità.',
    ],
    bannerRequired: 'Occhiali ISO 12312-2 obbligatori adesso',
    bannerOff: 'Puoi togliere gli occhiali — solo per {n} s',
    bannerBackOn: 'Occhiali subito: il Sole è tornato',
    bannerNone: 'Mai a occhio nudo senza occhiali certificati',
  },

  spots: {
    title: 'Dove andare',
    subtitle:
      'Punti consigliati ad A Coruña. Nessun elenco può garantire la visibilità: la verifica sul posto è sempre necessaria.',
    cta: 'Apri indicazioni',
    warning: 'Verifica sempre che l’orizzonte verso Ovest sia libero.',
    kinds: {
      coast: 'Costa',
      viewpoint: 'Punto panoramico',
      beach: 'Spiaggia urbana',
      promenade: 'Passeggiata sul mare',
    },
    horizonLabel: 'Orizzonte a Ovest',
    horizon: {
      open: 'Aperto sul mare',
      partial: 'Parzialmente coperto',
      limited: 'Limitato',
    },
    reasons: {
      oPortino:
        'Affaccio diretto sull’Atlantico: verso Ovest c’è solo mare aperto, la condizione migliore con il Sole a 12°.',
      monteSanPedro:
        'La quota elevata alza la linea dell’orizzonte apparente e riduce il rischio di ostacoli davanti al Sole basso.',
      riazor:
        'Grande spiaggia urbana facile da raggiungere: ampio cielo aperto, ma controlla il promontorio sul lato Ovest.',
      orzan:
        'In pieno centro e ben servita: comoda come ripiego, con vista aperta verso Nord-Ovest.',
      oParrote:
        'Passeggiata sul mare molto accessibile: adatta se non puoi spostarti, ma la città si frappone verso Ovest.',
    },
    fallbackTitle: 'Se il tuo punto è coperto',
    fallbackSteps: [
      'Il Sole sarà molto basso: un edificio di 20 m può coprirlo fino a un centinaio di metri di distanza.',
      'Spostati verso uno spazio aperto o guadagna quota: un parco, un tetto, una collina.',
      'Controlla l’orizzonte già un’ora prima, con il Sole ancora più alto: se lo perdi di vista, cambia posto adesso.',
      'Meglio un punto banale ma libero che un punto scenografico con un ostacolo davanti.',
    ],
    distance: 'a ~{n} km dal centro',

    // Generic fallback shown for every city except A Coruña, which has
    // curated named spots instead — see the strings above.
    genericTitle: 'Dove guardare',
    genericSubtitle: 'Direzione da cercare: {dir}, azimut {az}°',
    genericBody:
      'Non abbiamo punti verificati per questa città, quindi non li inventiamo. Cerca un luogo con vista libera nella direzione indicata: un parco, un tetto accessibile, un argine, una collina. Quello che conta è l’assenza di edifici o alberi lungo la linea di vista.',
    searchViewpoint: 'punto panoramico',
    searchViewpointCta: 'Cerca punti panoramici',
    searchOpenSpace: 'parco',
    searchOpenSpaceCta: 'Cerca parchi e spazi aperti',
  },

  weather: {
    title: 'Meteo e nuvolosità',
    mock: 'Dati simulati',
    mockNote: 'Valori di esempio: la sezione è pronta per essere collegata a un’API meteo.',
    cloudCover: 'Copertura nuvolosa',
    lowClouds: 'Nubi basse',
    lowCloudsNote: 'Le nubi basse sono le più critiche con il Sole vicino all’orizzonte.',
    visibility: 'Visibilità',
    wind: 'Vento',
    temperature: 'Temperatura',
    hourly: 'Nuvolosità oraria',
    observedAt: 'Aggiornato alle',
    verdict: {
      good: 'Condizioni favorevoli',
      mixed: 'Condizioni incerte',
      poor: 'Condizioni difficili',
    },
  },

  tabs: {
    now: 'Ora',
    totality: 'Totalità',
    sky: 'Cielo',
    places: 'Luoghi',
  },

  dial: {
    covered: 'Coperto',
  },

  script: {
    title: 'I 76 secondi',
    subtitle:
      'La totalità dura poco più di un minuto. Questo è l’ordine in cui guardare le cose, per non arrivare alla fine senza aver visto niente.',
    liveNow: 'Adesso',
    glassesOn: 'Occhiali indossati',
    glassesOff: 'Occhiali tolti',
    priorityLabel: 'Da non perdere',
    tip: 'Consiglio: non fotografare. Con 76 secondi, un telefono ti fa perdere l’unica cosa che conta.',
    steps: {
      approach: {
        title: 'L’ombra in arrivo',
        body: 'Guarda verso Ovest: il cono d’ombra della Luna sta correndo verso di te attraverso il paesaggio a migliaia di km/h. Con un orizzonte libero puoi provare a scorgerlo pochi secondi prima che ti raggiunga.',
      },
      'shadow-bands': {
        title: 'Bande d’ombra a terra',
        body: 'Stendi un telo o un foglio bianco per terra. Nei secondi prima e dopo la totalità possono comparire onde di luce e ombra che scorrono, come riflessi sul fondo di una piscina.',
      },
      beads: {
        title: 'Grani di Baily',
        body: 'La falce si spezza in puntini di luce: è il Sole che filtra tra le montagne della Luna. Ancora con gli occhiali.',
      },
      'diamond-in': {
        title: 'Anello di diamante',
        body: 'Resta un solo punto brillantissimo su un cerchio sottile. Tieni gli occhiali finché non sparisce del tutto.',
      },
      'glasses-off': {
        title: 'Togli gli occhiali adesso',
        body: 'Il disco è coperto. Puoi guardare a occhio nudo: è l’unico momento in cui è sicuro, e l’unico in cui vedrai qualcosa.',
      },
      corona: {
        title: 'La corona',
        body: 'Non fare altro. Guarda e basta. La corona è un alone perlaceo con filamenti che si allungano nello spazio: nessuna foto le rende.',
      },
      prominences: {
        title: 'Protuberanze e cromosfera',
        body: 'Sul bordo del disco nero cerca fiammate rosa e un sottile anello rossastro: sono getti di gas alti decine di migliaia di chilometri.',
      },
      'look-around': {
        title: 'Stacca gli occhi dal Sole',
        body: 'Girati intorno: tutto l’orizzonte a 360° ha i colori del tramonto, perché stai guardando il giorno oltre il bordo dell’ombra. Ascolta: spesso gli uccelli tacciono.',
      },
      planets: {
        title: 'Pianeti e stelle',
        body: 'Venere è alto a Sud-Ovest, molto luminoso: è la cosa più facile da riconoscere. Altri pianeti possono comparire vicinissimi al Sole eclissato — guarda il tab Cielo per sapere esattamente cosa aspettarti da qui.',
      },
      'corona-again': {
        title: 'Un ultimo sguardo alla corona',
        body: 'Torna sul Sole e fissa la forma della corona: cambia a ogni eclissi e questa non la rivedrai mai più uguale.',
      },
      'glasses-on': {
        title: 'Rimetti gli occhiali',
        body: 'Non aspettare di vedere la luce tornare. Rimettili adesso, prima che il bordo del Sole riappaia.',
      },
      'diamond-out': {
        title: 'Secondo anello di diamante',
        body: 'La luce esplode dal lato opposto. Con gli occhiali puoi guardarlo: è la chiusura della totalità.',
      },
    },
  },

  phenomena: {
    title: 'Cosa cercare',
    subtitle:
      'Ogni fenomeno dura pochi secondi e si riconosce solo se sai già cos’è. Leggi prima, così durante non devi pensarci.',
    difficulty: { easy: 'Facile', medium: 'Media', hard: 'Difficile' },
    direction: {
      sun: 'Verso il Sole',
      horizon: 'Sull’orizzonte',
      ground: 'A terra',
      around: 'Tutt’intorno',
      self: 'Su di te',
    },
    nakedEye: 'A occhio nudo',
    withGlasses: 'Con occhiali',
    items: {
      'umbra-approach': {
        title: 'L’ombra che arriva',
        body: 'Una parete scura che avanza a migliaia di km/h. Da un punto panoramico o vicino al mare puoi vederla arrivare pochi secondi prima che ti raggiunga.',
      },
      'shadow-bands': {
        title: 'Bande d’ombra',
        body: 'Sottili onde chiare e scure che scorrono sulle superfici chiare. Sono turbolenza atmosferica illuminata da una falce di Sole sottilissima. Rare e sfuggenti.',
      },
      temperature: {
        title: 'Crollo della temperatura',
        body: 'Nell’ora attorno alla totalità la temperatura può scendere di diversi gradi e il vento cambiare direzione. Portati qualcosa da mettere addosso.',
      },
      wildlife: {
        title: 'Reazione degli animali',
        body: 'Gabbiani che rientrano, uccelli che smettono di cantare, grilli che partono. Più evidente all’aperto, lontano dal rumore del traffico.',
      },
      'diamond-ring': {
        title: 'Anello di diamante',
        body: 'Un punto di luce accecante su un anello sottile, un attimo prima e un attimo dopo la totalità. È il momento più fotografato dell’intero fenomeno.',
      },
      'baily-beads': {
        title: 'Grani di Baily',
        body: 'La luce residua spezzata in perline dalle valli lunari. Durano pochi secondi e annunciano l’inizio della totalità.',
      },
      corona: {
        title: 'La corona solare',
        body: 'L’atmosfera esterna del Sole, un milione di gradi, visibile solo adesso. Filamenti perlacei che si estendono per diversi raggi solari.',
      },
      chromosphere: {
        title: 'Cromosfera',
        body: 'Un anello rosso vivo sul bordo del disco nero, visibile per pochi secondi all’inizio e alla fine della totalità.',
      },
      prominences: {
        title: 'Protuberanze',
        body: 'Fiammate di gas rosa ancorate al bordo solare, alte molte volte la Terra. Con il Sole così basso spiccano molto bene.',
      },
      'horizon-360': {
        title: 'Tramonto a 360°',
        body: 'Sei dentro un cono d’ombra largo poche decine di km: in ogni direzione, oltre il bordo, è ancora giorno. L’orizzonte si accende di arancione tutto intorno.',
      },
    },
  },

  sky: {
    title: 'Il cielo durante la totalità',
    subtitle:
      'Con il Sole coperto il cielo scende a una luminosità da crepuscolo e compaiono pianeti e stelle luminose. Posizioni calcolate per il massimo, le {time}.',
    mapTitle: 'Cielo a Ovest al massimo',
    mapHint: 'Vista verso Ovest, dall’orizzonte a 45° di altezza.',
    eclipsedSun: 'Sole eclissato',
    onlyNow: 'Solo adesso',
    onlyNowExplain:
      'Normalmente perso nel bagliore del Sole: la totalità è l’unica occasione dell’anno per vederlo.',
    magnitude: 'magnitudine',
    fromSun: 'dal Sole',
    altitudeShort: 'alt',
    behindYou: 'Alle tue spalle e in alto',
    behindYouHint:
      'Se avanza tempo dopo aver guardato la corona: queste sono già sopra l’orizzonte, ma ti costringono a voltarti.',
    planets: 'Pianeti',
    objects: {
      venus: { name: 'Venere', note: 'Il più facile in assoluto: alto a Sud-Ovest e molto brillante. Lo vedrai anche prima della totalità.' },
      jupiter: { name: 'Giove', note: 'Vicinissimo al Sole eclissato. Invisibile in qualsiasi altra sera di agosto.' },
      mercury: { name: 'Mercurio', note: 'Basso, appena sopra l’orizzonte a destra del Sole. Serve un orizzonte marino perfettamente pulito.' },
      arcturus: { name: 'Arturo', note: 'La stella più luminosa del cielo in quel momento, quasi allo zenit verso Sud-Ovest.' },
      vega: { name: 'Vega', note: 'Alta a Est, vertice del Triangolo Estivo. Ti devi girare completamente.' },
      altair: { name: 'Altair', note: 'A Est, terzo vertice del Triangolo Estivo.' },
      spica: { name: 'Spica', note: 'A Sud-Ovest, sotto Arturo: la stella principale della Vergine.' },
      antares: { name: 'Antares', note: 'Rossastra, bassa a Sud: il cuore dello Scorpione.' },
      deneb: { name: 'Deneb', note: 'A Nord-Est, nel Cigno: il vertice più lontano del Triangolo Estivo.' },
      regulus: { name: 'Regolo', note: 'Molto vicino al Sole: in agosto il Sole attraversa il Leone, quindi normalmente è invisibile.' },
    },
  },

  night: {
    title: 'La notte del 12 agosto',
    subtitle:
      'L’eclissi finisce 19 minuti prima del tramonto. Ma la serata non è finita: quella stessa notte è il picco delle Perseidi, e senza Luna.',
    twilightTitle: 'Come si fa buio',
    twilight: {
      sunset: 'Tramonto',
      civilEnd: 'Fine crepuscolo civile',
      nauticalEnd: 'Fine crepuscolo nautico',
      astronomicalEnd: 'Buio astronomico',
    },
    twilightNote:
      'Dalle {time} il cielo è completamente buio: da quel momento in poi le condizioni sono le migliori possibili.',
    neverFullyDark:
      'A questa latitudine e in questo periodo il cielo non diventa mai completamente buio: resta un chiarore basso a Nord per tutta la notte.',
    perseidsTitle: 'Perseidi al picco, senza Luna',
    perseidsBody:
      'Un’eclissi di Sole avviene per definizione con la Luna nuova. Significa che la notte del picco delle Perseidi non ha nemmeno un filo di luce lunare: è la combinazione migliore che si possa avere.',
    zhrLabel: 'Meteore/ora teoriche',
    zhrNote:
      'Valore ideale con cielo perfetto e radiante allo zenit. In pratica, da un punto buio, aspettati parecchie decine all’ora nelle ore migliori.',
    moonLabel: 'Illuminazione lunare',
    radiantTitle: 'Altezza del radiante',
    radiantNote:
      'Il radiante è in Perseo, a Nord-Est, e da {city} non tramonta mai. Più sale, più meteore vedi: le ore migliori sono dopo l’una.',
    bestWindow: 'Ore migliori',
    bestWindowValue: 'dall’01:00 all’alba',
    tipsTitle: 'Per le Perseidi',
    tips: [
      'Non servono occhiali né strumenti: le meteore si guardano a occhio nudo, sdraiati.',
      'Guarda in alto, non verso il radiante: le scie più lunghe compaiono lontano da Perseo.',
      'Servono 20 minuti al buio completo perché l’occhio si adatti. Il telefono azzera l’adattamento ogni volta che lo accendi.',
      'Lo stesso punto scelto per l’eclissi va bene anche per le Perseidi, purché lontano dalle luci della città.',
    ],
  },

  footer: {
    offline: 'Funziona offline: i dati dell’eclissi sono salvati nell’app.',
    disclaimer: 'Orari calcolati per {city} ({lat}, {lng}). Verifica sempre le condizioni reali sul posto.',
    timezoneWarning:
      'Il telefono non è sull’orario di {city}: tutti gli orari mostrati sono comunque quelli locali della città selezionata.',
    sources:
      'Orari, posizioni del Sole, pianeti e crepuscolo calcolati e verificati per ogni città con gli script in scripts/verify-*.mjs.',
  },

  cityPicker: {
    title: 'Scegli una città',
    subtitle:
      'Solo città dove l’eclissi del 12 agosto è davvero visibile: altrove non c’è nulla da vedere quel giorno.',
    totalGroup: 'Eclissi totale',
    partialGroup: 'Eclissi parziale',
    scopeNote:
      'La maggior parte delle grandi città del mondo non vede nulla il 12 agosto 2026: l’eclissi è visibile solo lungo una fascia stretta tra Artico, Groenlandia, Islanda ed Europa. Per questo l’elenco è limitato a queste 16 città.',
  },

  eclipseTitle: {
    total: 'Eclissi totale di Sole',
    partial: 'Eclissi parziale di Sole',
  },

  partialNotice: {
    eyebrow: 'Non applicabile qui',
    totality: {
      title: 'Qui non c’è totalità',
      body: 'La sequenza dei 76 secondi e i fenomeni come corona, anello di diamante e cromosfera esistono solo quando il Sole è completamente coperto. Da {city} l’eclissi resta parziale, con una copertura massima del {magnitude}%: il Sole non sarà mai coperto del tutto, quindi non c’è una sequenza da seguire. Tieni gli occhiali per tutta la durata.',
    },
    sky: {
      title: 'Il cielo non si scurisce abbastanza',
      body: 'Pianeti e stelle diventano visibili solo quando il disco solare è completamente coperto e il cielo scende a una luminosità da crepuscolo. Da {city}, dove l’eclissi resta parziale (massimo {magnitude}% di copertura), il cielo resta troppo chiaro perché questo accada.',
    },
  },

  cities: {
    'a-coruna': { name: 'A Coruña', country: 'Spagna' },
    reykjavik: { name: 'Reykjavík', country: 'Islanda' },
    valencia: { name: 'Valencia', country: 'Spagna' },
    zaragoza: { name: 'Saragozza', country: 'Spagna' },
    bilbao: { name: 'Bilbao', country: 'Spagna' },
    palma: { name: 'Palma di Maiorca', country: 'Spagna' },
    madrid: { name: 'Madrid', country: 'Spagna' },
    lisbon: { name: 'Lisbona', country: 'Portogallo' },
    dublin: { name: 'Dublino', country: 'Irlanda' },
    paris: { name: 'Parigi', country: 'Francia' },
    london: { name: 'Londra', country: 'Regno Unito' },
    brussels: { name: 'Bruxelles', country: 'Belgio' },
    amsterdam: { name: 'Amsterdam', country: 'Paesi Bassi' },
    berlin: { name: 'Berlino', country: 'Germania' },
    stockholm: { name: 'Stoccolma', country: 'Svezia' },
    rome: { name: 'Roma', country: 'Italia' },
  },
};

type Dict = typeof it;

const es: Dict = {
  liveClock: 'Hora local',
  langLabel: 'Idioma',

  stage: {
    before: 'Antes del eclipse',
    'partial-rising': 'Fase parcial',
    totality: 'Totalidad',
    'partial-falling': 'Fase parcial final',
    after: 'Eclipse finalizado',
  },

  status: {
    before: 'Prepárate. Elige un punto con vista completamente despejada hacia el Oeste.',
    'partial-rising':
      'El eclipse ha comenzado. Mira hacia el Oeste usando únicamente gafas de eclipse certificadas.',
    totality:
      'TOTALIDAD. El Sol está completamente cubierto. Solo puedes quitarte las gafas durante esta fase.',
    'partial-falling': 'Vuelve a ponerte las gafas certificadas: el Sol es visible de nuevo.',
    after: 'El eclipse ha terminado.',
    partialFallingOnly: 'El eclipse ha superado el máximo y está disminuyendo. Gafas siempre puestas.',
    neverTotalReminder:
      'En esta ciudad el eclipse sigue siendo parcial: el Sol nunca quedará completamente cubierto, así que las gafas son obligatorias durante todo el evento.',
  },

  countdown: {
    to: 'Faltan para',
    glassesBackOn: 'Ponte las gafas en',
    done: 'Todas las fases han concluido',
    days: 'd',
    hours: 'h',
    minutes: 'min',
    seconds: 's',
  },

  phases: {
    'partial-start': 'Comienza el eclipse',
    'totality-start': 'Comienza la totalidad',
    maximum: 'Máximo',
    'totality-end': 'Finaliza la totalidad',
    'partial-end': 'Finaliza el eclipse',
  },

  compass: {
    title: 'Dónde mirar ahora',
    lookToward: 'Mira hacia el',
    west: 'Oeste',
    azimuth: 'azimut',
    live: 'Posición real del Sol',
    atMaximum: 'En el máximo del eclipse',
    enable: 'Activar la brújula',
    enableHint: 'Se necesita permiso para los sensores de orientación.',
    unavailable: 'Brújula no disponible: la rosa está orientada con el Norte arriba.',
    yourHeading: 'El teléfono apunta al',
    turnRight: 'Gira a la derecha',
    turnLeft: 'Gira a la izquierda',
    onTarget: 'Estás alineado con el Sol',
    magneticNote: 'La brújula del teléfono puede desviarse algunos grados.',
  },

  horizon: {
    title: 'Altura del Sol',
    aboveHorizon: 'sobre el horizonte',
    fists: 'unos {n} puños con el brazo extendido',
    belowHorizon: 'El Sol está bajo el horizonte',
    warning:
      'El Sol estará muy bajo: necesitas un horizonte completamente despejado hacia el Oeste, sin edificios, árboles ni relieves.',
    atMax: 'En el máximo: {alt}° de altura, azimut {az}°',
  },

  timeline: {
    title: 'Fases del eclipse',
    subtitle: 'Horas locales de {city} ({timezone})',
    totalityDuration: 'Duración de la totalidad: {n} segundos',
    maxCoverage: 'Cobertura máxima del Sol: {n}%',
    next: 'siguiente',
  },

  safety: {
    title: 'Seguridad ocular',
    rules: [
      'Durante las fases parciales usa solo gafas de eclipse homologadas ISO 12312-2.',
      'No uses gafas de sol, filtros improvisados, radiografías ni cristales ahumados.',
      'Solo puedes quitarte las gafas durante la totalidad, cuando el disco solar está completamente cubierto.',
      'Vuelve a ponértelas antes de que termine la totalidad.',
    ],
    bannerRequired: 'Gafas ISO 12312-2 obligatorias ahora',
    bannerOff: 'Puedes quitarte las gafas — solo {n} s',
    bannerBackOn: 'Gafas ya: el Sol ha vuelto',
    bannerNone: 'Nunca a simple vista sin gafas certificadas',
  },

  spots: {
    title: 'Dónde ir',
    subtitle:
      'Puntos recomendados en A Coruña. Ninguna lista garantiza la visibilidad: siempre hay que comprobarlo en el sitio.',
    cta: 'Abrir indicaciones',
    warning: 'Comprueba siempre que el horizonte hacia el Oeste esté despejado.',
    kinds: {
      coast: 'Costa',
      viewpoint: 'Mirador',
      beach: 'Playa urbana',
      promenade: 'Paseo marítimo',
    },
    horizonLabel: 'Horizonte al Oeste',
    horizon: {
      open: 'Abierto al mar',
      partial: 'Parcialmente cubierto',
      limited: 'Limitado',
    },
    reasons: {
      oPortino:
        'Frente directo al Atlántico: hacia el Oeste solo hay mar abierto, la mejor condición con el Sol a 12°.',
      monteSanPedro:
        'La altura eleva la línea del horizonte aparente y reduce el riesgo de obstáculos ante el Sol bajo.',
      riazor:
        'Gran playa urbana de fácil acceso: mucho cielo abierto, pero revisa el promontorio del lado Oeste.',
      orzan:
        'En pleno centro y bien comunicada: cómoda como alternativa, con vista abierta hacia el Noroeste.',
      oParrote:
        'Paseo marítimo muy accesible: válido si no puedes desplazarte, pero la ciudad se interpone hacia el Oeste.',
    },
    fallbackTitle: 'Si tu punto está cubierto',
    fallbackSteps: [
      'El Sol estará muy bajo: un edificio de 20 m puede taparlo hasta un centenar de metros de distancia.',
      'Muévete a un espacio abierto o gana altura: un parque, un tejado, una colina.',
      'Comprueba el horizonte una hora antes, con el Sol más alto: si lo pierdes de vista, cambia de sitio ya.',
      'Mejor un punto anodino pero despejado que uno espectacular con un obstáculo delante.',
    ],
    distance: 'a ~{n} km del centro',

    genericTitle: 'Dónde mirar',
    genericSubtitle: 'Dirección a buscar: {dir}, azimut {az}°',
    genericBody:
      'No tenemos puntos verificados para esta ciudad, así que no los inventamos. Busca un lugar con vista despejada en la dirección indicada: un parque, una azotea accesible, un dique, una colina. Lo que importa es que no haya edificios ni árboles en la línea de visión.',
    searchViewpoint: 'mirador',
    searchViewpointCta: 'Buscar miradores',
    searchOpenSpace: 'parque',
    searchOpenSpaceCta: 'Buscar parques y espacios abiertos',
  },

  weather: {
    title: 'Meteorología y nubosidad',
    mock: 'Datos simulados',
    mockNote: 'Valores de ejemplo: la sección está lista para conectarse a una API meteorológica.',
    cloudCover: 'Cobertura nubosa',
    lowClouds: 'Nubes bajas',
    lowCloudsNote: 'Las nubes bajas son las más críticas con el Sol cerca del horizonte.',
    visibility: 'Visibilidad',
    wind: 'Viento',
    temperature: 'Temperatura',
    hourly: 'Nubosidad por horas',
    observedAt: 'Actualizado a las',
    verdict: {
      good: 'Condiciones favorables',
      mixed: 'Condiciones inciertas',
      poor: 'Condiciones difíciles',
    },
  },

  tabs: {
    now: 'Ahora',
    totality: 'Totalidad',
    sky: 'Cielo',
    places: 'Lugares',
  },

  dial: {
    covered: 'Cubierto',
  },

  script: {
    title: 'Los 76 segundos',
    subtitle:
      'La totalidad dura poco más de un minuto. Este es el orden en el que mirar las cosas, para no llegar al final sin haber visto nada.',
    liveNow: 'Ahora',
    glassesOn: 'Gafas puestas',
    glassesOff: 'Gafas quitadas',
    priorityLabel: 'Imprescindible',
    tip: 'Consejo: no hagas fotos. Con 76 segundos, el móvil te hace perder lo único que importa.',
    steps: {
      approach: {
        title: 'La sombra que se acerca',
        body: 'Mira hacia el Oeste: el cono de sombra de la Luna viene corriendo hacia ti a través del paisaje a miles de km/h. Con un horizonte despejado puedes intentar verlo unos segundos antes de que te alcance.',
      },
      'shadow-bands': {
        title: 'Bandas de sombra en el suelo',
        body: 'Extiende una tela o una hoja blanca en el suelo. En los segundos previos y posteriores a la totalidad pueden aparecer ondas de luz y sombra, como reflejos en el fondo de una piscina.',
      },
      beads: {
        title: 'Perlas de Baily',
        body: 'La media luna se rompe en puntos de luz: es el Sol filtrándose entre las montañas de la Luna. Todavía con gafas.',
      },
      'diamond-in': {
        title: 'Anillo de diamante',
        body: 'Queda un único punto brillantísimo sobre un círculo fino. Mantén las gafas hasta que desaparezca del todo.',
      },
      'glasses-off': {
        title: 'Quítate las gafas ahora',
        body: 'El disco está cubierto. Puedes mirar a simple vista: es el único momento en que es seguro, y el único en que verás algo.',
      },
      corona: {
        title: 'La corona',
        body: 'No hagas nada más. Solo mira. La corona es un halo perlado con filamentos que se alargan en el espacio: ninguna foto los reproduce.',
      },
      prominences: {
        title: 'Protuberancias y cromosfera',
        body: 'En el borde del disco negro busca llamaradas rosas y un fino anillo rojizo: son chorros de gas de decenas de miles de kilómetros de altura.',
      },
      'look-around': {
        title: 'Aparta la vista del Sol',
        body: 'Date la vuelta: todo el horizonte a 360° tiene colores de atardecer, porque estás viendo el día más allá del borde de la sombra. Escucha: los pájaros suelen callar.',
      },
      planets: {
        title: 'Planetas y estrellas',
        body: 'Venus está alto al Suroeste, muy brillante: es lo más fácil de reconocer. Otros planetas pueden aparecer muy cerca del Sol eclipsado — consulta la pestaña Cielo para saber exactamente qué esperar desde aquí.',
      },
      'corona-again': {
        title: 'Una última mirada a la corona',
        body: 'Vuelve al Sol y fíjate en la forma de la corona: cambia en cada eclipse y esta no la volverás a ver igual.',
      },
      'glasses-on': {
        title: 'Vuelve a ponerte las gafas',
        body: 'No esperes a ver volver la luz. Póntelas ahora, antes de que reaparezca el borde del Sol.',
      },
      'diamond-out': {
        title: 'Segundo anillo de diamante',
        body: 'La luz estalla por el lado opuesto. Con gafas puedes mirarlo: es el cierre de la totalidad.',
      },
    },
  },

  phenomena: {
    title: 'Qué buscar',
    subtitle:
      'Cada fenómeno dura pocos segundos y solo se reconoce si ya sabes qué es. Léelo antes, así durante no tendrás que pensarlo.',
    difficulty: { easy: 'Fácil', medium: 'Media', hard: 'Difícil' },
    direction: {
      sun: 'Hacia el Sol',
      horizon: 'En el horizonte',
      ground: 'En el suelo',
      around: 'Alrededor',
      self: 'En ti mismo',
    },
    nakedEye: 'A simple vista',
    withGlasses: 'Con gafas',
    items: {
      'umbra-approach': {
        title: 'La sombra que llega',
        body: 'Un muro oscuro que avanza a miles de km/h. Desde un mirador o cerca del mar puedes verla llegar unos segundos antes de que te alcance.',
      },
      'shadow-bands': {
        title: 'Bandas de sombra',
        body: 'Finas ondas claras y oscuras que recorren las superficies claras. Son turbulencia atmosférica iluminada por una finísima hoz de Sol. Raras y esquivas.',
      },
      temperature: {
        title: 'Caída de temperatura',
        body: 'En la hora alrededor de la totalidad la temperatura puede bajar varios grados y cambiar el viento. Lleva algo de abrigo.',
      },
      wildlife: {
        title: 'Reacción de los animales',
        body: 'Gaviotas que se retiran, pájaros que dejan de cantar, grillos que arrancan. Más evidente al aire libre, lejos del ruido del tráfico.',
      },
      'diamond-ring': {
        title: 'Anillo de diamante',
        body: 'Un punto de luz cegador sobre un anillo fino, justo antes y justo después de la totalidad. Es el momento más fotografiado de todo el fenómeno.',
      },
      'baily-beads': {
        title: 'Perlas de Baily',
        body: 'La luz restante rota en perlas por los valles lunares. Duran pocos segundos y anuncian el inicio de la totalidad.',
      },
      corona: {
        title: 'La corona solar',
        body: 'La atmósfera exterior del Sol, a un millón de grados, visible solo ahora. Filamentos perlados que se extienden varios radios solares.',
      },
      chromosphere: {
        title: 'Cromosfera',
        body: 'Un anillo rojo intenso en el borde del disco negro, visible unos segundos al principio y al final de la totalidad.',
      },
      prominences: {
        title: 'Protuberancias',
        body: 'Llamaradas de gas rosa ancladas al borde solar, muchas veces más altas que la Tierra. Con el Sol tan bajo destacan muy bien.',
      },
      'horizon-360': {
        title: 'Atardecer de 360°',
        body: 'Estás dentro de un cono de sombra de pocas decenas de km: en todas direcciones, más allá del borde, todavía es de día. El horizonte se enciende de naranja alrededor.',
      },
    },
  },

  sky: {
    title: 'El cielo durante la totalidad',
    subtitle:
      'Con el Sol cubierto el cielo baja a un brillo de crepúsculo y aparecen planetas y estrellas brillantes. Posiciones calculadas para el máximo, las {time}.',
    mapTitle: 'Cielo al Oeste en el máximo',
    mapHint: 'Vista hacia el Oeste, desde el horizonte hasta 45° de altura.',
    eclipsedSun: 'Sol eclipsado',
    onlyNow: 'Solo ahora',
    onlyNowExplain:
      'Normalmente perdido en el resplandor del Sol: la totalidad es la única ocasión del año para verlo.',
    magnitude: 'magnitud',
    fromSun: 'del Sol',
    altitudeShort: 'alt',
    behindYou: 'A tu espalda y en lo alto',
    behindYouHint:
      'Si te sobra tiempo tras mirar la corona: ya están sobre el horizonte, pero te obligan a darte la vuelta.',
    planets: 'Planetas',
    objects: {
      venus: { name: 'Venus', note: 'El más fácil con diferencia: alto al Suroeste y muy brillante. Lo verás incluso antes de la totalidad.' },
      jupiter: { name: 'Júpiter', note: 'Muy cerca del Sol eclipsado. Invisible cualquier otra noche de agosto.' },
      mercury: { name: 'Mercurio', note: 'Bajo, apenas sobre el horizonte a la derecha del Sol. Necesita un horizonte marino perfectamente limpio.' },
      arcturus: { name: 'Arturo', note: 'La estrella más brillante del cielo en ese momento, casi en el cenit hacia el Suroeste.' },
      vega: { name: 'Vega', note: 'Alta al Este, vértice del Triángulo de Verano. Tienes que darte la vuelta del todo.' },
      altair: { name: 'Altair', note: 'Al Este, tercer vértice del Triángulo de Verano.' },
      spica: { name: 'Spica', note: 'Al Suroeste, bajo Arturo: la estrella principal de Virgo.' },
      antares: { name: 'Antares', note: 'Rojiza, baja al Sur: el corazón de Escorpio.' },
      deneb: { name: 'Deneb', note: 'Al Noreste, en el Cisne: el vértice más lejano del Triángulo de Verano.' },
      regulus: { name: 'Régulo', note: 'Muy cerca del Sol: en agosto el Sol atraviesa Leo, así que normalmente es invisible.' },
    },
  },

  night: {
    title: 'La noche del 12 de agosto',
    subtitle:
      'El eclipse acaba 19 minutos antes del atardecer. Pero la noche no ha terminado: esa misma noche es el pico de las Perseidas, y sin Luna.',
    twilightTitle: 'Cómo se hace de noche',
    twilight: {
      sunset: 'Puesta de Sol',
      civilEnd: 'Fin del crepúsculo civil',
      nauticalEnd: 'Fin del crepúsculo náutico',
      astronomicalEnd: 'Oscuridad astronómica',
    },
    twilightNote:
      'Desde las {time} el cielo está completamente oscuro: a partir de ahí las condiciones son las mejores posibles.',
    neverFullyDark:
      'A esta latitud y en esta época del año el cielo nunca queda completamente oscuro: queda un resplandor bajo hacia el Norte toda la noche.',
    perseidsTitle: 'Perseidas en el pico, sin Luna',
    perseidsBody:
      'Un eclipse de Sol ocurre por definición con Luna nueva. Eso significa que la noche del pico de las Perseidas no tiene ni un hilo de luz lunar: es la mejor combinación posible.',
    zhrLabel: 'Meteoros/hora teóricos',
    zhrNote:
      'Valor ideal con cielo perfecto y radiante en el cenit. En la práctica, desde un sitio oscuro, espera varias decenas por hora en las mejores horas.',
    moonLabel: 'Iluminación lunar',
    radiantTitle: 'Altura del radiante',
    radiantNote:
      'El radiante está en Perseo, al Noreste, y desde {city} no se pone nunca. Cuanto más sube, más meteoros ves: las mejores horas son después de la una.',
    bestWindow: 'Mejores horas',
    bestWindowValue: 'de la 01:00 al amanecer',
    tipsTitle: 'Para las Perseidas',
    tips: [
      'No hacen falta gafas ni instrumentos: los meteoros se miran a simple vista, tumbado.',
      'Mira hacia arriba, no hacia el radiante: las estelas más largas aparecen lejos de Perseo.',
      'Hacen falta 20 minutos a oscuras para que el ojo se adapte. El móvil borra esa adaptación cada vez que lo enciendes.',
      'El mismo punto elegido para el eclipse también sirve para las Perseidas, siempre que esté lejos de las luces de la ciudad.',
    ],
  },

  footer: {
    offline: 'Funciona sin conexión: los datos del eclipse están guardados en la app.',
    disclaimer: 'Horas calculadas para {city} ({lat}, {lng}). Comprueba siempre las condiciones reales en el sitio.',
    timezoneWarning:
      'El teléfono no está en la hora de {city}: todas las horas mostradas son las locales de la ciudad seleccionada.',
    sources:
      'Horas, posición del Sol, planetas y crepúsculo calculados y verificados para cada ciudad con los scripts en scripts/verify-*.mjs.',
  },

  cityPicker: {
    title: 'Elige una ciudad',
    subtitle:
      'Solo ciudades donde el eclipse del 12 de agosto es realmente visible: en el resto no hay nada que ver ese día.',
    totalGroup: 'Eclipse total',
    partialGroup: 'Eclipse parcial',
    scopeNote:
      'La mayoría de las grandes ciudades del mundo no ven nada el 12 de agosto de 2026: el eclipse solo es visible a lo largo de una franja estrecha entre el Ártico, Groenlandia, Islandia y Europa. Por eso la lista se limita a estas 16 ciudades.',
  },

  eclipseTitle: {
    total: 'Eclipse total de Sol',
    partial: 'Eclipse parcial de Sol',
  },

  partialNotice: {
    eyebrow: 'No aplicable aquí',
    totality: {
      title: 'Aquí no hay totalidad',
      body: 'La secuencia de los 76 segundos y fenómenos como la corona, el anillo de diamante y la cromosfera solo existen cuando el Sol está completamente cubierto. Desde {city} el eclipse sigue siendo parcial, con una cobertura máxima del {magnitude}%: el Sol nunca quedará totalmente cubierto, así que no hay una secuencia que seguir. Mantén las gafas puestas todo el tiempo.',
    },
    sky: {
      title: 'El cielo no se oscurece lo suficiente',
      body: 'Planetas y estrellas solo se vuelven visibles cuando el disco solar está completamente cubierto y el cielo baja a un brillo de crepúsculo. Desde {city}, donde el eclipse sigue siendo parcial (máximo {magnitude}% de cobertura), el cielo queda demasiado claro para que esto ocurra.',
    },
  },

  cities: {
    'a-coruna': { name: 'A Coruña', country: 'España' },
    reykjavik: { name: 'Reikiavik', country: 'Islandia' },
    valencia: { name: 'Valencia', country: 'España' },
    zaragoza: { name: 'Zaragoza', country: 'España' },
    bilbao: { name: 'Bilbao', country: 'España' },
    palma: { name: 'Palma de Mallorca', country: 'España' },
    madrid: { name: 'Madrid', country: 'España' },
    lisbon: { name: 'Lisboa', country: 'Portugal' },
    dublin: { name: 'Dublín', country: 'Irlanda' },
    paris: { name: 'París', country: 'Francia' },
    london: { name: 'Londres', country: 'Reino Unido' },
    brussels: { name: 'Bruselas', country: 'Bélgica' },
    amsterdam: { name: 'Ámsterdam', country: 'Países Bajos' },
    berlin: { name: 'Berlín', country: 'Alemania' },
    stockholm: { name: 'Estocolmo', country: 'Suecia' },
    rome: { name: 'Roma', country: 'Italia' },
  },
};

const en: Dict = {
  liveClock: 'Local time',
  langLabel: 'Language',

  stage: {
    before: 'Before the eclipse',
    'partial-rising': 'Partial phase',
    totality: 'Totality',
    'partial-falling': 'Final partial phase',
    after: 'Eclipse over',
  },

  status: {
    before: 'Get ready. Pick a spot with a completely open view to the West.',
    'partial-rising': 'The eclipse has begun. Look West using only certified eclipse glasses.',
    totality: 'TOTALITY. The Sun is completely covered. You can remove your glasses only during this phase.',
    'partial-falling': 'Put your certified glasses back on now: the Sun is visible again.',
    after: 'The eclipse is over.',
    partialFallingOnly: 'The eclipse has passed its maximum and is now waning. Keep your glasses on throughout.',
    neverTotalReminder:
      'In this city the eclipse stays partial: the Sun will never be fully covered, so glasses stay mandatory for the whole event.',
  },

  countdown: {
    to: 'Time to',
    glassesBackOn: 'Glasses back on in',
    done: 'All phases are over',
    days: 'd',
    hours: 'h',
    minutes: 'min',
    seconds: 's',
  },

  phases: {
    'partial-start': 'Eclipse begins',
    'totality-start': 'Totality begins',
    maximum: 'Maximum',
    'totality-end': 'Totality ends',
    'partial-end': 'Eclipse ends',
  },

  compass: {
    title: 'Where to look right now',
    lookToward: 'Look toward the',
    west: 'West',
    azimuth: 'azimuth',
    live: 'Real-time Sun position',
    atMaximum: 'At eclipse maximum',
    enable: 'Enable the compass',
    enableHint: 'Needs permission to use the orientation sensors.',
    unavailable: 'Compass unavailable: the rose is shown with North up.',
    yourHeading: 'Your phone is pointing',
    turnRight: 'Turn right',
    turnLeft: 'Turn left',
    onTarget: 'You are aligned with the Sun',
    magneticNote: 'Your phone’s compass can be off by a few degrees.',
  },

  horizon: {
    title: 'Sun altitude',
    aboveHorizon: 'above the horizon',
    fists: 'about {n} fists at arm’s length',
    belowHorizon: 'The Sun is below the horizon',
    warning:
      'The Sun will be very low: you need a completely open horizon to the West, with no buildings, trees or hills.',
    atMax: 'At maximum: {alt}° altitude, azimuth {az}°',
  },

  timeline: {
    title: 'Eclipse phases',
    subtitle: 'Local times for {city} ({timezone})',
    totalityDuration: 'Totality lasts: {n} seconds',
    maxCoverage: 'Maximum Sun coverage: {n}%',
    next: 'next',
  },

  safety: {
    title: 'Eye safety',
    rules: [
      'During the partial phases use only ISO 12312-2 certified eclipse glasses.',
      'Do not use sunglasses, improvised filters, X-ray film or smoked glass.',
      'You can remove your glasses only during totality, when the solar disk is completely covered.',
      'Put them back on before totality ends.',
    ],
    bannerRequired: 'ISO 12312-2 glasses required now',
    bannerOff: 'You can remove your glasses — only for {n} s',
    bannerBackOn: 'Glasses now: the Sun is back',
    bannerNone: 'Never with the naked eye, without certified glasses',
  },

  spots: {
    title: 'Where to go',
    subtitle:
      'Suggested spots in A Coruña. No list can guarantee visibility: checking on site is always necessary.',
    cta: 'Open directions',
    warning: 'Always check that the horizon to the West is clear.',
    kinds: {
      coast: 'Coast',
      viewpoint: 'Viewpoint',
      beach: 'Urban beach',
      promenade: 'Seafront promenade',
    },
    horizonLabel: 'Western horizon',
    horizon: {
      open: 'Open sea',
      partial: 'Partially blocked',
      limited: 'Limited',
    },
    reasons: {
      oPortino:
        'A direct Atlantic frontage: to the West there is only open sea, the best condition with the Sun at 12°.',
      monteSanPedro:
        'The elevation raises the apparent horizon line and lowers the risk of obstacles in front of the low Sun.',
      riazor:
        'A large, easy-to-reach urban beach: wide open sky, but check the headland on the western side.',
      orzan:
        'Right in the centre and well served: a handy fallback, with an open view to the Northwest.',
      oParrote:
        'A very accessible seafront walk: fine if you can’t travel further, but the city gets in the way to the West.',
    },
    fallbackTitle: 'If your spot is blocked',
    fallbackSteps: [
      'The Sun will be very low: a 20 m building can hide it up to roughly a hundred metres away.',
      'Move to an open space or gain some height: a park, a rooftop, a hill.',
      'Check the horizon an hour ahead, while the Sun is still higher: if you lose sight of it, move now.',
      'A plain but open spot beats a scenic one with an obstacle in front.',
    ],
    distance: '~{n} km from the centre',

    genericTitle: 'Where to look',
    genericSubtitle: 'Direction to look for: {dir}, azimuth {az}°',
    genericBody:
      'We don’t have verified spots for this city, so we’re not making any up. Look for a place with an open view in the direction shown: a park, an accessible rooftop, an embankment, a hill. What matters is no buildings or trees along the line of sight.',
    searchViewpoint: 'viewpoint',
    searchViewpointCta: 'Search for viewpoints',
    searchOpenSpace: 'park',
    searchOpenSpaceCta: 'Search for parks and open spaces',
  },

  weather: {
    title: 'Weather and cloud cover',
    mock: 'Simulated data',
    mockNote: 'Example values: this section is ready to be connected to a weather API.',
    cloudCover: 'Cloud cover',
    lowClouds: 'Low clouds',
    lowCloudsNote: 'Low clouds matter most with the Sun close to the horizon.',
    visibility: 'Visibility',
    wind: 'Wind',
    temperature: 'Temperature',
    hourly: 'Hourly cloud cover',
    observedAt: 'Updated at',
    verdict: {
      good: 'Favourable conditions',
      mixed: 'Uncertain conditions',
      poor: 'Difficult conditions',
    },
  },

  tabs: {
    now: 'Now',
    totality: 'Totality',
    sky: 'Sky',
    places: 'Places',
  },

  dial: {
    covered: 'Covered',
  },

  script: {
    title: 'The 76 seconds',
    subtitle:
      'Totality lasts a little over a minute. This is the order to look at things in, so you don’t reach the end without having seen anything.',
    liveNow: 'Now',
    glassesOn: 'Glasses on',
    glassesOff: 'Glasses off',
    priorityLabel: 'Don’t miss this',
    tip: 'Tip: don’t take photos. With 76 seconds, a phone will cost you the one thing that matters.',
    steps: {
      approach: {
        title: 'The shadow closing in',
        body: 'Look West: the Moon’s shadow cone is racing toward you across the landscape at thousands of km/h. With an open horizon, try to catch it a few seconds before it reaches you.',
      },
      'shadow-bands': {
        title: 'Shadow bands on the ground',
        body: 'Lay a sheet or a white cloth on the ground. In the seconds before and after totality, rippling waves of light and shadow can appear, like reflections on a pool floor.',
      },
      beads: {
        title: 'Baily’s beads',
        body: 'The crescent breaks into points of light: sunlight filtering through the Moon’s mountains. Glasses still on.',
      },
      'diamond-in': {
        title: 'Diamond ring',
        body: 'A single blazing point remains on a thin ring. Keep your glasses on until it disappears completely.',
      },
      'glasses-off': {
        title: 'Remove your glasses now',
        body: 'The disk is covered. You can look with the naked eye: the only moment it’s safe, and the only one where you’ll see anything.',
      },
      corona: {
        title: 'The corona',
        body: 'Don’t do anything else. Just look. The corona is a pearly halo with filaments stretching into space: no photo does it justice.',
      },
      prominences: {
        title: 'Prominences and chromosphere',
        body: 'On the edge of the black disk, look for pink flares and a thin reddish ring: jets of gas tens of thousands of kilometres high.',
      },
      'look-around': {
        title: 'Look away from the Sun',
        body: 'Turn around: the whole 360° horizon has sunset colours, because you’re looking at daylight beyond the edge of the shadow. Listen: birds often go quiet.',
      },
      planets: {
        title: 'Planets and stars',
        body: 'Venus is high in the Southwest, very bright — the easiest one to spot. Other planets can appear very close to the eclipsed Sun: check the Sky tab for exactly what to expect from here.',
      },
      'corona-again': {
        title: 'One last look at the corona',
        body: 'Go back to the Sun and study the corona’s shape: it changes with every eclipse, and you’ll never see this exact one again.',
      },
      'glasses-on': {
        title: 'Glasses back on',
        body: 'Don’t wait to see the light return. Put them on now, before the Sun’s edge reappears.',
      },
      'diamond-out': {
        title: 'Second diamond ring',
        body: 'Light bursts out from the opposite side. With your glasses on, you can watch it: this is totality closing out.',
      },
    },
  },

  phenomena: {
    title: 'What to look for',
    subtitle:
      'Every phenomenon lasts a few seconds and is only recognisable if you already know what it is. Read this beforehand, so you don’t have to think during it.',
    difficulty: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    direction: {
      sun: 'Toward the Sun',
      horizon: 'On the horizon',
      ground: 'On the ground',
      around: 'All around',
      self: 'On yourself',
    },
    nakedEye: 'Naked eye',
    withGlasses: 'With glasses',
    items: {
      'umbra-approach': {
        title: 'The approaching shadow',
        body: 'A dark wall advancing at thousands of km/h. From a viewpoint or near the sea, you can watch it arrive a few seconds before it reaches you.',
      },
      'shadow-bands': {
        title: 'Shadow bands',
        body: 'Faint light and dark ripples running across pale surfaces. They’re atmospheric turbulence lit by an extremely thin crescent Sun. Rare and elusive.',
      },
      temperature: {
        title: 'Temperature drop',
        body: 'In the hour around totality, temperature can drop several degrees and the wind can shift. Bring something to put on.',
      },
      wildlife: {
        title: 'Animal reactions',
        body: 'Gulls heading back, birds falling silent, crickets starting up. Most noticeable outdoors, away from traffic noise.',
      },
      'diamond-ring': {
        title: 'Diamond ring',
        body: 'A blinding point of light on a thin ring, a moment before and a moment after totality. The most photographed instant of the whole event.',
      },
      'baily-beads': {
        title: 'Baily’s beads',
        body: 'The last light broken into beads by lunar valleys. They last a few seconds and announce the start of totality.',
      },
      corona: {
        title: 'The solar corona',
        body: 'The Sun’s outer atmosphere, a million degrees, visible only now. Pearly filaments extending several solar radii.',
      },
      chromosphere: {
        title: 'Chromosphere',
        body: 'A vivid red ring on the edge of the black disk, visible for a few seconds at the start and end of totality.',
      },
      prominences: {
        title: 'Prominences',
        body: 'Pink flares of gas anchored to the solar edge, many times taller than Earth. With the Sun this low, they stand out clearly.',
      },
      'horizon-360': {
        title: '360° sunset',
        body: 'You’re inside a shadow cone only a few dozen km wide: in every direction, beyond its edge, it’s still daytime. The horizon glows orange all around.',
      },
    },
  },

  sky: {
    title: 'The sky during totality',
    subtitle:
      'With the Sun covered, the sky drops to twilight brightness and bright planets and stars appear. Positions computed for maximum, at {time}.',
    mapTitle: 'Western sky at maximum',
    mapHint: 'View toward the West, from the horizon up to 45° altitude.',
    eclipsedSun: 'Eclipsed Sun',
    onlyNow: 'Only now',
    onlyNowExplain:
      'Normally lost in the Sun’s glare: totality is the only chance all year to see it.',
    magnitude: 'magnitude',
    fromSun: 'from the Sun',
    altitudeShort: 'alt',
    behindYou: 'Behind you and overhead',
    behindYouHint:
      'If you have time left after looking at the corona: these are already above the horizon, but you’ll have to turn around.',
    planets: 'Planets',
    objects: {
      venus: { name: 'Venus', note: 'By far the easiest: high in the Southwest and very bright. You’ll see it even before totality.' },
      jupiter: { name: 'Jupiter', note: 'Right next to the eclipsed Sun. Invisible on any other August evening.' },
      mercury: { name: 'Mercury', note: 'Low, just above the horizon to the Sun’s right. Needs a perfectly clear sea horizon.' },
      arcturus: { name: 'Arcturus', note: 'The brightest star in the sky at that moment, almost overhead toward the Southwest.' },
      vega: { name: 'Vega', note: 'High in the East, a vertex of the Summer Triangle. You’ll need to turn all the way around.' },
      altair: { name: 'Altair', note: 'In the East, the third vertex of the Summer Triangle.' },
      spica: { name: 'Spica', note: 'Southwest, below Arcturus: the main star of Virgo.' },
      antares: { name: 'Antares', note: 'Reddish, low in the South: the heart of Scorpius.' },
      deneb: { name: 'Deneb', note: 'Northeast, in Cygnus: the farthest vertex of the Summer Triangle.' },
      regulus: { name: 'Regulus', note: 'Very close to the Sun: in August the Sun crosses Leo, so it’s normally invisible.' },
    },
  },

  night: {
    title: 'The night of 12 August',
    subtitle:
      'The eclipse ends 19 minutes before sunset. But the evening isn’t over: that same night is the Perseid peak, with no Moon at all.',
    twilightTitle: 'How the sky goes dark',
    twilight: {
      sunset: 'Sunset',
      civilEnd: 'End of civil twilight',
      nauticalEnd: 'End of nautical twilight',
      astronomicalEnd: 'Astronomical darkness',
    },
    twilightNote: 'From {time} the sky is fully dark: from then on, conditions are as good as they get.',
    neverFullyDark:
      'At this latitude and time of year the sky never gets fully dark: a low glow stays on the northern horizon all night.',
    perseidsTitle: 'Perseids at their peak, with no Moon',
    perseidsBody:
      'A solar eclipse happens, by definition, at new Moon. That means the night of the Perseid peak doesn’t have a single sliver of moonlight: it’s the best combination you can get.',
    zhrLabel: 'Theoretical meteors/hour',
    zhrNote:
      'The ideal figure, under a perfect sky with the radiant overhead. In practice, from a dark site, expect several dozen an hour in the best hours.',
    moonLabel: 'Moon illumination',
    radiantTitle: 'Radiant altitude',
    radiantNote:
      'The radiant sits in Perseus, to the Northeast, and never sets from {city}. The higher it climbs, the more meteors you’ll see: the best hours are after 1am.',
    bestWindow: 'Best hours',
    bestWindowValue: '1am to dawn',
    tipsTitle: 'For the Perseids',
    tips: [
      'No glasses or equipment needed: meteors are watched with the naked eye, lying down.',
      'Look up, not at the radiant: the longest trails appear far from Perseus.',
      'It takes 20 minutes in full darkness for your eyes to adapt. Your phone resets that adaptation every time you switch it on.',
      'The same spot you picked for the eclipse works fine for the Perseids too, as long as it’s away from city lights.',
    ],
  },

  footer: {
    offline: 'Works offline: the eclipse data is stored in the app.',
    disclaimer: 'Times calculated for {city} ({lat}, {lng}). Always check real conditions on site.',
    timezoneWarning:
      'Your phone isn’t set to {city}’s time zone: every time shown is still local to the selected city.',
    sources:
      'Times, Sun position, planets and twilight are computed and cross-checked for every city with the scripts in scripts/verify-*.mjs.',
  },

  cityPicker: {
    title: 'Choose a city',
    subtitle: 'Only cities where the 12 August eclipse is actually visible — everywhere else, there’s nothing to see that day.',
    totalGroup: 'Total eclipse',
    partialGroup: 'Partial eclipse',
    scopeNote:
      'Most major cities in the world see nothing at all on 12 August 2026: the eclipse is visible only along a narrow band between the Arctic, Greenland, Iceland and Europe. That’s why this list is limited to these 16 cities.',
  },

  eclipseTitle: {
    total: 'Total solar eclipse',
    partial: 'Partial solar eclipse',
  },

  partialNotice: {
    eyebrow: 'Not applicable here',
    totality: {
      title: 'There’s no totality here',
      body: 'The 76-second sequence and phenomena like the corona, the diamond ring and the chromosphere only exist when the Sun is completely covered. From {city} the eclipse stays partial, with a maximum coverage of {magnitude}%: the Sun will never be fully covered, so there’s no sequence to follow. Keep your glasses on for the whole event.',
    },
    sky: {
      title: 'The sky doesn’t get dark enough',
      body: 'Planets and stars only become visible once the solar disk is fully covered and the sky drops to twilight brightness. From {city}, where the eclipse stays partial (maximum {magnitude}% coverage), the sky stays too bright for that to happen.',
    },
  },

  cities: {
    'a-coruna': { name: 'A Coruña', country: 'Spain' },
    reykjavik: { name: 'Reykjavik', country: 'Iceland' },
    valencia: { name: 'Valencia', country: 'Spain' },
    zaragoza: { name: 'Zaragoza', country: 'Spain' },
    bilbao: { name: 'Bilbao', country: 'Spain' },
    palma: { name: 'Palma de Mallorca', country: 'Spain' },
    madrid: { name: 'Madrid', country: 'Spain' },
    lisbon: { name: 'Lisbon', country: 'Portugal' },
    dublin: { name: 'Dublin', country: 'Ireland' },
    paris: { name: 'Paris', country: 'France' },
    london: { name: 'London', country: 'United Kingdom' },
    brussels: { name: 'Brussels', country: 'Belgium' },
    amsterdam: { name: 'Amsterdam', country: 'Netherlands' },
    berlin: { name: 'Berlin', country: 'Germany' },
    stockholm: { name: 'Stockholm', country: 'Sweden' },
    rome: { name: 'Rome', country: 'Italy' },
  },
};

export const dictionaries: Record<Lang, Dict> = { it, es, en };

export type Copy = Dict;

/** Replace {placeholders} in a string. */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));

/**
 * Localized name/country for a city id. `City.id` is a plain string (the
 * cities array isn't a discriminated union), so this centralises the one
 * cast the whole app needs instead of repeating it at every call site.
 */
export const cityLabel = (t: Copy, id: string) =>
  (t.cities as Record<string, { name: string; country: string }>)[id];
