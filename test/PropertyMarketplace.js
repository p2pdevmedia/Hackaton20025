const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PropertyMarketplace', function () {
  it('only verified users can list property', async function () {
    const [admin, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('TestToken');
    const usdt = await Token.deploy('Tether', 'USDT');
    await usdt.deployed();
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy(usdt.address);
    await marketplace.deployed();

    await expect(
      marketplace.connect(user).listProperty(
        'Titulo',
        'Descripcion',
        'Metropolis',
        '12345',
        ethers.utils.parseUnits('1', 6),
        ethers.utils.parseUnits('0.1', 6),
        'slider',
        'mini',
        'avatar',
        'url',
        true,
        false
      )
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
    await marketplace
      .connect(user)
      .listProperty(
        'Titulo',
        'Descripcion',
        'Metropolis',
        '12345',
        ethers.utils.parseUnits('1', 6),
        ethers.utils.parseUnits('0.1', 6),
        'slider',
        'mini',
        'avatar',
        'url',
        true,
        false
      );
    const prop = await marketplace.properties(1);
    expect(prop.owner).to.equal(user.address);
    expect(prop.titulo).to.equal('Titulo');
  });

  it('admin can cancel a sale', async function () {
    const [admin, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('TestToken');
    const usdt = await Token.deploy('Tether', 'USDT');
    await usdt.deployed();
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy(usdt.address);
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
    await marketplace
      .connect(user)
      .listProperty(
        'Titulo',
        'Descripcion',
        'Metropolis',
        '12345',
        ethers.utils.parseUnits('1', 6),
        ethers.utils.parseUnits('0.1', 6),
        'slider',
        'mini',
        'avatar',
        'url',
        true,
        false
      );
    await marketplace.adminCancelSale(1);
    const prop = await marketplace.properties(1);
    expect(prop.forSale).to.equal(false);
  });

  it('allows reserving and paying rent with access code generation', async function () {
    const [admin, owner, renter] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('TestToken');
    const usdt = await Token.deploy('Tether', 'USDT');
    await usdt.deployed();
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy(usdt.address);
    await marketplace.deployed();

    // Owner lists a property for rent
    await marketplace
      .connect(owner)
      .submitKYC(
        'Owner',
        'Lister',
        'owner@example.com',
        '123 Main St',
        'Metropolis',
        'Wonderland',
        '12345',
        '555-0000',
        'Passport',
        'O1234567'
      );
    await marketplace.verifyKYC(owner.address);
    await marketplace
      .connect(owner)
      .listProperty(
        'Casa',
        'Linda casa',
        'Metropolis',
        '12345',
        ethers.utils.parseUnits('1', 6),
        ethers.utils.parseUnits('0.1', 6),
        'slider',
        'mini',
        'avatar',
        'url',
        false,
        true
      );

    // Renter KYC
    await marketplace
      .connect(renter)
      .submitKYC(
        'Renter',
        'User',
        'renter@example.com',
        '456 Side St',
        'Gotham',
        'Wonderland',
        '67890',
        '555-1111',
        'Passport',
        'R1234567'
      );
    await marketplace.verifyKYC(renter.address);

    const day = 1700000000; // example day timestamp

    // Mint and approve tokens for renter
    await usdt.mint(renter.address, ethers.utils.parseUnits('1', 6));
    await usdt.connect(renter).approve(marketplace.address, ethers.utils.parseUnits('0.1', 6));

    // Reserve the day with deposit
    await marketplace.connect(renter).reserveDate(1, day);

    expect(await marketplace.isDateAvailable(1, day)).to.equal(false);

    await expect(
      marketplace.connect(renter).reserveDate(1, day)
    ).to.be.revertedWith('Date reserved');

    // Pay remaining amount and receive code
    await usdt.connect(renter).approve(marketplace.address, ethers.utils.parseUnits('0.9', 6));
    const tx = await marketplace.connect(renter).payRent(1, day);
    const receipt = await tx.wait();
    const event = receipt.events.find((e) => e.event === 'AccessCodeGenerated');
    expect(event.args.code).to.not.equal(ethers.constants.HashZero);
  });

  it('owner can pause, resume, and remove property without active reservations', async function () {
    const [admin, owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('TestToken');
    const usdt = await Token.deploy('Tether', 'USDT');
    await usdt.deployed();
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy(usdt.address);
    await marketplace.deployed();

    await marketplace
      .connect(owner)
      .submitKYC(
        'Owner',
        'Lister',
        'owner@example.com',
        '123 Main St',
        'Metropolis',
        'Wonderland',
        '12345',
        '555-0000',
        'Passport',
        'O1234567'
      );
    await marketplace.verifyKYC(owner.address);
    await marketplace
      .connect(owner)
      .listProperty(
        'Casa',
        'Linda casa',
        'Metropolis',
        '12345',
        ethers.utils.parseUnits('1', 6),
        ethers.utils.parseUnits('0.1', 6),
        'slider',
        'mini',
        'avatar',
        'url',
        false,
        true
      );

    await marketplace.connect(owner).pauseProperty(1);
    let prop = await marketplace.properties(1);
    expect(prop.forRent).to.equal(false);

    await marketplace.connect(owner).resumeProperty(1);
    prop = await marketplace.properties(1);
    expect(prop.forRent).to.equal(true);

    await marketplace.connect(owner).removeProperty(1);
    prop = await marketplace.properties(1);
    expect(prop.owner).to.equal(ethers.constants.AddressZero);
  });

  it('cannot remove property with active reservations', async function () {
    const [admin, owner, renter] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('TestToken');
    const usdt = await Token.deploy('Tether', 'USDT');
    await usdt.deployed();
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy(usdt.address);
    await marketplace.deployed();

    await marketplace
      .connect(owner)
      .submitKYC(
        'Owner',
        'Lister',
        'owner@example.com',
        '123 Main St',
        'Metropolis',
        'Wonderland',
        '12345',
        '555-0000',
        'Passport',
        'O1234567'
      );
    await marketplace.verifyKYC(owner.address);
    await marketplace
      .connect(owner)
      .listProperty(
        'Casa',
        'Linda casa',
        ethers.utils.parseUnits('1', 6),
        ethers.utils.parseUnits('0.1', 6),
        'slider',
        'mini',
        'avatar',
        'url',
        false,
        true
      );

    await marketplace
      .connect(renter)
      .submitKYC(
        'Renter',
        'User',
        'renter@example.com',
        '456 Side St',
        'Gotham',
        'Wonderland',
        '67890',
        '555-1111',
        'Passport',
        'R1234567'
      );
    await marketplace.verifyKYC(renter.address);

    const day = 1700000000;
    await usdt.mint(renter.address, ethers.utils.parseUnits('1', 6));
    await usdt.connect(renter).approve(marketplace.address, ethers.utils.parseUnits('0.1', 6));
    await marketplace.connect(renter).reserveDate(1, day);

    await expect(
      marketplace.connect(owner).removeProperty(1)
    ).to.be.revertedWith('Active reservations');
  });
});
