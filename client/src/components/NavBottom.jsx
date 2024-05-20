import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useWeb3Modal } from '@web3modal/ethers/react'
import "./styles/navBottomStyle.css";

export default function NavBottom(props) {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(props.page);
    const [requestOpened, setRequestOpened] = useState(false);

    const { open } = useWeb3Modal();
    const { address, chainId, isConnected } = useWeb3ModalAccount()

   async function openChat() {
        if(address){
            navigate("/portfolio")
        } else {
            open();
            setRequestOpened(true);
        }
    }

    useEffect(() => {
        if(requestOpened && isConnected) {
            navigate("/portfolio");
        }
    }, [requestOpened, isConnected]);

    return (
        <div id="navBottomOuterFlex">
            <div id="navBottom">
                <div className="bottomBtn" id={props.page === "explore" ? "selectedBtn" : ""} onClick={() => navigate("/explore")}>
                    <svg id="btnIcon" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-2 h-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <div>
                        explore
                    </div>
                </div>
                <div className="bottomBtn" id={props.page === "chat" ? "selectedBtn" : ""} onClick={() => openChat()}>
                    <svg id="btnIcon" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <div>
                        chat
                    </div>
                </div>
                {/* <div className="bottomBtn" id={props.page === "account" && "selectedBtn"} onClick={() => navigate("/chat")}>
                <svg id="btnIcon" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <div>
                    account
                </div>
            </div> */}
            </div>
        </div>
    );
}