# Edge City · Residency Activity Registry

Edge City documents its Patagonia residency program on-chain. The project combines a Solidity
smart contract with a React dashboard so organizers can publish activities, manage spots and
collect USDT payments directly from participant wallets.

## Platform overview

- Curate multi-day cultural and nature activities for each residency edition.
- Accept USDT payments that are validated and escrowed by the smart contract.
- Track real-time availability, registrations and participant wallets from the dashboard.
- Offer a multilingual interface (English, Spanish and French) connected to the blockchain data.

## Smart contracts

### `contracts/ActivityRegistry.sol`

The core contract stores the activity catalog. Administrators can create experiences, toggle their
status and configure pricing in USDT. Participants call `registerForActivity` to secure their spot
and transfer the required stablecoin amount to the organizer in a single transaction. Public getters
expose activity metadata, availability counters, the current admin and the stablecoin address used
for payments.

### `contracts/mocks/TestToken.sol`

A lightweight ERC20-like token included for local development and testing. It exposes minting and
standard allowance flows so Hardhat tests can emulate USDT behaviour.

## Frontend

The `frontend` folder contains a React application that surfaces contract data and lets admins
publish activities once they connect their wallet. Update the following environment variables to
point at your deployment:

- `REACT_APP_CONTRACT_ADDRESS`: address of the deployed `ActivityRegistry` contract.
- `REACT_APP_USDT_ADDRESS`: address of the ERC20 token accepted for payments.

## Getting started

```bash
npm install
npm run compile
npm test
```

To work on the UI:

```bash
cd frontend
npm install
npm start
```

Deploy the contracts with Hardhat, configure the frontend environment variables, and the dashboard
will reflect the live on-chain activity data.
