# Hackaton20025

Este proyecto incluye un smart contract en Solidity para el manejo de ventas y alquileres de propiedades y una aplicación React que permite a los usuarios autenticarse mediante [Privy](https://www.privy.io/) para crear o conectar wallets y publicar sus propiedades.

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


La carpeta `frontend` contiene una app React sencilla que interactúa con el contrato. Ahora utiliza Privy para manejar el inicio de sesión y la creación de wallets embebidas. Antes de ejecutar la aplicación, crea un archivo `.env` dentro de `frontend` con tu identificador de aplicación de Privy:

```
REACT_APP_PRIVY_APP_ID=tu_app_id
```

Después de desplegar el contrato, coloca su dirección en `frontend/src/App.js` en la variable `contractAddress` y asegúrate de que el ABI del contrato se encuentre en `frontend/src/PropertyMarketplace.json`.


### Comandos frontend

```bash
cd frontend
npm install
npm start
```
