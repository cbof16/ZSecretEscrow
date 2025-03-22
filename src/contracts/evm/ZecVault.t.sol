// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "./ZecVault.sol";

contract ZecVaultTest is Test {
    ZecVault public vault;
    address public admin;
    address public user1;
    address public user2;
    
    function setUp() public {
        admin = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        
        // Deploy the contract
        vault = new ZecVault();
        
        // Add some test balances
        vault.updateBalance(user1, 100 * 1e8); // 100 ZEC
        vault.updateBalance(user2, 50 * 1e8);  // 50 ZEC
    }
    
    function testBalanceUpdates() public {
        assertEq(vault.getBalance(user1), 100 * 1e8);
        assertEq(vault.getBalance(user2), 50 * 1e8);
        
        // Update balance
        vault.updateBalance(user1, 200 * 1e8);
        assertEq(vault.getBalance(user1), 200 * 1e8);
    }
    
    function testLockBalance() public {
        string memory dealId = "deal1";
        uint256 lockAmount = 30 * 1e8; // 30 ZEC
        
        vault.lockBalance(user1, lockAmount, dealId);
        
        // Check updated balances
        assertEq(vault.getBalance(user1), 70 * 1e8);
        assertEq(vault.getLockedBalance(user1, dealId), lockAmount);
    }
    
    function testReleaseBalance() public {
        string memory dealId = "deal1";
        uint256 lockAmount = 30 * 1e8; // 30 ZEC
        
        // First lock some balance
        vault.lockBalance(user1, lockAmount, dealId);
        
        // Now release to user2
        vault.releaseBalance(user1, user2, lockAmount, dealId);
        
        // Check balances after release
        assertEq(vault.getBalance(user1), 70 * 1e8);
        assertEq(vault.getBalance(user2), 80 * 1e8);
        assertEq(vault.getLockedBalance(user1, dealId), 0);
    }
    
    function testRefundBalance() public {
        string memory dealId = "deal1";
        uint256 lockAmount = 30 * 1e8; // 30 ZEC
        
        // First lock some balance
        vault.lockBalance(user1, lockAmount, dealId);
        
        // Now refund it
        vault.refundBalance(user1, dealId);
        
        // Check balances after refund
        assertEq(vault.getBalance(user1), 100 * 1e8); // Back to original
        assertEq(vault.getLockedBalance(user1, dealId), 0);
    }
    
    function testFailLockInsufficientBalance() public {
        string memory dealId = "deal1";
        uint256 lockAmount = 200 * 1e8; // 200 ZEC - more than user1 has
        
        // This should fail
        vault.lockBalance(user1, lockAmount, dealId);
    }
    
    function testFailReleaseInsufficientLock() public {
        string memory dealId = "deal1";
        uint256 lockAmount = 30 * 1e8; // 30 ZEC
        
        // Lock some balance
        vault.lockBalance(user1, lockAmount, dealId);
        
        // Try to release more than locked - should fail
        vault.releaseBalance(user1, user2, 40 * 1e8, dealId);
    }
    
    function testFailRefundNonExistentLock() public {
        string memory dealId = "nonexistent";
        
        // This should fail as nothing is locked
        vault.refundBalance(user1, dealId);
    }
    
    function testFailNonAdminActions() public {
        // Test that non-admin can't perform admin actions
        vm.prank(user1);
        vault.updateBalance(user2, 100 * 1e8);
    }
    
    function testSetAdmin() public {
        // Change admin to user1
        vault.setAdmin(user1);
        
        // Now only user1 should be able to update balances
        vm.prank(user1);
        vault.updateBalance(user2, 100 * 1e8);
        
        // This should pass now with user1 as admin
        assertEq(vault.getBalance(user2), 100 * 1e8);
    }
} 