// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PrivatePropertyTrading
 * @dev Smart contract for private and secure property trading
 */
contract PrivatePropertyTrading {

    struct Property {
        uint256 id;
        address owner;
        string propertyHash; // IPFS hash or encrypted property details
        uint256 price;
        bool isListed;
        uint256 listedAt;
    }

    struct Transaction {
        uint256 propertyId;
        address seller;
        address buyer;
        uint256 price;
        uint256 timestamp;
        bool completed;
    }

    // State variables
    uint256 private propertyCounter;
    uint256 private transactionCounter;

    mapping(uint256 => Property) public properties;
    mapping(uint256 => Transaction) public transactions;
    mapping(address => uint256[]) public userProperties;
    mapping(address => uint256[]) public userTransactions;

    // Events
    event PropertyRegistered(uint256 indexed propertyId, address indexed owner, uint256 price);
    event PropertyListed(uint256 indexed propertyId, uint256 price);
    event PropertyDelisted(uint256 indexed propertyId);
    event PropertyPurchased(uint256 indexed propertyId, address indexed buyer, address indexed seller, uint256 price);
    event PriceUpdated(uint256 indexed propertyId, uint256 oldPrice, uint256 newPrice);

    // Modifiers
    modifier onlyPropertyOwner(uint256 _propertyId) {
        require(properties[_propertyId].owner == msg.sender, "Not property owner");
        _;
    }

    modifier propertyExists(uint256 _propertyId) {
        require(_propertyId > 0 && _propertyId <= propertyCounter, "Property does not exist");
        _;
    }

    modifier propertyListed(uint256 _propertyId) {
        require(properties[_propertyId].isListed, "Property not listed");
        _;
    }

    /**
     * @dev Register a new property
     * @param _propertyHash IPFS hash containing encrypted property details
     * @param _price Property price in wei
     */
    function registerProperty(string memory _propertyHash, uint256 _price) external returns (uint256) {
        require(bytes(_propertyHash).length > 0, "Property hash cannot be empty");
        require(_price > 0, "Price must be greater than 0");

        propertyCounter++;

        properties[propertyCounter] = Property({
            id: propertyCounter,
            owner: msg.sender,
            propertyHash: _propertyHash,
            price: _price,
            isListed: false,
            listedAt: 0
        });

        userProperties[msg.sender].push(propertyCounter);

        emit PropertyRegistered(propertyCounter, msg.sender, _price);

        return propertyCounter;
    }

    /**
     * @dev List a property for sale
     * @param _propertyId ID of the property to list
     */
    function listProperty(uint256 _propertyId)
        external
        propertyExists(_propertyId)
        onlyPropertyOwner(_propertyId)
    {
        require(!properties[_propertyId].isListed, "Property already listed");

        properties[_propertyId].isListed = true;
        properties[_propertyId].listedAt = block.timestamp;

        emit PropertyListed(_propertyId, properties[_propertyId].price);
    }

    /**
     * @dev Delist a property from sale
     * @param _propertyId ID of the property to delist
     */
    function delistProperty(uint256 _propertyId)
        external
        propertyExists(_propertyId)
        onlyPropertyOwner(_propertyId)
    {
        require(properties[_propertyId].isListed, "Property not listed");

        properties[_propertyId].isListed = false;
        properties[_propertyId].listedAt = 0;

        emit PropertyDelisted(_propertyId);
    }

    /**
     * @dev Update property price
     * @param _propertyId ID of the property
     * @param _newPrice New price in wei
     */
    function updatePrice(uint256 _propertyId, uint256 _newPrice)
        external
        propertyExists(_propertyId)
        onlyPropertyOwner(_propertyId)
    {
        require(_newPrice > 0, "Price must be greater than 0");

        uint256 oldPrice = properties[_propertyId].price;
        properties[_propertyId].price = _newPrice;

        emit PriceUpdated(_propertyId, oldPrice, _newPrice);
    }

    /**
     * @dev Purchase a listed property
     * @param _propertyId ID of the property to purchase
     */
    function purchaseProperty(uint256 _propertyId)
        external
        payable
        propertyExists(_propertyId)
        propertyListed(_propertyId)
    {
        Property storage property = properties[_propertyId];

        require(msg.sender != property.owner, "Cannot buy your own property");
        require(msg.value >= property.price, "Insufficient payment");

        address previousOwner = property.owner;

        // Transfer ownership
        property.owner = msg.sender;
        property.isListed = false;
        property.listedAt = 0;

        // Update user properties
        userProperties[msg.sender].push(_propertyId);

        // Record transaction
        transactionCounter++;
        transactions[transactionCounter] = Transaction({
            propertyId: _propertyId,
            seller: previousOwner,
            buyer: msg.sender,
            price: property.price,
            timestamp: block.timestamp,
            completed: true
        });

        userTransactions[msg.sender].push(transactionCounter);
        userTransactions[previousOwner].push(transactionCounter);

        // Transfer funds to previous owner
        (bool success, ) = payable(previousOwner).call{value: property.price}("");
        require(success, "Payment transfer failed");

        // Refund excess payment
        if (msg.value > property.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - property.price}("");
            require(refundSuccess, "Refund failed");
        }

        emit PropertyPurchased(_propertyId, msg.sender, previousOwner, property.price);
    }

    /**
     * @dev Get all properties owned by an address
     * @param _owner Address of the owner
     */
    function getPropertiesByOwner(address _owner) external view returns (uint256[] memory) {
        return userProperties[_owner];
    }

    /**
     * @dev Get all transactions for an address
     * @param _user Address of the user
     */
    function getTransactionsByUser(address _user) external view returns (uint256[] memory) {
        return userTransactions[_user];
    }

    /**
     * @dev Get all listed properties
     */
    function getListedProperties() external view returns (uint256[] memory) {
        uint256 listedCount = 0;

        // Count listed properties
        for (uint256 i = 1; i <= propertyCounter; i++) {
            if (properties[i].isListed) {
                listedCount++;
            }
        }

        // Create array of listed property IDs
        uint256[] memory listedProperties = new uint256[](listedCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= propertyCounter; i++) {
            if (properties[i].isListed) {
                listedProperties[index] = i;
                index++;
            }
        }

        return listedProperties;
    }

    /**
     * @dev Get total number of properties
     */
    function getTotalProperties() external view returns (uint256) {
        return propertyCounter;
    }

    /**
     * @dev Get total number of transactions
     */
    function getTotalTransactions() external view returns (uint256) {
        return transactionCounter;
    }

    /**
     * @dev Get property details
     * @param _propertyId ID of the property
     */
    function getProperty(uint256 _propertyId)
        external
        view
        propertyExists(_propertyId)
        returns (
            uint256 id,
            address owner,
            string memory propertyHash,
            uint256 price,
            bool isListed,
            uint256 listedAt
        )
    {
        Property memory property = properties[_propertyId];
        return (
            property.id,
            property.owner,
            property.propertyHash,
            property.price,
            property.isListed,
            property.listedAt
        );
    }

    /**
     * @dev Get transaction details
     * @param _transactionId ID of the transaction
     */
    function getTransaction(uint256 _transactionId)
        external
        view
        returns (
            uint256 propertyId,
            address seller,
            address buyer,
            uint256 price,
            uint256 timestamp,
            bool completed
        )
    {
        require(_transactionId > 0 && _transactionId <= transactionCounter, "Transaction does not exist");
        Transaction memory txn = transactions[_transactionId];
        return (
            txn.propertyId,
            txn.seller,
            txn.buyer,
            txn.price,
            txn.timestamp,
            txn.completed
        );
    }
}
