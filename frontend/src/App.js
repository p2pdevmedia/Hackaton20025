import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import ActivityRegistry from './ActivityRegistry.json';
import Navbar from './components/Navbar';
import ActivityCalendar from './components/ActivityCalendar';
import { translations, residencyActivities as residencyCatalog, localeMap } from './translations';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '';
const usdtAddress = process.env.REACT_APP_USDT_ADDRESS || '';

const isValidContract = ethers.utils.isAddress(contractAddress);
const isValidUsdt = ethers.utils.isAddress(usdtAddress);

const ERC20_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address owner) view returns (uint256)'
];

function App() {
  const [account, setAccount] = useState(null);
  const [activities, setActivities] = useState([]);
  const [usdtDecimals, setUsdtDecimals] = useState(6);
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [statusKey, setStatusKey] = useState(null);
  const [language, setLanguage] = useState('en');

  const text = useMemo(() => translations[language] || translations.en, [language]);
  const languageOptions = useMemo(
    () => Object.entries(translations).map(([code, value]) => ({ code, label: value.languageName })),
    []
  );
  const heroActivities = useMemo(
    () =>
      residencyCatalog.map(activity => {
        const localized = activity.translations[language] || activity.translations.en;
        return { ...localized, id: activity.id, image: activity.image };
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
  const statusMessage = statusKey ? text.status[statusKey] || '' : '';

  const hasProvider = useMemo(() => typeof window !== 'undefined' && window.ethereum, []);

  const getProvider = useCallback(() => {
    if (!hasProvider) {
      return null;
    }
    return new ethers.providers.Web3Provider(window.ethereum);
  }, [hasProvider]);

  const fetchUsdtDecimals = useCallback(
    async provider => {
      if (!isValidUsdt) {
        setUsdtDecimals(6);
        return 6;
      }
      try {
        const usdt = new ethers.Contract(usdtAddress, ERC20_ABI, provider);
        const decimals = await usdt.decimals();
        setUsdtDecimals(decimals);
        return decimals;
      } catch (err) {
        console.error('Error fetching USDT decimals', err);
        setUsdtDecimals(6);
        return 6;
      }
    },
    []
  );

  const fetchActivities = useCallback(async () => {
    if (!isValidContract) return;
    const provider = getProvider();
    if (!provider) return;

    setLoading(true);
    try {
      const contract = new ethers.Contract(contractAddress, ActivityRegistry.abi, provider);
      const rawActivities = await contract.getActivities();
      const decimals = await fetchUsdtDecimals(provider);

      const formatted = await Promise.all(
        rawActivities.map(async activity => {
          const id = activity.id.toNumber();
          let registered = false;
          if (account) {
            try {
              registered = await contract.isRegistered(id, account);
            } catch (err) {
              console.warn('Error fetching registration status', err);
            }
          }
          return {
            id,
            name: activity.name,
            description: activity.description,
            date: activity.date.toNumber(),
            maxParticipants: activity.maxParticipants.toNumber(),
            registeredCount: activity.registeredCount.toNumber(),
            priceRaw: activity.priceUSDT,
            price: ethers.utils.formatUnits(activity.priceUSDT, decimals),
            organizer: activity.organizer,
            active: activity.active,
            isRegistered: registered
          };
        })
      );

      setActivities(formatted);
    } catch (error) {
      console.error('Error fetching activities', error);
    } finally {
      setLoading(false);
    }
  }, [account, fetchUsdtDecimals, getProvider]);

  const fetchUsdtBalance = useCallback(async () => {
    if (!account || !isValidUsdt) {
      setUsdtBalance('0');
      return;
    }
    const provider = getProvider();
    if (!provider) return;
    try {
      const token = new ethers.Contract(usdtAddress, ERC20_ABI, provider);
      const balance = await token.balanceOf(account);
      setUsdtBalance(ethers.utils.formatUnits(balance, usdtDecimals));
    } catch (err) {
      console.error('Error fetching USDT balance', err);
      setUsdtBalance('0');
    }
  }, [account, getProvider, isValidUsdt, usdtDecimals]);

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
      if (!isValidContract) {
        setStatusKey('contractMissing');
        return;
      }
      if (activity.isRegistered) {
        setStatusKey('alreadyRegistered');
        return;
      }
      const remainingSpots = activity.maxParticipants - activity.registeredCount;
      if (remainingSpots <= 0 || activity.date * 1000 <= Date.now()) {
        setStatusKey('activityUnavailable');
        return;
      }
      if (!activity.active) {
        setStatusKey('activityUnavailable');
        return;
      }
      const provider = getProvider();
      if (!provider) return;

      try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ActivityRegistry.abi, signer);

        if (activity.priceRaw.gt(0) && isValidUsdt) {
          const token = new ethers.Contract(usdtAddress, ERC20_ABI, signer);
          const allowance = await token.allowance(account, contractAddress);
          if (allowance.lt(activity.priceRaw)) {
            const approveTx = await token.approve(contractAddress, activity.priceRaw);
            setStatusKey('approvingUsdt');
            await approveTx.wait();
          }
        }

        const tx = await contract.registerForActivity(activity.id);
        setStatusKey('confirmingRegistration');
        await tx.wait();
        setStatusKey('registrationComplete');
        await Promise.all([fetchActivities(), fetchUsdtBalance()]);
      } catch (error) {
        console.error('Error registering', error);
        setStatusKey('registrationFailed');
      }
    },
    [account, fetchActivities, fetchUsdtBalance, getProvider, isValidContract, isValidUsdt]
  );

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  useEffect(() => {
    fetchUsdtBalance();
  }, [fetchUsdtBalance]);

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
    setUsdtBalance('0');
    setStatusKey(null);
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
          {heroActivities.map(activity => (
            <article key={activity.id} className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-100">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="space-y-3 px-6 py-6">
                <h3 className="text-xl font-semibold text-slate-900">{activity.title}</h3>
                <p className="text-sm text-slate-600">{activity.summary}</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {activity.highlights.map(highlight => (
                    <li key={highlight} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <p className="text-xs uppercase tracking-wide text-slate-500">{activity.guide}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/60 p-6 text-sm text-blue-900 shadow-inner">
          <h2 className="text-lg font-semibold text-blue-900">{text.contract.heading}</h2>
          <p className="mt-2">{text.contract.paragraph1}</p>
          <p className="mt-3">{text.contract.paragraph2}</p>
        </section>

        {!isValidContract && (
          <div className="p-4 rounded bg-yellow-100 text-yellow-900">
            <span dangerouslySetInnerHTML={{ __html: text.warnings.contract }} />
          </div>
        )}
        {!isValidUsdt && (
          <div className="p-4 rounded bg-yellow-100 text-yellow-900">
            <span dangerouslySetInnerHTML={{ __html: text.warnings.usdt }} />
          </div>
        )}

        {statusMessage && (
          <div className="p-4 rounded bg-blue-100 text-blue-900">{statusMessage}</div>
        )}

        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{text.agenda.heading}</h2>
              <p className="text-sm text-gray-600">{text.agenda.description}</p>
            </div>
            {account && isValidUsdt && (
              <div className="text-sm text-gray-700">
                {text.agenda.balanceLabel}: <span className="font-semibold">{usdtBalance}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
                {text.agenda.loading}
              </div>
            ) : activities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
                {text.agenda.empty}
              </div>
            ) : (
              activities.map(activity => {
                const remaining = activity.maxParticipants - activity.registeredCount;
                const registrationClosed = activity.date * 1000 <= Date.now();
                const canRegister = activity.active && !registrationClosed && remaining > 0 && !activity.isRegistered;
                const dateString = new Date(activity.date * 1000).toLocaleString(locale, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                });
                const priceLabel = activity.priceRaw.isZero() ? text.agenda.freeLabel : `${activity.price} USDT`;
                const spotsDetail =
                  remaining > 0 ? `${remaining} ${text.agenda.remainingLabel}` : text.agenda.noSpotsBadge;

                let buttonLabel = text.agenda.registerButton;
                if (activity.isRegistered) {
                  buttonLabel = text.agenda.registeredBadge;
                } else if (!activity.active) {
                  buttonLabel = text.agenda.inactiveBadge;
                } else if (remaining <= 0) {
                  buttonLabel = text.agenda.noSpotsBadge;
                } else if (registrationClosed) {
                  buttonLabel = text.agenda.closedLabel;
                }

                return (
                  <article
                    key={activity.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-start md:justify-between"
                  >
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-slate-900">{activity.name}</h3>
                      <p className="text-sm text-slate-600 whitespace-pre-line">{activity.description}</p>
                      <dl className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
                        <div>
                          <dt className="font-semibold text-slate-800">{text.agenda.dateLabel}</dt>
                          <dd>{dateString}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-slate-800">{text.agenda.spotsLabel}</dt>
                          <dd>{`${activity.registeredCount}/${activity.maxParticipants}`} · {spotsDetail}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-slate-800">{text.agenda.priceLabel}</dt>
                          <dd>{priceLabel}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex flex-col items-stretch gap-2 sm:min-w-[220px]">
                      <div className="flex flex-wrap gap-2">
                        {activity.isRegistered && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            {text.agenda.registeredBadge}
                          </span>
                        )}
                        {!activity.active && (
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                            {text.agenda.inactiveBadge}
                          </span>
                        )}
                        {remaining <= 0 && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            {text.agenda.noSpotsBadge}
                          </span>
                        )}
                        {registrationClosed && remaining > 0 && (
                          <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                            {text.agenda.closedLabel}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => register(activity)}
                        disabled={!canRegister}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                          canRegister
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'cursor-not-allowed bg-slate-200 text-slate-500'
                        }`}
                      >
                        {buttonLabel}
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
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
