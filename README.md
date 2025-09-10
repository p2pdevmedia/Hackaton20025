# Hackaton20025

Este proyecto incluye un smart contract en Solidity para el manejo de ventas y alquileres de propiedades y una aplicación React que permite a los usuarios conectarse con MetaMask y publicar sus propiedades.

## Smart Contract

- **contracts/PropertyMarketplace.sol**: contrato que permite listar propiedades, comprarlas o rentarlas.
- Usa Hardhat para compilar y ejecutar pruebas.

### Comandos principales

```bash
npm install
npm run compile
npm test
```

## Frontend

La carpeta `frontend` contiene una app React sencilla que interactúa con el contrato. Después de desplegar el contrato, coloque su dirección en `frontend/src/App.js` en la variable `contractAddress` y asegúrese de que el ABI del contrato se encuentre en `frontend/src/PropertyMarketplace.json`.

### Comandos frontend

```bash
cd frontend
npm install
npm start
```
