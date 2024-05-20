import React from 'react';
import AuthContext from "./context/AuthContext";
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Analytics } from "@vercel/analytics/react"
import img from "./assets/coin.png";

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'

// 1. Get projectId
const projectId = '34ed21a1fe179e463890afb6bf2c4745'

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const base = {
  chainId: 8453,
  name: "Base",
  currency: "ETH",
  explorerUrl: "https://basescan.org",
  rpcUrl: "https://mainnet.base.org"
}

const baseSepolia = {
  chainId: 84532,
  name: "Base Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia-explorer.base.org",
  rpcUrl: "https://sepolia.base.org"
}

// 3. Create a metadata object
const metadata = {
  name: 'Tokenchat',
  description: 'Token Launcher',
  url: 'https://tokenchat.app', // origin must match your domain & subdomain
  icons: [img]
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: '...', // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [base],
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContext>
      <App />
      <Analytics />
    </AuthContext>
);

// See https://docs.privy.io/guide/troubleshooting/webpack for how to handle
// common build issues with web3 projects bootstrapped with Create React App