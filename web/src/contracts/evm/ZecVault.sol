// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZecVault
 * @dev A simple contract to track ZEC balances off-chain, updated manually by an admin
 */
contract ZecVault {
    address public admin;
    
    // Mapping to store ZEC balances (in smallest units - 1 ZEC = 10^8 units)
    mapping(address => uint256) public balances;
    
    // Events
    event BalanceUpdated(address indexed user, uint256 amount);
    
    constructor() {
        admin = msg.sender;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "ZecVault: caller is not the admin");
        _;
    }
    
    /**
     * @dev Update a user's balance in the vault
     * @param user The address of the user whose balance is being updated
     * @param amount The new balance amount in ZEC smallest units
     */
    function updateBalance(address user, uint256 amount) external onlyAdmin {
        balances[user] = amount;
        emit BalanceUpdated(user, amount);
    }
    
    /**
     * @dev Get a user's balance from the vault
     * @param user The address of the user to query
     * @return The user's balance in ZEC smallest units
     */
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    /**
     * @dev Increment a user's balance in the vault (for deposits)
     * @param user The address of the user whose balance is being incremented
     * @param amount The amount to add to the balance
     */
    function incrementBalance(address user, uint256 amount) external onlyAdmin {
        balances[user] += amount;
        emit BalanceUpdated(user, balances[user]);
    }
    
    /**
     * @dev Decrement a user's balance in the vault (for withdrawals)
     * @param user The address of the user whose balance is being decremented
     * @param amount The amount to subtract from the balance
     */
    function decrementBalance(address user, uint256 amount) external onlyAdmin {
        require(balances[user] >= amount, "ZecVault: insufficient balance");
        balances[user] -= amount;
        emit BalanceUpdated(user, balances[user]);
    }
}
