// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title ZecVault
 * @dev Contract for tracking Zcash balances and managing escrow locks
 */
contract ZecVault {
    // Mapping from user address to their ZEC balance (in smallest units)
    mapping(address => uint256) private balances;
    
    // Mapping from user address to locked balances for specific deals
    mapping(address => mapping(string => uint256)) private lockedBalances;
    
    // Admin address with special privileges
    address private admin;
    
    // Precision factor for ZEC (8 decimal places)
    uint256 private constant PRECISION = 100000000; // 1 ZEC = 10^8 zatoshi
    
    // Events
    event BalanceUpdated(address indexed user, uint256 amount, uint256 timestamp);
    event BalanceLocked(address indexed user, uint256 amount, string dealId);
    event BalanceReleased(address indexed from, address indexed to, uint256 amount, string dealId);
    
    /**
     * @dev Constructor - sets the admin to the contract deployer
     */
    constructor() {
        admin = msg.sender;
    }
    
    /**
     * @dev Modifier to restrict functions to admin only
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    /**
     * @dev Update a user's balance (admin only)
     * @param user Address of the user
     * @param amount New balance in ZEC's smallest unit (zatoshi)
     */
    function updateBalance(address user, uint256 amount) external onlyAdmin {
        balances[user] = amount;
        emit BalanceUpdated(user, amount, block.timestamp);
    }
    
    /**
     * @dev Get a user's available balance
     * @param user Address of the user
     * @return User's balance in smallest ZEC unit
     */
    function getBalance(address user) public view returns (uint256) {
        return balances[user];
    }
    
    /**
     * @dev Get a user's locked balance for a specific deal
     * @param user Address of the user
     * @param dealId ID of the deal
     * @return Locked amount for the deal in smallest ZEC unit
     */
    function getLockedBalance(address user, string calldata dealId) public view returns (uint256) {
        return lockedBalances[user][dealId];
    }
    
    /**
     * @dev Lock a portion of a user's balance for a deal (admin only)
     * @param user Address of the user
     * @param amount Amount to lock in smallest ZEC unit
     * @param dealId ID of the deal
     */
    function lockBalance(address user, uint256 amount, string calldata dealId) external onlyAdmin {
        require(balances[user] >= amount, "Insufficient balance");
        
        balances[user] -= amount;
        lockedBalances[user][dealId] = amount;
        
        emit BalanceLocked(user, amount, dealId);
    }
    
    /**
     * @dev Release locked balance to recipient (admin only)
     * @param from Address of the sender
     * @param to Address of the recipient
     * @param amount Amount to release in smallest ZEC unit
     * @param dealId ID of the deal
     */
    function releaseBalance(address from, address to, uint256 amount, string calldata dealId) external onlyAdmin {
        require(lockedBalances[from][dealId] >= amount, "Insufficient locked balance");
        
        lockedBalances[from][dealId] -= amount;
        balances[to] += amount;
        
        emit BalanceReleased(from, to, amount, dealId);
    }
    
    /**
     * @dev Refund locked balance back to the user (admin only)
     * @param user Address of the user
     * @param dealId ID of the deal
     */
    function refundBalance(address user, string calldata dealId) external onlyAdmin {
        uint256 amount = lockedBalances[user][dealId];
        require(amount > 0, "No locked balance for this deal");
        
        lockedBalances[user][dealId] = 0;
        balances[user] += amount;
        
        emit BalanceReleased(user, user, amount, dealId);
    }
    
    /**
     * @dev Set a new admin (admin only)
     * @param newAdmin Address of the new admin
     */
    function setAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "New admin cannot be zero address");
        admin = newAdmin;
    }
} 