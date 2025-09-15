import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PropertyMarketplace from '../PropertyMarketplace.json';

function KYCForm({ account, contractAddress }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    country: '',
    postalCode: '',
    phone: '',
    idType: '',
    idNumber: '',
  });
  const [completed, setCompleted] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const fetchKYC = async () => {
      if (!ethers.utils.isAddress(contractAddress)) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, PropertyMarketplace.abi, provider);
      const [firstName, lastName, email, street, city, country, postalCode, phone, idType, idNumber, isVerified] =
        await contract.getKYC(account);
      if (firstName) {
        setFormData({
          firstName,
          lastName,
          email,
          street,
          city,
          country,
          postalCode,
          phone,
          idType,
          idNumber,
        });
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
    if (!ethers.utils.isAddress(contractAddress)) {
      console.error('Invalid contract address');
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PropertyMarketplace.abi, signer);
    const tx = await contract.submitKYC(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.street,
      formData.city,
      formData.country,
      formData.postalCode,
      formData.phone,
      formData.idType,
      formData.idNumber
    );
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
          <p><strong>First Name:</strong> {formData.firstName}</p>
          <p><strong>Last Name:</strong> {formData.lastName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Address:</strong> {formData.street}</p>
          <p><strong>City:</strong> {formData.city}</p>
          <p><strong>Country:</strong> {formData.country}</p>
          <p><strong>Postal Code:</strong> {formData.postalCode}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>ID Type:</strong> {formData.idType}</p>
          <p><strong>ID Number:</strong> {formData.idNumber}</p>
          <p><strong>Verified:</strong> {verified ? 'Yes' : 'Pending'}</p>
          {!verified && (
            <button
              onClick={handleEdit}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Edit
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border p-2 rounded"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="Address"
            name="street"
            value={formData.street}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="ID Type (Passport or ID)"
            name="idType"
            value={formData.idType}
            onChange={handleChange}
          />
          <input
            className="border p-2 rounded"
            placeholder="ID Number"
            name="idNumber"
            value={formData.idNumber}
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
