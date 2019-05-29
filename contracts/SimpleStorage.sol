pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

contract SimpleStorage {
  struct Data{
    address from;
    address to;
    string digitalSignature;
  }
  struct identity{
    string pubkey;
    string name;
  }
  string[] public namearr;

  address[] public addressarr;
  mapping(address => identity) publicKey;
  function checkPublicKey(address a) public view returns (bool) {

    if(bytes(publicKey[a].pubkey).length == 0)
    {
      return false;
    }
    else
    {
      return true;
    }
  }
  function getPublicKey(address a) public view returns (string memory){
    return publicKey[a].pubkey;
  }
 
  function getDigitalSignature(string memory link) public view returns (string memory,address)
  {
     return (data[link].digitalSignature,data[link].from);
  }

  mapping(address => string[]) addressLink;
  function addAddressLink(address add,string memory link) private {
        addressLink[add].push(link);
  }
  mapping(string=> Data) data;
  function addData(string memory link,string memory digitalSignature,address to,address a) public
  {
    data[link].from = a;
    data[link].to = to;
    data[link].digitalSignature = digitalSignature;
    addAddressLink(to,link);
  }
  function getLinks(address a) public view returns (string[] memory arr)
  {
    arr = addressLink[a];
    return arr;
  }
  function addPublicKey(string memory key,address a,string memory name) public {
    bool check = checkPublicKey(a);
    if(check == true)
    {

    }
    else
    {
      publicKey[a].pubkey = key;
      publicKey[a].name = name;
      namearr.push(name);
      addressarr.push(a);

    }
  }
  function getName(address add) public view returns(string memory name){
    return publicKey[add].name;
  }
  function getAllUsersName() public view returns(string[] memory)
  {
    return namearr;

  }
  function getAllUsersAdd() public view returns(address[] memory)
  {
    return addressarr;
  }
  function getSenderName(address a) public view returns(string memory){
    for(uint i=0;i<=addressarr.length;i++)
    {
     if (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((addressarr[i]))) )
        {
          return namearr[i];
        }
    }
  }
  
  
}
