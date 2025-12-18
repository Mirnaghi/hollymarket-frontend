# WalletConnect Setup Guide

This application uses WalletConnect (Reown AppKit) for wallet connections.

## Setup Instructions

### 1. Get a WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Sign up or log in
3. Create a new project
4. Copy your Project ID

### 2. Configure Environment Variable

Add your Project ID to `.env.local`:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## Features

- Multi-wallet support (MetaMask, WalletConnect, Coinbase Wallet, etc.)
- Network switching (Ethereum, Polygon, Arbitrum)
- Wallet connection persistence
- Automatic disconnection on logout

## Usage

1. Click the "Account" button when logged in
2. Click "Connect Wallet" in the dropdown menu
3. Choose your preferred wallet from the modal
4. Approve the connection in your wallet
5. Your wallet address will be displayed in the dropdown
6. Click "Disconnect" to disconnect your wallet

## Supported Networks

- Ethereum Mainnet
- Polygon
- Arbitrum

You can add more networks by editing `lib/web3-config.ts`.
