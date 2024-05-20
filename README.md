# TokenChat - Tokenized Group Chat Application

## Introduction
TokenChat is a decentralized group chat application built on the Base Mainnet EVM chain. It utilizes the MERN stack with Vite and JavaScript, and runs on Node.js v20. The application incorporates bonding curves to manage the token contracts, providing a unique and scalable tokenomics model for user interaction within the chat application.

## Features
- **Decentralized Group Chat**: Secure and private group chat powered by blockchain technology.
- **Tokenized Economy**: Users interact using a native token managed through bonding curves.
- **Scalability**: Efficient and scalable architecture leveraging the MERN stack and Vite.
- **Modern Development Stack**: Built with the latest technologies including Node.js v20 and React.

## Technology Stack
- **Frontend**: React, Vite
- **Backend**: Node.js v20, Express
- **Database**: MongoDB
- **Blockchain**: Base Mainnet EVM chain
- **Smart Contracts**: Solidity (Bonding Curves)

## Installation

### Prerequisites
- Node.js v20+
- MongoDB
- Metamask or any other Web3 wallet

### Steps

1. **Clone the Repository**
   ```sh
   git clone https://github.com/jawm17/tokenchat-tutorial.git
   cd tokenchat
   ```

2. **Install Dependencies**
   ```sh
   cd api
   npm install
   cd client
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   MONGO_URL=your_mongodb_connection_string
   ALCHEMY_API_KEY=your_base_mainnet_rpc_url
   ```

4. **Start the Application**
   ```sh
   # Start backend server
   cd api
   nodemon index.js

   # Start frontend development server
   cd client
   npm run dev
   ```

5. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`.

## Usage
1. **Connect Wallet**: Connect your Web3 wallet to the application.
2. **Join/Create Token Group**: Join an existing token or create a new one.
3. **Interact with Tokens**: Use the native token for sending messages and other interactions within the chat.

## Smart Contracts
The token contracts are built using bonding curves, which dynamically adjust the price and supply of the tokens based on demand. The smart contracts are written in Solidity and deployed on the Base Mainnet.

### Key Contracts
- **SimulatedERC.sol**: Manages the issuance and burning of tokens.
- **SimulatedERCFactory.sol**: Factory contract to create new tokens.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or suggestions, feel free to open an issue or contact the project maintainer at [envy@nvus.io].

---
