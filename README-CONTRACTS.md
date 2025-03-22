# ZSecretEscrow Smart Contracts

This directory contains the smart contracts for the ZSecretEscrow project:

1. **ZecVault.sol** - Solidity contract for Base Sepolia that tracks Zcash balances and manages escrow funds
2. **escrow_intent.rs** - NEAR contract that manages the intent/agreement between clients and freelancers

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Foundry](https://getfoundry.sh/) for Solidity development and testing
- [Rust](https://www.rust-lang.org/tools/install) and [cargo-near](https://github.com/near/cargo-near) for NEAR contract development
- Access to Base Sepolia and NEAR testnet accounts with tokens

## Setup

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/ZSecretEscrow.git
cd ZSecretEscrow
npm install
```

2. Create a `.env` file based on the example:

```bash
cp .env.example .env
```

3. Edit the `.env` file with your credentials:
   - Set your Ethereum private key
   - Set your NEAR account ID and private key
   - Configure other variables as needed

## Compile Contracts

### Solidity (ZecVault)

```bash
# Install Foundry if you haven't already
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compile the contract
forge build
```

### NEAR (EscrowIntent)

```bash
# Install Rust if you haven't already
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Install cargo-near
cargo install cargo-near

# Navigate to the NEAR contract directory
cd src/contracts/near

# Build the contract
cargo near build
```

## Test Contracts

### Solidity Tests

```bash
# Run Foundry tests
forge test
```

### NEAR Tests

```bash
# Run NEAR tests
cd src/contracts/near
cargo test
```

## Deployment

### Deploy ZecVault to Base Sepolia

Ensure you have ETH in your Base Sepolia account before deployment.

```bash
npm run deploy:zecvault
```

### Deploy EscrowIntent to NEAR Testnet

Ensure you have NEAR in your testnet account before deployment.

```bash
npm run deploy:escrow-intent
```

## Using the Zcash Monitor Service

The Zcash Monitor Service bridges between actual Zcash transactions and the on-chain ZecVault contract.

```bash
# Start the monitor service
npm run start:zcash-monitor
```

## Example Usage

Run the example to see how the contracts work together:

```bash
npm run example
```

## Contract Addresses

After deployment, you can find the contract addresses in:
- `deployments/zecvault-deployment.json`
- `deployments/escrow-intent-deployment.json`

## Development

### Directory Structure

- `src/contracts/evm/` - ZecVault Solidity contract and tests
- `src/contracts/near/` - EscrowIntent NEAR contract and tests
- `src/scripts/` - Deployment scripts
- `src/services/` - Zcash Monitor service
- `src/examples/` - Example usage of the contracts
- `src/mock/` - Mock implementations for local development

### Workflow

1. Build and test contracts locally
2. Deploy to respective testnets
3. Test integration between contracts and services
4. Update frontend to interact with deployed contracts 