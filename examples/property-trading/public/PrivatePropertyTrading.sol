// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract PrivatePropertyTrading is SepoliaConfig {

    address public owner;
    uint256 public propertyCounter;
    uint256 public offerCounter;

    struct Property {
        uint256 propertyId;
        address owner;
        string location;
        string propertyType; // office, retail, warehouse, etc
        bool isForSale;
        euint64 askingPrice; // encrypted asking price
        euint32 squareFootage; // encrypted square footage
        uint256 listedTimestamp;
        bool isActive;
    }

    struct PrivateOffer {
        uint256 offerId;
        uint256 propertyId;
        address buyer;
        euint64 offerAmount; // encrypted offer amount
        euint32 financingTerms; // encrypted financing terms in months
        uint256 offerTimestamp;
        uint256 expirationTime;
        bool isActive;
        bool isAccepted;
        bool isRejected;
    }

    struct Transaction {
        uint256 transactionId;
        uint256 propertyId;
        address seller;
        address buyer;
        uint64 finalPrice; // revealed after completion
        uint256 completionTimestamp;
        bool isCompleted;
    }

    mapping(uint256 => Property) public properties;
    mapping(uint256 => PrivateOffer) public offers;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public ownerProperties;
    mapping(address => uint256[]) public buyerOffers;
    mapping(uint256 => uint256[]) public propertyOffers; // propertyId => offerIds[]

    // Access control for viewing encrypted data
    mapping(uint256 => mapping(address => bool)) public propertyViewAccess;
    mapping(uint256 => mapping(address => bool)) public offerViewAccess;

    event PropertyListed(uint256 indexed propertyId, address indexed owner, string location);
    event OfferSubmitted(uint256 indexed offerId, uint256 indexed propertyId, address indexed buyer);
    event OfferAccepted(uint256 indexed offerId, uint256 indexed propertyId);
    event OfferRejected(uint256 indexed offerId, uint256 indexed propertyId);
    event TransactionCompleted(uint256 indexed transactionId, uint256 indexed propertyId, address seller, address buyer);
    event PropertyViewGranted(uint256 indexed propertyId, address indexed viewer);
    event OfferViewGranted(uint256 indexed offerId, address indexed viewer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    modifier onlyPropertyOwner(uint256 propertyId) {
        require(properties[propertyId].owner == msg.sender, "Not property owner");
        _;
    }

    modifier onlyOfferBuyer(uint256 offerId) {
        require(offers[offerId].buyer == msg.sender, "Not offer buyer");
        _;
    }

    modifier propertyExists(uint256 propertyId) {
        require(properties[propertyId].propertyId != 0, "Property does not exist");
        _;
    }

    modifier offerExists(uint256 offerId) {
        require(offers[offerId].offerId != 0, "Offer does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
        propertyCounter = 0;
        offerCounter = 0;
    }

    // List a commercial property for sale
    function listProperty(
        string memory _location,
        string memory _propertyType,
        uint64 _askingPrice,
        uint32 _squareFootage
    ) external returns (uint256) {
        propertyCounter++;

        euint64 encryptedPrice = FHE.asEuint64(_askingPrice);
        euint32 encryptedSquareFootage = FHE.asEuint32(_squareFootage);

        properties[propertyCounter] = Property({
            propertyId: propertyCounter,
            owner: msg.sender,
            location: _location,
            propertyType: _propertyType,
            isForSale: true,
            askingPrice: encryptedPrice,
            squareFootage: encryptedSquareFootage,
            listedTimestamp: block.timestamp,
            isActive: true
        });

        ownerProperties[msg.sender].push(propertyCounter);

        // Grant view access to property owner
        propertyViewAccess[propertyCounter][msg.sender] = true;

        // Set ACL permissions
        FHE.allowThis(encryptedPrice);
        FHE.allowThis(encryptedSquareFootage);
        FHE.allow(encryptedPrice, msg.sender);
        FHE.allow(encryptedSquareFootage, msg.sender);

        emit PropertyListed(propertyCounter, msg.sender, _location);
        return propertyCounter;
    }

    // Submit private offer for a property
    function submitPrivateOffer(
        uint256 _propertyId,
        uint64 _offerAmount,
        uint32 _financingTerms,
        uint256 _expirationHours
    ) external propertyExists(_propertyId) returns (uint256) {
        require(properties[_propertyId].isForSale, "Property not for sale");
        require(properties[_propertyId].isActive, "Property not active");
        require(properties[_propertyId].owner != msg.sender, "Cannot offer on own property");

        offerCounter++;

        euint64 encryptedOffer = FHE.asEuint64(_offerAmount);
        euint32 encryptedTerms = FHE.asEuint32(_financingTerms);

        uint256 expirationTime = block.timestamp + (_expirationHours * 1 hours);

        offers[offerCounter] = PrivateOffer({
            offerId: offerCounter,
            propertyId: _propertyId,
            buyer: msg.sender,
            offerAmount: encryptedOffer,
            financingTerms: encryptedTerms,
            offerTimestamp: block.timestamp,
            expirationTime: expirationTime,
            isActive: true,
            isAccepted: false,
            isRejected: false
        });

        buyerOffers[msg.sender].push(offerCounter);
        propertyOffers[_propertyId].push(offerCounter);

        // Grant view access to buyer and property owner
        offerViewAccess[offerCounter][msg.sender] = true;
        offerViewAccess[offerCounter][properties[_propertyId].owner] = true;

        // Set ACL permissions
        FHE.allowThis(encryptedOffer);
        FHE.allowThis(encryptedTerms);
        FHE.allow(encryptedOffer, msg.sender);
        FHE.allow(encryptedOffer, properties[_propertyId].owner);
        FHE.allow(encryptedTerms, msg.sender);
        FHE.allow(encryptedTerms, properties[_propertyId].owner);

        emit OfferSubmitted(offerCounter, _propertyId, msg.sender);
        return offerCounter;
    }

    // Accept an offer (property owner only)
    function acceptOffer(uint256 _offerId)
        external
        offerExists(_offerId)
        onlyPropertyOwner(offers[_offerId].propertyId)
    {
        PrivateOffer storage offer = offers[_offerId];
        require(offer.isActive, "Offer not active");
        require(!offer.isAccepted && !offer.isRejected, "Offer already processed");
        require(block.timestamp <= offer.expirationTime, "Offer expired");

        offer.isAccepted = true;
        offer.isActive = false;

        // Mark property as no longer for sale
        properties[offer.propertyId].isForSale = false;

        // Deactivate all other offers for this property
        uint256[] memory otherOffers = propertyOffers[offer.propertyId];
        for (uint256 i = 0; i < otherOffers.length; i++) {
            if (otherOffers[i] != _offerId) {
                offers[otherOffers[i]].isActive = false;
                offers[otherOffers[i]].isRejected = true;
            }
        }

        emit OfferAccepted(_offerId, offer.propertyId);

        // Initiate transaction completion process
        _initiateTransaction(_offerId);
    }

    // Reject an offer (property owner only)
    function rejectOffer(uint256 _offerId)
        external
        offerExists(_offerId)
        onlyPropertyOwner(offers[_offerId].propertyId)
    {
        PrivateOffer storage offer = offers[_offerId];
        require(offer.isActive, "Offer not active");
        require(!offer.isAccepted && !offer.isRejected, "Offer already processed");

        offer.isRejected = true;
        offer.isActive = false;

        emit OfferRejected(_offerId, offer.propertyId);
    }

    // Internal function to initiate transaction
    function _initiateTransaction(uint256 _offerId) private {
        PrivateOffer storage offer = offers[_offerId];
        Property storage property = properties[offer.propertyId];

        // For now, complete transaction immediately with placeholder price
        // In production, this would use FHE decryption
        _completeTransactionDirect(_offerId, 0); // 0 as placeholder for encrypted price
    }

    // Complete transaction directly (simplified for compilation)
    function _completeTransactionDirect(uint256 _offerId, uint64 finalPrice) private {
        PrivateOffer storage offer = offers[_offerId];
        Property storage property = properties[offer.propertyId];

        // Transfer property ownership
        address previousOwner = property.owner;
        property.owner = offer.buyer;

        // Remove from previous owner's list
        _removeFromOwnerProperties(previousOwner, offer.propertyId);

        // Add to new owner's list
        ownerProperties[offer.buyer].push(offer.propertyId);

        // Create transaction record
        uint256 transactionId = _createTransactionRecord(
            offer.propertyId,
            previousOwner,
            offer.buyer,
            finalPrice
        );

        emit TransactionCompleted(transactionId, offer.propertyId, previousOwner, offer.buyer);
    }


    // Helper function to remove property from owner's list
    function _removeFromOwnerProperties(address owner, uint256 propertyId) private {
        uint256[] storage ownerProps = ownerProperties[owner];
        for (uint256 i = 0; i < ownerProps.length; i++) {
            if (ownerProps[i] == propertyId) {
                ownerProps[i] = ownerProps[ownerProps.length - 1];
                ownerProps.pop();
                break;
            }
        }
    }

    // Helper function to create transaction record
    function _createTransactionRecord(
        uint256 propertyId,
        address seller,
        address buyer,
        uint64 finalPrice
    ) private returns (uint256) {
        uint256 transactionId = propertyId; // Simple ID scheme

        transactions[transactionId] = Transaction({
            transactionId: transactionId,
            propertyId: propertyId,
            seller: seller,
            buyer: buyer,
            finalPrice: finalPrice,
            completionTimestamp: block.timestamp,
            isCompleted: true
        });

        return transactionId;
    }

    // Grant view access to property details
    function grantPropertyViewAccess(uint256 _propertyId, address _viewer)
        external
        onlyPropertyOwner(_propertyId)
    {
        propertyViewAccess[_propertyId][_viewer] = true;

        // Grant FHE access
        FHE.allow(properties[_propertyId].askingPrice, _viewer);
        FHE.allow(properties[_propertyId].squareFootage, _viewer);

        emit PropertyViewGranted(_propertyId, _viewer);
    }

    // Grant view access to offer details
    function grantOfferViewAccess(uint256 _offerId, address _viewer)
        external
    {
        require(
            msg.sender == offers[_offerId].buyer ||
            msg.sender == properties[offers[_offerId].propertyId].owner,
            "Not authorized to grant access"
        );

        offerViewAccess[_offerId][_viewer] = true;

        // Grant FHE access
        FHE.allow(offers[_offerId].offerAmount, _viewer);
        FHE.allow(offers[_offerId].financingTerms, _viewer);

        emit OfferViewGranted(_offerId, _viewer);
    }

    // Get property basic info (non-encrypted)
    function getPropertyInfo(uint256 _propertyId)
        external
        view
        propertyExists(_propertyId)
        returns (
            address propertyOwner,
            string memory location,
            string memory propertyType,
            bool isForSale,
            uint256 listedTimestamp,
            bool isActive
        )
    {
        Property storage property = properties[_propertyId];
        return (
            property.owner,
            property.location,
            property.propertyType,
            property.isForSale,
            property.listedTimestamp,
            property.isActive
        );
    }

    // Get offer basic info (non-encrypted)
    function getOfferInfo(uint256 _offerId)
        external
        view
        offerExists(_offerId)
        returns (
            uint256 propertyId,
            address buyer,
            uint256 offerTimestamp,
            uint256 expirationTime,
            bool isActive,
            bool isAccepted,
            bool isRejected
        )
    {
        PrivateOffer storage offer = offers[_offerId];
        return (
            offer.propertyId,
            offer.buyer,
            offer.offerTimestamp,
            offer.expirationTime,
            offer.isActive,
            offer.isAccepted,
            offer.isRejected
        );
    }

    // Get properties owned by an address
    function getOwnerProperties(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        return ownerProperties[_owner];
    }

    // Get offers made by a buyer
    function getBuyerOffers(address _buyer)
        external
        view
        returns (uint256[] memory)
    {
        return buyerOffers[_buyer];
    }

    // Get offers for a specific property
    function getPropertyOffers(uint256 _propertyId)
        external
        view
        returns (uint256[] memory)
    {
        return propertyOffers[_propertyId];
    }

    // Get transaction details
    function getTransactionDetails(uint256 _transactionId)
        external
        view
        returns (
            uint256 propertyId,
            address seller,
            address buyer,
            uint64 finalPrice,
            uint256 completionTimestamp,
            bool isCompleted
        )
    {
        Transaction storage transaction = transactions[_transactionId];
        return (
            transaction.propertyId,
            transaction.seller,
            transaction.buyer,
            transaction.finalPrice,
            transaction.completionTimestamp,
            transaction.isCompleted
        );
    }

    // Check if address has view access to property
    function hasPropertyViewAccess(uint256 _propertyId, address _viewer)
        external
        view
        returns (bool)
    {
        return propertyViewAccess[_propertyId][_viewer];
    }

    // Check if address has view access to offer
    function hasOfferViewAccess(uint256 _offerId, address _viewer)
        external
        view
        returns (bool)
    {
        return offerViewAccess[_offerId][_viewer];
    }

    // Emergency function to deactivate property (owner only)
    function deactivateProperty(uint256 _propertyId)
        external
        onlyPropertyOwner(_propertyId)
    {
        properties[_propertyId].isActive = false;
        properties[_propertyId].isForSale = false;

        // Deactivate all active offers for this property
        uint256[] memory offers_list = propertyOffers[_propertyId];
        for (uint256 i = 0; i < offers_list.length; i++) {
            if (offers[offers_list[i]].isActive) {
                offers[offers_list[i]].isActive = false;
                offers[offers_list[i]].isRejected = true;
            }
        }
    }

    // Get platform statistics
    function getPlatformStats()
        external
        view
        returns (
            uint256 totalProperties,
            uint256 totalOffers,
            uint256 activeProperties,
            uint256 activeOffers
        )
    {
        uint256 activeProps = 0;
        uint256 activeOffs = 0;

        for (uint256 i = 1; i <= propertyCounter; i++) {
            if (properties[i].isActive) {
                activeProps++;
            }
        }

        for (uint256 i = 1; i <= offerCounter; i++) {
            if (offers[i].isActive) {
                activeOffs++;
            }
        }

        return (propertyCounter, offerCounter, activeProps, activeOffs);
    }
}