# ZecVault Contract

A simple Ethereum contract to track off-chain ZEC balances.

## Overview

The ZecVault contract provides functionality to:
- Track ZEC balances for users (in ZEC's smallest units, where 1 ZEC = 10^8 units)
- Update, increment, and decrement balances
- Restrict administrative functions to the contract owner

## Testing Without Foundry

Since Foundry's forge-std is not available, you can test the contract using Remix IDE:

1. Visit [Remix IDE](https://remix.ethereum.org/)
2. Create new files for `ZecVault.sol` and `ZecVault.t.sol`
3. Copy and paste the code from these files into Remix
4. Compile the contracts using the Solidity compiler tab
5. Deploy the test contract using the deployment tab
6. Check the transaction logs to see the test results

## Manual Testing

You can also test the contract functions manually:

1. Deploy the `ZecVault` contract
2. Call `updateBalance` to set a user's balance
3. Call `getBalance` to verify the balance
4. Test `incrementBalance` and `decrementBalance`
5. Verify that only the admin can call restricted functions

## Deployment

To deploy to a testnet:

1. Use Remix IDE or another deployment tool
2. Connect to your desired network (e.g., Base Sepolia)
3. Deploy the `ZecVault` contract
4. Save the contract address for integration with your backend
