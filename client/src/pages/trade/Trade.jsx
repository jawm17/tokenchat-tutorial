import React, { useState, useEffect } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider, useWeb3Modal } from '@web3modal/ethers/react'
import { useNavigate, useParams } from 'react-router-dom';
import { ethers, BrowserProvider } from 'ethers';
import Chart from "./Chart";
import axios from "axios";
import SimulatedERC from "../../contracts/SimulatedERC.json";
import NumericLabel from 'react-pretty-numbers';
import "./tradeStyle.css";

export default function Trade() {
    const { walletProvider } = useWeb3ModalProvider()
    const { address } = useWeb3ModalAccount()
    const { open } = useWeb3Modal();
    const navigate = useNavigate();
    const params = useParams();
    const tokenAddress = params.contractAddress;
    const [tokenData, setTokenData] = useState();
    const [currentPrice, setCurrentPrice] = useState(0);

    const [ethAmount, setEthAmount] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [userBalance, setUserBalance] = useState(0);
    const [sellValue, setSellValue] = useState(0);

    const [liquidity, setLiquidity] = useState(0);
    const [buying, setBuying] = useState(true);
    const [trades, setTrades] = useState([]);

    const [fdvPercent, setFdvPercent] = useState(0);

    // dextools chart
    let chainId = "base";
    let pairAddress = "0xba3f945812a83471d709bce9c3ca699a19fb46f7";
    const dextools = `https://www.dextools.io/widget-chart/en/${chainId}/pe-light/${pairAddress}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false`

    const ethPrice = 3300;

    // useEffect(() => {
    //     loadBlockchainData();
    //     getTokenData();
    // }, []);

    useEffect(() => {
        loadBlockchainData();
        getTokenData();
        fetchTrades();
        if (address) {
            getUserBalance();
        }
    }, [address]);

    async function getUserBalance() {
        try {
            const provider = new BrowserProvider(walletProvider);
            const simulatedERCContract = new ethers.Contract(tokenAddress, SimulatedERC, provider);
            const bal = await simulatedERCContract.balances(address);
            setUserBalance(parseFloat(bal));
        } catch (error) {
            console.log(error);
        }
    }

    async function getTokenData() {
        try {
            const { data } = await axios.get("/token/data/" + tokenAddress);
            setTokenData(data.token);
            setFdvPercent(((data.token.fdv / 8000000000000000000) * 100).toFixed(2))
            console.log(((data.token.fdv / 8000000000000000000) * 100).toFixed(2))
        } catch (error) {
            console.log(error);
        }
    }

    async function loadBlockchainData() {
        try {
            const provider = new BrowserProvider(walletProvider);
            const simulatedERCContract = new ethers.Contract(tokenAddress, SimulatedERC, provider);
            const price = await simulatedERCContract.calculateBuyPrice(1);
            // const fdv = await simulatedERCContract.reserveBalance();
            // let fdvUSD = ethers.formatEther(fdv) * ethPrice;
            // console.log(fdvUSD)
            // setLiquidity(fdvUSD)
            // let priceInEth = ethers.formatEther(price)
            setCurrentPrice(ethers.formatEther(price) || 0.01);
        } catch (error) {
            console.error('Error fetching current price:', error);
        }
    }

    async function calculatePurchasePrice() {
        if (tokenAmount > 0) {
            try {
                const provider = new BrowserProvider(walletProvider);
                const simulatedERCContract = new ethers.Contract(tokenAddress, SimulatedERC, provider);
                const price = await simulatedERCContract.calculateBuyPrice(tokenAmount); // Get the price to buy 1 token
                console.log(parseFloat(price) / 1000000000000000000);
                setEthAmount(price.toString());
            } catch (error) {
                console.error('Error fetching current price:', error);
            }
        }
    }

    async function calculateSalePrice() {
        if (tokenAmount > 0) {
            try {
                const provider = new BrowserProvider(walletProvider);
                const simulatedERCContract = new ethers.Contract(tokenAddress, SimulatedERC, provider);
                const value = await simulatedERCContract.calculateSalePrice(tokenAmount); // Get the price to buy 1 token
                console.log(parseFloat(value));
                setSellValue(value.toString());
            } catch (error) {
                console.error('Error fetching current price:', error);
            }
        }
    }

    async function submitBuyOrder() {
        if (tokenAmount > 0) {
            try {
                const provider = new BrowserProvider(walletProvider);
                const signer = await provider.getSigner();
                const simulatedERCContract = new ethers.Contract(tokenAddress, SimulatedERC, signer);

                // Ensure tokenAmount is converted to a compatible data type if needed
                const reducedAmount = (parseFloat(tokenAmount)).toString();

                // Prepare transaction options
                const transactionOptions = {
                    value: ethAmount, // Specify the amount of ether to send
                };

                // Call the buyTokens function with the parsed token amount and transaction options
                const tx = await simulatedERCContract.buyTokens(tokenAmount, transactionOptions);

                // Wait for the transaction to be mined
                const receipt = await tx.wait();

                getUserBalance();
                getTokenData();
                loadBlockchainData();
                fetchTrades();
                setTokenAmount(0);
                setEthAmount(0);
                // alert("Tokens purchased successfully!");
            } catch (error) {
                console.error('Error buying tokens:', error);
                alert("Failed to buy tokens. Please check the console for details.");
            }
        } else {
            alert("Please enter a valid token amount.");
        }
    }

    async function submitSellOrder() {
        if (tokenAmount > 0) {
            try {
                const provider = new BrowserProvider(walletProvider);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(tokenAddress, SimulatedERC, signer);

                // Ensure tokenAmount is converted to a compatible data type if needed
                const sellAmount = (parseFloat(tokenAmount)).toString();
                console.log(sellAmount)
                // Prepare transaction options
                const transactionOptions = {
                    gasLimit: 5000000, // Adjust as needed
                };

                // Call the buyTokens function with the parsed token amount and transaction options
                const tx = await contract.sellTokens(sellAmount);

                // Wait for the transaction to be mined
                const receipt = await tx.wait();

                getUserBalance();
                getTokenData();
                loadBlockchainData();
                fetchTrades();
                setTokenAmount(0);
                setSellValue(0);
                // alert("Tokens purchased successfully!");
            } catch (error) {
                console.error('Error buying tokens:', error);
                alert("Failed to buy tokens. Please check the console for details.");
            }
        } else {
            alert("Please enter a valid token amount.");
        }
    }

    useEffect(() => {
        if (buying) {
            calculatePurchasePrice();
        } else {
            calculateSalePrice();
        }
    }, [tokenAmount]);

    const liquidityParams = { currency: true, commafy: true, shortFormat: true, justification: 'L' };
    const userBalanceParams = { currency: false, commafy: true, shortFormat: true, precision: 1, justification: 'L' };

    const fetchTrades = async () => {
        try {
            const { data } = await axios.get(`/token/trades/${tokenAddress}`);
            setTrades([...data].reverse());
        } catch (error) {
            console.error('Error fetching trades:', error);
        }
    };

    return (
        <div id="tradeBody">
            <div id="tradeCenter">
                <div id="chartArea">
                    <div id="chartTop">

                        <svg onClick={() => navigate("/explore")} id="backBtn" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>

                        <img id="chartTopImg" src={tokenData?.tokenImage}></img>
                        <div id="chartTopData">
                            <div id="chartName"> ${tokenData?.tokenSymbol} • {tokenData?.tokenName.slice(0, 8)}{tokenData?.tokenName.length > 8 ? "..." : ""}</div>
                            <div id="chartMembers">Current Price: ${(ethPrice * tokenData?.lastPrice).toFixed(2) > 0 ? (ethPrice * tokenData?.lastPrice).toFixed(2) : 0.01}</div>
                        </div>

                        {userBalance > 0 ?
                            <div id="tradeChatBtn" onClick={() => navigate("/chat/" + tokenData?.tokenAddress)}>
                                <div id="uniText">
                                    chat
                                </div>
                            </div>
                            :
                            address ?
                                <div id="tradeChatBtn">
                                    <svg id="chatLockIcon" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                                    </svg>
                                    <div id="uniText">
                                        chat
                                    </div>
                                </div>
                                :
                                <div id="tradeChatBtn" onClick={() => open()}>
                                    <svg id="chatLockIcon" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                                    </svg>
                                    <div id="uniText">
                                        chat
                                    </div>
                                </div>
                        }
                    </div>
                    {/* <iframe id="dextools-widget"
                        title="DEXTools Trading Chart"
                        width="500"
                        theme="dark"
                        chartType="1"
                        src={dextools}>
                    </iframe> */}
                    <Chart contractAddress={tokenAddress} trades={trades} />

                    {/* <div id="progressTitle">
                        Bonding Curve Progress
                    </div>
                    <div id="progressArea">
                        <div id="progressSlide" style={{width: fdvPercent + "%"}}>

                        </div>
                        <div id="startValue">
                            0 ETH
                        </div>
                        <div id="endValue">
                            8 ETH
                        </div>
                    </div> */}

                    <div id="tokenPrice">
                        current price: {currentPrice == 0 ? tokenData?.lastPrice : currentPrice} ETH
                    </div>
                    <div id="tokenPrice">
                        market cap: {(tokenData?.fdv / 1000000000000000000).toFixed(6)} ETH
                    </div>

                    <div id="tokenPrice">
                        your balance: {<NumericLabel params={userBalanceParams}>{userBalance}</NumericLabel>} {tokenData?.tokenSymbol}
                    </div>

                    <div id="tradeBtns">
                        <div id={buying ? "selectedTrade" : ""} className="tradeSelector" onClick={() => setBuying(true)}>buy</div>
                        <div id={!buying ? "selectedTrade" : ""} className="tradeSelector" onClick={() => setBuying(false)}>sell</div>
                    </div>
                    {
                        buying ?
                            <div>
                                <div id="buyInputFlex">
                                    <input id="buyInput" autocomplete={false} value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)}></input>
                                    <div id="buyInputLabel">{tokenData?.tokenSymbol}</div>
                                </div>
                                <div id="amountItem">
                                    <div className="amountItemItem">
                                        Total Cost:
                                    </div>
                                    <div className="amountItemItem">
                                        {ethAmount / 1000000000000000000} ETH
                                    </div>

                                </div>
                                {address ?
                                    <div id="submitOrderBtn" onClick={() => submitBuyOrder()}>{userBalance > 0 ? "submit" : "buy tokens to chat"}</div>
                                    :
                                    <div id="submitOrderBtn" onClick={() => open()}>connect wallet</div>
                                }
                            </div>
                            :
                            <div>
                                <div id="buyInputFlex">
                                    <input id="buyInput" autocomplete={false} value={tokenAmount} onChange={(e) => setTokenAmount(e.target.value)}></input>
                                    <div id="maxAmountBtn" onClick={() => setTokenAmount(userBalance)}>max</div>
                                </div>
                                <div id="amountItem">
                                    <div className="amountItemItem">
                                        Total Recieved:
                                    </div>
                                    <div className="amountItemItem">
                                        {sellValue / 1000000000000000000} ETH
                                    </div>

                                </div>
                                {address ?
                                    <div id="submitOrderBtn" onClick={() => submitSellOrder()}>submit</div>
                                    :
                                    <div id="submitOrderBtn" onClick={() => open()}>connect wallet</div>

                                }
                            </div>
                    }
                </div>
                {/* <NavBottom page="explore" /> */}
            </div>
        </div>
    );
}