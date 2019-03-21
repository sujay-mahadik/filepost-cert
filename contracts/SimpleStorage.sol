pragma solidity ^0.5.0;

contract SimpleStorage {
  uint storedData;
  mapping(address => string) publicKey;
  function checkPublicKey() public view returns (bool) {

    if(bytes(publicKey[msg.sender]).length ==0)
    {
      return false;
    }
    else
    {
      return true;
    }
  }
  function getPublicKey() public{

  }
  mapping (string => string) digitalSignature;
  function storeDigitalSignature(string memory link,string memory signature) public {
    digitalSignature[link] = signature;
  }
  function getDigitalSignature(string memory link) public view returns (string memory)
  {
    return digitalSignature[link];
  }
  function addPublicKey(string memory key) public {
    bool check = checkPublicKey();
    if(check == true)
    {

    }
    else
    {
      publicKey[msg.sender] = key;
    }
  }
  function get() public view returns (uint) {
    return storedData;
  }
}
