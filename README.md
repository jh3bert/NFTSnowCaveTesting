# Concavecation

Boilerplate started pack for concave nft. Fork me.

### Smart Contract Weakness Classification Registry (aligned to the terminologies and structure used in the [Common Weakness Enumeration](https://cwe.mitre.org)):

- [https://github.com/SmartContractSecurity/SWC-registry](https://github.com/SmartContractSecurity/SWC-registry): documented solidity vulnerabilities with examples.

### [Slither](https://github.com/crytic/slither) Solidity static analysis framework runs a suite of vulnerability detectors:

To analyze contracts, open terminal into the root project directory and run:

```bash
docker run -it -v `pwd`:/share trailofbits/eth-security-toolbox
cd /share && slither .
```

### Npm tasks:

- `compile`: Compile contracts
- `node`: Fire local rpc and deployed contracts
- `test:unit`: Execute unit test suite
- `test:coverage`: Execute unit test suite with coverage report
- `lint:fix`: Execute linter for .js and .sol files
- `prettier:write`: Execute prettier for .js and .sol files
- `deploy:mumbai`: Deploy contract on mumbai network

### Execute a scripts:

```bash
npx hardhat run scripts/mint.ts --network localhost
```

### Verify source code on [Polygonscan](https://mumbai.polygonscan.com):

Constructor arguments must be set into `./arguments.js`

```bash
npm run verify:mumbai DEPLOYED_CONTRACT_ADDRESS
```
