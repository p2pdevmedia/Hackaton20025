import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import PropertyMarketplace from '../PropertyMarketplace.json';

function MyProperties({ account, contractAddress }) {
  const [properties, setProperties] = useState([]);

  const load = async () => {
    if (!ethers.utils.isAddress(contractAddress)) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, PropertyMarketplace.abi, provider);
    const count = await contract.propertyCount();
    const props = [];
    for (let i = 1; i <= count; i++) {
      const p = await contract.properties(i);
      if (p.owner.toLowerCase() === account.toLowerCase()) {
        const reservations = await contract.reservationCount(i);
        props.push({
          id: p.id.toNumber(),
          titulo: p.titulo,
          forRent: p.forRent,
          reservations: reservations.toNumber(),
        });
      }
    }
    setProperties(props);
  };

  useEffect(() => {
    if (account) load();
  }, [account]);

  const remove = async (id) => {
    if (!ethers.utils.isAddress(contractAddress)) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PropertyMarketplace.abi, signer);
    const tx = await contract.removeProperty(id);
    await tx.wait();
    load();
  };

  const toggleRent = async (id, forRent) => {
    if (!ethers.utils.isAddress(contractAddress)) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PropertyMarketplace.abi, signer);
    const tx = await (forRent ? contract.pauseProperty(id) : contract.resumeProperty(id));
    await tx.wait();
    load();
  };

  if (!account) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Properties</h2>
      {properties.map((p) => (
        <div key={p.id} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold">{p.titulo}</h3>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => toggleRent(p.id, p.forRent)}
              className="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              {p.forRent ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={() => remove(p.id)}
              disabled={p.reservations > 0}
              className={`px-3 py-1 ${p.reservations > 0 ? 'bg-gray-300' : 'bg-red-500'} text-white rounded`}
            >
              Delete
            </button>
          </div>
          {p.reservations > 0 && (
            <p className="text-sm text-red-600 mt-2">Active reservations exist</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyProperties;
