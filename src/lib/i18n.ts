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

  footer: {
    offline: 'Funziona offline: i dati dell’eclissi sono salvati nell’app.',
    disclaimer:
      'Orari calcolati per A Coruña (43.3623, −8.4115). Verifica sempre le condizioni reali sul posto.',
    timezoneWarning:
      'Il telefono non è sull’orario di Madrid: tutti gli orari mostrati sono comunque quelli locali di A Coruña.',
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

  footer: {
    offline: 'Funciona sin conexión: los datos del eclipse están guardados en la app.',
    disclaimer:
      'Horas calculadas para A Coruña (43.3623, −8.4115). Comprueba siempre las condiciones reales en el sitio.',
    timezoneWarning:
      'El teléfono no está en hora de Madrid: todas las horas mostradas son las locales de A Coruña.',
  },
};

export const dictionaries: Record<Lang, Dict> = { it, es };

export type Copy = Dict;

/** Replace {placeholders} in a string. */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
