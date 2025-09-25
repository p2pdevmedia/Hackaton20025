const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const solc = require("solc");

const ACTIVITY_IDS = {
  MOUNTAIN: 1,
  KAYAK: 2,
  CLIMBING: 3,
  ASADO: 4
};

function compileContracts() {
  const sources = {
    "ActivityRegistry.sol": {
      content: fs.readFileSync(path.join(__dirname, "../contracts/ActivityRegistry.sol"), "utf8")
    },
    "mocks/TestToken.sol": {
      content: fs.readFileSync(path.join(__dirname, "../contracts/mocks/TestToken.sol"), "utf8")
    }
  };

  const input = {
    language: "Solidity",
    sources,
    settings: {
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"]
        }
      }
    }
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    const errors = output.errors.filter(error => error.severity === "error");
    if (errors.length) {
      throw new Error(errors.map(error => error.formattedMessage).join("\n"));
    }
  }

  return {
    registry: output.contracts["ActivityRegistry.sol"].ActivityRegistry,
    testToken: output.contracts["mocks/TestToken.sol"].TestToken
  };
}

const compiled = compileContracts();

const toBytecode = object => (object.startsWith("0x") ? object : `0x${object}`);

describe("ActivityRegistry", function () {
  let registry;
  let usdt;
  let registryAddress;
  let usdtAddress;
  let owner;
  let alice;
  let bob;
  let carol;

  beforeEach(async function () {
    [owner, alice, bob, carol] = await ethers.getSigners();

    const tokenFactory = new ethers.ContractFactory(
      compiled.testToken.abi,
      toBytecode(compiled.testToken.evm.bytecode.object),
      owner
    );
    usdt = await tokenFactory.deploy("Mock USDT", "USDT");
    await usdt.waitForDeployment();
    usdtAddress = await usdt.getAddress();

    await usdt.mint(owner.address, ethers.parseUnits("1000", 6));
    await usdt.mint(alice.address, ethers.parseUnits("1000", 6));
    await usdt.mint(bob.address, ethers.parseUnits("1000", 6));
    await usdt.mint(carol.address, ethers.parseUnits("1000", 6));

    const registryFactory = new ethers.ContractFactory(
      compiled.registry.abi,
      toBytecode(compiled.registry.evm.bytecode.object),
      owner
    );
    registry = await registryFactory.deploy(usdtAddress);
    await registry.waitForDeployment();
    registryAddress = await registry.getAddress();
  });

  it("initializes four fixed activities", async function () {
    expect(await registry.activityCount()).to.equal(4);

    const mountain = await registry.activities(ACTIVITY_IDS.MOUNTAIN);
    expect(mountain.name).to.equal("Mountain expedition");
    expect(mountain.maxParticipants).to.equal(24);
    expect(mountain.priceUSDT).to.equal(ethers.parseUnits("150", 6));
    expect(mountain.organizer).to.equal(owner.address);

    const asado = await registry.activities(ACTIVITY_IDS.ASADO);
    expect(asado.name).to.equal("Patagonian asado");
    expect(asado.active).to.equal(true);
  });

  it("allows participants to register for a predefined activity", async function () {
    const activity = await registry.activities(ACTIVITY_IDS.KAYAK);
    await usdt.connect(alice).approve(registryAddress, activity.priceUSDT);

    await registry.connect(alice).registerForActivity(ACTIVITY_IDS.KAYAK);

    const updated = await registry.activities(ACTIVITY_IDS.KAYAK);
    expect(updated.registeredCount).to.equal(1);
    expect(await registry.isRegistered(ACTIVITY_IDS.KAYAK, alice.address)).to.equal(true);
  });

  it("prevents double registration", async function () {
    const activity = await registry.activities(ACTIVITY_IDS.MOUNTAIN);
    await usdt.connect(alice).approve(registryAddress, activity.priceUSDT);

    await registry.connect(alice).registerForActivity(ACTIVITY_IDS.MOUNTAIN);
    await expect(
      registry.connect(alice).registerForActivity(ACTIVITY_IDS.MOUNTAIN)
    ).to.be.revertedWith("Already registered");
  });

  it("enforces the max participant limit", async function () {
    const climbing = await registry.activities(ACTIVITY_IDS.CLIMBING);

    await usdt.connect(alice).approve(registryAddress, climbing.priceUSDT);
    await registry.connect(alice).registerForActivity(ACTIVITY_IDS.CLIMBING);

    await usdt.connect(bob).approve(registryAddress, climbing.priceUSDT);
    await registry.connect(bob).registerForActivity(ACTIVITY_IDS.CLIMBING);

    await usdt.connect(carol).approve(registryAddress, climbing.priceUSDT);
    await expect(
      registry.connect(carol).registerForActivity(ACTIVITY_IDS.CLIMBING)
    ).to.be.revertedWith("No spots available");
  });

  it("updates organizers when the admin changes", async function () {
    const newAdmin = carol.address;
    await registry.setAdmin(newAdmin);

    const mountain = await registry.activities(ACTIVITY_IDS.MOUNTAIN);
    expect(mountain.organizer).to.equal(newAdmin);
    expect(await registry.admin()).to.equal(newAdmin);
  });
});
