// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract PropertyMarketplace {
    uint public propertyCount;
    address public admin;
    IERC20 public paymentToken;

    constructor(address tokenAddress) {
        admin = msg.sender;
        paymentToken = IERC20(tokenAddress);
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
        address owner;
        string titulo;
        string descripcion;
        string city;
        string postalCode;
        uint precioUSDT;
        uint seniaUSDT;
        string fotoSlider;
        string fotosMini;
        string fotoAvatar;
        string url;
        bool forSale;
        bool forRent;
        bool rented;
    }

    // Booking information per property and day (Unix timestamp at 00:00)
    struct Reservation {
        address renter;
        bool paid;
        bytes32 accessCode;
    }

    // propertyId => day => Reservation
    mapping(uint => mapping(uint => Reservation)) public reservations;

    // track active reservations per property
    mapping(uint => uint) public reservationCount;

    mapping(uint => Property) public properties;
    mapping(address => KYC) public kycs;

    event PropertyListed(uint id, address owner, string titulo, uint precioUSDT, bool forSale, bool forRent);
    event PropertyPurchased(uint id, address buyer);
    event PropertyRented(uint id, address renter);
    event ReservationMade(uint id, address renter, uint date);
    event AccessCodeGenerated(uint id, address renter, uint date, bytes32 code);

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

    function listProperty(
        string memory titulo,
        string memory descripcion,
        string memory city,
        string memory postalCode,
        uint precioUSDT,
        uint seniaUSDT,
        string memory fotoSlider,
        string memory fotosMini,
        string memory fotoAvatar,
        string memory url,
        bool forSale,
        bool forRent
    ) external onlyVerified {
        require(bytes(titulo).length > 0, "Title required");
        require(bytes(descripcion).length > 0, "Description required");
        require(bytes(city).length > 0, "City required");
        require(bytes(postalCode).length > 0, "Postal code required");
        require(precioUSDT > 0, "Price required");
        require(bytes(fotoSlider).length > 0, "Slider photo required");
        require(bytes(fotosMini).length > 0, "Mini photos required");
        require(bytes(fotoAvatar).length > 0, "Avatar photo required");
        require(bytes(url).length > 0, "URL required");
        require(forSale || forRent, "Must be for sale or rent");
        propertyCount++;
        properties[propertyCount] = Property(
            propertyCount,
            msg.sender,
            titulo,
            descripcion,
            city,
            postalCode,
            precioUSDT,
            seniaUSDT,
            fotoSlider,
            fotosMini,
            fotoAvatar,
            url,
            forSale,
            forRent,
            false
        );
        emit PropertyListed(propertyCount, msg.sender, titulo, precioUSDT, forSale, forRent);
    }

    function buyProperty(uint id) external onlyVerified {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        require(prop.forSale, "Not for sale");
        require(paymentToken.transferFrom(msg.sender, prop.owner, prop.precioUSDT), "Payment failed");

        prop.owner = msg.sender;
        prop.forSale = false;

        emit PropertyPurchased(id, msg.sender);
    }

    function rentProperty(uint id) external onlyVerified {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        require(prop.forRent, "Not for rent");
        require(!prop.rented, "Already rented");
        require(paymentToken.transferFrom(msg.sender, prop.owner, prop.precioUSDT), "Payment failed");
        prop.rented = true;

        emit PropertyRented(id, msg.sender);
    }

    // Check if a specific day is free for booking
    function isDateAvailable(uint id, uint date) public view returns (bool) {
        return reservations[id][date].renter == address(0);
    }

    // Reserve a day by paying the deposit (seña)
    function reserveDate(uint id, uint date) external onlyVerified {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        require(prop.forRent, "Not for rent");
        require(isDateAvailable(id, date), "Date reserved");
        require(paymentToken.transferFrom(msg.sender, prop.owner, prop.seniaUSDT), "Payment failed");

        reservations[id][date].renter = msg.sender;
        reservationCount[id]++;

        emit ReservationMade(id, msg.sender, date);
    }

    // Pay the remaining rent and receive an access code for the smart lock
    function payRent(uint id, uint date) external onlyVerified returns (bytes32) {
        Property storage prop = properties[id];
        Reservation storage res = reservations[id][date];

        require(res.renter == msg.sender, "Not renter");
        require(!res.paid, "Already paid");
        uint remaining = prop.precioUSDT - prop.seniaUSDT;
        require(paymentToken.transferFrom(msg.sender, prop.owner, remaining), "Payment failed");

        res.paid = true;
        res.accessCode = keccak256(abi.encodePacked(block.timestamp, msg.sender, id, date));

        reservationCount[id]--;

        emit AccessCodeGenerated(id, msg.sender, date, res.accessCode);
        return res.accessCode;
    }

    function pauseProperty(uint id) external {
        Property storage prop = properties[id];
        require(prop.owner == msg.sender, "Not owner");
        prop.forRent = false;
    }

    function resumeProperty(uint id) external {
        Property storage prop = properties[id];
        require(prop.owner == msg.sender, "Not owner");
        prop.forRent = true;
    }

    function removeProperty(uint id) external {
        Property storage prop = properties[id];
        require(prop.owner == msg.sender, "Not owner");
        require(reservationCount[id] == 0, "Active reservations");
        delete properties[id];
    }

    function adminCancelSale(uint id) external onlyAdmin {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        prop.forSale = false;
        prop.forRent = false;
    }

    function adminCancelPurchase(uint id, address previousOwner) external onlyAdmin {
        Property storage prop = properties[id];
        require(prop.owner != address(0), "Property not found");
        prop.owner = previousOwner;
    }
}
