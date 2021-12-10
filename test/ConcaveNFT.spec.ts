import { expect } from 'chai'
import { deployments, ethers, getNamedAccounts } from 'hardhat'

const memory: any = {}

describe('ConcaveNFT', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
    memory.deployer = memory.signers[0]
    memory.other1 = memory.signers[1]
    memory.other2 = memory.signers[2]
    memory.namedAccounts = await getNamedAccounts()
  })

  beforeEach(async () => {
    const { ConcaveNFT } = await deployments.fixture(['ConcaveNFT'])
    memory.ConcaveNFT = await ethers.getContractAt(
      ConcaveNFT.abi,
      ConcaveNFT.address,
      memory.other1
    )
  })

  it('Should get max token id', async () => {
    const maxTokenId = await memory.ConcaveNFT.maxTokenId()
    expect(maxTokenId).to.be.eq('3')
  })

  it('Should mint', async () => {
    await memory.ConcaveNFT.mint('1')
    expect(await memory.ConcaveNFT.balanceOf(memory.other1.address)).to.be.eq(
      '1'
    )
  })

  it('Should mint many from same address', async () => {
    await memory.ConcaveNFT.mint('1')
    await memory.ConcaveNFT.mint('2')
    expect(await memory.ConcaveNFT.balanceOf(memory.other1.address)).to.be.eq(
      '2'
    )
  })

  it('Should mint many from different address', async () => {
    await memory.ConcaveNFT.mint('1')
    await memory.ConcaveNFT.connect(memory.other2).mint('2')
    expect(await memory.ConcaveNFT.balanceOf(memory.other1.address)).to.be.eq(
      '1'
    )
    expect(await memory.ConcaveNFT.balanceOf(memory.other2.address)).to.be.eq(
      '1'
    )
  })

  it('Should throw when token Id higher than max allowed', async () => {
    await expect(memory.ConcaveNFT.mint('5')).to.be.revertedWith(
      'Token id is higher than max token id'
    )
  })
})
