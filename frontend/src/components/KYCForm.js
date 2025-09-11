import { useState, useEffect } from 'react';

function KYCForm({ account }) {
  const storageKey = `kyc_${account}`;
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setFormData(JSON.parse(stored));
      setCompleted(true);
    }
  }, [storageKey]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(storageKey, JSON.stringify(formData));
    setCompleted(true);
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
