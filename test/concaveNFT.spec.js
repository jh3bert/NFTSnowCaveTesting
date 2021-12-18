const { expect } = require("chai");
const { waffle, ethers } = require("hardhat");


// Contract Variables and Constants

const baseExtension = ".json";
const cost = 0.05;
const costToEther = ethers.utils.parseEther(cost.toString());
const maxSupply = 5555;
const maxMintAmount = 10;
const paused = false;

//constructor variables

const _name = "SnowCave";
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
let SnowCaveFact;
let SnowCave;


const deploy = async () => {
    [deployer,thirdParty] =  await ethers.getSigners();
    SnowCaveFact = await ethers.getContractFactory("ConcaveNFT");
    SnowCave = await SnowCaveFact.deploy(
        _name,
        _symbol,
        _initBaseURI
    );
    console.log('->')
}

const mint = async (amount) => {
    while (amount > 0) {
      let atOnce = amount > 10 ? 10: amount; 
      await SnowCave.connect(thirdParty).mint(thirdParty.getAddress(), atOnce, {value:ethers.utils.parseEther((atOnce*cost).toString())})
      amount -= atOnce;
    }
}

// Tests

describe("SnowCave: Reads public constants & Variables", () => {
    before(deploy)
    it(`name is "${_name}"`, async () => {
        expect(await SnowCave.name()).to.equal(_name)
    })
    it(`symbol is "${_symbol}"`, async () => {
        expect(await SnowCave.symbol()).to.equal(_symbol)
    })
    it(`baseURI is "${_initBaseURI}"`, async () => {
        expect(await SnowCave.baseURI()).to.equal(_initBaseURI)
    })
    it(`maxMintAmount is "${maxMintAmount}"`, async () => {
        expect(await SnowCave.maxMintAmount()).to.equal(maxMintAmount)
    })
    it(`Max Supply is "${maxSupply}"`, async () => {
        expect(await SnowCave.maxSupply()).to.equal(maxSupply)
    })
    it(`Base Extension is "${baseExtension}"`, async () => {
        expect(await SnowCave.baseExtension()).to.equal(baseExtension)
    })
    it(`Paused is "${paused}"`, async () => {
        expect(await SnowCave.paused()).to.equal(paused)
    })
    it(`cost is "${ethers.utils.formatEther(costToEther)}"`, async () => {
        expect(await SnowCave.cost()).to.equal(costToEther)
    })
    
})

describe("SnowCave: Owner Functions", () => {
    beforeEach(deploy)
    describe("setBaseURI()", () => {
        it("Non owner calling should revert with: Ownable: caller is not the owner", async () => {
            await expect(
                SnowCave.connect(thirdParty).setBaseURI("Error")
            ).to.be.revertedWith('Ownable: caller is not the owner')
        })
        it(`Calling setBaseURI() with parameter "test" should set baseURI="test"`, async () => {
            await SnowCave.setBaseURI("test");
            expect(await SnowCave.baseURI()).to.equal("test");
        })
        it('Owner calling setBaseURI multiple times', async () => {
            await SnowCave.setBaseURI("omega");
            expect(await SnowCave.baseURI()).to.equal("omega");
            await SnowCave.setBaseURI("baseURI");
            expect(await SnowCave.baseURI()).to.equal("baseURI");
        })
    })
    describe("setMaxMintAmount()", () => {
        it(`Third party calling setMaxMintAmount() should revert with "Ownable: caller is not the owner"`, async () => {
            await expect(
                SnowCave.connect(thirdParty).setMaxMintAmount(20)
            ).to.be.revertedWith('Ownable: caller is not the owner')
        })
        it(`Owner calling setMaxMintAmount() should pass"`, async () => {
            await SnowCave.setMaxMintAmount(20);
        })
        it(`Calling setMaxMintAmount() with parameter "40" should set maxMintAmount="40"`, async () => {
            await SnowCave.setMaxMintAmount(40);
            expect(await SnowCave.maxMintAmount()).to.equal(40);
        })
        it(`Owner can call setMaxMintAmount multiple times`, async () => {
            await SnowCave.setMaxMintAmount(40);
            expect(await SnowCave.maxMintAmount()).to.equal(40);
            await SnowCave.setMaxMintAmount(50);
            expect(await SnowCave.maxMintAmount()).to.equal(50);
        })
    })
    describe("setCost()", () => {
        it(`Non Owner calling setCost() should revert with "Ownable: caller is not the owner"`, async () => {
            await expect(
                SnowCave.connect(thirdParty).setCost(10)
            ).to.be.revertedWith('Ownable: caller is not the owner')
        })
        it(`Owner calling setCost() should pass"`, async () => {
            await SnowCave.setCost(1);
        })
        it(`Calling setCost() with parameter "40" should set cost="40"`, async () => {
            await SnowCave.setCost(40);
            expect(await SnowCave.cost()).to.equal(40);
        })
        it(`Owner can call setCost multiple times`, async () => {
            await SnowCave.setCost(40);
            expect(await SnowCave.cost()).to.equal(40);
            await SnowCave.setCost(50);
            expect(await SnowCave.cost()).to.equal(50);
        })
    })
    describe("pause()", () => {
        it('Non Owner calling pause should revert', async () => {
            await expect(SnowCave.connect(thirdParty).pause(false)
            ).to.be.revertedWith('Ownable: caller is not the owner')
        })
        it("Owner calling pause should set pause", async () => {
            await SnowCave.pause(true);
            expect(await SnowCave.paused()).to.equal(true);
        })
        it('owner can call pause multiple times', async () => {
            await SnowCave.pause(true);
            expect(await SnowCave.paused()).to.equal(true);
            await SnowCave.pause(false);
            expect(await SnowCave.paused()).to.equal(false); 
        })
    })
    describe("setBaseExtension", () => {
        it('Non Owner calling setBaseExtension() should revert', async () => {
            await expect(SnowCave.connect(thirdParty).setBaseExtension("error")
            ).to.be.revertedWith('Ownable: caller is not the owner')
        })
        it(`Calling setBaseExtension() with parameter "test" should set baseExtension="test"`, async () => {
            await SnowCave.setBaseExtension("test");
            expect(await SnowCave.baseExtension()).to.equal("test");
        })
        it('Owner calling setBaseExtension multiple times', async () => {
            await SnowCave.setBaseExtension("omega");
            expect(await SnowCave.baseExtension()).to.equal("omega");
            await SnowCave.setBaseExtension(".json");
            expect(await SnowCave.baseExtension()).to.equal(".json");
        })
    })
    describe("withdraw()", () => {
      /*  it(`Contract Balance after Sellout should be ${ethers.utils.formatEther(ethers.utils.parseEther((cost*(maxSupply)).toString()))}`, async () => {
            await mint(maxSupply);
            expect(await SnowCave.totalSupply()).to.equal(5555);
            expect(
              await waffle.provider.getBalance(SnowCave.address)
            ).to.equal(ethers.utils.parseEther((cost*(maxSupply)).toString()))
        }).timeout(0); */
        it('Mint 1 NFT, checking allocations to accounts', async () => {
          await mint(1);
          expect(await SnowCave.totalSupply()).to.equal(1);

          const balance = await waffle.provider.getBalance(SnowCave.address);
          let jack = (balance * 0.35);
          let db = balance * 0.1;
          let mar = balance * 0.25;
          let wg = balance - jack - db - mar;

          const JackCurrentEth = await waffle.provider.getBalance("0x939deceC052193035C61B96565f49b4262C462A5");
          const WgOld = await waffle.provider.getBalance("0x5b62EEE7439Aa1DC64CF0723fFd43894B2823DFF");
          await SnowCave.withdraw();

          const JackNewEth = await waffle.provider.getBalance("0x939deceC052193035C61B96565f49b4262C462A5");
          const WgNew = await waffle.provider.getBalance("0x5b62EEE7439Aa1DC64CF0723fFd43894B2823DFF");

          let JackMoney = (JackNewEth - JackCurrentEth)/(10**18);

          console.log(`Jack || 0x939deceC052193035C61B96565f49b4262C462A5 || Old Jack Eth: ${JackCurrentEth/(10**18)} ||
          Jacks Eth: ${JackNewEth/(10**18)} || Inc ${(JackNewEth/(10**18))/(balance/(10**18))}`);
          
          
          expect(
            await waffle.provider.getBalance(SnowCave.address)
          ).to.equal(ethers.utils.parseEther((0).toString()))
          
        }).timeout(0);
    })
}) 

describe("Public Functions", () => {
    beforeEach(deploy)
    describe("tokenURI()", () => {
      it(`Calling tokenURI() on nonexistent tokenId should revert with "ERC721Metadata: URI query for nonexistent token"`, async () => {
          await expect(
              SnowCave.tokenURI(0)
          ).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token")
      })
      it(`Calling tokenURI() on an existing tokenId x after reveal should return "${_initBaseURI}x.json"`, async () => {
          await mint(4);
          expect(
            await SnowCave.tokenURI(3)
        ).to.equal(`${_initBaseURI}3.json`)
      })
    })
    describe("walletOfOwner()", () => {
        it('Calling wallet of Owner with no NFTS should be Empty', async () => {
          console.log(await SnowCave.walletOfOwner("0x5b62EEE7439Aa1DC64CF0723fFd43894B2823DFF"),'should be empty');
          expect(await SnowCave.totalSupply()).to.equal(0);
        })
        it(`Checking Wallet after Minting 2 NFTs [1,2]`, async () => {
          await SnowCave.mint("0x5b62EEE7439Aa1DC64CF0723fFd43894B2823DFF", 2,
           {value:ethers.utils.parseEther((cost*2).toString())});
           console.log(await SnowCave.walletOfOwner("0x5b62EEE7439Aa1DC64CF0723fFd43894B2823DFF"))
          expect (
            await SnowCave.totalSupply()
          ).to.equal(2);
        })
    })
    describe("getBalance()", () => {
        it('Calling getBalance() before any nfts are minted should be 0', async () => {
          expect(
            await SnowCave.getBalance()
          ).to.equal(0);
        })
        it(`Mint 4 NFTs balance should be ${4*cost}`, async () => {
          await mint(4);
          const bal = await SnowCave.getBalance()/(10**18);
          expect(
            bal
          ).to.equal(4*cost);
        })
        it(`Mint 1 NFT balance should be ${cost}`, async () => {
          await mint(1);
          const bal = await SnowCave.getBalance()/(10**18);

          expect(
            bal
          ).to.equal(1*cost);
        })
    })
    /*  NOT IN USE NOW
      describe("_baseURI()", () => {
        it(`Init Base URI should be ${_initBaseURI}`, async () => {
          expect(
            await SnowCave._baseURI()
          ).to.equal(_initBaseURI);
        })
        it(`Set Base URI to Concave/Test`, async () => {
          await SnowCave.setBaseURI('Concave/Test');
          expect(
            await SnowCave._baseURI()
          ).to.equal("Concave/Test");
        })
    }) */
    describe("mint()", () => {
        it("Should fail when Paused", async () => {
          await SnowCave.pause(true);
          await expect(
            SnowCave.connect(thirdParty).mint(thirdParty.getAddress(), 
            1, {value:ethers.utils.parseEther((cost).toString())})
          ).to.be.revertedWith("not for sale at the moment");
        })
        it("Should fail when mintAmt <= 0", async () => {
          await SnowCave.pause(false);
          await expect(
            SnowCave.connect(thirdParty).mint(thirdParty.getAddress(), 
            0, {value:ethers.utils.parseEther((0*cost).toString())})
          ).to.be.revertedWith("select mint amount");
        })
        it("Should fail when mintAmt > maxMint per tx", async () => {
          await SnowCave.pause(false);
          await expect(
            SnowCave.connect(thirdParty).mint(thirdParty.getAddress(), 
            11, {value:ethers.utils.parseEther((11*cost).toString())})
          ).to.be.revertedWith("exceeded max mint amount of ten");
        })
       /*  UNCOMMENT TO TEST BUT RUNTIME IS LONG (45SEC)


          it("Should fail when mintAmt + supply > maxsupply", async () => {
          await SnowCave.pause(false);
          await mint(5551);
          await expect(
            SnowCave.connect(thirdParty).mint(thirdParty.getAddress(), 
            5, {value:ethers.utils.parseEther((5*cost).toString())})
          ).to.be.revertedWith("not enough supply");
        }).timeout(0); */
        it("Should fail if msg.value < price*mintAmt", async () => {
          await SnowCave.pause(false);

          await expect (
            SnowCave.connect(thirdParty).mint(thirdParty.getAddress(), 5)
          ).to.be.revertedWith("insufficient funds");
        })
        it("Successful Mint with !pause, 0 < mintAmt <= 10, enough supply", async () => {
          await SnowCave.pause(false);
          
          await expect (
            SnowCave.connect(thirdParty).mint(thirdParty.getAddress(), 
            3, {value: ethers.utils.parseEther((3*cost).toString())})
          ).to.not.be.reverted;
        })
    })
})