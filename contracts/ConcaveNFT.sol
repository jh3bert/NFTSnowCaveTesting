// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract ConcaveNFT is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseURI;
  string public baseExtension = '.json';
  uint256 public cost = 0.05 ether;
  uint256 public maxSupply = 5555;
  uint256 public maxMintAmount = 10;
  bool public paused = false;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
    //mint(msg.sender, 4);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function mint(address _to, uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused, 'not for sale at the moment');
    require(_mintAmount > 0, 'select mint amount');
    require(_mintAmount <= maxMintAmount, 'exceeded max mint amount of ten');
    require(supply + _mintAmount <= maxSupply, 'not enough supply');

    if (msg.sender != owner()) {
      require(msg.value >= cost * _mintAmount, 'insufficient funds');
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(_to, supply + i);
    }
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      'ERC721Metadata: URI query for nonexistent token'
    );

    string memory currentBaseURI = _baseURI();
    return
      bytes(currentBaseURI).length > 0
        ? string(
          abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension)
        )
        : '';
  }

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setCost(uint256 _cost) public onlyOwner {
    cost = _cost;
  }

  function setMaxMintAmount(uint256 _amount) public onlyOwner {
    maxMintAmount = _amount;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }

  function withdraw() public payable onlyOwner {
    uint256 bal = address(this).balance;

    uint256 mrHeb = (bal * 40) / 100;
    uint256 dbp = (bal * 10) / 100;
    uint256 mar = (bal * 20) / 100;
    // uint256 wg = bal *.3;

    payable(0x939deceC052193035C61B96565f49b4262C462A5).transfer(mrHeb);
    payable(0x18baA59e0B1f69cb7dD472AA0c21A7E5D5f389DE).transfer(dbp); // need dbp wallet
    payable(0xA7b56B5dfCe40A22d0AC8C872fbC0AE64D2E05ac).transfer(mar); // need mar wallet

    // transferring rest of balance to wg, because of rounding above ^ need wallet address
    payable(0x5b62EEE7439Aa1DC64CF0723fFd43894B2823DFF).transfer(
      address(this).balance
    );
  }
}
