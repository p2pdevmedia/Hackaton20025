// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyMarketplace {
    uint public propertyCount;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    struct KYC {
        string firstName;
        string lastName;
        string email;
        string street;
        string city;
        string country;
        string postalCode;
        string phone;
        string idType;
        string idNumber;
        bool verified;
    }

    struct Property {
        uint id;
        address payable owner;
        string uri;
        uint price;
        bool forSale;
        bool forRent;
        bool rented;
    }

    mapping(uint => Property) public properties;
    mapping(address => KYC) public kycs;

    event PropertyListed(uint id, address owner, string uri, uint price, bool forSale, bool forRent);
    event PropertyPurchased(uint id, address buyer);
    event PropertyRented(uint id, address renter);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyVerified() {
        require(kycs[msg.sender].verified, "Not verified");
        _;
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    function submitKYC(
        string calldata firstName,
        string calldata lastName,
        string calldata email,
        string calldata street,
        string calldata city,
        string calldata country,
        string calldata postalCode,
        string calldata phone,
        string calldata idType,
        string calldata idNumber
    ) external {
        kycs[msg.sender] = KYC(
            firstName,
            lastName,
            email,
            street,
            city,
            country,
            postalCode,
            phone,
            idType,
            idNumber,
            false
        );
    }

    function verifyKYC(address user) external onlyAdmin {
        require(bytes(kycs[user].firstName).length > 0, "No KYC");
        kycs[user].verified = true;
    }

    function getKYC(address user)
        external
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            bool
        )
    {
        KYC storage info = kycs[user];
        return (
            info.firstName,
            info.lastName,
            info.email,
            info.street,
            info.city,
            info.country,
            info.postalCode,
            info.phone,
            info.idType,
            info.idNumber,
            info.verified
        );
    }

    function listProperty(string memory uri, uint price, bool forSale, bool forRent) external onlyVerified {
        require(forSale || forRent, "Must be for sale or rent");
        propertyCount++;
        properties[propertyCount] = Property(propertyCount, payable(msg.sender), uri, price, forSale, forRent, false);
        emit PropertyListed(propertyCount, msg.sender, uri, price, forSale, forRent);
    }

    function buyProperty(uint id) external payable onlyVerified {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        require(prop.forSale, "Not for sale");
        require(msg.value == prop.price, "Incorrect price");

        address payable seller = prop.owner;
        prop.owner = payable(msg.sender);
        prop.forSale = false;
        seller.transfer(msg.value);

        emit PropertyPurchased(id, msg.sender);
    }

    function rentProperty(uint id) external payable onlyVerified {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        require(prop.forRent, "Not for rent");
        require(!prop.rented, "Already rented");
        require(msg.value == prop.price, "Incorrect rent");

        prop.owner.transfer(msg.value);
        prop.rented = true;

        emit PropertyRented(id, msg.sender);
    }

    function adminCancelSale(uint id) external onlyAdmin {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        prop.forSale = false;
        prop.forRent = false;
    }

    function adminCancelPurchase(uint id, address payable previousOwner) external onlyAdmin {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        prop.owner = previousOwner;
    }
}
