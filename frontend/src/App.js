import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';

import PropertyMarketplace from './PropertyMarketplace.json';
import PropertySlider from './components/PropertySlider';
import Navbar from './components/Navbar';
import KYCForm from './components/KYCForm';

const contractAddress = '0xYourContractAddress'; // replace after deployment

function App() {
  const { login, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [account, setAccount] = useState(null);
  const [uri, setUri] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (authenticated && wallets.length > 0) {
      setAccount(wallets[0].address);
    } else {
      setAccount(null);
    }
  }, [authenticated, wallets]);

  const connect = () => login();
  const disconnect = () => logout();

  const listProperty = async () => {
    if (!uri || !price || wallets.length === 0) return;
    const provider = new ethers.providers.Web3Provider(wallets[0].ethereum);
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
    <div className="min-h-screen bg-gray-100">
      <Navbar account={account} connect={connect} disconnect={disconnect} />

      {account && <KYCForm account={account} contractAddress={contractAddress} />}

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

      <section className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Featured Properties</h2>
        <PropertySlider properties={properties} />
      </section>
    </div>
  );
}

export default App;
