# Hackaton20025

Aplicación descentralizada para gestionar venta y alquiler de propiedades en la blockchain. El proyecto combina un contrato inteligente en Solidity con un frontend en React, permitiendo a los usuarios conectar su billetera MetaMask, completar un proceso de KYC, publicar propiedades y realizar transacciones de compra o renta.

## Características principales

- Registro KYC en cadena y verificación por un administrador.
- Listado de propiedades con imágenes, precio y URL de referencia.
- Compra o alquiler de propiedades mediante transacciones en Ether.
- Interfaz web que muestra propiedades destacadas y formulario para listar nuevos inmuebles.

## Smart Contract

El contrato [`contracts/PropertyMarketplace.sol`](contracts/PropertyMarketplace.sol) contiene la lógica de negocio:

- Mantiene los datos de KYC y de las propiedades.
- Permite a usuarios verificados listar, comprar o rentar propiedades.
- Emite eventos para cada publicación, compra o alquiler.
- Incluye funciones administrativas para verificar identidades y cancelar operaciones.

### Comandos principales

```bash
npm install
npm run compile
npm test
```

## Frontend

La carpeta [`frontend`](frontend) incluye la app React que interactúa con el contrato. Una vez desplegado el contrato, actualice la variable `contractAddress` en `frontend/src/App.js` y asegúrese de copiar el ABI a `frontend/src/PropertyMarketplace.json`.

La interfaz permite:

- Conectarse con MetaMask.
- Completar el formulario KYC.
- Publicar propiedades indicando precio, seña e imágenes.
- Visualizar propiedades destacadas en un carrusel.

### Comandos frontend

```bash
cd frontend
npm install
npm start
```

