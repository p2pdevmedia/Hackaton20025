import { useCallback, useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

import ActivityRegistry from './ActivityRegistry.json';
import Navbar from './components/Navbar';

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

const residencyActivities = [
  {
    id: 'mountain-expedition',
    title: 'Salida de montaña al corazón de la cordillera',
    summary:
      'Ascenso guiado entre bosques nativos, miradores ocultos y relatos locales para sentir la energía del Parque Nacional Lanín.',
    highlights: [
      'Guía habilitado de Edge City y equipo de trekking incluido',
      'Registro fotográfico y checkpoints sincronizados con el contrato electrónico',
      'Cierre con breathwork frente al volcán Lanín'
    ],
    image:
      'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=80',
    guide: 'Coordinada por Iván Moritz Karl y la comunidad residente'
  },
  {
    id: 'lake-kayak',
    title: 'Travesía en kayak por el lago Lolog',
    summary:
      'Remada suave entre bahías transparentes, aprendiendo lectura del clima patagónico y navegando en silencio al atardecer.',
    highlights: [
      'Kayaks dobles, chalecos y briefing de seguridad incluidos',
      'Check-in en cadena al embarcar y tracking de cupos en vivo',
      'Brindis con cocina de campamento en la playa de arena volcánica'
    ],
    image:
      'https://images.unsplash.com/photo-1526481280695-3c46973ed107?auto=format&fit=crop&w=1200&q=80',
    guide: 'Logística junto al club náutico de Lolog y artistas residentes'
  },
  {
    id: 'rock-climbing',
    title: 'Clínica de escalada en roca y movimientos conscientes',
    summary:
      'Sesión progresiva en la escuela de granito local para conectar fuerza, respiración y foco creativo.',
    highlights: [
      'Todos los niveles: desde boulder introductorio a vías con cuerda',
      'Seguimiento de progresos y liberación de responsabilidad digital firmada on-chain',
      'Círculo de integración sonora al pie de la pared'
    ],
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    guide: 'Mentoreada por guías IFMGA y performers de Edge City'
  },
  {
    id: 'patagonian-asado',
    title: 'Asado patagónico íntimo en la orilla del lago',
    summary:
      'Fuego lento, productos locales y pintura en vivo de Iván Moritz Karl mientras cae la noche sobre Lolog.',
    highlights: [
      'Menú de carnes, hongos y vegetales de productores aliados',
      'Registro audiovisual conectado al contrato para actualizar memorabilia digital',
      'Jam session con residentes y comunidad invitada'
    ],
    image:
      'https://images.unsplash.com/photo-1529694157877-4b9a0c7d3ec6?auto=format&fit=crop&w=1200&q=80',
    guide: 'Curaduría gastronómica de la cocina Edge City'
  }
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
  const [statusMessage, setStatusMessage] = useState('');

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
      alert('Instalá MetaMask para continuar');
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

  const createActivity = async event => {
    event.preventDefault();
    setStatusMessage('');

    if (!isValidContract) {
      setStatusMessage('Configura la dirección del contrato para crear actividades.');
      return;
    }
    if (!account) {
      setStatusMessage('Conectá tu wallet para crear actividades.');
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
      setStatusMessage('Creando actividad...');
      await tx.wait();
      setStatusMessage('Actividad creada con éxito.');
      resetForm();
      await fetchActivities();
    } catch (error) {
      console.error('Error creating activity', error);
      setStatusMessage('No se pudo crear la actividad. Revisá la consola para más información.');
    }
  };

  const register = async activity => {
    setStatusMessage('');
    if (!account) {
      setStatusMessage('Conectá tu wallet para registrarte.');
      return;
    }
    if (!activity.active) {
      setStatusMessage('Esta actividad no está disponible.');
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
          setStatusMessage('Aprobando USDT...');
          await approveTx.wait();
        }
      }

      const tx = await contract.registerForActivity(activity.id);
      setStatusMessage('Confirmando registro...');
      await tx.wait();
      setStatusMessage('¡Registro completado!');
      await Promise.all([fetchActivities(), fetchUsdtBalance()]);
    } catch (error) {
      console.error('Error registering', error);
      setStatusMessage('No se pudo completar el registro. Revisá la consola para más detalles.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar account={account} connect={connect} disconnect={disconnect} />
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 grid gap-8 lg:grid-cols-[1.2fr,0.8fr] items-center">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-3 py-1 text-xs uppercase tracking-widest">
              Nueva edición 2024 · Lago Lolog
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
              Residencia Edge City Patagonia: arte vivo, naturaleza y comunidad conectada on-chain.
            </h2>
            <p className="text-base text-slate-200">
              Diseñamos una inmersión de varios días donde exploramos la cordillera, activamos prácticas físicas y culinarias,
              y documentamos cada momento con contratos inteligentes que resguardan cupos, pagos y memorias.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://edgecity.notion.site/EC-Patagonia-Residency-List-updated-regularly-240d45cdfc5980e980f8db7d362c553d"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100"
              >
                Ver programa completo
              </a>
              <div className="inline-flex items-center gap-2 rounded border border-white/40 px-4 py-2 text-xs sm:text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Datos actualizados en contrato electrónico
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-lg font-medium">Lo que activa la residencia</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                Salidas curadas a montaña, agua y roca con guías locales.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
                Cocina de territorio y rituales artísticos con Iván Moritz Karl.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                Cupos, pagos y entregables asegurados en el contrato Edge City.
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        <section className="grid gap-6 md:grid-cols-2">
          {residencyActivities.map(activity => (
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
          <h2 className="text-lg font-semibold text-blue-900">Contrato Edge City x Patagonia</h2>
          <p className="mt-2">
            Cada actividad se sincroniza con este panel en tiempo real. Los datos que ves (cupos, precios, descripciones y
            fotos) son los que se escriben o actualizan cuando firmás el contrato electrónico desde tu wallet.
          </p>
          <p className="mt-3">
            Al registrar participantes, el smart contract valida el pago en USDT, reserva el cupo y deja registro auditable para
            la comunidad y los organizadores. Las imágenes se almacenan como referencias IPFS/NFT que podés actualizar en cada
            edición.
          </p>
        </section>

        {!isValidContract && (
          <div className="p-4 rounded bg-yellow-100 text-yellow-900">
            Configurá <code>REACT_APP_CONTRACT_ADDRESS</code> para interactuar con el contrato de actividades.
          </div>
        )}
        {!isValidUsdt && (
          <div className="p-4 rounded bg-yellow-100 text-yellow-900">
            Configurá <code>REACT_APP_USDT_ADDRESS</code> para apuntar al token USDT que se utilizará para los pagos.
          </div>
        )}

        {statusMessage && (
          <div className="p-4 rounded bg-blue-100 text-blue-900">{statusMessage}</div>
        )}

        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Agenda Web3 en vivo</h2>
              <p className="text-sm text-gray-600">
                Gestioná disponibilidad, precios y registros confirmados directamente en la cadena de bloques.
              </p>
            </div>
            {account && isValidUsdt && (
              <div className="text-sm text-gray-700">
                Balance USDT: <span className="font-semibold">{usdtBalance}</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Cargando actividades...</div>
          ) : activities.length === 0 ? (
            <div className="rounded border border-dashed border-gray-300 p-6 text-center text-gray-500">
              Aún no hay actividades creadas.
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map(activity => {
                const remaining = activity.maxParticipants - activity.registeredCount;
                const dateString = new Date(activity.date * 1000).toLocaleString();
                const canRegister =
                  account &&
                  !activity.isRegistered &&
                  remaining > 0 &&
                  activity.active &&
                  activity.date * 1000 > Date.now();

                return (
                  <div key={activity.id} className="rounded border bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-600">{activity.name}</h3>
                        <p className="text-gray-700 whitespace-pre-line">{activity.description}</p>
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Fecha:</span> {dateString}
                          </p>
                          <p>
                            <span className="font-medium">Cupos:</span> {activity.registeredCount}/{activity.maxParticipants}
                          </p>
                          <p>
                            <span className="font-medium">Precio:</span> {activity.price} USDT
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-stretch min-w-[200px]">
                        {activity.isRegistered ? (
                          <span className="rounded bg-green-100 text-green-700 px-3 py-2 text-center">
                            Ya estás registrado/a
                          </span>
                        ) : (
                          <button
                            onClick={() => register(activity)}
                            disabled={!canRegister || !isValidContract}
                            className={`px-4 py-2 rounded text-white transition-colors ${
                              canRegister && isValidContract
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-300 cursor-not-allowed'
                            }`}
                          >
                            {remaining > 0 ? 'Registrarme' : 'Sin cupos disponibles'}
                          </button>
                        )}
                        {!activity.active && (
                          <span className="rounded bg-gray-200 text-gray-600 px-3 py-2 text-center">
                            Actividad inactiva
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="rounded bg-white p-6 shadow space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Crear nueva actividad</h2>
              <p className="text-sm text-gray-600">
                Definí la experiencia, fecha y cupos disponibles. El precio se expresará en USDT.
              </p>
            </div>
            <form className="space-y-4" onSubmit={createActivity}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                  placeholder="Nombre de la actividad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                  rows={4}
                  placeholder="Contanos de qué trata la experiencia"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Fecha y horario</label>
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
                  <label className="block text-sm font-medium text-gray-700">Cupos máximos</label>
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
                <label className="block text-sm font-medium text-gray-700">Precio en USDT</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded border px-3 py-2"
                  placeholder="Ej: 25"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Crear actividad
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
