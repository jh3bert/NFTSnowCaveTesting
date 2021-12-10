# Concavecation

Boilerplate started pack for concave nft. Fork me.

### Smart Contract Weakness Classification Registry (aligned to the terminologies and structure used in the [Common Weakness Enumeration](https://cwe.mitre.org)):

- [https://github.com/SmartContractSecurity/SWC-registry](https://github.com/SmartContractSecurity/SWC-registry)
- You will find documented, well-known solidity vulnerability description with examples. 

### [Slither](https://github.com/crytic/slither) Solidity static analysis framework runs a suite of vulnerability detectors:

``` bash
docker run -it -v `pwd`:/share trailofbits/eth-security-toolbox
cd /share && slither .
```
