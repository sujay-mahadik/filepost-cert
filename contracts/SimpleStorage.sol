pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
  struct Data{
    address from;
    address to;
    string digitalSignature;
  }
  mapping(address => string) publicKey;
  function checkPublicKey(address a) public view returns (uint) {

    if(bytes(publicKey[a]).length ==0)
    {
      return 0;
    }
    else
    {
      return 1;
    }
  }
  function getPublicKey(address a) public view returns (string memory){
    return publicKey[a];
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
  function addData(string memory link,string memory digitalSignature,address to,address a) public
  {
    data[link].from=a;
    data[link].to=to;
    data[link].digitalSignature=digitalSignature;
    addAddressLink(to,link);
  }
  function getLinks(address a) public view returns (string[] memory)
  {
    return addressLink[a];
  }
  function addPublicKey(string memory key,address a) public {
    uint check = checkPublicKey(a);
    if(check == 1)
    {

    }
    else
    {
      publicKey[a] = key;
    }
  }
  
}
