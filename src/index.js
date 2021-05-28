import React from 'react';
import ReactDOM from 'react-dom';
import getConfig from './config.js';
import * as nearAPI from 'near-api-js';
import './index.css';
import App from './App';

// Initializing contract
async function initConnection() {
  const nearConfig = getConfig(process.env.NODE_ENV || 'testnet');

  // Initializing connection to the NEAR TestNet
  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
  });

  // Needed to access wallet
  const walletConnection = new nearAPI.WalletConnection(near);

  return { near, nearConfig, walletConnection };
}

window.nearInitPromise = initConnection().then(
  ({ near, nearConfig, walletConnection }) => {
    ReactDOM.render(
      <React.StrictMode>
        <App near={near} nearConfig={nearConfig} wallet={walletConnection} />
      </React.StrictMode>,
      document.getElementById('root')
    );
  }
);
