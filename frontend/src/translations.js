export const translations = {
  en: {
    languageName: 'English',
    languageSelectorLabel: 'Language',
    navbar: {
      title: 'Edge City · Patagonia Experience',
      subtitle:
        'An immersive nature experience with every registration confirmed on-chain through a single wallet message.',
      connect: 'Connect wallet',
      disconnect: 'Disconnect',
      editProfile: 'Edit personal information'
    },
    hero: {
      badge: 'NEW EDITION 2025 · SAN MARTIN DE LOS ANDES',
      title: 'Edge City Patagonia Experience: live art, nature, and community with direct wallet confirmations.',
      description:
        'We design a multi-day immersion to explore the Andes, activate physical and culinary practices, and confirm each spot with a single wallet transaction that delivers your message to the host.',
      primaryLink: 'View full program',
      dataBadge: 'Live on-chain confirmations'
    },
    heroCard: {
      heading: 'What the residency activates',
      items: [
        'Curated outings to mountains, water, and rock with local guides.',
        'We are locals from San Martín de los Andes and technology fanatics.'
      ]
    },
    calendar: {
      heading: 'October & November expedition calendar',
      description: 'Preview the exact days blocked for climbing and kayak sessions during the residency.',
      legendTitle: 'Activities',
      legend: {
        climb: 'Climbing',
        kayak: 'Kayak'
      },
      months: {
        october: 'October 2024',
        november: 'November 2024'
      },
      location: 'Lago Lolog · Patagonia, Argentina',
      addToGoogle: 'Add to Google Calendar',
      events: {
        octoberClimb: {
          title: 'Rock climbing immersion',
          shortLabel: 'Climb',
          description: 'Guided multi-pitch progression on the granite walls from October 20 to 23.'
        },
        novemberKayak: {
          title: 'Kayak crossings on Lolog Lake',
          shortLabel: 'Kayak',
          description: 'Sunrise and sunset paddles across the lake from November 1 to 3.'
        },
        novemberClimb: {
          title: 'Granite summit climbing block',
          shortLabel: 'Climb',
          description: 'Advanced crack and slab clinics from November 10 to 13.'
        }
      }
    },
    warnings: {
      destination: 'Set <code>REACT_APP_DESTINATION_WALLET</code> to receive the registration transactions.',
      usdt: 'Set <code>REACT_APP_USDT_ADDRESS</code> to target the USDT token used for registrations.',
      usdc: 'Set <code>REACT_APP_USDC_ADDRESS</code> if you need to override the default USDC token address.',
      invalidDestination: 'The configured destination wallet address is invalid.',
      invalidUsdt: 'The configured USDT token address is invalid.',
      invalidUsdc: 'The configured USDC token address is invalid.'
    },
    status: {
      connectWalletToRegister: 'Connect your wallet to send the registration.',
      activityUnavailable: 'This activity is not available.',
      destinationMissing: 'Add the destination wallet to enable on-chain registration messages.',
      alreadyRegistered: 'You already registered for this activity from this device.',
      invalidParticipantCount: 'Select how many participants are joining.',
      notEnoughSpots: 'There are not enough spots remaining for that group size.',
      requestingSignature: 'Review and sign the transaction in your wallet.',
      confirmingOnChain: 'Waiting for the transaction to confirm...',
      registrationComplete: 'Registration message sent successfully!',
      registrationFailed: 'Could not send the registration. Check the console for more details.',
      processingRegistration: 'We are processing your registration.',
      insufficientBalance: 'Your USDT balance is not sufficient to cover this registration.',
      insufficientBalanceToken: 'Your {token} balance is not sufficient to cover this registration.',
      usdtUnavailable: 'The configured USDT token ({address}) is not deployed on {network}.',
      tokenUnavailable: 'The configured {token} token ({address}) is not deployed on {network}.',
      missingParticipantInfo: 'Complete your participant information before sending a registration.'
    },
    alerts: {
      metaMask: 'Install MetaMask to continue.',
      wrongNetwork: {
        message: 'You are not connected to the Ethereum network.',
        action: 'Switch to Ethereum'
      }
    },
    agenda: {
      detailsButton: 'View details',
      detailBackButton: 'Back to activities',
      detailHeading: 'Activity information',
      activityNotFound: 'We could not load that activity. Please return to the agenda.',
      dateLabel: 'Date',
      spotsLabel: 'Spots',
      priceLabel: 'Contribution',
      registeredBadge: 'You are registered',
      subscribeButton: 'Send registration',
      processingButton: 'Sending...',
      noSpotsButton: 'No spots available',
      inactiveBadge: 'Inactive activity',
      participantCountLabel: 'Participants',
      participantCountHelper: 'Choose how many seats to reserve.',
      transactionInfo: 'MetaMask will deliver your message on-chain to {wallet}.',
      paymentTokenLabel: 'Select the token to pay'
    },
    participantForm: {
      title: 'Complete your participant profile',
      description: 'Fill in your personal information so we can share the registration with the hosts.',
      firstNameLabel: 'First name',
      lastNameLabel: 'Last name',
      idTypeLabel: 'Identification type',
      idNumberLabel: 'Identification number',
      accommodationLabel: 'Accommodation',
      nationalityLabel: 'Nationality',
      birthDateLabel: 'Birth date',
      contactLabel: 'Contact phone',
      observationsLabel: 'Observations',
      idTypeDni: 'DNI',
      idTypePassport: 'Passport',
      idTypeOther: 'Other',
      cancelButton: 'Cancel',
      saveButton: 'Save and continue',
      requiredField: 'This field is required.'
    }
  },
  es: {
    languageName: 'Español',
    languageSelectorLabel: 'Idioma',
    navbar: {
      title: 'Edge City · Residencia Patagonia',
      subtitle:
        'Una experiencia inmersiva en la naturaleza con cada registro confirmado on-chain mediante un único mensaje desde tu wallet.',
      connect: 'Conectar wallet',
      disconnect: 'Desconectar',
      editProfile: 'Editar datos personales'
    },
    hero: {
      badge: 'Nueva edición 2025 · San Martín de los Andes',
      title: 'Residencia Edge City Patagonia: arte vivo, naturaleza y comunidad con confirmaciones directas desde tu wallet.',
      description:
        'Diseñamos una inmersión de varios días para explorar los Andes, activar prácticas físicas y culinarias, y confirmar cada cupo con una sola transacción desde tu wallet que envía tu mensaje al anfitrión.',
      primaryLink: 'Ver programa completo',
      dataBadge: 'Confirmaciones on-chain en vivo'
    },
    heroCard: {
      heading: 'Lo que activa la residencia',
      items: [
        'Salidas curadas a montaña, agua y roca con guías locales.',
        'Somos locales de San Martín de los Andes fanáticos de la tecnología.'
      ]
    },
    calendar: {
      heading: 'Calendario de expediciones octubre y noviembre',
      description: 'Visualizá los días exactos reservados para las sesiones de escalada y kayak durante la residencia.',
      legendTitle: 'Actividades',
      legend: {
        climb: 'Escalada',
        kayak: 'Kayak'
      },
      months: {
        october: 'Octubre 2024',
        november: 'Noviembre 2024'
      },
      location: 'Lago Lolog · Patagonia, Argentina',
      addToGoogle: 'Agregar a Google Calendar',
      events: {
        octoberClimb: {
          title: 'Inmersión de escalada en roca',
          shortLabel: 'Escalada',
          description: 'Progresión guiada en paredes de granito del 20 al 23 de octubre.'
        },
        novemberKayak: {
          title: 'Travesías en kayak por el lago Lolog',
          shortLabel: 'Kayak',
          description: 'Remadas al amanecer y al atardecer del 1 al 3 de noviembre.'
        },
        novemberClimb: {
          title: 'Bloque de cumbres en granito',
          shortLabel: 'Escalada',
          description: 'Clínicas avanzadas de fisura y placa del 10 al 13 de noviembre.'
        }
      }
    },
    warnings: {
      destination: 'Configurá <code>REACT_APP_DESTINATION_WALLET</code> para recibir las transacciones de registro.',
      usdt: 'Configurá <code>REACT_APP_USDT_ADDRESS</code> para apuntar al token USDT usado en los registros.',
      usdc: 'Configurá <code>REACT_APP_USDC_ADDRESS</code> si necesitás reemplazar la dirección predeterminada de USDC.',
      invalidDestination: 'La dirección configurada para la wallet de destino no es válida.',
      invalidUsdt: 'La dirección configurada para el token USDT no es válida.',
      invalidUsdc: 'La dirección configurada para el token USDC no es válida.'
    },
    status: {
      connectWalletToRegister: 'Conectá tu wallet para enviar el registro.',
      activityUnavailable: 'Esta actividad no está disponible.',
      destinationMissing: 'Agregá la wallet de destino para habilitar los mensajes on-chain.',
      alreadyRegistered: 'Ya registraste esta actividad desde este dispositivo.',
      invalidParticipantCount: 'Indicá cuántas personas participan.',
      notEnoughSpots: 'No quedan suficientes cupos para esa cantidad.',
      requestingSignature: 'Revisá y firmá la transacción en tu wallet.',
      confirmingOnChain: 'Esperando la confirmación en cadena...',
      registrationComplete: '¡Mensaje de registro enviado con éxito!',
      registrationFailed: 'No pudimos enviar el registro. Revisá la consola para más detalles.',
      processingRegistration: 'Estamos procesando tu registro.',
      insufficientBalance: 'Tu balance de USDT no es suficiente para cubrir esta inscripción.',
      insufficientBalanceToken: 'Tu balance de {token} no es suficiente para cubrir esta inscripción.',
      usdtUnavailable: 'El token de USDT configurado ({address}) no está desplegado en {network}.',
      tokenUnavailable: 'El token de {token} configurado ({address}) no está desplegado en {network}.',
      missingParticipantInfo: 'Completá tu información personal antes de enviar el registro.'
    },
    alerts: {
      metaMask: 'Instalá MetaMask para continuar.',
      wrongNetwork: {
        message: 'No estás conectado a la red de Ethereum.',
        action: 'Cambiar a Ethereum'
      }
    },
    agenda: {
      detailsButton: 'Ver detalles',
      detailBackButton: 'Volver a las actividades',
      detailHeading: 'Información de la actividad',
      activityNotFound: 'No pudimos cargar esa actividad. Volvé a la agenda.',
      dateLabel: 'Fecha',
      spotsLabel: 'Cupos',
      priceLabel: 'Contribución',
      registeredBadge: 'Ya estás registrado/a',
      subscribeButton: 'Enviar registro',
      processingButton: 'Enviando...',
      noSpotsButton: 'Sin cupos disponibles',
      inactiveBadge: 'Actividad inactiva',
      participantCountLabel: 'Participantes',
      participantCountHelper: 'Elegí cuántos lugares querés reservar.',
      transactionInfo: 'MetaMask enviará tu mensaje on-chain a {wallet}.',
      paymentTokenLabel: 'Seleccioná el token de pago'
    },
    participantForm: {
      title: 'Completá tu perfil de participante',
      description: 'Ingresá tus datos personales para compartir el registro con los anfitriones.',
      firstNameLabel: 'Nombre',
      lastNameLabel: 'Apellido',
      idTypeLabel: 'Tipo de documento',
      idNumberLabel: 'Número del documento',
      accommodationLabel: 'Alojamiento',
      nationalityLabel: 'Nacionalidad',
      birthDateLabel: 'Fecha de nacimiento',
      contactLabel: 'Teléfono de contacto',
      observationsLabel: 'Observaciones',
      idTypeDni: 'DNI',
      idTypePassport: 'Pasaporte',
      idTypeOther: 'Otro',
      cancelButton: 'Cancelar',
      saveButton: 'Guardar y continuar',
      requiredField: 'Este campo es obligatorio.'
    }
  }
};

export const localeMap = {
  en: 'en-US',
  es: 'es-ES'
};

export const residencyActivities = [
  {
    id: 'patagonian-asado',
    priceUSDT: 230,
    maxParticipants: 60,
    images: [
      'https://ipfs.io/ipfs/bafybeic23gavkexic2nmmccmknbff4ngwhzhzqxcic7qdzbysc7rzeyzo4',
      'https://ipfs.io/ipfs/bafybeifqkwx3c6rr7d22sdnmss5j6atmkvsis5ivh42gdwfcy3znssaw5m'
    ],
    translations: {
      en: {
        title: 'Intimate Patagonian asado on the lakeshore',
        summary:
          'A six-hour outing with round-trip transport from San Martín de los Andes: a 45-minute private crossing of Lake Lácar to Quilaquina for a guided shoreline immersion with local hosts before a fire-cooked feast curated by Edge City on a secluded beach.',
        highlights: [
          'Private boat crossing for up to 60 guests with round-trip transport included.',
          'Guided shoreline immersion in Quilaquina with local hosts.',
          'Patagonian fire-cooked meal (cordero al asador) with local wines and soft drinks included at USD 230 per person.'
        ],
        guide: 'Curated by the Edge City culinary team.'
      },
      es: {
        title: 'Asado patagónico íntimo en la orilla del lago',
        summary:
          'Salida de seis horas con traslado ida y vuelta desde San Martín de los Andes: navegación privada de 45 minutos por el lago Lácar hasta Quilaquina para una inmersión guiada en la costa con anfitriones locales antes de un festín a fuego abierto curado por Edge City en una playa escondida.',
        highlights: [
          'Travesía en lancha privada para hasta 60 personas, con transporte ida y vuelta incluido.',
          'Inmersión guiada en la costa de Quilaquina junto a anfitriones locales.',
          'Asado patagónico al fuego (cordero al asador) con vinos locales y bebidas sin alcohol incluidos por USD 230 por persona.'
        ],
        guide: 'Curaduría del equipo culinario de Edge City.'
      }
    }
  },
  {
    id: 'mountain-expedition',
    priceUSDT: 150,
    maxParticipants: 40,
    images: [],
    imageFolderCid: 'bafybeih77q6wubddx6phljd6ajbcua7jooh2wnxbxz4c2rvna2tdrjzdha',
    translations: {
      en: {
        title: 'Children’s mountain school',
        summary:
          'Outdoor adventure school for ages 5–16 with rotating kayak, mountain biking, trekking, nature skills, orientation, and team sports. Sunday emails share the weekly roster of two-and-a-half-hour meetups plus a three-hour family excursion every Saturday. All sports and safety gear is provided and groups open with a minimum of 3 and cap at 40 participants.',
        highlights: [
          'Designed for 5–16 year olds with all sporting and safety materials included.',
          'Rotating activities: kayak, mountain biking, trekking, nature living, orientation, and team sports.',
          'Weekly plan delivered every Sunday outlining 2.5-hour sessions throughout the week and the Saturday family outing.',
          'Contribution tiers: USD 150 for two sessions per week, USD 200 for three sessions, USD 270 for four sessions; Saturday family experience at USD 60 per person.'
        ],
        guide: 'Coordinated by the Edge City youth mountain guides.'
      },
      es: {
        title: 'Escuela de montaña infantil',
        summary:
          'Actividad para infancias de 5 a 16 años con módulos rotativos de kayak, bici de montaña, trekking, vida en la naturaleza, orientación y deportes de conjunto. Cada domingo se envía el cronograma semanal con encuentros de dos horas y media, más una excursión familiar de tres horas los sábados. Incluye materiales deportivos y de seguridad, con grupos que se arman desde un mínimo de 3 hasta un máximo de 40 participantes.',
        highlights: [
          'Pensada para infancias de 5 a 16 años con todo el equipamiento deportivo y de seguridad incluido.',
          'Actividades rotativas: kayak, bici de montaña, trekking, vida en la naturaleza, orientación y deportes de conjunto.',
          'Cronograma enviado cada domingo con encuentros de 2,5 horas y excursión familiar los sábados.',
          'Aportes: USD 150 por dos encuentros semanales, USD 200 por tres, USD 270 por cuatro; actividad familiar del sábado a USD 60 por persona.'
        ],
        guide: 'Coordinación del equipo de guías de montaña para infancias de Edge City.'
      }
    }
  },
  {
    id: 'lake-kayak',
    images: ['https://ipfs.io/ipfs/bafkreia6mqussojkw3tcngfj6iyow2gjszuxsjereznjomefa2iajg7x4q'],
    translations: {
      en: {
        title: 'Kayak journey across Lake Lolog',
        summary:
          'A gentle paddle through transparent bays, learning Patagonian weather patterns and gliding silently at sunset.',
        highlights: [
          'Double kayaks, life vests, and safety briefing included.',
          'On-chain check-in at embarkation with live tracking of spots.',
          'Campfire toast on the volcanic-sand beach.'
        ],
        guide: 'Logistics with the Lolog nautical club and resident artists.'
      },
      es: {
        title: 'Travesía en kayak por el lago Lolog',
        summary:
          'Remada suave entre bahías transparentes, aprendiendo lectura del clima patagónico y navegando en silencio al atardecer.',
        highlights: [
          'Kayaks dobles, chalecos y briefing de seguridad incluidos.',
          'Check-in en cadena al embarcar y seguimiento de cupos en vivo.',
          'Brindis con cocina de campamento en la playa de arena volcánica.'
        ],
        guide: 'Logística junto al club náutico de Lolog y artistas residentes.'
      }
    }
  },
  {
    id: 'rock-climbing',
    images: ['https://ipfs.io/ipfs/bafkreiazmgq5d4xq72ggid33nkh4fozsn6ek6feaf3oqes3mczybyjyqca'],
    translations: {
      en: {
        title: 'Rock-climbing clinic and mindful movement',
        summary:
          'A progressive session at the local granite school to connect strength, breathing, and creative focus.',
        highlights: [
          'All levels welcome: from intro bouldering to roped routes.',
          'Progress tracking and digital waiver recorded on-chain.',
          'Integration circle with sound at the base of the wall.'
        ],
        guide: 'Mentored by IFMGA guides and Edge City performers.'
      },
      es: {
        title: 'Clínica de escalada en roca y movimientos conscientes',
        summary:
          'Sesión progresiva en la escuela de granito local para conectar fuerza, respiración y foco creativo.',
        highlights: [
          'Todos los niveles: desde boulder introductorio a vías con cuerda.',
          'Seguimiento de progresos y liberación de responsabilidad digital firmada on-chain.',
          'Círculo de integración sonora al pie de la pared.'
        ],
        guide: 'Mentoreada por guías IFMGA y performers de Edge City.'
      }
    }
  }
];
