# ZSecretEscrow

ZSecretEscrow is a privacy-first blockchain escrow platform built on Zcash and NEAR Protocol, enabling secure transactions between untrusted parties with advanced privacy features.

## Features

- **Privacy-First Design**: Utilizes Zcash's shielded transactions and zero-knowledge proofs
- **Multi-Chain Support**: Built on both Zcash and NEAR Protocol
- **Smart Contract Escrow**: Secure fund locking and milestone-based releases
- **User Dashboards**: Separate interfaces for clients and freelancers
- **Dispute Resolution**: Built-in arbitration system
- **Demo Mode**: Test the platform without connecting real wallets

## Architecture

The application consists of three main components:

1. **Frontend**: Next.js application with React and TailwindCSS
2. **API Server**: Express.js REST API with blockchain integrations
3. **Smart Contracts**: NEAR Protocol and Zcash integration

## Getting Started

### Prerequisites

- Node.js 18+
- NPM 9+
- NEAR CLI (optional for contract deployment)
- Zcash CLI (optional for contract interaction)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ZSecretEscrow.git
cd ZSecretEscrow
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=8080
API_PORT=3000
FRONTEND_PORT=3001
NEAR_NETWORK=testnet
NEAR_ACCOUNT_ID=youraccount.testnet
NEAR_PRIVATE_KEY=your_private_key
```

4. Start the development server:

```bash
npm start
```

This will launch:
- Main server on http://localhost:8080
- API server on http://localhost:3000
- Frontend server on http://localhost:3001

## Development

### Project Structure

```
ZSecretEscrow/
├── src/                    # Backend code
│   ├── api/                # API server
│   ├── contracts/          # Smart contract code
├── web/                    # Frontend code
│   ├── src/
│       ├── client/         # Next.js app
│       │   ├── app/        # App Router structure
│       │   ├── components/ # React components
│       │   ├── lib/        # Utility functions and hooks
│       │   ├── store/      # State management
├── docs/                   # Documentation
```

### Building for Production

```bash
# Build the frontend
cd web/src/client && npm run build

# Start the production server
cd ../../.. && npm run start:prod
```

## Blockchain Integration

### NEAR Protocol

The application connects to NEAR Testnet by default. To deploy your own contracts:

```bash
cd src/contracts/near
near deploy --accountId youraccount.testnet --wasmFile out/escrow.wasm
```

### Zcash

Zcash integration uses the ZecVault contract for escrow functionality. Connection details can be found in the `.env` file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 