/**
 * Minimal two-language dictionary (no i18n library).
 * Italian is the default UI language; Spanish is available because the app is
 * meant to be used on the ground in A Coruña.
 */

export type Lang = 'it' | 'es';

export const LANGS: Lang[] = ['it', 'es'];

const it = {
  appName: 'Coruña Eclipse Navigator',
  tagline: 'Eclissi totale di Sole · 12 agosto 2026',
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
  },

  countdown: {
    nextLabel: 'Prossima fase',
    to: 'Mancano a',
    totalityLeft: 'Totalità: tempo rimasto',
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
    calibrate: 'Muovi il telefono a forma di 8 per calibrare.',
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
    subtitle: 'Orari locali di A Coruña (Europe/Madrid)',
    totalityDuration: 'Durata della totalità: {n} secondi',
    now: 'adesso',
    done: 'passata',
    next: 'prossima',
  },

  safety: {
    title: 'Sicurezza degli occhi',
    required: 'Occhiali da eclissi obbligatori',
    off: 'Occhiali rimovibili solo ora',
    none: 'Non guardare mai il Sole a occhio nudo',
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
    more: 'Regole complete',
    less: 'Chiudi',
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
      'Il Sole sarà a soli 12° di altezza: un edificio di 20 m copre il Sole fino a circa 95 m di distanza.',
      'Spostati verso il mare o guadagna quota: la costa a Ovest è la scelta più sicura.',
      'Controlla l’orizzonte già un’ora prima, con il Sole ancora più alto: se lo perdi di vista, cambia posto adesso.',
      'Meglio un punto banale ma libero che un punto scenografico con un ostacolo davanti.',
    ],
    distance: 'a ~{n} km dal centro',
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
    beforeStart: 'La sequenza parte all’inizio della totalità, alle 20:27:35.',
    ended: 'La totalità è finita.',
    tip: 'Consiglio: non fotografare. Con 76 secondi, un telefono ti fa perdere l’unica cosa che conta.',
    steps: {
      approach: {
        title: 'L’ombra arriva dal mare',
        body: 'Guarda verso Nord-Ovest, sull’Atlantico: il cono d’ombra della Luna corre verso di te sull’acqua. Dalla costa è uno spettacolo che chi è nell’entroterra non vede.',
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
        body: 'Venere è alto a Sud-Ovest, molto luminoso. Giove e Mercurio sono a pochi gradi dal Sole eclissato: in nessun’altra sera dell’anno riusciresti a vederli.',
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
    difficultyLabel: 'Difficoltà',
    difficulty: { easy: 'Facile', medium: 'Media', hard: 'Difficile' },
    directionLabel: 'Dove guardare',
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
        body: 'Una parete scura che avanza sul mare da Nord-Ovest a migliaia di km/h. Ad A Coruña arriva dall’Atlantico: è il vantaggio di stare sulla costa.',
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
        body: 'Gabbiani che rientrano, uccelli che smettono di cantare, grilli che partono. Sulla costa di A Coruña è particolarmente evidente.',
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
      'Con il Sole coperto il cielo scende a una luminosità da crepuscolo e compaiono pianeti e stelle luminose. Posizioni calcolate per il massimo, le 20:28:13.',
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
    stars: 'Stelle luminose',
    objects: {
      venus: { name: 'Venere', note: 'Il più facile in assoluto: alto a Sud-Ovest e molto brillante. Lo vedrai anche prima della totalità.' },
      jupiter: { name: 'Giove', note: 'A soli 10° dal Sole eclissato, poco sotto a destra. Invisibile in qualsiasi altra sera di agosto.' },
      mercury: { name: 'Mercurio', note: 'Basso, appena sopra l’orizzonte a destra del Sole. Serve un orizzonte marino perfettamente pulito.' },
      arcturus: { name: 'Arturo', note: 'La stella più luminosa del cielo in quel momento, quasi allo zenit verso Sud-Ovest.' },
      vega: { name: 'Vega', note: 'Alta a Est, vertice del Triangolo Estivo. Ti devi girare completamente.' },
      altair: { name: 'Altair', note: 'A Est, terzo vertice del Triangolo Estivo.' },
      spica: { name: 'Spica', note: 'A Sud-Ovest, sotto Arturo: la stella principale della Vergine.' },
      antares: { name: 'Antares', note: 'Rossastra, bassa a Sud: il cuore dello Scorpione.' },
      deneb: { name: 'Deneb', note: 'A Nord-Est, nel Cigno: il vertice più lontano del Triangolo Estivo.' },
      regulus: { name: 'Regolo', note: 'A 10° dal Sole, appena sopra: in agosto il Sole attraversa il Leone, quindi normalmente è invisibile.' },
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
      'Dalle 23:32 il cielo è completamente buio: da quel momento in poi le condizioni sono le migliori possibili.',
    perseidsTitle: 'Perseidi al picco, senza Luna',
    perseidsBody:
      'Un’eclissi di Sole avviene per definizione con la Luna nuova. Significa che la notte del picco delle Perseidi non ha nemmeno un filo di luce lunare: è la combinazione migliore che si possa avere.',
    zhrLabel: 'Meteore/ora teoriche',
    zhrNote:
      'Valore ideale con cielo perfetto e radiante allo zenit. In pratica, da un punto buio, aspettati parecchie decine all’ora nelle ore migliori.',
    moonLabel: 'Illuminazione lunare',
    radiantTitle: 'Altezza del radiante',
    radiantNote:
      'Il radiante è in Perseo, a Nord-Est, e da A Coruña non tramonta mai. Più sale, più meteore vedi: le ore migliori sono dopo l’una.',
    bestWindow: 'Ore migliori',
    bestWindowValue: 'dall’01:00 all’alba',
    tipsTitle: 'Per le Perseidi',
    tips: [
      'Non servono occhiali né strumenti: le meteore si guardano a occhio nudo, sdraiati.',
      'Guarda in alto, non verso il radiante: le scie più lunghe compaiono lontano da Perseo.',
      'Servono 20 minuti al buio completo perché l’occhio si adatti. Il telefono azzera l’adattamento ogni volta che lo accendi.',
      'Gli stessi punti costieri dell’eclissi vanno bene, purché lontani dalle luci della città.',
    ],
  },

  footer: {
    offline: 'Funziona offline: i dati dell’eclissi sono salvati nell’app.',
    disclaimer:
      'Orari calcolati per A Coruña (43.3623, −8.4115). Verifica sempre le condizioni reali sul posto.',
    timezoneWarning:
      'Il telefono non è sull’orario di Madrid: tutti gli orari mostrati sono comunque quelli locali di A Coruña.',
    sources:
      'Posizioni di pianeti e stelle calcolate per il massimo dell’eclissi da A Coruña. Rigenerabili con "npm run verify:sky".',
  },
};

type Dict = typeof it;

const es: Dict = {
  appName: 'Coruña Eclipse Navigator',
  tagline: 'Eclipse total de Sol · 12 de agosto de 2026',
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
  },

  countdown: {
    nextLabel: 'Próxima fase',
    to: 'Faltan para',
    totalityLeft: 'Totalidad: tiempo restante',
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
    calibrate: 'Mueve el teléfono en forma de 8 para calibrar.',
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
    subtitle: 'Horas locales de A Coruña (Europe/Madrid)',
    totalityDuration: 'Duración de la totalidad: {n} segundos',
    now: 'ahora',
    done: 'pasada',
    next: 'siguiente',
  },

  safety: {
    title: 'Seguridad ocular',
    required: 'Gafas de eclipse obligatorias',
    off: 'Gafas retirables solo ahora',
    none: 'Nunca mires al Sol sin protección',
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
    more: 'Reglas completas',
    less: 'Cerrar',
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
      'El Sol estará a solo 12° de altura: un edificio de 20 m lo tapa hasta unos 95 m de distancia.',
      'Muévete hacia el mar o gana altura: la costa oeste es la opción más segura.',
      'Comprueba el horizonte una hora antes, con el Sol más alto: si lo pierdes de vista, cambia de sitio ya.',
      'Mejor un punto anodino pero despejado que uno espectacular con un obstáculo delante.',
    ],
    distance: 'a ~{n} km del centro',
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
    beforeStart: 'La secuencia empieza al inicio de la totalidad, a las 20:27:35.',
    ended: 'La totalidad ha terminado.',
    tip: 'Consejo: no hagas fotos. Con 76 segundos, el móvil te hace perder lo único que importa.',
    steps: {
      approach: {
        title: 'La sombra llega desde el mar',
        body: 'Mira hacia el Noroeste, sobre el Atlántico: el cono de sombra de la Luna corre hacia ti sobre el agua. Desde la costa es un espectáculo que no se ve tierra adentro.',
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
        body: 'Venus está alto al Suroeste, muy brillante. Júpiter y Mercurio están a pocos grados del Sol eclipsado: ninguna otra noche del año podrías verlos.',
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
    difficultyLabel: 'Dificultad',
    difficulty: { easy: 'Fácil', medium: 'Media', hard: 'Difícil' },
    directionLabel: 'Dónde mirar',
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
        body: 'Un muro oscuro que avanza sobre el mar desde el Noroeste a miles de km/h. A A Coruña llega desde el Atlántico: esa es la ventaja de estar en la costa.',
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
        body: 'Gaviotas que se retiran, pájaros que dejan de cantar, grillos que arrancan. En la costa de A Coruña se nota especialmente.',
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
      'Con el Sol cubierto el cielo baja a un brillo de crepúsculo y aparecen planetas y estrellas brillantes. Posiciones calculadas para el máximo, las 20:28:13.',
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
    stars: 'Estrellas brillantes',
    objects: {
      venus: { name: 'Venus', note: 'El más fácil con diferencia: alto al Suroeste y muy brillante. Lo verás incluso antes de la totalidad.' },
      jupiter: { name: 'Júpiter', note: 'A solo 10° del Sol eclipsado, algo por debajo y a la derecha. Invisible cualquier otra noche de agosto.' },
      mercury: { name: 'Mercurio', note: 'Bajo, apenas sobre el horizonte a la derecha del Sol. Necesita un horizonte marino perfectamente limpio.' },
      arcturus: { name: 'Arturo', note: 'La estrella más brillante del cielo en ese momento, casi en el cenit hacia el Suroeste.' },
      vega: { name: 'Vega', note: 'Alta al Este, vértice del Triángulo de Verano. Tienes que darte la vuelta del todo.' },
      altair: { name: 'Altair', note: 'Al Este, tercer vértice del Triángulo de Verano.' },
      spica: { name: 'Spica', note: 'Al Suroeste, bajo Arturo: la estrella principal de Virgo.' },
      antares: { name: 'Antares', note: 'Rojiza, baja al Sur: el corazón de Escorpio.' },
      deneb: { name: 'Deneb', note: 'Al Noreste, en el Cisne: el vértice más lejano del Triángulo de Verano.' },
      regulus: { name: 'Régulo', note: 'A 10° del Sol, justo encima: en agosto el Sol atraviesa Leo, así que normalmente es invisible.' },
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
      'Desde las 23:32 el cielo está completamente oscuro: a partir de ahí las condiciones son las mejores posibles.',
    perseidsTitle: 'Perseidas en el pico, sin Luna',
    perseidsBody:
      'Un eclipse de Sol ocurre por definición con Luna nueva. Eso significa que la noche del pico de las Perseidas no tiene ni un hilo de luz lunar: es la mejor combinación posible.',
    zhrLabel: 'Meteoros/hora teóricos',
    zhrNote:
      'Valor ideal con cielo perfecto y radiante en el cenit. En la práctica, desde un sitio oscuro, espera varias decenas por hora en las mejores horas.',
    moonLabel: 'Iluminación lunar',
    radiantTitle: 'Altura del radiante',
    radiantNote:
      'El radiante está en Perseo, al Noreste, y desde A Coruña no se pone nunca. Cuanto más sube, más meteoros ves: las mejores horas son después de la una.',
    bestWindow: 'Mejores horas',
    bestWindowValue: 'de la 01:00 al amanecer',
    tipsTitle: 'Para las Perseidas',
    tips: [
      'No hacen falta gafas ni instrumentos: los meteoros se miran a simple vista, tumbado.',
      'Mira hacia arriba, no hacia el radiante: las estelas más largas aparecen lejos de Perseo.',
      'Hacen falta 20 minutos a oscuras para que el ojo se adapte. El móvil borra esa adaptación cada vez que lo enciendes.',
      'Los mismos puntos costeros del eclipse sirven, siempre que estén lejos de las luces de la ciudad.',
    ],
  },

  footer: {
    offline: 'Funciona sin conexión: los datos del eclipse están guardados en la app.',
    disclaimer:
      'Horas calculadas para A Coruña (43.3623, −8.4115). Comprueba siempre las condiciones reales en el sitio.',
    timezoneWarning:
      'El teléfono no está en hora de Madrid: todas las horas mostradas son las locales de A Coruña.',
    sources:
      'Posiciones de planetas y estrellas calculadas para el máximo del eclipse desde A Coruña. Regenerables con "npm run verify:sky".',
  },
};

export const dictionaries: Record<Lang, Dict> = { it, es };

export type Copy = Dict;

/** Replace {placeholders} in a string. */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
