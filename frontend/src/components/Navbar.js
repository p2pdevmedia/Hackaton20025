import React from 'react';

function Navbar({ account, connect, disconnect, setPage }) {
  return (
    <nav className="bg-white shadow mb-8">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">Airbnbit.com</h1>
            <p className="text-sm text-gray-600">Alquiler de propiedades en blockchain</p>
          </div>
          <button onClick={() => setPage('home')} className="text-blue-600">
            Home
          </button>
          <button onClick={() => setPage('kyc')} className="text-blue-600">
            KYC
          </button>
          {account && (
            <button onClick={() => setPage('myProperties')} className="text-blue-600">
              My Properties
            </button>
          )}
        </div>
        {account ? (
          <div className="flex items-center gap-4">
            <span className="font-mono">{account.slice(0, 6)}...{account.slice(-4)}</span>
            <button
              onClick={disconnect}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connect}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
