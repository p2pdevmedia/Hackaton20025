export const translations = {
  en: {
    languageName: 'English',
    languageSelectorLabel: 'Language',
    navbar: {
      title: 'Edge City · Patagonia Residency',
      subtitle: 'An immersive nature experience with registration and payments secured on-chain.',
      connect: 'Connect wallet',
      disconnect: 'Disconnect'
    },
    hero: {
      badge: 'NEW EDITION 2025 · SAN MARTIN DE LOS ANDES',
      title: 'Edge City Patagonia Residency: live art, nature, and community linked on-chain.',
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
        'Spots, payments, and deliverables secured by the Edge City contract.'
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
      contract: 'Set <code>REACT_APP_CONTRACT_ADDRESS</code> to interact with the activity contract.',
      usdt: 'Set <code>REACT_APP_USDT_ADDRESS</code> to point at the USDT token used for payments.'
    },
    status: {
      contractMissing: 'Configure the contract address to create activities.',
      connectWalletToCreate: 'Connect your wallet to create activities.',
      creatingActivity: 'Creating activity...',
      activityCreated: 'Activity created successfully.',
      activityCreationFailed: 'Could not create the activity. Check the console for more information.',
      connectWalletToRegister: 'Connect your wallet to register.',
      activityUnavailable: 'This activity is not available.',
      approvingUsdt: 'Approving USDT...',
      confirmingRegistration: 'Confirming registration...',
      registrationComplete: 'Registration completed!',
      registrationFailed: 'Could not complete the registration. Check the console for more details.'
    },
    alerts: {
      metaMask: 'Install MetaMask to continue.'
    },
    agenda: {
      heading: 'Live Web3 schedule',
      description: 'Manage availability, pricing, and confirmed registrations directly on-chain.',
      loading: 'Loading activities...',
      empty: 'There are no activities yet.',
      detailsButton: 'View details',
      detailBackButton: 'Back to activities',
      detailHeading: 'Activity information',
      activityNotFound: 'We could not load that activity. Please return to the agenda.',
      balanceLabel: 'USDT balance',
      dateLabel: 'Date',
      spotsLabel: 'Spots',
      priceLabel: 'Price',
      registeredBadge: 'You are registered',
      subscribeButton: 'Subscribe with MetaMask',
      noSpotsButton: 'No spots available',
      inactiveBadge: 'Inactive activity'
    },
    adminForm: {
      heading: 'Create new activity',
      description: 'Define the experience, schedule, and available spots. The price will be expressed in USDT.',
      nameLabel: 'Name',
      namePlaceholder: 'Activity name',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Tell us about the experience',
      dateLabel: 'Date and time',
      maxParticipantsLabel: 'Maximum participants',
      priceLabel: 'Price in USDT',
      pricePlaceholder: 'E.g. 25',
      submit: 'Create activity'
    }
  },
  es: {
    languageName: 'Español',
    languageSelectorLabel: 'Idioma',
    navbar: {
      title: 'Edge City · Residencia Patagonia',
      subtitle: 'Una experiencia inmersiva en la naturaleza con registro y pagos asegurados en la cadena de bloques.',
      connect: 'Conectar wallet',
      disconnect: 'Desconectar'
    },
    hero: {
      badge: 'Nueva edición 2025 · San Martín de los Andes',
      title: 'Residencia Edge City Patagonia: arte vivo, naturaleza y comunidad conectada on-chain.',
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
        'Cupos, pagos y entregables asegurados en el contrato Edge City.'
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
    warnings: {
      contract: 'Configurá <code>REACT_APP_CONTRACT_ADDRESS</code> para interactuar con el contrato de actividades.',
      usdt: 'Configurá <code>REACT_APP_USDT_ADDRESS</code> para apuntar al token USDT que se utilizará para los pagos.'
    },
    status: {
      contractMissing: 'Configura la dirección del contrato para crear actividades.',
      connectWalletToCreate: 'Conectá tu wallet para crear actividades.',
      creatingActivity: 'Creando actividad...',
      activityCreated: 'Actividad creada con éxito.',
      activityCreationFailed: 'No se pudo crear la actividad. Revisá la consola para más información.',
      connectWalletToRegister: 'Conectá tu wallet para registrarte.',
      activityUnavailable: 'Esta actividad no está disponible.',
      approvingUsdt: 'Aprobando USDT...',
      confirmingRegistration: 'Confirmando registro...',
      registrationComplete: '¡Registro completado!',
      registrationFailed: 'No se pudo completar el registro. Revisá la consola para más detalles.'
    },
    alerts: {
      metaMask: 'Instalá MetaMask para continuar.'
    },
    agenda: {
      heading: 'Agenda Web3 en vivo',
      description: 'Gestioná disponibilidad, precios y registros confirmados directamente en la cadena de bloques.',
      loading: 'Cargando actividades...',
      empty: 'Aún no hay actividades creadas.',
      detailsButton: 'Ver detalles',
      detailBackButton: 'Volver a las actividades',
      detailHeading: 'Información de la actividad',
      activityNotFound: 'No pudimos cargar esa actividad. Volvé a la agenda.',
      balanceLabel: 'Balance USDT',
      dateLabel: 'Fecha',
      spotsLabel: 'Cupos',
      priceLabel: 'Precio',
      registeredBadge: 'Ya estás registrado/a',
      subscribeButton: 'Suscribirme con MetaMask',
      noSpotsButton: 'Sin cupos disponibles',
      inactiveBadge: 'Actividad inactiva'
    },
    adminForm: {
      heading: 'Crear nueva actividad',
      description: 'Definí la experiencia, fecha y cupos disponibles. El precio se expresará en USDT.',
      nameLabel: 'Nombre',
      namePlaceholder: 'Nombre de la actividad',
      descriptionLabel: 'Descripción',
      descriptionPlaceholder: 'Contanos de qué trata la experiencia',
      dateLabel: 'Fecha y horario',
      maxParticipantsLabel: 'Cupos máximos',
      priceLabel: 'Precio en USDT',
      pricePlaceholder: 'Ej: 25',
      submit: 'Crear actividad'
    }
  },
  fr: {
    languageName: 'Français',
    languageSelectorLabel: 'Langue',
    navbar: {
      title: 'Edge City · Résidence Patagonie',
      subtitle: 'Une expérience immersive dans la nature avec inscriptions et paiements sécurisés sur la blockchain.',
      connect: 'Connecter le wallet',
      disconnect: 'Déconnecter'
    },
    hero: {
      badge: 'Nouvelle édition 2025 · San Martín de los Andes',
      title: 'Résidence Edge City Patagonie : art vivant, nature et communauté reliés on-chain.',
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
        'Places, paiements et livrables sécurisés par le contrat Edge City.'
      ]
    },
    warnings: {
      contract: 'Configurez <code>REACT_APP_CONTRACT_ADDRESS</code> pour interagir avec le contrat d’activités.',
      usdt: 'Configurez <code>REACT_APP_USDT_ADDRESS</code> pour cibler le jeton USDT utilisé pour les paiements.'
    },
    status: {
      contractMissing: 'Configurez l’adresse du contrat pour créer des activités.',
      connectWalletToCreate: 'Connectez votre wallet pour créer des activités.',
      creatingActivity: 'Création de l’activité…',
      activityCreated: 'Activité créée avec succès.',
      activityCreationFailed: 'Impossible de créer l’activité. Consultez la console pour plus d’informations.',
      connectWalletToRegister: 'Connectez votre wallet pour vous inscrire.',
      activityUnavailable: 'Cette activité n’est pas disponible.',
      approvingUsdt: 'Approbation des USDT…',
      confirmingRegistration: 'Confirmation de l’inscription…',
      registrationComplete: 'Inscription terminée !',
      registrationFailed: 'Impossible de finaliser l’inscription. Consultez la console pour plus de détails.'
    },
    alerts: {
      metaMask: 'Installez MetaMask pour continuer.'
    },
    agenda: {
      heading: 'Agenda Web3 en direct',
      description: 'Gérez disponibilités, tarifs et inscriptions confirmées directement sur la blockchain.',
      loading: 'Chargement des activités…',
      empty: 'Aucune activité pour le moment.',
      detailsButton: 'Voir les détails',
      detailBackButton: 'Retour aux activités',
      detailHeading: "Informations sur l'activité",
      activityNotFound: "Impossible de charger cette activité. Retournez à l'agenda.",
      balanceLabel: 'Solde USDT',
      dateLabel: 'Date',
      spotsLabel: 'Places',
      priceLabel: 'Prix',
      registeredBadge: 'Vous êtes inscrit·e',
      subscribeButton: 'M’inscrire avec MetaMask',
      noSpotsButton: 'Plus de places disponibles',
      inactiveBadge: 'Activité inactive'
    },
    adminForm: {
      heading: 'Créer une nouvelle activité',
      description: 'Définissez l’expérience, la date et les places disponibles. Le prix sera exprimé en USDT.',
      nameLabel: 'Nom',
      namePlaceholder: 'Nom de l’activité',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Décrivez l’expérience',
      dateLabel: 'Date et horaire',
      maxParticipantsLabel: 'Participants maximum',
      priceLabel: 'Prix en USDT',
      pricePlaceholder: 'Ex : 25',
      submit: 'Créer l’activité'
    }
  },
  de: {
    languageName: 'Deutsch',
    languageSelectorLabel: 'Sprache',
    navbar: {
      title: 'Edge City · Patagonien-Residenz',
      subtitle: 'Eine immersive Naturerfahrung mit Anmeldungen und Zahlungen, die on-chain abgesichert sind.',
      connect: 'Wallet verbinden',
      disconnect: 'Trennen'
    },
    hero: {
      badge: 'Neue Ausgabe 2025 · San Martín de los Andes',
      title: 'Edge City Patagonien-Residenz: lebendige Kunst, Natur und Gemeinschaft on-chain vernetzt.',
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
        'Plätze, Zahlungen und Deliverables, gesichert durch den Edge City-Vertrag.'
      ]
    },
    warnings: {
      contract: 'Setze <code>REACT_APP_CONTRACT_ADDRESS</code>, um mit dem Aktivitätsvertrag zu interagieren.',
      usdt: 'Setze <code>REACT_APP_USDT_ADDRESS</code>, um auf den für Zahlungen verwendeten USDT-Token zu verweisen.'
    },
    status: {
      contractMissing: 'Konfiguriere die Vertragsadresse, um Aktivitäten zu erstellen.',
      connectWalletToCreate: 'Verbinde dein Wallet, um Aktivitäten zu erstellen.',
      creatingActivity: 'Aktivität wird erstellt...',
      activityCreated: 'Aktivität erfolgreich erstellt.',
      activityCreationFailed: 'Aktivität konnte nicht erstellt werden. Sieh für mehr Informationen in die Konsole.',
      connectWalletToRegister: 'Verbinde dein Wallet, um dich anzumelden.',
      activityUnavailable: 'Diese Aktivität ist nicht verfügbar.',
      approvingUsdt: 'USDT werden genehmigt...',
      confirmingRegistration: 'Anmeldung wird bestätigt...',
      registrationComplete: 'Anmeldung abgeschlossen!',
      registrationFailed: 'Anmeldung konnte nicht abgeschlossen werden. Sieh für Details in die Konsole.'
    },
    alerts: {
      metaMask: 'Installiere MetaMask, um fortzufahren.'
    },
    agenda: {
      heading: 'Live-Web3-Zeitplan',
      description: 'Verwalte Verfügbarkeit, Preise und bestätigte Anmeldungen direkt on-chain.',
      loading: 'Aktivitäten werden geladen...',
      empty: 'Es gibt noch keine Aktivitäten.',
      detailsButton: 'Details ansehen',
      detailBackButton: 'Zurück zu den Aktivitäten',
      detailHeading: 'Aktivitätsinformationen',
      activityNotFound: 'Diese Aktivität konnte nicht geladen werden. Kehre zur Übersicht zurück.',
      balanceLabel: 'USDT-Guthaben',
      dateLabel: 'Datum',
      spotsLabel: 'Plätze',
      priceLabel: 'Preis',
      registeredBadge: 'Du bist angemeldet',
      subscribeButton: 'Mit MetaMask anmelden',
      noSpotsButton: 'Keine Plätze verfügbar',
      inactiveBadge: 'Inaktive Aktivität'
    },
    adminForm: {
      heading: 'Neue Aktivität erstellen',
      description: 'Definiere Erlebnis, Termin und verfügbare Plätze. Der Preis wird in USDT angegeben.',
      nameLabel: 'Name',
      namePlaceholder: 'Name der Aktivität',
      descriptionLabel: 'Beschreibung',
      descriptionPlaceholder: 'Beschreibe das Erlebnis',
      dateLabel: 'Datum und Uhrzeit',
      maxParticipantsLabel: 'Maximale Teilnehmer',
      priceLabel: 'Preis in USDT',
      pricePlaceholder: 'Z. B. 25',
      submit: 'Aktivität erstellen'
    }
  },
  zh: {
    languageName: '中文',
    languageSelectorLabel: '语言',
    navbar: {
      title: 'Edge City · 巴塔哥尼亚驻地',
      subtitle: '沉浸式自然体验，报名和付款全部通过区块链保障。',
      connect: '连接钱包',
      disconnect: '断开连接'
    },
    hero: {
      badge: '2025 年全新一季 · 圣马丁德洛斯安第斯',
      title: 'Edge City 巴塔哥尼亚驻地：在链上连接的现场艺术、自然与社区。',
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
        '由 Edge City 合约保障的席位、付款与成果。'
      ]
    },
    warnings: {
      contract: '请设置 <code>REACT_APP_CONTRACT_ADDRESS</code> 以便与活动合约交互。',
      usdt: '请设置 <code>REACT_APP_USDT_ADDRESS</code> 指向用于支付的 USDT 代币。'
    },
    status: {
      contractMissing: '请配置合约地址以创建活动。',
      connectWalletToCreate: '连接钱包以创建活动。',
      creatingActivity: '正在创建活动…',
      activityCreated: '活动创建成功。',
      activityCreationFailed: '无法创建活动。请查看控制台了解更多信息。',
      connectWalletToRegister: '连接钱包以报名。',
      activityUnavailable: '该活动当前不可用。',
      approvingUsdt: '正在授权 USDT…',
      confirmingRegistration: '正在确认报名…',
      registrationComplete: '报名完成！',
      registrationFailed: '无法完成报名。请查看控制台了解更多详情。'
    },
    alerts: {
      metaMask: '请安装 MetaMask 以继续。'
    },
    agenda: {
      heading: '实时 Web3 日程',
      description: '直接在链上管理可用名额、价格与已确认的报名。',
      loading: '正在加载活动…',
      empty: '目前还没有活动。',
      detailsButton: '查看详情',
      detailBackButton: '返回活动列表',
      detailHeading: '活动信息',
      activityNotFound: '无法加载该活动，请返回日程列表。',
      balanceLabel: 'USDT 余额',
      dateLabel: '日期',
      spotsLabel: '名额',
      priceLabel: '价格',
      registeredBadge: '你已报名',
      subscribeButton: '使用 MetaMask 报名',
      noSpotsButton: '名额已满',
      inactiveBadge: '活动未开放'
    },
    adminForm: {
      heading: '创建新活动',
      description: '设定体验内容、时间与可用名额。价格将以 USDT 表示。',
      nameLabel: '名称',
      namePlaceholder: '活动名称',
      descriptionLabel: '描述',
      descriptionPlaceholder: '介绍这项体验',
      dateLabel: '日期与时间',
      maxParticipantsLabel: '最大参与人数',
      priceLabel: 'USDT 价格',
      pricePlaceholder: '例如：25',
      submit: '创建活动'
    }
  },
  ru: {
    languageName: 'Русский',
    languageSelectorLabel: 'Язык',
    navbar: {
      title: 'Edge City · Резиденция в Патагонии',
      subtitle: 'Иммерсивный опыт в природе с регистрациями и платежами, защищёнными блокчейном.',
      connect: 'Подключить кошелёк',
      disconnect: 'Отключить'
    },
    hero: {
      badge: 'Новое издание 2025 · Сан-Мартин-де-лос-Андес',
      title: 'Резиденция Edge City в Патагонии: живое искусство, природа и сообщество, соединённые on-chain.',
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
        'Места, платежи и результаты под защитой контракта Edge City.'
      ]
    },
    warnings: {
      contract: 'Укажите <code>REACT_APP_CONTRACT_ADDRESS</code>, чтобы взаимодействовать с контрактом активностей.',
      usdt: 'Укажите <code>REACT_APP_USDT_ADDRESS</code>, чтобы настроить USDT-токен для платежей.'
    },
    status: {
      contractMissing: 'Настройте адрес контракта, чтобы создавать активности.',
      connectWalletToCreate: 'Подключите кошелёк, чтобы создавать активности.',
      creatingActivity: 'Создание активности…',
      activityCreated: 'Активность успешно создана.',
      activityCreationFailed: 'Не удалось создать активность. Подробности смотрите в консоли.',
      connectWalletToRegister: 'Подключите кошелёк, чтобы зарегистрироваться.',
      activityUnavailable: 'Эта активность недоступна.',
      approvingUsdt: 'Идёт подтверждение USDT…',
      confirmingRegistration: 'Подтверждение регистрации…',
      registrationComplete: 'Регистрация завершена!',
      registrationFailed: 'Не удалось завершить регистрацию. Подробности смотрите в консоли.'
    },
    alerts: {
      metaMask: 'Установите MetaMask, чтобы продолжить.'
    },
    agenda: {
      heading: 'Живой график Web3',
      description: 'Управляйте доступностью, ценами и подтверждёнными регистрациями напрямую в блокчейне.',
      loading: 'Загрузка активностей…',
      empty: 'Активностей пока нет.',
      detailsButton: 'Подробнее',
      detailBackButton: 'Назад к активностям',
      detailHeading: 'Информация об активности',
      activityNotFound: 'Не удалось загрузить активность. Вернитесь к расписанию.',
      balanceLabel: 'Баланс USDT',
      dateLabel: 'Дата',
      spotsLabel: 'Места',
      priceLabel: 'Цена',
      registeredBadge: 'Вы зарегистрированы',
      subscribeButton: 'Подписаться через MetaMask',
      noSpotsButton: 'Нет свободных мест',
      inactiveBadge: 'Активность неактивна'
    },
    adminForm: {
      heading: 'Создать новую активность',
      description: 'Определите опыт, дату и количество мест. Цена указывается в USDT.',
      nameLabel: 'Название',
      namePlaceholder: 'Название активности',
      descriptionLabel: 'Описание',
      descriptionPlaceholder: 'Опишите опыт',
      dateLabel: 'Дата и время',
      maxParticipantsLabel: 'Максимум участников',
      priceLabel: 'Цена в USDT',
      pricePlaceholder: 'Напр.: 25',
      submit: 'Создать активность'
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
          'Certified Edge City guide and trekking gear included.',
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
          'Guía habilitado de Edge City y equipo de trekking incluido.',
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
          'Guide Edge City certifié et équipement de trekking inclus.',
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
          'Zertifizierter Edge City-Guide und Trekkingausrüstung inklusive.',
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
          'Edge City 认证向导与登山装备全程提供。',
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
          'Сертифицированный гид Edge City и включённое снаряжение для треккинга.',
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
        guide: 'Encadrée par des guides IFMGA et des performers Edge City.'
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
        guide: 'Begleitet von IFMGA-Guides und Edge City-Performer:innen.'
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
        guide: '由 IFMGA 向导与 Edge City 表演者带领。'
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
        guide: 'Наставники — гиды IFMGA и исполнители Edge City.'
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
        guide: 'Curated by the Edge City culinary team.'
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
        guide: 'Curaduría gastronómica de la cocina Edge City.'
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
        guide: 'Curaté par l’équipe culinaire d’Edge City.'
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
        guide: 'Kuratiert vom Edge City-Küchenteam.'
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
        guide: '由 Edge City 烹饪团队策展。'
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
        guide: 'Кураторская работа кулинарной команды Edge City.'
      }
    }
  }
];
