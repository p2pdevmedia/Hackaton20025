export const translations = {
  en: {
    languageName: 'English',
    languageSelectorLabel: 'Language',
    navbar: {
      title: 'Patagonia Residency Activities',
      subtitle: 'An immersive nature experience with registration and payments secured on-chain.',
      connect: 'Connect wallet',
      disconnect: 'Disconnect'
    },
    hero: {
      badge: 'NEW EDITION 2025 · SAN MARTIN DE LOS ANDES',
      title: 'Patagonia Residency: live art, nature, and community linked on-chain.',
      description:
        'We design a multi-day immersion to explore the Andes, activate physical and culinary practices, and document every moment with smart contracts that safeguard spots, payments, and memories.',
      primaryLink: 'View full program',
      dataBadge: 'Live smart-contract data'
    },
    heroCard: {
      heading: 'What the residency activates',
      items: [
        'Curated outings to mountains, water, and rock with local guides.',
        'Territory cuisine and artistic rituals with Iván Moritz Karl.',
        'Spots, payments, and deliverables secured by the residency contract.'
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
    contract: {
      heading: 'Patagonia residency smart contract',
      paragraph1: 'Choose your experience and confirm the transaction from your wallet to secure a spot.',
      paragraph2: 'Registrations are recorded on-chain in USDT, keeping availability and participation transparent for everyone.'
    },
    warnings: {
      contract: 'Set <code>REACT_APP_CONTRACT_ADDRESS</code> to interact with the activity contract.',
      usdt: 'Set <code>REACT_APP_USDT_ADDRESS</code> to point at the USDT token used for payments.'
    },
    status: {
      contractMissing: 'Configure the contract address to register.',
      connectWalletToRegister: 'Connect your wallet to register.',
      activityUnavailable: 'This activity is not available.',
      approvingUsdt: 'Approving USDT...',
      confirmingRegistration: 'Confirming registration...',
      registrationComplete: 'Registration completed!',
      registrationFailed: 'Could not complete the registration. Check the console for more details.',
      alreadyRegistered: 'You are already registered for this activity.'
    },
    alerts: {
      metaMask: 'Install MetaMask to continue.'
    },
    agenda: {
      heading: 'Activity schedule',
      description: 'Review availability and confirm your registration directly on-chain.',
      loading: 'Loading activities...',
      empty: 'Activities will appear here when available.',
      balanceLabel: 'USDT balance',
      dateLabel: 'Date',
      spotsLabel: 'Spots',
      priceLabel: 'Price',
      registeredBadge: 'You are registered',
      registerButton: 'Register',
      noSpotsBadge: 'No spots available',
      inactiveBadge: 'Inactive activity',
      freeLabel: 'Free',
      remainingLabel: 'spots left',
      closedLabel: 'Registration closed'
    },
  },
  es: {
    languageName: 'Español',
    languageSelectorLabel: 'Idioma',
    navbar: {
      title: 'Residencia Patagonia · Actividades',
      subtitle: 'Una experiencia inmersiva en la naturaleza con registro y pagos asegurados en la cadena de bloques.',
      connect: 'Conectar wallet',
      disconnect: 'Desconectar'
    },
    hero: {
      badge: 'Nueva edición 2025 · San Martín de los Andes',
      title: 'Residencia Patagonia: arte vivo, naturaleza y comunidad conectada on-chain.',
      description:
        'Diseñamos una inmersión de varios días para explorar la cordillera, activar prácticas físicas y culinarias, y documentar cada momento con contratos inteligentes que resguardan cupos, pagos y memorias.',
      primaryLink: 'Ver programa completo',
      dataBadge: 'Datos en vivo del contrato'
    },
    heroCard: {
      heading: 'Lo que activa la residencia',
      items: [
        'Salidas curadas a montaña, agua y roca con guías locales.',
        'Cocina de territorio y rituales artísticos con Iván Moritz Karl.',
        'Cupos, pagos y entregables asegurados en el contrato de la residencia.'
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
          description: 'Progresión guiada en rutas de granito del 20 al 23 de octubre.'
        },
        novemberKayak: {
          title: 'Travesías en kayak por el lago Lolog',
          shortLabel: 'Kayak',
          description: 'Remadas al amanecer y atardecer del 1 al 3 de noviembre.'
        },
        novemberClimb: {
          title: 'Bloque de cumbres en granito',
          shortLabel: 'Escalada',
          description: 'Clínicas avanzadas de fisura y placa del 10 al 13 de noviembre.'
        }
      }
    },
    contract: {
      heading: 'Contrato inteligente de la residencia Patagonia',
      paragraph1: 'Elegí la experiencia y confirmá la transacción desde tu wallet para asegurar tu lugar.',
      paragraph2: 'Las inscripciones quedan registradas on-chain en USDT, manteniendo transparente la disponibilidad para toda la comunidad.'
    },
    warnings: {
      contract: 'Configurá <code>REACT_APP_CONTRACT_ADDRESS</code> para interactuar con el contrato de actividades.',
      usdt: 'Configurá <code>REACT_APP_USDT_ADDRESS</code> para apuntar al token USDT que se utilizará para los pagos.'
    },
    status: {
      contractMissing: 'Configurá la dirección del contrato para registrarte.',
      connectWalletToRegister: 'Conectá tu wallet para registrarte.',
      activityUnavailable: 'Esta actividad no está disponible.',
      approvingUsdt: 'Aprobando USDT...',
      confirmingRegistration: 'Confirmando registro...',
      registrationComplete: '¡Registro completado!',
      registrationFailed: 'No se pudo completar el registro. Revisá la consola para más detalles.',
      alreadyRegistered: 'Ya estás inscripto en esta actividad.'
    },
    alerts: {
      metaMask: 'Instalá MetaMask para continuar.'
    },
    agenda: {
      heading: 'Agenda de actividades',
      description: 'Revisá disponibilidad y confirmá tu inscripción directamente en la cadena de bloques.',
      loading: 'Cargando actividades...',
      empty: 'Las actividades aparecerán aquí cuando estén disponibles.',
      balanceLabel: 'Balance USDT',
      dateLabel: 'Fecha',
      spotsLabel: 'Cupos',
      priceLabel: 'Precio',
      registeredBadge: 'Ya estás registrado/a',
      registerButton: 'Inscribirme',
      noSpotsBadge: 'Sin cupos disponibles',
      inactiveBadge: 'Actividad inactiva',
      freeLabel: 'Sin costo',
      remainingLabel: 'cupos libres',
      closedLabel: 'Registro cerrado'
    }
  },
  fr: {
    languageName: 'Français',
    languageSelectorLabel: 'Langue',
    navbar: {
      title: 'Résidence Patagonie · Activités',
      subtitle: 'Une expérience immersive dans la nature avec inscriptions et paiements sécurisés sur la blockchain.',
      connect: 'Connecter le wallet',
      disconnect: 'Déconnecter'
    },
    hero: {
      badge: 'Nouvelle édition 2025 · San Martín de los Andes',
      title: 'Résidence Patagonie : art vivant, nature et communauté reliés on-chain.',
      description:
        'Nous concevons une immersion de plusieurs jours pour explorer la cordillère, activer des pratiques physiques et culinaires, et documenter chaque moment avec des smart contracts qui protègent places, paiements et souvenirs.',
      primaryLink: 'Voir le programme complet',
      dataBadge: 'Données du contrat en direct'
    },
    heroCard: {
      heading: 'Ce que la résidence active',
      items: [
        'Sorties curatoriales en montagne, sur l’eau et la roche avec des guides locaux.',
        'Cuisine du territoire et rituels artistiques avec Iván Moritz Karl.',
        'Places, paiements et livrables sécurisés par le contrat de résidence.'
      ]
    },
    contract: {
      heading: 'Contrat intelligent de la résidence Patagonie',
      paragraph1: 'Choisissez votre expérience et confirmez la transaction depuis votre wallet pour garantir votre place.',
      paragraph2: 'Les inscriptions sont enregistrées on-chain en USDT, assurant une disponibilité transparente pour toute la communauté.'
    },
    warnings: {
      contract: 'Configurez <code>REACT_APP_CONTRACT_ADDRESS</code> pour interagir avec le contrat d’activités.',
      usdt: 'Configurez <code>REACT_APP_USDT_ADDRESS</code> pour cibler le jeton USDT utilisé pour les paiements.'
    },
    status: {
      contractMissing: 'Configurez l’adresse du contrat pour vous inscrire.',
      connectWalletToRegister: 'Connectez votre wallet pour vous inscrire.',
      activityUnavailable: 'Cette activité n’est pas disponible.',
      approvingUsdt: 'Approbation des USDT…',
      confirmingRegistration: 'Confirmation de l’inscription…',
      registrationComplete: 'Inscription terminée !',
      registrationFailed: 'Impossible de finaliser l’inscription. Consultez la console pour plus de détails.',
      alreadyRegistered: 'Vous êtes déjà inscrit·e à cette activité.'
    },
    alerts: {
      metaMask: 'Installez MetaMask pour continuer.'
    },
    agenda: {
      heading: 'Agenda des activités',
      description: 'Consultez les disponibilités et confirmez votre inscription directement sur la blockchain.',
      loading: 'Chargement des activités…',
      empty: 'Les activités apparaîtront ici lorsqu’elles seront disponibles.',
      balanceLabel: 'Solde USDT',
      dateLabel: 'Date',
      spotsLabel: 'Places',
      priceLabel: 'Prix',
      registeredBadge: 'Vous êtes inscrit·e',
      registerButton: 'M’inscrire',
      noSpotsBadge: 'Plus de places disponibles',
      inactiveBadge: 'Activité inactive',
      freeLabel: 'Gratuit',
      remainingLabel: 'places restantes',
      closedLabel: 'Inscriptions clôturées'
    }
  },
  de: {
    languageName: 'Deutsch',
    languageSelectorLabel: 'Sprache',
    navbar: {
      title: 'Patagonien-Residenz · Aktivitäten',
      subtitle: 'Eine immersive Naturerfahrung mit Anmeldungen und Zahlungen, die on-chain abgesichert sind.',
      connect: 'Wallet verbinden',
      disconnect: 'Trennen'
    },
    hero: {
      badge: 'Neue Ausgabe 2025 · San Martín de los Andes',
      title: 'Patagonien-Residenz: lebendige Kunst, Natur und Gemeinschaft on-chain vernetzt.',
      description:
        'Wir gestalten eine mehrtägige Immersion, um die Anden zu erkunden, körperliche und kulinarische Praktiken zu aktivieren und jeden Moment mit Smart Contracts zu dokumentieren, die Plätze, Zahlungen und Erinnerungen schützen.',
      primaryLink: 'Gesamtes Programm ansehen',
      dataBadge: 'Live-Daten des Smart Contracts'
    },
    heroCard: {
      heading: 'Was die Residenz aktiviert',
      items: [
        'Kuratiere Ausflüge zu Bergen, Wasser und Fels mit lokalen Guides.',
        'Regionale Küche und künstlerische Rituale mit Iván Moritz Karl.',
        'Plätze, Zahlungen und Deliverables, gesichert durch den Residenzvertrag.'
      ]
    },
    contract: {
      heading: 'Smart Contract der Patagonien-Residenz',
      paragraph1: 'Wähle deine Erfahrung und bestätige die Transaktion mit deinem Wallet, um dir einen Platz zu sichern.',
      paragraph2: 'Anmeldungen werden on-chain in USDT gespeichert und machen Verfügbarkeit und Teilnahme für alle transparent.'
    },
    warnings: {
      contract: 'Setze <code>REACT_APP_CONTRACT_ADDRESS</code>, um mit dem Aktivitätsvertrag zu interagieren.',
      usdt: 'Setze <code>REACT_APP_USDT_ADDRESS</code>, um auf den für Zahlungen verwendeten USDT-Token zu verweisen.'
    },
    status: {
      contractMissing: 'Konfiguriere die Vertragsadresse, um dich anzumelden.',
      connectWalletToRegister: 'Verbinde dein Wallet, um dich anzumelden.',
      activityUnavailable: 'Diese Aktivität ist nicht verfügbar.',
      approvingUsdt: 'USDT werden genehmigt...',
      confirmingRegistration: 'Anmeldung wird bestätigt...',
      registrationComplete: 'Anmeldung abgeschlossen!',
      registrationFailed: 'Anmeldung konnte nicht abgeschlossen werden. Sieh für Details in die Konsole.',
      alreadyRegistered: 'Du bist bereits für diese Aktivität angemeldet.'
    },
    alerts: {
      metaMask: 'Installiere MetaMask, um fortzufahren.'
    },
    agenda: {
      heading: 'Aktivitätenplan',
      description: 'Prüfe die Verfügbarkeit und bestätige deine Anmeldung direkt on-chain.',
      loading: 'Aktivitäten werden geladen...',
      empty: 'Aktivitäten erscheinen hier, sobald sie verfügbar sind.',
      balanceLabel: 'USDT-Guthaben',
      dateLabel: 'Datum',
      spotsLabel: 'Plätze',
      priceLabel: 'Preis',
      registeredBadge: 'Du bist angemeldet',
      registerButton: 'Anmelden',
      noSpotsBadge: 'Keine Plätze verfügbar',
      inactiveBadge: 'Inaktive Aktivität',
      freeLabel: 'Kostenlos',
      remainingLabel: 'Plätze übrig',
      closedLabel: 'Anmeldung geschlossen'
    }
  },
  zh: {
    languageName: '中文',
    languageSelectorLabel: '语言',
    navbar: {
      title: '巴塔哥尼亚驻地活动',
      subtitle: '沉浸式自然体验，报名和付款全部通过区块链保障。',
      connect: '连接钱包',
      disconnect: '断开连接'
    },
    hero: {
      badge: '2025 年全新一季 · 圣马丁德洛斯安第斯',
      title: '巴塔哥尼亚驻地：在链上连接的现场艺术、自然与社区。',
      description:
        '我们策划为期多日的沉浸体验，探索安第斯山脉，开启身体与美食实践，并通过智能合约记录每一个守护席位、支付与记忆的瞬间。',
      primaryLink: '查看完整日程',
      dataBadge: '智能合约实时数据'
    },
    heroCard: {
      heading: '驻地带来的体验',
      items: [
        '与本地向导一起前往山地、湖水与岩壁的精选行程。',
        '与 Iván Moritz Karl 共同呈现的地域料理与艺术仪式。',
        '由驻地合约保障的席位、付款与成果。'
      ]
    },
    contract: {
      heading: '巴塔哥尼亚驻地智能合约',
      paragraph1: '选择想参加的体验，并通过钱包确认交易来锁定名额。',
      paragraph2: '所有报名都会以 USDT 记录在链上，让每个人都能透明掌握可用名额与参与情况。'
    },
    warnings: {
      contract: '请设置 <code>REACT_APP_CONTRACT_ADDRESS</code> 以便与活动合约交互。',
      usdt: '请设置 <code>REACT_APP_USDT_ADDRESS</code> 指向用于支付的 USDT 代币。'
    },
    status: {
      contractMissing: '请配置合约地址以完成报名。',
      connectWalletToRegister: '连接钱包以报名。',
      activityUnavailable: '该活动当前不可用。',
      approvingUsdt: '正在授权 USDT…',
      confirmingRegistration: '正在确认报名…',
      registrationComplete: '报名完成！',
      registrationFailed: '无法完成报名。请查看控制台了解更多详情。',
      alreadyRegistered: '你已报名此活动。'
    },
    alerts: {
      metaMask: '请安装 MetaMask 以继续。'
    },
    agenda: {
      heading: '活动日程',
      description: '查看可用名额，并直接在链上确认你的报名。',
      loading: '正在加载活动…',
      empty: '活动上线后将在此显示。',
      balanceLabel: 'USDT 余额',
      dateLabel: '日期',
      spotsLabel: '名额',
      priceLabel: '价格',
      registeredBadge: '你已报名',
      registerButton: '报名',
      noSpotsBadge: '名额已满',
      inactiveBadge: '活动未开放',
      freeLabel: '免费',
      remainingLabel: '剩余名额',
      closedLabel: '报名已截止'
    }
  },
  ru: {
    languageName: 'Русский',
    languageSelectorLabel: 'Язык',
    navbar: {
      title: 'Резиденция в Патагонии · Активности',
      subtitle: 'Иммерсивный опыт в природе с регистрациями и платежами, защищёнными блокчейном.',
      connect: 'Подключить кошелёк',
      disconnect: 'Отключить'
    },
    hero: {
      badge: 'Новое издание 2025 · Сан-Мартин-де-лос-Андес',
      title: 'Резиденция в Патагонии: живое искусство, природа и сообщество, соединённые on-chain.',
      description:
        'Мы создаём многодневное погружение, чтобы исследовать Анды, развивать телесные и кулинарные практики и фиксировать каждый момент с помощью смарт-контрактов, которые защищают места, платежи и воспоминания.',
      primaryLink: 'Посмотреть программу полностью',
      dataBadge: 'Данные смарт-контракта в реальном времени'
    },
    heroCard: {
      heading: 'Что предлагает резиденция',
      items: [
        'Кураторские выезды в горы, к воде и скалам с местными гидами.',
        'Кухня региона и художественные ритуалы с Иваном Морицем Карлом.',
        'Места, платежи и результаты под защитой контракта резиденции.'
      ]
    },
    contract: {
      heading: 'Смарт-контракт резиденции в Патагонии',
      paragraph1: 'Выберите опыт и подтвердите транзакцию через кошелёк, чтобы закрепить место.',
      paragraph2: 'Регистрации фиксируются on-chain в USDT, обеспечивая прозрачность доступности и участия для всех.'
    },
    warnings: {
      contract: 'Укажите <code>REACT_APP_CONTRACT_ADDRESS</code>, чтобы взаимодействовать с контрактом активностей.',
      usdt: 'Укажите <code>REACT_APP_USDT_ADDRESS</code>, чтобы настроить USDT-токен для платежей.'
    },
      status: {
        contractMissing: 'Укажите адрес контракта, чтобы записаться.',
        connectWalletToRegister: 'Подключите кошелёк, чтобы зарегистрироваться.',
        activityUnavailable: 'Эта активность недоступна.',
        approvingUsdt: 'Идёт подтверждение USDT…',
        confirmingRegistration: 'Подтверждение регистрации…',
        registrationComplete: 'Регистрация завершена!',
        registrationFailed: 'Не удалось завершить регистрацию. Подробности смотрите в консоли.',
        alreadyRegistered: 'Вы уже записаны на эту активность.'
      },
    alerts: {
      metaMask: 'Установите MetaMask, чтобы продолжить.'
    },
    agenda: {
      heading: 'Расписание активностей',
      description: 'Проверяйте доступность и подтверждайте регистрацию напрямую в блокчейне.',
      loading: 'Загрузка активностей…',
      empty: 'Здесь появятся активности, как только они станут доступны.',
      balanceLabel: 'Баланс USDT',
      dateLabel: 'Дата',
      spotsLabel: 'Места',
      priceLabel: 'Цена',
      registeredBadge: 'Вы зарегистрированы',
      registerButton: 'Записаться',
      noSpotsBadge: 'Нет свободных мест',
      inactiveBadge: 'Активность неактивна',
      freeLabel: 'Бесплатно',
      remainingLabel: 'свободных мест',
      closedLabel: 'Регистрация закрыта'
    }
  }
};

export const localeMap = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
  ru: 'ru-RU'
};

export const residencyActivities = [
  {
    id: 'mountain-expedition',
    image: 'https://ipfs.io/ipfs/bafybeienxvgvzj4a4qhozas5cd5hgnkk2dkkylnv4q6tiypqz6qqxswwru',
    translations: {
      en: {
        title: 'Mountain expedition to the heart of the Andes',
        summary:
          'A guided ascent through native forests, hidden viewpoints, and local stories to feel the energy of Lanín National Park.',
        highlights: [
          'Certified mountain guide and trekking gear included.',
          'Photo log and checkpoints synced with the smart contract.',
          'Closing breathwork facing the Lanín volcano.'
        ],
        guide: 'Led by Iván Moritz Karl and the resident community.'
      },
      es: {
        title: 'Salida de montaña al corazón de la cordillera',
        summary:
          'Ascenso guiado entre bosques nativos, miradores ocultos y relatos locales para sentir la energía del Parque Nacional Lanín.',
        highlights: [
          'Guía habilitado y equipo de trekking incluido.',
          'Registro fotográfico y checkpoints sincronizados con el contrato electrónico.',
          'Cierre con breathwork frente al volcán Lanín.'
        ],
        guide: 'Coordinada por Iván Moritz Karl y la comunidad residente.'
      },
      fr: {
        title: 'Expédition en montagne au cœur des Andes',
        summary:
          'Ascension guidée à travers forêts natives, belvédères cachés et récits locaux pour ressentir l’énergie du parc national Lanín.',
        highlights: [
          'Guide certifié et équipement de trekking inclus.',
          'Journal photo et checkpoints synchronisés avec le smart contract.',
          'Séance de breathwork face au volcan Lanín.'
        ],
        guide: 'Coordonnée par Iván Moritz Karl et la communauté résidente.'
      },
      de: {
        title: 'Bergexpedition ins Herz der Anden',
        summary:
          'Geführter Aufstieg durch heimische Wälder, versteckte Aussichtspunkte und lokale Geschichten, um die Energie des Lanín-Nationalparks zu spüren.',
        highlights: [
          'Zertifizierter Bergführer und Trekkingausrüstung inklusive.',
          'Fotoprotokoll und Checkpoints, die mit dem Smart Contract synchronisiert sind.',
          'Abschluss mit Breathwork vor dem Vulkan Lanín.'
        ],
        guide: 'Koordiniert von Iván Moritz Karl und der Resident-Community.'
      },
      zh: {
        title: '深入安第斯山脉的高山远征',
        summary:
          '在向导带领下穿越原始森林、隐秘观景点与在地故事，感受拉宁国家公园的能量。',
        highlights: [
          '认证向导与登山装备全程提供。',
          '与智能合约同步的影像记录与打卡点。',
          '在拉宁火山前的呼吸练习收尾。'
        ],
        guide: '由 Iván Moritz Karl 与驻地社区共同带领。'
      },
      ru: {
        title: 'Горная экспедиция в сердце Анд',
        summary:
          'Сопровождаемый подъём через родные леса, скрытые смотровые площадки и местные истории, чтобы почувствовать энергию национального парка Ланин.',
        highlights: [
          'Сертифицированный горный гид и включённое снаряжение для треккинга.',
          'Фотопротокол и чекпоинты, синхронизированные со смарт-контрактом.',
          'Завершение дыхательной практикой перед вулканом Ланин.'
        ],
        guide: 'Координация Ивана Морица Карла и резидентского сообщества.'
      }
    }
  },
  {
    id: 'lake-kayak',
    image: 'https://ipfs.io/ipfs/bafkreia6mqussojkw3tcngfj6iyow2gjszuxsjereznjomefa2iajg7x4q',
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
          'Check-in en cadena al embarcar y tracking de cupos en vivo.',
          'Brindis con cocina de campamento en la playa de arena volcánica.'
        ],
        guide: 'Logística junto al club náutico de Lolog y artistas residentes.'
      },
      fr: {
        title: 'Traversée en kayak du lac Lolog',
        summary:
          'Pagayage doux entre baies transparentes, apprentissage de la météo patagonienne et navigation silencieuse au coucher du soleil.',
        highlights: [
          'Kayaks doubles, gilets de sauvetage et briefing de sécurité inclus.',
          'Check-in on-chain à l’embarquement et suivi des places en direct.',
          'Toast autour du feu de camp sur la plage de sable volcanique.'
        ],
        guide: 'Logistique avec le club nautique de Lolog et les artistes résidents.'
      },
      de: {
        title: 'Kajaktour über den Lago Lolog',
        summary:
          'Sanftes Paddeln durch glasklare Buchten, Patagonische Wetterkunde und lautloses Gleiten bei Sonnenuntergang.',
        highlights: [
          'Doppelkajaks, Schwimmwesten und Sicherheitsbriefing inklusive.',
          'On-Chain-Check-in beim Einsteigen und Live-Tracking der Plätze.',
          'Lagerfeuer-Toast am Strand aus vulkanischem Sand.'
        ],
        guide: 'Logistik mit dem Yachtclub Lolog und den Resident-Künstler:innen.'
      },
      zh: {
        title: '洛洛湖皮划艇之旅',
        summary:
          '在透明海湾间轻松划行，学习巴塔哥尼亚的天气判断，傍晚静静滑向夕阳。',
        highlights: [
          '提供双人皮划艇、救生衣和安全简报。',
          '登船时链上签到，并实时追踪剩余名额。',
          '在火山砂海滩上以营地餐点举杯。'
        ],
        guide: '由洛洛湖航海俱乐部与驻地艺术家协同策划。'
      },
      ru: {
        title: 'Путешествие на каяках по озеру Лолог',
        summary:
          'Неспешная гребля по прозрачным бухтам, знакомство с патагонской погодой и тихое скольжение на закате.',
        highlights: [
          'Двухместные каяки, спасательные жилеты и инструктаж по безопасности включены.',
          'Чек-ин на блокчейне при посадке и живой трекинг свободных мест.',
          'Тост с походной кухней на пляже из вулканического песка.'
        ],
        guide: 'Логистика совместно с яхт-клубом Лолога и резидентами-художниками.'
      }
    }
  },
  {
    id: 'rock-climbing',
    image: 'https://ipfs.io/ipfs/bafkreiazmgq5d4xq72ggid33nkh4fozsn6ek6feaf3oqes3mczybyjyqca',
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
        guide: 'Mentored by IFMGA guides and resident facilitators.'
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
        guide: 'Mentoreada por guías IFMGA y facilitadores de la residencia.'
      },
      fr: {
        title: 'Clinique d’escalade sur roche et mouvement conscient',
        summary:
          'Session progressive à l’école locale de granit pour relier force, respiration et focus créatif.',
        highlights: [
          'Tous niveaux : du bloc d’initiation aux voies sur corde.',
          'Suivi des progrès et décharge de responsabilité numérique signée on-chain.',
          'Cercle d’intégration sonore au pied de la paroi.'
        ],
        guide: 'Encadrée par des guides IFMGA et des facilitateur·rices de la résidence.'
      },
      de: {
        title: 'Kletterklinik und achtsame Bewegung',
        summary:
          'Progressive Session in der lokalen Granitschule, um Kraft, Atmung und kreativen Fokus zu verbinden.',
        highlights: [
          'Alle Levels: vom Einsteiger-Bouldern bis zu Seilrouten.',
          'Fortschrittsverfolgung und digitale Haftungsfreistellung on-chain.',
          'Integrationskreis mit Klang am Fuß der Wand.'
        ],
        guide: 'Begleitet von IFMGA-Guides und Facilitator:innen der Residenz.'
      },
      zh: {
        title: '岩壁攀登诊所与身心觉察',
        summary:
          '在当地花岗岩学校循序渐进地训练，连结力量、呼吸与创意专注。',
        highlights: [
          '欢迎所有程度：从抱石入门到绳索线路。',
          '进度追踪与数字责任豁免表链上签署。',
          '在岩壁下以声音圈完成整合。'
        ],
        guide: '由 IFMGA 向导与驻地引导师共同带领。'
      },
      ru: {
        title: 'Клиника скалолазания и осознанного движения',
        summary:
          'Постепенная сессия в местной гранитной школе, соединяющая силу, дыхание и творческий фокус.',
        highlights: [
          'Все уровни: от вводного болдеринга до маршрутов с верёвкой.',
          'Отслеживание прогресса и цифровой отказ от ответственности, подписанный on-chain.',
          'Интеграционный звуковой круг у подножия скалы.'
        ],
        guide: 'Наставники — гиды IFMGA и фасилитаторы резиденции.'
      }
    }
  },
  {
    id: 'patagonian-asado',
    image: 'https://ipfs.io/ipfs/bafybeic23gavkexic2nmmccmknbff4ngwhzhzqxcic7qdzbysc7rzeyzo4',
    translations: {
      en: {
        title: 'Intimate Patagonian asado on the lakeshore',
        summary:
          'Slow fire, local produce, and live painting by Iván Moritz Karl as night falls over Lolog.',
        highlights: [
          'Menu of meats, mushrooms, and vegetables from partner producers.',
          'Audio-visual capture linked to the contract to update digital memorabilia.',
          'Jam session with residents and invited community.'
        ],
        guide: 'Curated by the residency culinary team.'
      },
      es: {
        title: 'Asado patagónico íntimo en la orilla del lago',
        summary:
          'Fuego lento, productos locales y pintura en vivo de Iván Moritz Karl mientras cae la noche sobre Lolog.',
        highlights: [
          'Menú de carnes, hongos y vegetales de productores aliados.',
          'Registro audiovisual conectado al contrato para actualizar memorabilia digital.',
          'Jam session con residentes y comunidad invitada.'
        ],
        guide: 'Curaduría gastronómica del equipo de la residencia.'
      },
      fr: {
        title: 'Asado patagonique intimiste au bord du lac',
        summary:
          'Cuisson lente, produits locaux et peinture en direct d’Iván Moritz Karl alors que la nuit tombe sur Lolog.',
        highlights: [
          'Menu de viandes, champignons et légumes de producteurs partenaires.',
          'Enregistrement audiovisuel relié au contrat pour mettre à jour les souvenirs numériques.',
          'Jam session avec les résidents et la communauté invitée.'
        ],
        guide: 'Curaté par l’équipe culinaire de la résidence.'
      },
      de: {
        title: 'Intimes patagonisches Asado am Seeufer',
        summary:
          'Langsames Feuer, lokale Produkte und Live-Malerei von Iván Moritz Karl, während die Nacht über Lolog hereinbricht.',
        highlights: [
          'Menü aus Fleisch, Pilzen und Gemüse von Partnerproduzent:innen.',
          'Audiovisuelles Recording, das mit dem Vertrag verknüpft ist, um digitale Erinnerungen zu aktualisieren.',
          'Jam-Session mit Residents und eingeladener Community.'
        ],
        guide: 'Kuratiert vom kulinarischen Team der Residenz.'
      },
      zh: {
        title: '湖畔的私密巴塔哥尼亚烤肉',
        summary:
          '慢火、在地食材，以及 Iván Moritz Karl 的现场绘画，伴随夜色笼罩洛洛湖。',
        highlights: [
          '合作伙伴提供的肉类、蘑菇与蔬菜菜单。',
          '与合约联动的影音记录，更新数字纪念品。',
          '驻地成员与社区嘉宾的即兴演出。'
        ],
        guide: '由驻地烹饪团队策展。'
      },
      ru: {
        title: 'Камерное патагонское асадо на берегу озера',
        summary:
          'Медленный огонь, местные продукты и живопись Ивана Морица Карла под вечерним небом Лолога.',
        highlights: [
          'Меню из мяса, грибов и овощей от партнёрских фермеров.',
          'Аудиовизуальная запись, связанная с контрактом для обновления цифровых сувениров.',
          'Джем-сейшн с резидентами и приглашённым сообществом.'
        ],
        guide: 'Кураторская работа кулинарной команды резиденции.'
      }
    }
  }
];
