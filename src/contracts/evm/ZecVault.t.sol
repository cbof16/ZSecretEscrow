// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "./ZecVault.sol";

/**
 * Test file for ZecVault contract
 * This file is commented for Hardhat compatibility
 * 
 * Original tests are preserved below but commented out
 */

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
    
    function test_RevertWhen_LockInsufficientBalance() public {
        string memory dealId = "deal1";
        uint256 lockAmount = 200 * 1e8; // 200 ZEC - more than user1 has
        
        // This should fail
        vm.expectRevert("Insufficient balance");
        vault.lockBalance(user1, lockAmount, dealId);
    }
    
    function test_RevertWhen_ReleaseInsufficientLock() public {
        string memory dealId = "deal1";
        uint256 lockAmount = 30 * 1e8; // 30 ZEC
        
        // Lock some balance
        vault.lockBalance(user1, lockAmount, dealId);
        
        // Try to release more than locked - should fail
        vm.expectRevert("Insufficient locked balance");
        vault.releaseBalance(user1, user2, 40 * 1e8, dealId);
    }
    
    function test_RevertWhen_RefundNonExistentLock() public {
        string memory dealId = "nonexistent";
        
        // This should fail as nothing is locked
        vm.expectRevert("No locked balance for this deal");
        vault.refundBalance(user1, dealId);
    }
    
    function test_RevertWhen_NonAdminActions() public {
        // Test that non-admin can't perform admin actions
        vm.prank(user1);
        vm.expectRevert("Only admin can perform this action");
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

/*
contract ZecVaultTest is Test {
    ZecVault public vault;
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    event Deposit(address indexed account, uint256 amount);
    event Withdrawal(address indexed account, uint256 amount);
    event IntentCreated(bytes32 indexed intentId, address indexed client, address freelancer, uint256 amount);
    event IntentCompleted(bytes32 indexed intentId);
    event IntentCancelled(bytes32 indexed intentId);

    function setUp() public {
        vm.startPrank(owner);
        vault = new ZecVault();
        vm.stopPrank();
    }

    function testDeposit() public {
        vm.deal(user1, 1 ether);
        
        vm.startPrank(user1);
        vm.expectEmit(true, false, false, true);
        emit Deposit(user1, 0.5 ether);
        vault.deposit{value: 0.5 ether}();
        vm.stopPrank();
        
        assertEq(vault.balanceOf(user1), 0.5 ether);
    }

    function testWithdraw() public {
        vm.deal(user1, 1 ether);
        
        vm.startPrank(user1);
        vault.deposit{value: 0.5 ether}();
        
        uint256 balanceBefore = user1.balance;
        vm.expectEmit(true, false, false, true);
        emit Withdrawal(user1, 0.2 ether);
        vault.withdraw(0.2 ether);
        vm.stopPrank();
        
        assertEq(vault.balanceOf(user1), 0.3 ether);
        assertEq(user1.balance, balanceBefore + 0.2 ether);
    }

    function testCreateIntent() public {
        vm.deal(user1, 1 ether);
        
        vm.startPrank(user1);
        vault.deposit{value: 0.5 ether}();
        
        bytes32 intentId = keccak256(abi.encodePacked(user1, user2, block.timestamp));
        vm.expectEmit(true, true, true, true);
        emit IntentCreated(intentId, user1, user2, 0.3 ether);
        vault.createIntent(user2, 0.3 ether);
        vm.stopPrank();
        
        (address client, address freelancer, uint256 amount, bool completed, bool cancelled) = vault.intents(intentId);
        
        assertEq(client, user1);
        assertEq(freelancer, user2);
        assertEq(amount, 0.3 ether);
        assertEq(completed, false);
        assertEq(cancelled, false);
        assertEq(vault.lockedBalanceOf(user1), 0.3 ether);
        assertEq(vault.availableBalanceOf(user1), 0.2 ether);
    }

    function testCompleteIntent() public {
        vm.deal(user1, 1 ether);
        
        vm.startPrank(user1);
        vault.deposit{value: 0.5 ether}();
        bytes32 intentId = vault.createIntent(user2, 0.3 ether);
        vm.stopPrank();
        
        vm.startPrank(owner);
        vm.expectEmit(true, false, false, false);
        emit IntentCompleted(intentId);
        vault.completeIntent(intentId);
        vm.stopPrank();
        
        (,,, bool completed,) = vault.intents(intentId);
        assertEq(completed, true);
        assertEq(vault.balanceOf(user1), 0.2 ether);
        assertEq(vault.balanceOf(user2), 0.3 ether);
        assertEq(vault.lockedBalanceOf(user1), 0);
    }

    function testCancelIntent() public {
        vm.deal(user1, 1 ether);
        
        vm.startPrank(user1);
        vault.deposit{value: 0.5 ether}();
        bytes32 intentId = vault.createIntent(user2, 0.3 ether);
        vm.stopPrank();
        
        vm.startPrank(owner);
        vm.expectEmit(true, false, false, false);
        emit IntentCancelled(intentId);
        vault.cancelIntent(intentId);
        vm.stopPrank();
        
        (,,,, bool cancelled) = vault.intents(intentId);
        assertEq(cancelled, true);
        assertEq(vault.balanceOf(user1), 0.5 ether);
        assertEq(vault.lockedBalanceOf(user1), 0);
    }

    function testOnlyOwnerCanCompleteIntent() public {
        vm.deal(user1, 1 ether);
        
        vm.startPrank(user1);
        vault.deposit{value: 0.5 ether}();
        bytes32 intentId = vault.createIntent(user2, 0.3 ether);
        vm.expectRevert("Not authorized");
        vault.completeIntent(intentId);
        vm.stopPrank();
    }

    function testOnlyOwnerCanCancelIntent() public {
        vm.deal(user1, 1 ether);
        
        vm.startPrank(user1);
        vault.deposit{value: 0.5 ether}();
        bytes32 intentId = vault.createIntent(user2, 0.3 ether);
        vm.expectRevert("Not authorized");
        vault.cancelIntent(intentId);
        vm.stopPrank();
    }
}
*/ 