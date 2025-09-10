import { useState } from 'react';
import { ethers } from 'ethers';

import PropertyMarketplace from './PropertyMarketplace.json';
import PropertySlider from './components/PropertySlider';

const contractAddress = '0xYourContractAddress'; // replace after deployment

function App() {
  const [account, setAccount] = useState(null);
  const [uri, setUri] = useState('');
  const [price, setPrice] = useState('');

  const connect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask');
      return;
    }
    const [acc] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(acc);
  };

  const listProperty = async () => {
    if (!uri || !price) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PropertyMarketplace.abi, signer);
    const tx = await contract.listProperty(uri, ethers.utils.parseEther(price), true, false);
    await tx.wait();
    setUri('');
    setPrice('');
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
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="max-w-4xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-center mb-4">Property Marketplace</h1>
        {!account && (
          <div className="text-center">
            <button
              onClick={connect}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </header>

      {account && (
        <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow mb-8">
          <div className="flex flex-col gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Property URI"
              value={uri}
              onChange={e => setUri(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Price in ETH"
              value={price}
              onChange={e => setPrice(e.target.value)}
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

      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Featured Properties</h2>
        <PropertySlider properties={properties} />
      </section>
    </div>
  );
}

export default App;
