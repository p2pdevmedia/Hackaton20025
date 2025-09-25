// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ActivityRegistry
 * @notice Manages a catalog of residency activities, tracks available spots and
 *         coordinates USDT-denominated registrations directly on-chain.
 * @dev External interface:
 * - `createActivity(string,string,uint64,uint32,uint256)` creates a new activity (admin only).
 * - `setActivityStatus(uint256,bool)` toggles availability (admin only).
 * - `registerForActivity(uint256)` validates allowance, transfers USDT and reserves a spot.
 * - `getActivities()` returns the full list of activities with metadata.
 * - `getParticipants(uint256)` exposes the wallet addresses registered for an activity.
 *
 * The contract depends on a minimal `IERC20` interface for the stablecoin used to
 * charge registrations (`allowance` and `transferFrom`).
 */
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

    event ActivityStatusChanged(uint256 indexed id, bool active);
    event ActivityRegistered(uint256 indexed id, address indexed participant, uint32 registeredCount);

    uint256 public activityCount;
    address public admin;
    IERC20 public immutable stablecoin;

    uint256 public constant TOTAL_ACTIVITIES = 4;

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
        _initializeActivities();
    }

    function setAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin");
        admin = newAdmin;
        for (uint256 i = 1; i <= activityCount; i++) {
            Activity storage activity = activities[i];
            if (activity.id != 0) {
                activity.organizer = newAdmin;
            }
        }
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

    function _initializeActivities() private {
        activityCount = TOTAL_ACTIVITIES;

        _storeActivity(1, "Mountain expedition", "Summit preparation trek across the Andean skyline.", 2000000000, 24, 150 * 1e6);

        _storeActivity(2, "Kayak journey across Lake", "Dawn-to-dusk paddling clinics on the glacial lake.", 2000865600, 18, 120 * 1e6);

        _storeActivity(3, "Rock-climbing clinic", "Granite multi-pitch progression with local guides.", 2001734400, 2, 200 * 1e6);

        _storeActivity(4, "Patagonian asado", "Traditional fire-cooked feast with regional flavors.", 2002598400, 40, 80 * 1e6);
    }

    function _storeActivity(
        uint256 id,
        string memory name,
        string memory description,
        uint64 date,
        uint32 maxParticipants,
        uint256 priceUSDT
    ) private {
        activities[id] = Activity({
            id: id,
            name: name,
            description: description,
            date: date,
            maxParticipants: maxParticipants,
            registeredCount: 0,
            priceUSDT: priceUSDT,
            organizer: admin,
            active: true
        });
    }
}
