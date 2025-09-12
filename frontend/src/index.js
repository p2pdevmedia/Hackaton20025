import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { PrivyProvider } from '@privy-io/react-auth';

const container = document.getElementById('root');
const root = createRoot(container);
const privyAppId = process.env.REACT_APP_PRIVY_APP_ID;

root.render(
  <PrivyProvider
    appId={privyAppId}
    config={{
      loginMethods: ['email', 'wallet'],
      embeddedWallets: { createOnLogin: 'users-without-wallets' },
    }}
  >
    <App />
  </PrivyProvider>
);
