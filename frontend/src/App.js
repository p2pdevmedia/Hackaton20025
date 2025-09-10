import { useState } from 'react';
import { ethers } from 'ethers';

import PropertyMarketplace from './PropertyMarketplace.json';


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

  return (
    <div>
      {!account && <button onClick={connect}>Connect Wallet</button>}
      {account && (
        <div>
          <input placeholder="Property URI" value={uri} onChange={e => setUri(e.target.value)} />
          <input placeholder="Price in ETH" value={price} onChange={e => setPrice(e.target.value)} />
          <button onClick={listProperty}>List Property for Sale</button>
        </div>
      )}
    </div>
  );
}

export default App;
