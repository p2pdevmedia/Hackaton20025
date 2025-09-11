import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PropertyMarketplace from '../PropertyMarketplace.json';

function KYCForm({ account, contractAddress }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [completed, setCompleted] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const fetchKYC = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, PropertyMarketplace.abi, provider);
      const [name, email, isVerified] = await contract.getKYC(account);
      if (name) {
        setFormData({ name, email });
        setCompleted(true);
        setVerified(isVerified);
      }
    };
    if (account) {
      fetchKYC();
    }
  }, [account, contractAddress]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PropertyMarketplace.abi, signer);
    const tx = await contract.submitKYC(formData.name, formData.email);
    await tx.wait();
    setCompleted(true);
    setVerified(false);
  };

  const handleEdit = () => {
    setCompleted(false);
  };

  if (!account) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4">KYC Information</h2>
      {completed ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Verified:</strong> {verified ? 'Yes' : 'Pending'}</p>
          <button
            onClick={handleEdit}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="self-start px-4 py-2 bg-green-600 text-white rounded"
          >
            Submit KYC
          </button>
        </form>
      )}
    </div>
  );
}

export default KYCForm;
