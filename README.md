# [Airbnbit.com](http://hackaton20025.vercel.app)

Aplicación descentralizada enfocada principalmente en el **alquiler de propiedades** en la blockchain. El proyecto combina un contrato inteligente en Solidity con un frontend en React, permitiendo a los usuarios conectar su billetera MetaMask, completar un proceso de KYC, publicar inmuebles y realizar reservas o pagos de renta en **USDT**. También admite la venta de propiedades si se requiere.

## Características principales

- Registro KYC en cadena y verificación por un administrador.
- Listado de propiedades para alquiler con imágenes, precio y URL de referencia.
- Reserva y pago de rentas mediante transacciones en USDT.
- Interfaz web que muestra propiedades destacadas y formulario para listar nuevos inmuebles.

## Smart Contract

El contrato [`contracts/PropertyMarketplace.sol`](contracts/PropertyMarketplace.sol) contiene la lógica de negocio:

- Mantiene los datos de KYC y de las propiedades.
- Permite a usuarios verificados listar, comprar o rentar propiedades.
- Emite eventos para cada publicación, compra o alquiler.
- Incluye funciones administrativas para verificar identidades y cancelar operaciones.
- Se despliega recibiendo la dirección del token USDT (ERC-20) que se utilizará para todos los pagos.

## Gobernanza y token GOV

El contrato [`contracts/GovernanceToken.sol`](contracts/GovernanceToken.sol) define el token de gobernanza **GOV** utilizado para la administración del protocolo. Los administradores pueden:

- Actualizar el token de pago aceptado para comprar GOV.
- Ajustar el precio del token.
- Pausar o reanudar la venta de GOV.

Adicionalmente, el administrador del marketplace verifica identidades, puede asignar un nuevo administrador y cancelar operaciones de compra o alquiler en caso de disputas.

### Comandos principales

```bash
npm install
npm run compile
npm test
```

## Frontend

La carpeta [`frontend`](frontend) incluye la app React que interactúa con el contrato. Una vez desplegado el contrato, configure la variable `REACT_APP_CONTRACT_ADDRESS` en el archivo `.env` dentro de `frontend` y asegúrese de copiar el ABI a `frontend/src/PropertyMarketplace.json`.

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

