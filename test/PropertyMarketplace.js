const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PropertyMarketplace', function () {
  it('only verified users can list property', async function () {
    const [admin, user] = await ethers.getSigners();
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    await expect(
      marketplace.connect(user).listProperty('ipfs://uri', ethers.utils.parseEther('1'), true, false)
    ).to.be.revertedWith('Not verified');

    await marketplace
      .connect(user)
      .submitKYC(
        'User',
        'Tester',
        'user@example.com',
        '123 Main St',
        'Metropolis',
        'Wonderland',
        '12345',
        '555-1234',
        'Passport',
        'A1234567'
      );
    await marketplace.verifyKYC(user.address);
    await marketplace.connect(user).listProperty('ipfs://uri', ethers.utils.parseEther('1'), true, false);
    const prop = await marketplace.properties(1);
    expect(prop.owner).to.equal(user.address);
  });

  it('admin can cancel a sale', async function () {
    const [admin, user] = await ethers.getSigners();
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    await marketplace
      .connect(user)
      .submitKYC(
        'User',
        'Tester',
        'user@example.com',
        '123 Main St',
        'Metropolis',
        'Wonderland',
        '12345',
        '555-1234',
        'Passport',
        'A1234567'
      );
    await marketplace.verifyKYC(user.address);
    await marketplace.connect(user).listProperty('ipfs://uri', ethers.utils.parseEther('1'), true, false);
    await marketplace.adminCancelSale(1);
    const prop = await marketplace.properties(1);
    expect(prop.forSale).to.equal(false);
  });
});
