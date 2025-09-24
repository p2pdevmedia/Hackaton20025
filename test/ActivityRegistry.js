const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ActivityRegistry", function () {
  let registry;
  let usdt;
  let owner;
  let alice;
  let bob;
  const price = ethers.utils.parseUnits("50", 6);
  const getFutureDate = () => Math.floor(Date.now() / 1000) + 3600;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("TestToken");
    usdt = await Token.deploy("Mock USDT", "USDT");
    await usdt.mint(owner.address, ethers.utils.parseUnits("1000", 6));
    await usdt.mint(alice.address, ethers.utils.parseUnits("1000", 6));
    await usdt.mint(bob.address, ethers.utils.parseUnits("1000", 6));

    const Registry = await ethers.getContractFactory("ActivityRegistry");
    registry = await Registry.deploy(usdt.address);
  });

  it("stores created activities", async function () {
    await registry.createActivity("Yoga", "Clase matutina", getFutureDate(), 20, price);
    const stored = await registry.activities(1);
    expect(stored.name).to.equal("Yoga");
    expect(stored.description).to.equal("Clase matutina");
    expect(stored.maxParticipants).to.equal(20);
    expect(stored.priceUSDT).to.equal(price);
    expect(await registry.activityCount()).to.equal(1);
  });

  it("allows participants to register after approving USDT", async function () {
    await registry.createActivity("Yoga", "Clase matutina", getFutureDate(), 2, price);

    await usdt.connect(alice).approve(registry.address, price);
    await registry.connect(alice).registerForActivity(1);

    const activity = await registry.activities(1);
    expect(activity.registeredCount).to.equal(1);
    expect(await registry.isRegistered(1, alice.address)).to.equal(true);
  });

  it("prevents double registration", async function () {
    await registry.createActivity("Yoga", "Clase matutina", getFutureDate(), 2, price);

    await usdt.connect(alice).approve(registry.address, price);
    await registry.connect(alice).registerForActivity(1);

    await expect(
      registry.connect(alice).registerForActivity(1)
    ).to.be.revertedWith("Already registered");
  });

  it("enforces the max participant limit", async function () {
    await registry.createActivity("Yoga", "Clase matutina", getFutureDate(), 1, price);

    await usdt.connect(alice).approve(registry.address, price);
    await registry.connect(alice).registerForActivity(1);

    await usdt.connect(bob).approve(registry.address, price);
    await expect(
      registry.connect(bob).registerForActivity(1)
    ).to.be.revertedWith("No spots available");
  });
});
