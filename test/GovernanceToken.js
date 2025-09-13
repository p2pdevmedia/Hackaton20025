const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GovernanceToken', function () {
  it('manages token sales with adjustable token, price and pause', async function () {
    const [owner, buyer] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('TestToken');
    const tokenA = await Token.deploy('TokenA', 'TKA');
    const tokenB = await Token.deploy('TokenB', 'TKB');

    await tokenA.mint(buyer.address, ethers.utils.parseUnits('1000', 18));
    await tokenB.mint(buyer.address, ethers.utils.parseUnits('1000', 18));

    const Gov = await ethers.getContractFactory('GovernanceToken');
    const gov = await Gov.deploy(tokenA.address, ethers.utils.parseUnits('1', 18));

    expect(await gov.totalSupply()).to.equal(ethers.utils.parseUnits('21000000', 18));
    expect(await gov.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits('1000000', 18));
    expect(await gov.balanceOf(gov.address)).to.equal(ethers.utils.parseUnits('20000000', 18));

    await tokenA.connect(buyer).approve(gov.address, ethers.utils.parseUnits('100', 18));
    await gov.connect(buyer).buyTokens(100);
    expect(await gov.balanceOf(buyer.address)).to.equal(ethers.utils.parseUnits('100', 18));

    await gov.connect(owner).setSalePaused(true);
    await expect(gov.connect(buyer).buyTokens(1)).to.be.revertedWith('sale paused');

    await gov.connect(owner).setSalePaused(false);
    await gov.connect(owner).setPrice(ethers.utils.parseUnits('2', 18));
    await gov.connect(owner).setPaymentToken(tokenB.address);

    await tokenB.connect(buyer).approve(gov.address, ethers.utils.parseUnits('200', 18));
    await gov.connect(buyer).buyTokens(50);

    expect(await gov.balanceOf(buyer.address)).to.equal(ethers.utils.parseUnits('150', 18));
    expect(await tokenB.balanceOf(gov.address)).to.equal(ethers.utils.parseUnits('100', 18));
  });
});

