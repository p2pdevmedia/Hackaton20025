import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import Navbar from './components/Navbar';
import ActivityCalendar from './components/ActivityCalendar';
import ActivityGallery from './components/ActivityGallery';
import { translations, residencyActivities as residencyCatalog, localeMap } from './translations';

const destinationWallet = process.env.REACT_APP_DESTINATION_WALLET || '';
const isValidDestination = ethers.utils.isAddress(destinationWallet);

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    name: 'Lolog Lakeshore Asado',
    description:
      'Sail across Lago Lolog to Iván Moritz Karl’s remote cabin, tour his studio, and share a Patagonian asado on a secluded beach.',
    date: Math.floor(Date.UTC(2025, 0, 18, 21, 0) / 1000),
    maxParticipants: 20,
    registeredCount: 12,
    price: '0.03 ETH deposit',
    priceEth: '0.03',
    active: true
  },
  {
    id: 2,
    name: 'Granite Climbing Clinic',
    description:
      'Guided progression on Patagonian granite with breathing rituals, safety coaching, and media documentation of every pitch.',
    date: Math.floor(Date.UTC(2025, 1, 14, 14, 0) / 1000),
    maxParticipants: 12,
    registeredCount: 7,
    price: '0.05 ETH deposit',
    priceEth: '0.05',
    active: true
  },
  {
    id: 3,
    name: 'Sunset Kayak Crossing',
    description:
      'A gentle paddle across translucent bays, ending with a fireside toast and stories from the residency community.',
    date: Math.floor(Date.UTC(2025, 1, 17, 22, 30) / 1000),
    maxParticipants: 16,
    registeredCount: 4,
    price: '0 ETH — message only',
    priceEth: '0',
    active: true
  }
];

function App() {
  const [account, setAccount] = useState(null);
  const [activities, setActivities] = useState(() =>
    DEFAULT_ACTIVITIES.map(activity => ({ ...activity, isRegistered: false }))
  );
  const [statusKey, setStatusKey] = useState(null);
  const [language, setLanguage] = useState('en');
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [participantCount, setParticipantCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const text = useMemo(() => translations[language] || translations.en, [language]);
  const languageOptions = useMemo(
    () =>
      ['en', 'es']
        .filter(code => translations[code])
        .map(code => ({ code, label: translations[code].languageName })),
    []
  );
  const heroActivities = useMemo(
    () =>
      residencyCatalog.map(activity => {
        const localized = activity.translations[language] || activity.translations.en;
        return {
          ...localized,
          id: activity.id,
          images: activity.images ? activity.images.filter(Boolean) : []
        };
      }),
    [language]
  );
  const locale = useMemo(() => localeMap[language] || localeMap.en, [language]);
  const calendarMonths = useMemo(
    () => [
      { year: 2024, month: 9, label: text.calendar.months.october },
      { year: 2024, month: 10, label: text.calendar.months.november }
    ],
    [text.calendar.months]
  );
  const seasonalEvents = useMemo(() => {
    const createDate = (month, day) => new Date(Date.UTC(2024, month, day));
    return [
      {
        id: 'october-climb',
        title: text.calendar.events.octoberClimb.title,
        shortLabel: text.calendar.events.octoberClimb.shortLabel,
        description: text.calendar.events.octoberClimb.description,
        type: 'climb',
        start: createDate(9, 20),
        end: createDate(9, 23)
      },
      {
        id: 'november-kayak',
        title: text.calendar.events.novemberKayak.title,
        shortLabel: text.calendar.events.novemberKayak.shortLabel,
        description: text.calendar.events.novemberKayak.description,
        type: 'kayak',
        start: createDate(10, 1),
        end: createDate(10, 3)
      },
      {
        id: 'november-climb',
        title: text.calendar.events.novemberClimb.title,
        shortLabel: text.calendar.events.novemberClimb.shortLabel,
        description: text.calendar.events.novemberClimb.description,
        type: 'climb',
        start: createDate(10, 10),
        end: createDate(10, 13)
      }
    ];
  }, [text.calendar.events]);
  const statusMessage = statusKey ? text.status[statusKey] : '';
  const selectedActivity = useMemo(() => {
    if (selectedActivityId === null) {
      return null;
    }
    return activities.find(activity => activity.id === selectedActivityId) || null;
  }, [activities, selectedActivityId]);

  const hasProvider = useMemo(() => typeof window !== 'undefined' && window.ethereum, []);

  const getProvider = useCallback(() => {
    if (!hasProvider) {
      return null;
    }
    return new ethers.providers.Web3Provider(window.ethereum);
  }, [hasProvider]);

  useEffect(() => {
    if (!hasProvider) return;
    const handleAccountsChanged = accounts => {
      if (!accounts.length) {
        setAccount(null);
      } else {
        setAccount(ethers.utils.getAddress(accounts[0]));
      }
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };
  }, [hasProvider]);
  const connect = async () => {
    if (!hasProvider) {
      alert(text.alerts.metaMask);
      return;
    }
    try {
      const provider = getProvider();
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts.length) {
        const normalized = ethers.utils.getAddress(accounts[0]);
        setAccount(normalized);
      }
    } catch (error) {
      console.error('Wallet connection failed', error);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setSelectedActivityId(null);
    setParticipantCount(1);
  };

  const openActivity = useCallback(activity => {
    if (!activity) {
      return;
    }
    setSelectedActivityId(activity.id);
    setParticipantCount(1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const closeActivity = useCallback(() => {
    setSelectedActivityId(null);
    setParticipantCount(1);
  }, []);

  const register = useCallback(
    async activity => {
      setStatusKey(null);
      if (!activity) {
        setStatusKey('activityUnavailable');
        return;
      }
      if (!account) {
        setStatusKey('connectWalletToRegister');
        return;
      }
      if (!isValidDestination) {
        setStatusKey('destinationMissing');
        return;
      }
      const remaining = activity.maxParticipants - activity.registeredCount;
      if (remaining <= 0 || activity.date * 1000 <= Date.now() || !activity.active) {
        setStatusKey('activityUnavailable');
        return;
      }
      if (activity.isRegistered) {
        setStatusKey('alreadyRegistered');
        return;
      }
      if (!Number.isInteger(participantCount) || participantCount <= 0) {
        setStatusKey('invalidParticipantCount');
        return;
      }
      if (participantCount > remaining) {
        setStatusKey('notEnoughSpots');
        return;
      }

      const provider = getProvider();
      if (!provider) {
        alert(text.alerts.metaMask);
        return;
      }

      try {
        setIsProcessing(true);
        const signer = provider.getSigner();
        const value = activity.priceEth
          ? ethers.utils.parseEther(activity.priceEth).mul(participantCount)
          : ethers.constants.Zero;
        const message = `Activity: ${activity.name}\nParticipants: ${participantCount}\nWallet: ${account}`;

        setStatusKey('requestingSignature');
        const tx = await signer.sendTransaction({
          to: destinationWallet,
          value,
          data: ethers.utils.toUtf8Bytes(message)
        });

        setStatusKey('confirmingOnChain');
        await tx.wait();

        setActivities(previous =>
          previous.map(item =>
            item.id === activity.id
              ? {
                  ...item,
                  registeredCount: Math.min(item.registeredCount + participantCount, item.maxParticipants),
                  isRegistered: true
                }
              : item
          )
        );
        setStatusKey('registrationComplete');
      } catch (error) {
        console.error('Error sending registration transaction', error);
        setStatusKey('registrationFailed');
      } finally {
        setIsProcessing(false);
      }
    },
    [account, destinationWallet, getProvider, isValidDestination, participantCount, text.alerts.metaMask]
  );

  const shortDestination = useMemo(() => {
    if (!isValidDestination) {
      return '';
    }
    return `${destinationWallet.slice(0, 6)}...${destinationWallet.slice(-4)}`;
  }, [destinationWallet, isValidDestination]);

  const handleParticipantChange = event => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) {
      setParticipantCount(1);
      return;
    }
    setParticipantCount(Math.floor(value));
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        account={account}
        connect={connect}
        disconnect={disconnect}
        language={language}
        setLanguage={setLanguage}
        text={text.navbar}
        languageLabel={text.languageSelectorLabel}
        languageOptions={languageOptions}
      />
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-3 py-1 text-xs uppercase tracking-widest">
              {text.hero.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
              {text.hero.title}
            </h2>
            <p className="text-base text-slate-200">
              {text.hero.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://edgecity.notion.site/EC-Patagonia-Residency-List-updated-regularly-240d45cdfc5980e980f8db7d362c553d"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100"
              >
                {text.hero.primaryLink}
              </a>
              <div className="inline-flex items-center gap-2 rounded border border-white/40 px-4 py-2 text-xs sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {text.hero.dataBadge}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-lg font-medium">{text.heroCard.heading}</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {text.heroCard.items.map((item, index) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    className={`mt-1 h-2 w-2 rounded-full ${
                      index === 0 ? 'bg-emerald-400' : index === 1 ? 'bg-sky-400' : 'bg-amber-400'
                    }`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        <section className="grid gap-6 md:grid-cols-2">
          {heroActivities.map(activity => {
            const isPatagonianAsado = activity.id === 'patagonian-asado';

            return (
              <article key={activity.id} className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-100">
                <ActivityGallery images={activity.images} alt={activity.title} />
                <div className="relative overflow-hidden px-6 py-6">
                  {isPatagonianAsado && (
                    <>
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://ipfs.io/ipfs/bafybeiad72atzvbl2sgaafzeii4ysf4m7qme54xoxg3pkpel2cksfmwfym"
                        autoPlay
                        loop
                        muted
                        playsInline
                        aria-hidden="true"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-slate-900/60" aria-hidden="true" />
                    </>
                  )}
                  <div className="relative space-y-3">
                    <h3 className={`text-xl font-semibold ${isPatagonianAsado ? 'text-white' : 'text-slate-900'}`}>
                      {activity.title}
                    </h3>
                    <p className={`text-sm ${isPatagonianAsado ? 'text-slate-100' : 'text-slate-600'}`}>{activity.summary}</p>
                    <ul className={`space-y-2 text-sm ${isPatagonianAsado ? 'text-slate-100' : 'text-slate-700'}`}>
                      {activity.highlights.map(highlight => (
                        <li key={highlight} className="flex items-start gap-2">
                          <span
                            className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                              isPatagonianAsado ? 'bg-emerald-300' : 'bg-blue-500'
                            }`}
                          />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <p className={`text-xs uppercase tracking-wide ${isPatagonianAsado ? 'text-slate-200' : 'text-slate-500'}`}>
                      {activity.guide}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {!isValidDestination && (
          <div className="p-4 rounded bg-yellow-100 text-yellow-900">
            <span dangerouslySetInnerHTML={{ __html: text.warnings.destination }} />
          </div>
        )}

        {statusMessage && (
          <div className="p-4 rounded bg-blue-100 text-blue-900">{statusMessage}</div>
        )}

        <section className="space-y-4">
          {selectedActivityId !== null ? (
            selectedActivity ? (
              (() => {
                const remaining = selectedActivity.maxParticipants - selectedActivity.registeredCount;
                const dateString = new Date(selectedActivity.date * 1000).toLocaleString(locale, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                });
                const canRegister =
                  account &&
                  !selectedActivity.isRegistered &&
                  remaining > 0 &&
                  selectedActivity.active &&
                  selectedActivity.date * 1000 > Date.now() &&
                  participantCount > 0 &&
                  participantCount <= remaining &&
                  isValidDestination &&
                  !isProcessing;

                const disabledReasonKey = canRegister
                  ? null
                  : (() => {
                      if (isProcessing) {
                        return 'processingRegistration';
                      }
                      if (!account) {
                        return 'connectWalletToRegister';
                      }
                      if (!isValidDestination) {
                        return 'destinationMissing';
                      }
                      if (
                        !selectedActivity.active ||
                        selectedActivity.date * 1000 <= Date.now() ||
                        remaining <= 0
                      ) {
                        return 'activityUnavailable';
                      }
                      if (selectedActivity.isRegistered) {
                        return 'alreadyRegistered';
                      }
                      if (!Number.isInteger(participantCount) || participantCount <= 0) {
                        return 'invalidParticipantCount';
                      }
                      if (participantCount > remaining) {
                        return 'notEnoughSpots';
                      }
                      return null;
                    })();

                const disabledReason = disabledReasonKey ? text.status[disabledReasonKey] : undefined;

                return (
                  <div className="space-y-4">
                    <button
                      onClick={closeActivity}
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      ← {text.agenda.detailBackButton}
                    </button>
                    <div className="rounded border bg-white p-6 shadow space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs uppercase tracking-wide text-blue-600">{text.agenda.detailHeading}</p>
                        <h3 className="text-2xl font-semibold text-slate-900">{selectedActivity.name}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{selectedActivity.description}</p>
                      </div>
                      <dl className="grid gap-4 sm:grid-cols-3 text-sm text-gray-700">
                        <div>
                          <dt className="font-medium text-gray-900">{text.agenda.dateLabel}</dt>
                          <dd>{dateString}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-900">{text.agenda.spotsLabel}</dt>
                          <dd>
                            {selectedActivity.registeredCount}/{selectedActivity.maxParticipants}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-gray-900">{text.agenda.priceLabel}</dt>
                          <dd>{selectedActivity.price}</dd>
                        </div>
                      </dl>
                      <div className="grid gap-4 sm:grid-cols-[1fr,auto] sm:items-end">
                        <label className="space-y-1">
                          <span className="text-sm font-medium text-gray-700">{text.agenda.participantCountLabel}</span>
                          <input
                            type="number"
                            min="1"
                            max={Math.max(1, remaining)}
                            value={participantCount}
                            onChange={handleParticipantChange}
                            className="w-full rounded border px-3 py-2"
                          />
                          <span className="block text-xs text-gray-500">{text.agenda.participantCountHelper}</span>
                        </label>
                        {selectedActivity.isRegistered ? (
                          <span className="rounded bg-green-100 text-green-700 px-3 py-2 text-center">
                            {text.agenda.registeredBadge}
                          </span>
                        ) : (
                          <button
                            onClick={() => register(selectedActivity)}
                            disabled={!canRegister}
                            title={disabledReason}
                            className={`px-4 py-2 rounded text-white transition-colors ${
                              canRegister ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {isProcessing ? text.agenda.processingButton : text.agenda.subscribeButton}
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        {!selectedActivity.active && (
                          <span className="rounded bg-gray-200 text-gray-600 px-3 py-2 text-center">
                            {text.agenda.inactiveBadge}
                          </span>
                        )}
                        {remaining <= 0 && (
                          <span className="rounded bg-amber-100 text-amber-700 px-3 py-2 text-center">
                            {text.agenda.noSpotsButton}
                          </span>
                        )}
                        {shortDestination && (
                          <span className="px-3 py-2 bg-slate-100 text-slate-600 rounded">
                            {text.agenda.transactionInfo.replace('{wallet}', shortDestination)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="space-y-4">
                <button
                  onClick={closeActivity}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  ← {text.agenda.detailBackButton}
                </button>
                <div className="rounded border border-dashed border-gray-300 p-6 text-center text-gray-500">
                  {text.agenda.activityNotFound}
                </div>
              </div>
            )
          ) : activities.length === 0 ? null : (
            <div className="space-y-4">
              {activities.map(activity => {
                const remaining = activity.maxParticipants - activity.registeredCount;
                const dateString = new Date(activity.date * 1000).toLocaleString(locale, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                });

                return (
                  <div key={activity.id} className="rounded border bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-900">{activity.name}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{activity.description}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>
                            <span className="font-medium">{text.agenda.dateLabel}:</span> {dateString}
                          </p>
                          <p>
                            <span className="font-medium">{text.agenda.spotsLabel}:</span> {activity.registeredCount}/{activity.maxParticipants}
                          </p>
                          <p>
                            <span className="font-medium">{text.agenda.priceLabel}:</span> {activity.price}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-stretch min-w-[200px]">
                        {activity.isRegistered && (
                          <span className="rounded bg-green-100 text-green-700 px-3 py-2 text-center">
                            {text.agenda.registeredBadge}
                          </span>
                        )}
                        {!activity.active && (
                          <span className="rounded bg-gray-200 text-gray-600 px-3 py-2 text-center">
                            {text.agenda.inactiveBadge}
                          </span>
                        )}
                        {remaining <= 0 && (
                          <span className="rounded bg-amber-100 text-amber-700 px-3 py-2 text-center">
                            {text.agenda.noSpotsButton}
                          </span>
                        )}
                        <button
                          onClick={() => openActivity(activity)}
                          className="px-4 py-2 rounded border border-blue-600 text-blue-600 transition-colors hover:bg-blue-50"
                        >
                          {text.agenda.detailsButton}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <ActivityCalendar
          months={calendarMonths}
          events={seasonalEvents}
          locale={locale}
          text={text.calendar}
        />
      </main>
    </div>
  );
}

export default App;
