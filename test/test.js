const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

// Contract Variables and Constants

const baseExtension = ".json";
const cost = 0.05;
const costToEther = ethers.utils.parseEther(cost.toString());
const maxSupply = 5555;
const maxMintAmount = 10;
const paused = false;

//constructor variables

const _name = "SnowCaveTest";
const _symbol = "SNOW"
const _initBaseURI = "https://gateway.pinata.cloud/ipfs/QmaytFJQnN5yv1yfDn8y23zt1f1jpLo9WE2QYVeKWNtjdk/";

//helpers

let addresses = [
    "0x939deceC052193035C61B96565f49b4262C462A5",
    "0x18baA59e0B1f69cb7dD472AA0c21A7E5D5f389DE",
    "0xA7b56B5dfCe40A22d0AC8C872fbC0AE64D2E05ac",
    "0x5b62EEE7439Aa1DC64CF0723fFd43894B2823DFF"
];

let deployer;
let thirdParty;
let ConcaveNFTFact;
let SnowCave;


const deploy = async () => {
    [deployer,thirdParty] =  await ethers.getSigners();
    ConcaveNFTFact = await ethers.getContractFactory("ConcaveNFT");
    SnowCave = await ConcaveNFT.deploy(
        _name,
        _symbol,
        _initBaseURI
    );
    console.log('>_')
}

// Tests

describe("ConcaveNFT: Reads public constants & Variables", () => {
    before(deploy)
    it(`name is "${_name}"`, async () => {
        expect(await concavenft.name()).to.equal(_name)
    })
    it(`symbol is "${_symbol}"`, async () => {
        expect(await concavenft.symbol()).to.equal(_symbol)
    })
    it(`baseURI is "${_initBaseURI}"`, async () => {
        expect(await concavenft.baseURI()).to.equal(_initBaseURI)
    })
    it(`maxMintAmount is "${maxMintAmount}"`, async () => {
        expect(await concavenft.maxMintAmount()).to.equal(maxMintAmount)
    })
    it(`Max Supply is "${maxSupply}"`, async () => {
        expect(await concavenft.maxSupply()).to.equal(maxSupply)
    })
    it(`Base Extension is "${baseExtension}"`, async () => {
        expect(await concavenft.baseExtension()).to.equal(baseExtension)
    })
    it(`Paused is "${paused}"`, async () => {
        expect(await concavenft.paused()).to.equal(paused)
    })
    it(`cost is "${ethers.utils.formatEther(costToEther)}"`, async () => {
        expect(await concavenft.cost()).to.equal(cost)
    })
    
})

describe("ConcaveNFT: Owner Functions", () => {
    beforeEach(deploy)
    describe("setBaseURI()", () => {
        it("Non owner calling should revert with: Ownable: caller is not the owner", async () => {
            await expect(
                concavenft.connect(thirdParty).setBaseURI("Error")
            ).to.be.revertedWith('Ownable: caller is not the owner')
        })
        it(`Calling setBaseURI() with parameter "test" should set baseURI="test"`, async () => {
            await concavenft.setBaseURI("test");
            expect(await concavenft.baseURI()).to.equal("test");
        })
        it('Owner calling setBaseURI multiple times', async () => {
            await concavenft.setBaseURI("omega");
            expect(await concavenft.baseURI()).to.equal("omega");
            await concavenft.setBaseURI("baseURI");
            expect(await concavenft.baseURI()).to.equal("baseURI");
        })
    })
    describe("setMaxMintAmount()", () => {
        it(`Third party calling setMaxMintAmount() should revert with "Ownable: caller is not the owner"`, async () => {
            await expect(
                concavenft.connect(thirdParty).setMaxMintAmount(20)
            ).to.be.revertedWith('Ownable: caller is not the owner')
        })
        it(`Owner calling setMaxMintAmount() should pass"`, async () => {
            await concavenft.setMaxMintAmount(20);
        })
        it(`Calling setMaxMintAmount() with parameter "40" should set maxMintAmount="40"`, async () => {
            await concavenft.setMaxMintAmount(40);
            expect(await concavenft.maxMintAmount()).to.equal(40);
        })
        it(`Owner can call setMaxMintAmount multiple times`, async () => {
            await concavenft.setMaxMintAmount(40);
            expect(await concavenft.maxMintAmount()).to.equal(40);
            await concavenft.setMaxMintAmount(50);
            expect(await concavenft.maxMintAmount()).to.equal(50);
        })
    })
    describe("setCost()", () => {
        it(`Non Owner calling setCost() should revert with "Ownable: caller is not the owner"`, async () => {
            await expect(
                concavenft.connect(thirdParty).setCost(10)
            ).to.be.revertedWith('Ownable: caller is not the owner')
        })
        it(`Owner calling setCost() should pass"`, async () => {
            await concavenft.setCost(1);
        })
        it(`Calling setCost() with parameter "40" should set cost="40"`, async () => {
            await concavenft.setCost(40);
            expect(await concavenft.cost()).to.equal(40);
        })
        it(`Owner can call setCost multiple times`, async () => {
            await concavenft.setCost(40);
            expect(await concavenft.cost()).to.equal(40);
            await concavenft.setCost(50);
            expect(await concavenft.cost()).to.equal(50);
        })
    })
    describe("pause()", () => {
        it('Non Owner calling pause should revert', async () => {
            await expect(concavenft.connect(thirdParty).pause(false)
            ).to.be.revertedWith('Ownable: caller is not the owner')
        })
        it("Owner calling pause should set pause", async () => {
            await concavenft.pause(true);
            expect(await concavenft.paused().to.equal(true));
        })
        it('owner can call pause multiple times', async () => {
            await concavenft.pause(true);
            expect(await concavenft.paused().to.equal(true));
            await concavenft.pause(false);
            expect(await concavenft.paused().to.equal(false)); 
        })
    })
})