import React, { useEffect, useState } from "react";
import { useWeb3ModalProvider, useWeb3ModalAccount, useDisconnect } from '@web3modal/ethers/react'
import { BrowserProvider } from 'ethers'
import { useNavigate } from 'react-router-dom';
import { useWeb3Modal } from '@web3modal/ethers/react'
import ethLogo from "../../assets/ethLogo.png";
import NavBottom from "../../components/NavBottom";
import PortfolioPreview from "./PortfolioPreview";
import coinImg from "../../assets/coin.png"
import axios from 'axios';
import "./portfolioStyle.css";

export default function Portfolio(props) {
    const navigate = useNavigate();
    const { disconnect } = useDisconnect()
    const { open } = useWeb3Modal();

    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const [activeTab, setActiveTab] = useState("collected");
    const [coinArray, setCoinArray] = useState([]);

    const [collected, setCollected] = useState([]);
    const [created, setCreated] = useState([]);

    const [tokenArray, setTokenArray] = useState([]);

    const [userBalance, setUserBalance] = useState(0);

    useEffect(() => {
        if (address) {
            setTokenArray([]);
            getWalletBalance();
            if (activeTab === "collected") {
                getCollectedTokens();
            } else {
                getCreatedTokens();
            }
        }
    }, [activeTab, address]);

    async function getWalletBalance() {
        try {
            const provider = new BrowserProvider(walletProvider)
            const data = await provider.getBalance(address);
            setUserBalance(parseFloat(data) / 1000000000000000000);
        } catch (error) {
            console.log(error);
        }
    }

    // useEffect(() => {
    //     if (address) {
    //         getUserInfo();
    //     }
    // }, [address]);

    async function getCollectedTokens() {
        try {
            const { data } = await axios.get("/collected/" + address);
            console.log(data);
            const sortedTokens = data.slice().sort((a, b) => b.fdv - a.fdv);
            setTokenArray(sortedTokens);
        } catch (error) {
            console.log(error);
        }
    }

    async function getCreatedTokens() {
        try {
            const { data } = await axios.get("/token/created/" + address);
            const sortedTokens = data.slice().sort((a, b) => b.fdv - a.fdv);
            setTokenArray(sortedTokens);
        } catch (error) {
            console.log(error);
        }
    }

    function logout() {
        disconnect();
        navigate("/explore");
    }

    return (
        <div id="mainBody">
            <div id="exploreCenter">
                    <div id="profileTop">
                        <div id="profileTopRow">
                            <img id="profileImg" src={"https://i.redd.it/ivr8bevv4gl11.png"}></img>
                            <div id="nameArea">
                                <div id="username">
                                    @user_{address?.slice(2,6)}
                                </div>
                                <div id="address">
                                    {address?.slice(0, 16) + "..." + address?.slice(address?.length - 4, address?.length)}
                                </div>
                                <div id="userBalance">
                                    eth balance: {userBalance.toFixed(4)} ETH
                                </div>
                            </div>
                        </div>


                        {/* <div id="disconnectBtn" onClick={() => logout()}>
                            disconnect
                        </div> */}

                    </div>

                    <div className="tabRow">
                        <div className="tab" onClick={() => setActiveTab("collected")} id={activeTab === "collected" ? "activeTab" : null}>
                            collected
                        </div>
                        <div className="tab" onClick={() => setActiveTab("created")} id={activeTab === "created" ? "activeTab" : null}>
                            created
                        </div>
                    </div>

                    <div id="profileContent">

                        {tokenArray.map((coinData) => {
                            return (
                                <PortfolioPreview
                                    data={coinData}
                                    key={coinData._id}
                                />
                            );
                        })}

                    </div>


                <NavBottom page="chat" />
            </div>
        </div>
    );
}