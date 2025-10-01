# Edge City · Residency Activity Registry

Edge City documents its Patagonia residency program directly on-chain. The project now relies on a
React dashboard that coordinates activity publishing, spot management and payments routed straight
to the organizer's wallet—no smart contracts or escrow layers are involved.

## Platform overview

- Curate multi-day cultural and nature activities for each residency edition.
- Collect USDT payments that are sent immediately to the organizer's wallet.
- Track real-time availability, registrations and participant wallets from the dashboard.
- Offer a multilingual interface (English, Spanish and French) connected to the residency data.

## Payment flow

Participants pay by signing a transaction from their wallet that transfers USDT directly to the
organizer. The dashboard validates the transaction hash and updates internal records so availability
and participant rosters stay current.

## Frontend

The `frontend` folder contains a React application that surfaces residency data and lets admins
publish activities once they connect their wallet. Update the following environment variables to
point at your deployment:

- `REACT_APP_DESTINATION_WALLET`: wallet address that receives participant payments.
- `REACT_APP_USDT_ADDRESS`: address of the ERC20 token accepted for payments.

## Hardcoded on-chain addresses

The hackathon demo is wired to the following addresses. They live in `frontend/.env.example` so you
can copy the file into `.env` and override them when deploying elsewhere:

- **Receiving wallet** (`REACT_APP_DESTINATION_WALLET`): `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
  (Hardhat default account #0 used for local testing).
- **USDT token** (`REACT_APP_USDT_ADDRESS`): `0xdAC17F958D2ee523a2206206994597C13D831ec7` (Tether on
  Ethereum mainnet).

## Getting started

```bash
npm install
npm run build
npm test
```

To work on the UI:

```bash
cd frontend
npm install
npm start
```

Configure the organizer wallet in your environment variables, launch the dashboard, and you'll see
live availability updates as participants complete their transfers.
