const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PropertyMarketplace', function () {
  it('should list a property', async function () {
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    await marketplace.listProperty('ipfs://uri', ethers.utils.parseEther('1'), true, false);
    const prop = await marketplace.properties(1);
    expect(prop.owner).to.not.equal(ethers.constants.AddressZero);
    expect(prop.price).to.equal(ethers.utils.parseEther('1'));
  });
});
