pragma solidity >=0.4.21 <0.6.0;

import "./Verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable {

    Verifier verifier;

    constructor (address verify) public ERC721Mintable() {
        verifier = Verifier(verify);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address owner;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) uniqueSolutions;

    // TODO Create an event to emit when a solution is added
    event AddedSolution(uint256 index, address account);

    // TODO Create a function to add the solutions to the array and emit the event
     function addSolution (uint256 index, address account, bytes32 key) internal {
         uniqueSolutions[key] = Solution({index: index, owner: account});
         solutions.push(uniqueSolutions[key]);

         emit AddedSolution(index, account);
     }

     function getSolution (bytes32 key) public view returns (address) {
        return uniqueSolutions[key].owner;
     }

     function generateKey (uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public pure returns (bytes32) {
         bytes32 key = keccak256(abi.encodePacked(a,b,c, input));
         return key;
     }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(address account, uint256 tokenId, uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) public {
        bytes32 key = generateKey(a, b, c, input);
        require(uniqueSolutions[key].owner == address(0), "this solution already exist");
        require(verifier.verifyTx(a, b, c, input), "solution is not verified");
        addSolution(tokenId, account, key);
        super.mint(account,tokenId);
    }
}



  


























