import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

import PropertyMarketplace from './PropertyMarketplace.json';
import PropertySlider from './components/PropertySlider';
import Navbar from './components/Navbar';
import KYCForm from './components/KYCForm';
import MyProperties from './components/MyProperties';

// The contract address is provided via an environment variable so that
// deployments don't accidentally use the placeholder value. When the value is
// missing or malformed, interactions with the contract are skipped to avoid
// ethers.js trying to resolve it as an ENS name (which results in the
// "network does not support ENS" error).
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || '';
const isValidAddress = ethers.utils.isAddress(contractAddress);

const getContract = (providerOrSigner) => {
  if (!isValidAddress) {
    console.warn('Contract address is not configured correctly');
    return null;
  }
  return new ethers.Contract(contractAddress, PropertyMarketplace.abi, providerOrSigner);
};

function App() {
  const [account, setAccount] = useState(null);
  const [properties, setProperties] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [precioUSDT, setPrecioUSDT] = useState('');
  const [seniaUSDT, setSeniaUSDT] = useState('');
  const [fotoSlider, setFotoSlider] = useState('');
  const [fotosMini, setFotosMini] = useState('');
  const [fotoAvatar, setFotoAvatar] = useState('');
  const [url, setUrl] = useState('');
  const [page, setPage] = useState('home');
  const [searchCity, setSearchCity] = useState('');
  const [searchPostal, setSearchPostal] = useState('');
  const [searchName, setSearchName] = useState('');

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
    const [acc] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(acc);
  };

  const disconnect = () => {
    setAccount(null);
  };

  const fetchProperties = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = getContract(provider);
    if (!contract) return;
    const count = await contract.propertyCount();
    const props = [];
    for (let i = 1; i <= count; i++) {
      const p = await contract.properties(i);
      props.push({
        id: p.id.toNumber(),
        titulo: p.titulo,
        descripcion: p.descripcion,
        city: p.city,
        postalCode: p.postalCode,
        precioWei: p.precioUSDT,
        seniaWei: p.seniaUSDT,
        precio: ethers.utils.formatEther(p.precioUSDT),
        senia: ethers.utils.formatEther(p.seniaUSDT),
        foto: p.fotoSlider,
        forRent: p.forRent,
        date: '',
        code: ''
      });
    }
    setProperties(props);
  };

  useEffect(() => {
    if (account && isValidAddress) {
      fetchProperties();
    }
  }, [account, isValidAddress]);

  const listProperty = async () => {
    if (
      !titulo ||
      !descripcion ||
      !city ||
      !postalCode ||
      !precioUSDT ||
      !fotoSlider ||
      !fotosMini ||
      !fotoAvatar ||
      !url ||
      !isValidAddress
    )
      return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = getContract(signer);
    if (!contract) return;
    const tx = await contract.listProperty(
      titulo,
      descripcion,
      city,
      postalCode,
      ethers.utils.parseEther(precioUSDT),
      ethers.utils.parseEther(seniaUSDT || '0'),
      fotoSlider,
      fotosMini,
      fotoAvatar,
      url,
      false,
      true
    );
    await tx.wait();
    setTitulo('');
    setDescripcion('');
    setCity('');
    setPostalCode('');
    setPrecioUSDT('');
    setSeniaUSDT('');
    setFotoSlider('');
    setFotosMini('');
    setFotoAvatar('');
    setUrl('');
  };

  const handleDateChange = (id, value) => {
    setProperties(props =>
      props.map(p => (p.id === id ? { ...p, date: value } : p))
    );
  };

  const reserve = async id => {
    const prop = properties.find(p => p.id === id);
    if (!prop || !prop.date || !isValidAddress) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = getContract(signer);
    if (!contract) return;
    const timestamp = Math.floor(new Date(prop.date).setHours(0, 0, 0, 0) / 1000);
    const tx = await contract.reserveDate(id, timestamp, { value: prop.seniaWei });
    await tx.wait();
  };

  const payRent = async id => {
    const prop = properties.find(p => p.id === id);
    if (!prop || !prop.date || !isValidAddress) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = getContract(signer);
    if (!contract) return;
    const timestamp = Math.floor(new Date(prop.date).setHours(0, 0, 0, 0) / 1000);
    const value = prop.precioWei.sub(prop.seniaWei);
    const tx = await contract.payRent(id, timestamp, { value });
    const receipt = await tx.wait();
    const event = receipt.events?.find(e => e.event === 'AccessCodeGenerated');
    const code = event && event.args ? event.args.code : '';
    setProperties(props =>
      props.map(p => (p.id === id ? { ...p, code: code } : p))
    );
  };

  const sliderProps = [
    {
      id: 1,
      title: 'Modern Apartment',
      image: 'https://via.placeholder.com/800x400?text=Property+1',
      price: '100 ETH',
    },
    {
      id: 2,
      title: 'Cozy House',
      image: 'https://via.placeholder.com/800x400?text=Property+2',
      price: '80 ETH',
    },
    {
      id: 3,
      title: 'Beach Villa',
      image: 'https://via.placeholder.com/800x400?text=Property+3',
      price: '200 ETH',
    },
  ];

  const filtered = properties.filter(
    p =>
      (!searchCity || p.city.toLowerCase().includes(searchCity.toLowerCase())) &&
      (!searchPostal || p.postalCode.includes(searchPostal)) &&
      (!searchName || p.titulo.toLowerCase().includes(searchName.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar account={account} connect={connect} disconnect={disconnect} setPage={setPage} />

      {account && isValidAddress && page === 'kyc' && (
        <KYCForm account={account} contractAddress={contractAddress} />
      )}

      {account && isValidAddress && page === 'myProperties' && (
        <MyProperties account={account} contractAddress={contractAddress} />
      )}

      {account && isValidAddress && page === 'create' && (
        <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow mb-8">
          <div className="flex flex-col gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Titulo"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Descripcion"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Ciudad"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Codigo Postal"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Precio en ETH"
              value={precioUSDT}
              onChange={e => setPrecioUSDT(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Seña en ETH"
              value={seniaUSDT}
              onChange={e => setSeniaUSDT(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Foto Slider URI"
              value={fotoSlider}
              onChange={e => setFotoSlider(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Fotos Mini URI"
              value={fotosMini}
              onChange={e => setFotosMini(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Foto Avatar URI"
              value={fotoAvatar}
              onChange={e => setFotoAvatar(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="URL"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
            <button
              onClick={listProperty}
              className="self-start px-4 py-2 bg-green-600 text-white rounded"
            >
              List Property for Rent
            </button>
          </div>
        </div>
      )}

      {page === 'home' && (
        <>
          <section className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Featured Rentals</h2>
            <PropertySlider properties={sliderProps} />
          </section>

          <section className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Available Rentals</h2>
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <input
                className="border p-2 rounded"
                placeholder="Ciudad"
                value={searchCity}
                onChange={e => setSearchCity(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Codigo Postal"
                value={searchPostal}
                onChange={e => setSearchPostal(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Nombre"
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
            </div>
            {filtered.map(p => (
              <div key={p.id} className="bg-white p-4 rounded shadow mb-4">
                <img src={p.foto} alt={p.titulo} className="w-full h-48 object-cover mb-2" />
                <h3 className="text-xl font-semibold">{p.titulo}</h3>
                <p className="text-sm mb-2">{p.descripcion}</p>
                <p className="text-sm">{p.city} - {p.postalCode}</p>
                <p className="text-sm">Precio: {p.precio} ETH</p>
                {p.forRent && (
                  <div className="mt-2 flex flex-col gap-2">
                    <input
                      type="date"
                      value={p.date}
                      onChange={e => handleDateChange(p.id, e.target.value)}
                      className="border p-2 rounded"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => reserve(p.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                      >
                        Reservar ({p.senia} ETH)
                      </button>
                      <button
                        onClick={() => payRent(p.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded"
                      >
                        Pagar Renta
                      </button>
                    </div>
                    {p.code && (
                      <p className="text-sm">Codigo de acceso: {p.code}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

export default App;
