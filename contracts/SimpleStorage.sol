pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
  struct Data{
    address from;
    address to;
    string digitalSignature;
  }
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
  
  //mapping (string => string) digitalSignature;
  //function storeDigitalSignature(string memory link,string memory signature) public {
  //  digitalSignature[link] = signature;
  //}
  function getDigitalSignature(string memory link) public view returns (string memory)
  {
     return data[link].digitalSignature;
  }

  mapping(address => string[]) addressLink;
  function addAddressLink(address add,string memory link) private {
        addressLink[add].push(link);
  }
  mapping(string=> Data) data;
  function addData(string memory link,string memory digitalSignature,address to) public
  {
    data[link].from=msg.sender;
    data[link].to=to;
    data[link].digitalSignature=digitalSignature;
    addAddressLink(to,link);
  }
  function getLinks() public view returns (string[] memory)
  {
    return addressLink[msg.sender];
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
  
}
