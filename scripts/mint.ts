import { deployments, ethers } from 'hardhat'

async function mint() {
  const contractName = 'ConcaveNFT'

  const accounts = await ethers.getSigners()
  const minter = accounts[0]

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(
    Contract.abi,
    Contract.address,
    minter
  )
  const tokenId = 0
  const tx = await contract.mint(tokenId, {
    value: 0,
  })
  const txReceipt = await tx.wait()
  console.log('txReceipt', txReceipt)
}

mint()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
