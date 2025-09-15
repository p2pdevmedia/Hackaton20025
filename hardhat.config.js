require('@nomicfoundation/hardhat-toolbox');

try {
  require('dotenv').config();
} catch (e) {
  console.warn('dotenv not installed; proceeding without .env file');
}

module.exports = {
  solidity: '0.8.20',
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  },
  networks: {
    sepolia: {
      url: process.env.RPC_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};
