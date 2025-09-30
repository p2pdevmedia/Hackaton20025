import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import Navbar from './components/Navbar';
import ActivityCalendar from './components/ActivityCalendar';
import ActivityGallery from './components/ActivityGallery';
import ActivityRegistration from './components/ActivityRegistration';
import { translations, residencyActivities as residencyCatalog, localeMap } from './translations';

function App() {
  const [account, setAccount] = useState(null);
  const [language, setLanguage] = useState('en');

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
          images: activity.images ? activity.images.filter(Boolean) : [],
          priceUSDT: activity.priceUSDT,
          maxParticipants: activity.maxParticipants
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
                    <ActivityRegistration
                      activity={activity}
                      account={account}
                      getProvider={getProvider}
                      text={text}
                    />
                  </div>
                </div>
              </article>
            );
          })}
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
