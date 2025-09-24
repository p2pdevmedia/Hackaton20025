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
  const [isAdmin, setIsAdmin] = useState(false);
  const [usdtDecimals, setUsdtDecimals] = useState(6);
  const [usdtBalance, setUsdtBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    maxParticipants: '',
    price: ''
  });
  const [statusKey, setStatusKey] = useState(null);
  const [language, setLanguage] = useState('en');
  const [selectedActivityId, setSelectedActivityId] = useState(null);

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
      const [admin, rawActivities] = await Promise.all([
        contract.admin(),
        contract.getActivities()
      ]);

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
      if (account) {
        setIsAdmin(admin.toLowerCase() === account.toLowerCase());
      } else {
        setIsAdmin(false);
      }
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
  }, [account, getProvider, usdtDecimals]);

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
        setIsAdmin(false);
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
    setIsAdmin(false);
    setUsdtBalance('0');
    setSelectedActivityId(null);
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      date: '',
      maxParticipants: '',
      price: ''
    });
  };

  const openActivity = useCallback(activityId => {
    setSelectedActivityId(activityId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const closeActivity = useCallback(() => {
    setSelectedActivityId(null);
  }, []);

  const createActivity = async event => {
    event.preventDefault();
    setStatusKey(null);

    if (!isValidContract) {
      setStatusKey('contractMissing');
      return;
    }
    if (!account) {
      setStatusKey('connectWalletToCreate');
      return;
    }

    const provider = getProvider();
    if (!provider) return;

    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ActivityRegistry.abi, signer);

      const timestamp = Math.floor(new Date(formData.date).getTime() / 1000);
      const maxParticipants = parseInt(formData.maxParticipants, 10);
      const price = formData.price ? ethers.utils.parseUnits(formData.price, usdtDecimals) : ethers.constants.Zero;

      const tx = await contract.createActivity(
        formData.name.trim(),
        formData.description.trim(),
        timestamp,
        maxParticipants,
        price
      );
      setStatusKey('creatingActivity');
      await tx.wait();
      setStatusKey('activityCreated');
      resetForm();
      await fetchActivities();
    } catch (error) {
      console.error('Error creating activity', error);
      setStatusKey('activityCreationFailed');
    }
  };

  const register = async activity => {
    setStatusKey(null);
    if (!activity) {
      setStatusKey('activityUnavailable');
      return;
    }
    if (!account) {
      setStatusKey('connectWalletToRegister');
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
                  selectedActivity.date * 1000 > Date.now();

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
                          <dd>{selectedActivity.price} USDT</dd>
                        </div>
                      </dl>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {selectedActivity.isRegistered ? (
                          <span className="rounded bg-green-100 text-green-700 px-3 py-2 text-center">
                            {text.agenda.registeredBadge}
                          </span>
                        ) : (
                          <button
                            onClick={() => register(selectedActivity)}
                            disabled={!canRegister || !isValidContract}
                            className={`px-4 py-2 rounded text-white transition-colors ${
                              canRegister && isValidContract
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {text.agenda.subscribeButton}
                          </button>
                        )}
                        <div className="flex flex-wrap gap-2">
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
                        </div>
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
          ) : loading ? (
            <div className="text-center text-gray-500">{text.agenda.loading}</div>
          ) : activities.length === 0 ? (
            <div className="rounded border border-dashed border-gray-300 p-6 text-center text-gray-500">
              {text.agenda.empty}
            </div>
          ) : (
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
                            <span className="font-medium">{text.agenda.priceLabel}:</span> {activity.price} USDT
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
                          onClick={() => openActivity(activity.id)}
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

        {isAdmin && (
          <section className="rounded bg-white p-6 shadow space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{text.adminForm.heading}</h2>
              <p className="text-sm text-gray-600">{text.adminForm.description}</p>
            </div>
            <form className="space-y-4" onSubmit={createActivity}>
              <div>
                <label className="block text-sm font-medium text-gray-700">{text.adminForm.nameLabel}</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                  placeholder={text.adminForm.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{text.adminForm.descriptionLabel}</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                  rows={4}
                  placeholder={text.adminForm.descriptionPlaceholder}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">{text.adminForm.dateLabel}</label>
                  <input
                    required
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded border px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{text.adminForm.maxParticipantsLabel}</label>
                  <input
                    required
                    type="number"
                    min="1"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded border px-3 py-2"
                  />
                </div>
              </div>
              <div className="sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700">{text.adminForm.priceLabel}</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                  placeholder={text.adminForm.pricePlaceholder}
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {text.adminForm.submit}
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
