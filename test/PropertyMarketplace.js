const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PropertyMarketplace', function () {
  it('only verified users can list property', async function () {
    const [admin, user] = await ethers.getSigners();
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    await expect(
      marketplace.connect(user).listProperty(
        'Titulo',
        'Descripcion',
        ethers.utils.parseEther('1'),
        ethers.utils.parseEther('0.1'),
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
        ethers.utils.parseEther('1'),
        ethers.utils.parseEther('0.1'),
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
    await marketplace
      .connect(user)
      .listProperty(
        'Titulo',
        'Descripcion',
        ethers.utils.parseEther('1'),
        ethers.utils.parseEther('0.1'),
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
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy();
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
        ethers.utils.parseEther('1'),
        ethers.utils.parseEther('0.1'),
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

    // Reserve the day with deposit
    await marketplace
      .connect(renter)
      .reserveDate(1, day, { value: ethers.utils.parseEther('0.1') });

    expect(await marketplace.isDateAvailable(1, day)).to.equal(false);

    await expect(
      marketplace
        .connect(renter)
        .reserveDate(1, day, { value: ethers.utils.parseEther('0.1') })
    ).to.be.revertedWith('Date reserved');

    // Pay remaining amount and receive code
    const tx = await marketplace
      .connect(renter)
      .payRent(1, day, { value: ethers.utils.parseEther('0.9') });
    const receipt = await tx.wait();
    const event = receipt.events.find((e) => e.event === 'AccessCodeGenerated');
    expect(event.args.code).to.not.equal(ethers.constants.HashZero);
  });

  it('reverts when reserving for the same day', async function () {
    const [admin, owner, renter] = await ethers.getSigners();
    const Marketplace = await ethers.getContractFactory('PropertyMarketplace');
    const marketplace = await Marketplace.deploy();
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
        ethers.utils.parseEther('1'),
        ethers.utils.parseEther('0.1'),
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

    const currentBlock = await ethers.provider.getBlock('latest');
    const sameDay = currentBlock.timestamp + 3600; // 1 hour later, same day

    await expect(
      marketplace
        .connect(renter)
        .reserveDate(1, sameDay, { value: ethers.utils.parseEther('0.1') })
    ).to.be.revertedWith('Same-day booking not allowed');
  });
});
