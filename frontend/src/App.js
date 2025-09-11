import { useState } from 'react';
import { ethers } from 'ethers';

import PropertyMarketplace from './PropertyMarketplace.json';
import PropertySlider from './components/PropertySlider';
import Navbar from './components/Navbar';
import KYCForm from './components/KYCForm';

const contractAddress = '0xYourContractAddress'; // replace after deployment

function App() {
  const [account, setAccount] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precioUSDT, setPrecioUSDT] = useState('');
  const [seniaUSDT, setSeniaUSDT] = useState('');
  const [fotoSlider, setFotoSlider] = useState('');
  const [fotosMini, setFotosMini] = useState('');
  const [fotoAvatar, setFotoAvatar] = useState('');
  const [url, setUrl] = useState('');

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

  const listProperty = async () => {
    if (!titulo || !descripcion || !precioUSDT || !fotoSlider || !fotosMini || !fotoAvatar || !url) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PropertyMarketplace.abi, signer);
    const tx = await contract.listProperty(
      titulo,
      descripcion,
      ethers.utils.parseEther(precioUSDT),
      ethers.utils.parseEther(seniaUSDT || '0'),
      fotoSlider,
      fotosMini,
      fotoAvatar,
      url,
      true,
      false
    );
    await tx.wait();
    setTitulo('');
    setDescripcion('');
    setPrecioUSDT('');
    setSeniaUSDT('');
    setFotoSlider('');
    setFotosMini('');
    setFotoAvatar('');
    setUrl('');
  };

  const properties = [
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar account={account} connect={connect} disconnect={disconnect} />

      {account && <KYCForm account={account} contractAddress={contractAddress} />}

      {account && (
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
              List Property for Sale
            </button>
          </div>
        </div>
      )}

      <section className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Featured Properties</h2>
        <PropertySlider properties={properties} />
      </section>
    </div>
  );
}

export default App;
