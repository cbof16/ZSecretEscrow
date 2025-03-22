# Frontend Integration with ZSecretEscrow Backend Services

This document explains how the ZSecretEscrow frontend integrates with the backend services, including NEAR and Zcash.

## Architecture Overview

The frontend application uses a service-based architecture where all blockchain interactions happen through dedicated services:

1. **ZcashService**: Manages Zcash wallet operations, transactions, and balance tracking
2. **NearService**: Handles interactions with the NEAR blockchain and EscrowIntent contract
3. **EscrowService**: Coordinates between Zcash and NEAR to provide a complete escrow solution

These services are loaded and initialized when the application starts, and are made available to the frontend through the Zustand store.

## Service Loading

The `serviceLoader.ts` file is responsible for loading all the required services at application startup. In a production environment, these services would be properly bundled with the application. For development and demonstration purposes, they are simulated with mock implementations.

To inject the real services, you would need to:

1. Build the services into proper modules
2. Import them in the serviceLoader
3. Initialize them with the correct configuration

## State Management

All application state is managed using Zustand, a lightweight state management library. The store is defined in `store.ts` and includes:

- User information
- Wallet data and balance
- Deal management
- UI state for modals and loaders

The store provides methods for interacting with the services, such as:
- Creating and importing wallets
- Creating deals
- Submitting and approving work
- Fetching user deals

## Integration Points

### Zcash Integration

The frontend integrates with Zcash through the ZcashService. The key integration points are:

1. **Wallet Creation**: Users can create a new Zcash wallet or import an existing one
2. **Balance Tracking**: The wallet balance is refreshed periodically and displayed to the user
3. **Fund Management**: Funds are sent to and received from the ZecVault contract for escrow

### NEAR Integration

The frontend integrates with NEAR through the NearService. The key integration points are:

1. **Smart Contract Interaction**: Creating and managing escrow intents on the NEAR blockchain
2. **Account Linking**: Each user's ID is associated with a NEAR account
3. **Status Tracking**: Deal status is tracked on the NEAR blockchain

## Wallet Management

Users can create or import a Zcash wallet through the WalletSetup component. Once a wallet is created, the WalletInfo component displays the wallet balance and address.

## How to Connect to Real Blockchains

To connect to real blockchains instead of using mocks:

### For Zcash:

1. Install Zcash libraries: Use `@stablelib/ed25519`, `@stablelib/random`, and a Zcash SDK
2. Update the ZcashService to use real Zcash libraries
3. Implement secure key management
4. Connect to a Zcash lightwalletd server

### For NEAR:

1. Configure the NearService to connect to NEAR testnet/mainnet
2. Set up proper account management
3. Deploy the EscrowIntent contract to NEAR
4. Update the contract address in the NearService

## Security Considerations

When implementing the real integration, make sure to:

1. **Never store private keys in browser storage**: Use secure key management patterns
2. **Implement proper error handling**: Handle network errors and blockchain failures gracefully
3. **Add transaction confirmation UI**: Show users when transactions are pending and confirmed
4. **Implement proper authentication**: Add authentication to protect user data
5. **Enable secure communications**: Use HTTPS and encrypt sensitive data

## Testing the Integration

To test the integration:

1. Create a user ID and log in
2. Create or import a Zcash wallet
3. Add test funds
4. Create a deal as a client
5. Submit work as a freelancer
6. Approve or dispute work as a client

## Mock Service Limitations

The current mock services have the following limitations:

1. They don't persist data across sessions
2. They don't simulate network latency realistically
3. They don't handle error cases extensively
4. They don't implement all edge cases

## Next Steps

To complete the integration:

1. Implement real Zcash integration with proper libraries
2. Deploy and connect to the NEAR EscrowIntent contract
3. Develop secure key management
4. Add proper error handling and recovery
5. Implement transaction monitoring and notifications 