// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract GovernanceToken {
    string public constant name = "Governance Token";
    string public constant symbol = "GOV";
    uint8 public constant decimals = 18;

    uint256 public constant maxSupply = 21_000_000 * 10 ** 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    address public owner;
    address public paymentToken;
    uint256 public price; // price per token in smallest unit of payment token
    bool public salePaused;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event PaymentTokenUpdated(address indexed newToken);
    event PriceUpdated(uint256 newPrice);
    event SalePaused(bool paused);

    constructor(address _token, uint256 _price) {
        owner = msg.sender;
        paymentToken = _token;
        price = _price;
        totalSupply = maxSupply;
        balanceOf[address(this)] = maxSupply;
        uint256 creatorAmount = 1_000_000 * 10 ** 18;
        _transfer(address(this), msg.sender, creatorAmount);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function setPaymentToken(address _token) external onlyOwner {
        paymentToken = _token;
        emit PaymentTokenUpdated(_token);
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
        emit PriceUpdated(_price);
    }

    function setSalePaused(bool _paused) external onlyOwner {
        salePaused = _paused;
        emit SalePaused(_paused);
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(balanceOf[from] >= amount, "balance");
        unchecked {
            balanceOf[from] -= amount;
            balanceOf[to] += amount;
        }
        emit Transfer(from, to, amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= amount, "allowance");
        if (allowed != type(uint256).max) {
            allowance[from][msg.sender] = allowed - amount;
        }
        _transfer(from, to, amount);
        return true;
    }

    // Buy tokens using the configured payment token. `amount` is the number of tokens without decimals
    function buyTokens(uint256 amount) external {
        require(!salePaused, "sale paused");
        require(amount > 0, "amount 0");
        uint256 tokenAmount = amount * 10 ** 18;
        require(balanceOf[address(this)] >= tokenAmount, "insufficient tokens");
        uint256 cost = amount * price;
        require(IERC20(paymentToken).transferFrom(msg.sender, address(this), cost), "payment failed");
        _transfer(address(this), msg.sender, tokenAmount);
    }
}

