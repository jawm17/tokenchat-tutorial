import React, { useEffect, useState } from "react";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useNavigate, useParams } from 'react-router-dom';
import Message from "./Message";
import axios from "axios";
import "./chatStyle.css";

export default function Chat() {
    const navigate = useNavigate();
    const params = useParams();
    const { address } = useWeb3ModalAccount()
    const tokenAddress = params.contractAddress;
    const [textContent, setTextContent] = useState("");
    const [tokenData, setTokenData] = useState();
    const [messageArray, setMessageArray] = useState([]);

    let chainId = "base";
    let pairAddress = "0xba3f945812a83471d709bce9c3ca699a19fb46f7";

    const dextools = `https://www.dextools.io/widget-chart/en/${chainId}/pe-light/${pairAddress}?theme=dark&chartType=2&chartResolution=30&drawingToolbars=false`

    const ethPrice = 3300;
    
    useEffect(() => {
        if (tokenAddress) {
            getChatData();
        }
    }, []);

    useEffect(() => {
        const messageArea = document.getElementById("messageArea");
        messageArea.scrollTop = messageArea.scrollHeight;
    }, [messageArray]);

    async function getChatData() {
        try {
            const { data } = await axios.get("/token/data/" + tokenAddress);
            setTokenData(data.token);
            setMessageArray(data.token.messages);
        } catch (error) {
            console.log(error);
        }
    }

    async function newMessage() {
        if (textContent && address) {
            try {
                const { data } = await axios.post("/message/new-message", {
                    newMessage: {
                        fromAddress: address,
                        tokenAddress,
                        textContent
                    }
                });
                setTextContent("");
                getChatData();
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div id="tradeBody">
        <div id="tradeCenter">
                <div id="chatArea">
                    <div id="chartTop">

                        <svg onClick={() => navigate("/explore")} id="backBtn" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>

                        <img id="chartTopImg" src={tokenData?.tokenImage}></img>
                        <div id="chartTopData">
                            <div id="chartName"> ${tokenData?.tokenSymbol} • {tokenData?.tokenName.slice(0, 8)}{tokenData?.tokenName.length > 8 ? "..." : ""}</div>
                            <div id="chartMembers">Current Price: ${(ethPrice * tokenData?.lastPrice).toFixed(2)}</div>
                        </div>

                        {tokenData && tokenData.tokenType !== "simulated" ?
                            <div id="uniswapBtn" onClick={() => window.open("https://app.uniswap.org", "_blank")}>
                                <div id="uniText">
                                    trade on uniswap 🦄
                                </div>
                            </div>
                            :
                            <div id="tradeChatBtn" onClick={() => navigate("/trade/" + tokenData?.tokenAddress)}>
                                <div id="uniText">
                                    trade
                                </div>
                            </div>
                        }
                    </div>
                    {/* <div id="dextools-widget"
                        title="DEXTools Trading Chart"
                        width="500"
                        theme="dark"
                        chartType="1"
                        src={dextools}>
                    </div> */}
                    <div id="convoArea">


                        <div id="messageArea">
                            {messageArray.map((message) => {
                                return (
                                    <Message
                                        message={message}
                                        fromUser={address === message.fromAddress}
                                        key={message._id}
                                    />
                                )
                            })}

                        </div>



                        <div id="textBoxArea">

                            {/* <div id="memberBtn" className="blueBadge chatBtn">
                                <svg xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                            </div>


                            <div className="greenBadge chatBtn">
                                <svg xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>

                            <div id="imgBtn" className="pinkBadge chatBtn">
                                <svg xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </div> */}

                            <div id="textBoxMain">
                                <input id="textInputMain"
                                    onChange={(e) => setTextContent(e.target.value)}
                                    value={textContent}
                                />
                            </div>

                            <div id="sendBtn" onClick={() => newMessage()}>
                                <svg xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                </svg>
                            </div>

                        </div>
                    </div>
                </div>
                {/* <NavBottom page="explore" /> */}
            </div>
        </div>
    );
}