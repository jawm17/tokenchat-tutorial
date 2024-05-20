const { ethers, JsonRpcProvider } = require('ethers');
const express = require('express');
const Token = require('../models/Token.js');
const Trade = require('../models/Trade');
const Message = require('../models/Message.js');
const tokenRouter = express.Router();
const User = require('../models/User.js');
const message = { msgBody: "Error has occured", msgError: true };

const provider = new JsonRpcProvider('https://base-mainnet.g.alchemy.com/v2/' + process.env.ALCHEMY_API_KEY);

const factoryAddress = "0xeBE19992927933bCf1D9f01977Dfe24Bcc760936";
const factoryAbi = require("../contracts/Factory.json");
const factoryContract = new ethers.Contract(factoryAddress, factoryAbi, provider);
const simulatedERCAbi = require("../contracts/SimulatedERC.json");

monitorTradeEvents();
monitorNewTokens();

async function monitorTradeEvents() {
    console.log("listening to trades")
    try {
        // Fetch all token objects from the database
        const tokens = await Token.find();
        // Create an array to store promises for event listeners
        const listenerPromises = tokens.map(async (token) => {
            // Create a contract instance
            const simulatedERCContract = new ethers.Contract(token.tokenAddress.toString(), simulatedERCAbi, provider);

            // Add event listener for the Trade event
            simulatedERCContract.on("Trade", async (buyer, tokens, totalValue, lastTokenPrice, isBuy, event) => {

                const tokensStr = tokens.toString();
                let totalValueEth = ethers.formatEther(totalValue);

                const lastPriceEth = ethers.formatEther(lastTokenPrice);
                let holders = await simulatedERCContract.totalHolders();
                const balance = await provider.getBalance(token.tokenAddress);

                if(token.tokenAddress === "0xEEC51359b5Dcf5AcE8895A3e957ed5aF1CF9592D") {
                    totalValueEth = parseFloat(totalValueEth) + 2.249;
                    holders = parseFloat(holders) + 18;
                }

                try {
                    // Create a new Trade document
                    const trade = new Trade({
                        tokenAddress: token.tokenAddress,
                        buyerAddress: buyer,
                        numTokens: tokensStr,
                        totalValue: totalValueEth,
                        lastPrice: lastPriceEth,
                        isBuy: isBuy
                    });

                    // Save the Trade document to MongoDB
                    await trade.save();
                    await Token.updateTokenPriceAndHolderCount(token.tokenAddress, lastPriceEth, parseFloat(holders), balance);

                    if(isBuy) {
                        addTokenToArray(token.tokenAddress, buyer)
                    }
                    // Log the saved trade
                    console.log("Trade saved:", trade);
                } catch (error) {
                    console.error("Error saving trade:", error);
                }
            });
        });

        // Wait for all event listener registrations to complete
        await Promise.all(listenerPromises);
    } catch (error) {
        console.error("Error monitoring trade events:", error);
    }
}

// Assuming you have access to the User and Token models and isBuy variable is defined
async function addTokenToArray(tokenAddress, buyerAddress) {
    console.log("buyerAddress: " + buyerAddress)
    try {
        // Find the buyer by their address
        const buyer = await User.findOne({ address: buyerAddress.toLowerCase() }).populate('tokenArray');

        if (!buyer) {
            return
            throw new Error("Buyer not found");
        }

        // Check if the buyer already has the token in their array
        const tokenExists = buyer.tokenArray.some(token => token.tokenAddress === tokenAddress);

        // If the token doesn't exist in the buyer's array, push it
        if (!tokenExists) {
            // Find the token by tokenAddress
            const token = await Token.findOne({ tokenAddress });

            if (!token) {
                return
                throw new Error("Token not found");
            }

            // Push the token onto the buyer's tokenArray
            buyer.tokenArray.push(token);
            
            // Save the updated buyer
            await buyer.save();
        }

        // Additional logic if needed
        
    } catch (error) {
        console.error("Error in yourFunction:", error);
        throw error;
    }
}

function monitorTradeEventsForAddress(address) {
    const simulatedERCContract = new ethers.Contract(address, simulatedERCAbi, provider);

    // Add event listener for the Trade event
    simulatedERCContract.on("Trade", async (buyer, tokens, totalValue, lastTokenPrice, isBuy, event) => {

        const tokensStr = tokens.toString();
        const totalValueEth = ethers.formatEther(totalValue);

        const lastPriceEth = ethers.formatEther(lastTokenPrice);
        const holders = await simulatedERCContract.totalHolders();
        const balance = await provider.getBalance(address);

        try {
            // Create a new Trade document
            const trade = new Trade({
                tokenAddress: address,
                buyerAddress: buyer,
                numTokens: tokensStr,
                totalValue: totalValueEth,
                lastPrice: lastPriceEth,
                isBuy: isBuy
            });

            // Save the Trade document to MongoDB
            await trade.save();
            await Token.updateTokenPriceAndHolderCount(address, lastPriceEth, parseFloat(holders), balance);

            if(isBuy) {
                addTokenToArray(address, buyer)
            }
            // Log the saved trade
            console.log("Trade saved:", trade);
        } catch (error) {
            console.error("Error saving trade:", error);
        }
    });
}

async function monitorNewTokens() {
    factoryContract.on('ContractDeployed', async (contractAddress, creator) => {
        console.log(`New SimulatedERC contract deployed at address: ${contractAddress}, created by: ${creator}`);
        try {
            const simulatedERCContract = new ethers.Contract(contractAddress, simulatedERCAbi, provider);

            monitorTradeEventsForAddress(contractAddress);
            const tokenName = await simulatedERCContract.tokenName();
            const tokenSymbol = await simulatedERCContract.tokenSymbol();
            const tokenImage = await simulatedERCContract.tokenImage();

            console.log("Token Name:", tokenName);
            console.log("Token Symbol:", tokenSymbol);
            console.log("Token Image:", tokenImage);

            // const tokenPrev = await Token.find({ tokenAddress: contractAddress });

            // if(tokenPrev) {
            //     return;
            // }

            const newToken = new Token({
                tokenAddress: contractAddress,
                tokenName,
                tokenSymbol,
                tokenImage,
                tokenType: "simulated",
                creatorAddress: creator
            });

            await newToken.save();

            const trade = new Trade({
                tokenAddress: contractAddress,
                buyerAddress: "",
                numTokens: 0,
                totalValue: 0,
                lastPrice: "0.0000001",
                isBuy: true
            });

            // Save the Trade document to MongoDB
            await trade.save();
        } catch (error) {
            console.error("Error retrieving token details:", error);
        }
    });
}

tokenRouter.get('/created/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const tokens = await Token.find({ creatorAddress: address });

        res.status(200).json(tokens);
    } catch (error) {
        console.error("Error fetching tokens:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// tokenRouter.get('/portfolio/:address', async (req, res) => {
//     try {
//         const address = req.params.address;

//         const balances = await alchemy.core.getTokenBalances(address);

//         const nonZeroBalances = balances.tokenBalances.filter((token) => {
//             return token.tokenBalance !== "0";
//         });

//         const tokenArray = [];

//         for (let token of nonZeroBalances) {
//             let balance = token.tokenBalance;

//             const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

//             balance = balance / Math.pow(10, metadata.decimals);
//             balance = balance.toFixed(2);

//             tokenArray.push({
//                 name: metadata.name,
//                 balance: `${balance} ${metadata.symbol}`,
//                 logo: metadata.logo,
//                 symbol: metadata.symbol
//             });
//         }
//         res.json(tokenArray);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

tokenRouter.post('/add-token', async (req, res) => {
    const { tokenAddress } = req.body.newToken;

    try {
        // Connect to the token contract
        const tokenContract = new ethers.Contract(tokenAddress, [
            'function name() view returns (string)',
            'function symbol() view returns (string)',
            'function totalSupply() view returns (uint256)'
        ], provider);

        // Call the contract functions to get the name, symbol, and total supply
        const [name, symbol, totalSupply] = await Promise.all([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.totalSupply()
        ]);

        // Create a new token instance with additional information
        const newToken = new Token({
            ...req.body.newToken,
            tokenName: name,
            tokenSymbol: symbol,
            totalSupply: totalSupply.toString() // Convert total supply to string to avoid overflow issues
        });

        // Save the token to the database
        await newToken.save();

        // Send success response
        res.status(200).json({ message: { msgBody: "Successfully created token", msgError: false } });
    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

tokenRouter.post('/create-token', async (req, res) => {
    const { newToken } = req.body.newToken;

    try {
        const newToken = new Token({ newToken });
        await newToken.save();
        res.status(200).json({ message: { msgBody: "Successfully created token", msgError: false } });
    } catch (error) {
        console.error('Error creating token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

tokenRouter.get('/top-tokens', (req, res) => {

});

tokenRouter.get('/all-tokens', async (req, res) => {
    try {
        const tokens = await Token.find();
        res.json(tokens);
    } catch (error) {
        res.status(500).json({ message });
    }
});

tokenRouter.get('/hot', async (req, res) => {
    try {
        // Calculate the timestamp for 24 hours ago
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Query tokens created within the last 24 hours and sort by 'fdv' value
        const tokens = await Token.find({ createdAt: { $gte: twentyFourHoursAgo } })
            .sort({ createdAt: -1 })
            .exec();

        res.json(tokens);
    } catch (err) {
        console.error("Error fetching tokens:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

tokenRouter.get('/data/:address', async (req, res) => {
    Token.findOne({ tokenAddress: req.params.address }).populate("messages").exec((err, token) => {
        if (err) {
            console.log(err)
            res.status(500).json({ message });
        }
        else if (token) {
            res.status(200).json({ token });
        } else {
            res.status(200).json({ error: "no tokens found" });
        }
    });
});

tokenRouter.get('/trades/:contractAddress', async (req, res) => {
    const { contractAddress } = req.params;
    try {
        // Fetch trades from the database for the given contract address
        const trades = await Trade.find({ tokenAddress: contractAddress }).sort({ createdAt: -1 });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trades' });
    }
});




module.exports = tokenRouter;