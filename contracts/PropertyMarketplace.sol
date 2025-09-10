// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyMarketplace {
    uint public propertyCount;

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

    event PropertyListed(uint id, address owner, string uri, uint price, bool forSale, bool forRent);
    event PropertyPurchased(uint id, address buyer);
    event PropertyRented(uint id, address renter);

    function listProperty(string memory uri, uint price, bool forSale, bool forRent) external {
        require(forSale || forRent, "Must be for sale or rent");
        propertyCount++;
        properties[propertyCount] = Property(propertyCount, payable(msg.sender), uri, price, forSale, forRent, false);
        emit PropertyListed(propertyCount, msg.sender, uri, price, forSale, forRent);
    }

    function buyProperty(uint id) external payable {
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

    function rentProperty(uint id) external payable {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        require(prop.forRent, "Not for rent");
        require(!prop.rented, "Already rented");
        require(msg.value == prop.price, "Incorrect rent");

        prop.owner.transfer(msg.value);
        prop.rented = true;

        emit PropertyRented(id, msg.sender);
    }
}
