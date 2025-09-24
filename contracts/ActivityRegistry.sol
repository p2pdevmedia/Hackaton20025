// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract ActivityRegistry {
    struct Activity {
        uint256 id;
        string name;
        string description;
        uint64 date;
        uint32 maxParticipants;
        uint32 registeredCount;
        uint256 priceUSDT;
        address organizer;
        bool active;
    }

    event ActivityCreated(uint256 indexed id, string name, uint64 date, uint32 maxParticipants, uint256 priceUSDT);
    event ActivityStatusChanged(uint256 indexed id, bool active);
    event ActivityRegistered(uint256 indexed id, address indexed participant, uint32 registeredCount);

    uint256 public activityCount;
    address public admin;
    IERC20 public immutable stablecoin;

    mapping(uint256 => Activity) public activities;
    mapping(uint256 => mapping(address => bool)) public isRegistered;
    mapping(uint256 => address[]) private participants;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor(address stablecoinAddress) {
        require(stablecoinAddress != address(0), "Stablecoin required");
        admin = msg.sender;
        stablecoin = IERC20(stablecoinAddress);
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin");
        admin = newAdmin;
    }

    function createActivity(
        string calldata name,
        string calldata description,
        uint64 date,
        uint32 maxParticipants,
        uint256 priceUSDT
    ) external onlyAdmin {
        require(bytes(name).length > 0, "Name required");
        require(bytes(description).length > 0, "Description required");
        require(date > block.timestamp, "Date must be future");
        require(maxParticipants > 0, "Max participants required");

        activityCount += 1;
        activities[activityCount] = Activity({
            id: activityCount,
            name: name,
            description: description,
            date: date,
            maxParticipants: maxParticipants,
            registeredCount: 0,
            priceUSDT: priceUSDT,
            organizer: msg.sender,
            active: true
        });

        emit ActivityCreated(activityCount, name, date, maxParticipants, priceUSDT);
    }

    function setActivityStatus(uint256 id, bool active) external onlyAdmin {
        Activity storage activity = activities[id];
        require(activity.id != 0, "Activity missing");
        activity.active = active;
        emit ActivityStatusChanged(id, active);
    }

    function registerForActivity(uint256 id) external {
        Activity storage activity = activities[id];
        require(activity.id != 0, "Activity missing");
        require(activity.active, "Activity inactive");
        require(activity.date > block.timestamp, "Activity finished");
        require(!isRegistered[id][msg.sender], "Already registered");
        require(activity.registeredCount < activity.maxParticipants, "No spots available");

        if (activity.priceUSDT > 0) {
            uint256 allowance = stablecoin.allowance(msg.sender, address(this));
            require(allowance >= activity.priceUSDT, "Insufficient allowance");
            bool success = stablecoin.transferFrom(msg.sender, activity.organizer, activity.priceUSDT);
            require(success, "Transfer failed");
        }

        activity.registeredCount += 1;
        isRegistered[id][msg.sender] = true;
        participants[id].push(msg.sender);

        emit ActivityRegistered(id, msg.sender, activity.registeredCount);
    }

    function getActivities() external view returns (Activity[] memory list) {
        list = new Activity[](activityCount);
        for (uint256 i = 0; i < activityCount; i++) {
            list[i] = activities[i + 1];
        }
    }

    function getParticipants(uint256 id) external view returns (address[] memory) {
        return participants[id];
    }
}
