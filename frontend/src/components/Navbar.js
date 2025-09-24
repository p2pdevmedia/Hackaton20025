import React from 'react';

function Navbar({ account, connect, disconnect }) {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-blue-600">Actividades Web3</h1>
          <p className="text-sm text-gray-600">
            Descubrí experiencias y registrate pagando con USDT.
          </p>
        </div>
        {account ? (
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={disconnect}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Desconectar
            </button>
          </div>
        ) : (
          <button
            onClick={connect}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Conectar wallet
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
