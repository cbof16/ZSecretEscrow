// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../ZecVault.sol";

// Mock test contract since forge-std is not available
contract ZecVaultTest {
    ZecVault public vault;
    address public admin;
    address public user;
    
    // Mock events for test reporting
    event TestPassed(string message);
    event TestFailed(string message);
    
    constructor() {
        admin = address(this);
        vault = new ZecVault();
        user = address(0x1);
        
        // Run all tests
        testUpdateBalance();
        testIncrementBalance();
        testDecrementBalance();
        testInsufficientBalanceRevert();
        testOnlyAdminCanUpdateBalance();
    }
    
    function testUpdateBalance() public {
        // Define a test amount (1 ZEC with 8 decimal places = 100,000,000)
        uint256 testAmount = 100000000;
        
        // Update the balance
        vault.updateBalance(user, testAmount);
        
        // Check if the balance was updated correctly
        if (vault.getBalance(user) == testAmount) {
            emit TestPassed("testUpdateBalance: Balance was updated correctly");
        } else {
            emit TestFailed("testUpdateBalance: Balance was not updated correctly");
        }
    }
    
    function testIncrementBalance() public {
        // Initial balance of 1 ZEC
        uint256 initialAmount = 100000000;
        vault.updateBalance(user, initialAmount);
        
        // Add 0.5 ZEC
        uint256 addAmount = 50000000;
        vault.incrementBalance(user, addAmount);
        
        // Check if the balance was incremented correctly
        if (vault.getBalance(user) == initialAmount + addAmount) {
            emit TestPassed("testIncrementBalance: Balance was incremented correctly");
        } else {
            emit TestFailed("testIncrementBalance: Balance was not incremented correctly");
        }
    }
    
    function testDecrementBalance() public {
        // Initial balance of 1 ZEC
        uint256 initialAmount = 100000000;
        vault.updateBalance(user, initialAmount);
        
        // Subtract 0.5 ZEC
        uint256 subtractAmount = 50000000;
        vault.decrementBalance(user, subtractAmount);
        
        // Check if the balance was decremented correctly
        if (vault.getBalance(user) == initialAmount - subtractAmount) {
            emit TestPassed("testDecrementBalance: Balance was decremented correctly");
        } else {
            emit TestFailed("testDecrementBalance: Balance was not decremented correctly");
        }
    }
    
    function testInsufficientBalanceRevert() public {
        // Initial balance of 0.5 ZEC
        uint256 initialAmount = 50000000;
        vault.updateBalance(user, initialAmount);
        
        // Try to subtract 1 ZEC
        uint256 subtractAmount = 100000000;
        
        // We can't use expectRevert here, so we'll catch the revert manually
        try vault.decrementBalance(user, subtractAmount) {
            emit TestFailed("testInsufficientBalanceRevert: Expected revert did not happen");
        } catch {
            emit TestPassed("testInsufficientBalanceRevert: Expected revert happened");
        }
    }
    
    function testOnlyAdminCanUpdateBalance() public {
        // Without vm.prank, we need to use a helper contract
        AdminRestrictionTest restrictionTest = new AdminRestrictionTest(address(vault));
        
        // Try to update balance from non-admin address
        bool success = restrictionTest.tryUpdateBalance(user, 100000000);
        
        if (!success) {
            emit TestPassed("testOnlyAdminCanUpdateBalance: Non-admin was restricted correctly");
        } else {
            emit TestFailed("testOnlyAdminCanUpdateBalance: Non-admin was able to update balance");
        }
    }
}

// Helper contract to test admin restrictions
contract AdminRestrictionTest {
    ZecVault vault;
    
    constructor(address _vault) {
        vault = ZecVault(_vault);
    }
    
    function tryUpdateBalance(address user, uint256 amount) public returns (bool) {
        try vault.updateBalance(user, amount) {
            return true; // Success (should not happen)
        } catch {
            return false; // Expected failure
        }
    }
}
