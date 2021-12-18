require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-etherscan");
require('solidity-coverage')
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    gasReporter: {
        enabled:true,
        currency: 'USD',
        gasPrice: 100,
        coinmarketcap:process.env.COINMARKETCAP
        // gasPriceApi:'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice'
    },
    networks: {
        localhost: {
          url: `http://localhost:8545`,
          // accounts: [
          // defaultPrivateKey,
          // ]
        }
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: process.env.API_ETHERSCAN
    },
    solidity: "0.8.4",
  }