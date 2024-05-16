pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DocumentNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter = 1; // Initialize the token ID counter

    // Mapping from token ID to IPFS hash (or other document reference)
    mapping(uint256 => string) private _tokenURIs;

    // Mapping from token ID to author's address
    mapping(uint256 => address) private _tokenAuthors;

    // Mapping from token ID to mapping of addresses allowed to view the document
    mapping(uint256 => mapping(address => bool)) private _viewers;

    // Mapping from token ID to mapping of addresses allowed to modify the document
    mapping(uint256 => mapping(address => bool)) private _modifiers;

    // Mapping from token ID to array of document logs
    mapping(uint256 => Log[]) private _documentLogs;

    // Mapping from owner's address to array of owned token IDs
    mapping(address => uint256[]) private _ownedTokens;
    // Mapping from address to array of owned token IDs for viewers
mapping(address => uint256[]) private _viewerOwnedTokens;

// Mapping from address to array of owned token IDs for modifiers
mapping(address => uint256[]) private _modifierOwnedTokens;

    // Struct to represent document logs
    struct Log {
        address account;
        uint256 timestamp;
        string action; // View or Modify
    }

    constructor() Ownable(msg.sender) ERC721("DocumentNFT", "DNFT") {}

    // Internal function to set token URI (like IPFS hash)
    function _setTokenURI(uint256 tokenId, string memory tokenURI) internal {
        _tokenURIs[tokenId] = tokenURI;
    }

// Function to mint a new NFT with a given IPFS hash (or document reference)
function mintDocumentNFT(string memory ipfsHash, address[] memory viewers, address[] memory modifiers) external {
    uint256 tokenId = _tokenIdCounter++; // Get current token ID and increment counter
    _safeMint(msg.sender, tokenId); // Mint the NFT to the caller
    _setTokenURI(tokenId, ipfsHash); // Set the IPFS hash for this token
    _tokenAuthors[tokenId] = msg.sender; // Set the author's address for this token

    // Add the token ID to the list of owned tokens for the caller (author)
    _ownedTokens[msg.sender].push(tokenId);

    // Add the token ID to the list of owned tokens for each viewer
    for (uint256 i = 0; i < viewers.length; i++) {
        _viewerOwnedTokens[viewers[i]].push(tokenId);
        _viewers[tokenId][viewers[i]] = true; // Set viewing permission for each address
    }

    // Add the token ID to the list of owned tokens for each modifier
    for (uint256 i = 0; i < modifiers.length; i++) {
        _modifierOwnedTokens[modifiers[i]].push(tokenId);
        _modifiers[tokenId][modifiers[i]] = true; // Set modifying permission for each address
    }
}

    // Function to modify viewing permission for a specific address
    function modifyViewPermission(uint256 tokenId, address viewer, bool permission) external {
        require(_tokenAuthors[tokenId] == msg.sender || ownerOf(tokenId) == msg.sender, "You are not authorized to modify permissions");
        _viewers[tokenId][viewer] = permission;
    }

    // Function to modify modifying permission for a specific address
    function modifyModifyPermission(uint256 tokenId, address modifiername, bool permission) external {
        require(_tokenAuthors[tokenId] == msg.sender || ownerOf(tokenId) == msg.sender, "You are not authorized to modify permissions");
        _modifiers[tokenId][modifiername] = permission;
    }

    // Function to log document action (view or modify)
    function logDocumentAction(uint256 tokenId, string memory action) external {
        require(_viewers[tokenId][msg.sender] || _modifiers[tokenId][msg.sender] || _tokenAuthors[tokenId] == msg.sender, "You are not authorized to perform this action");
        _documentLogs[tokenId].push(Log(msg.sender, block.timestamp, action));
    }

    // Function to get document logs for a specific token ID
    function getDocumentLogs(uint256 tokenId) external view returns (Log[] memory) {
        return _documentLogs[tokenId];
    }

    // Function to check if an address is allowed to view the document for a given token ID
    function canView(uint256 tokenId, address account) public view returns (bool) {
        return _viewers[tokenId][account] || _tokenAuthors[tokenId] == account;
    }

    // Function to check if an address is allowed to modify the document for a given token ID
    function canModify(uint256 tokenId, address account) public view returns (bool) {
        return _modifiers[tokenId][account] || _tokenAuthors[tokenId] == account;
    }

    // Function to get the author's address for a given token ID
    function tokenAuthor(uint256 tokenId) public view returns (address) {
        return _tokenAuthors[tokenId];
    }

 // Function to retrieve token IDs owned by a specific address
function tokensOfOwner(address owner) external view returns (uint256[] memory) {
    return _ownedTokens[owner];
}

// Function to retrieve token IDs owned by a specific viewer
function tokensOfViewer(address viewer) external view returns (uint256[] memory) {
    return _viewerOwnedTokens[viewer];
}

// Function to retrieve token IDs owned by a specific modifier
function tokensOfModifier(address modifier) external view returns (uint256[] memory) {
    return _modifierOwnedTokens[modifier];
}

    // Function to get the IPFS hash for a given token ID
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
