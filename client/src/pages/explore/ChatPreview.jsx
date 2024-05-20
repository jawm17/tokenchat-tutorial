import React from "react";
import { useNavigate } from 'react-router-dom';
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useWeb3Modal } from '@web3modal/ethers/react'
import "./chatPreviewStyle.css";

export default function ChatPreview(props) {
    const { open } = useWeb3Modal();
    const { address } = useWeb3ModalAccount()
    const navigate = useNavigate();
    const ethPrice = 3300;
    return (
        <div className="recUser" onClick={address ? () => navigate("/trade/" + props.data.tokenAddress) : () => open()}>
            <img className="recUserImg" src={props.data.tokenImage}></img>
            <div className="recUserDeets">
                <div className="nameFlex">
                    <div className="recUserName">{props.data.tokenName || props.data.tokenAddress.slice(0,8) + "..."}</div>
                </div>
                <div className="statusFlex">
                    {/* <div className="statusColor"></div> */}
                    <div className="statusLabel">${(ethPrice * (props.data.fdv / 1000000000000000000)).toFixed(2)} • ${(ethPrice * props.data.lastPrice).toFixed(2) > 0 ? (ethPrice * props.data.lastPrice).toFixed(2) : 0.01} • {props.data.holderCount} holders</div>
                </div>
            </div>
            <div className="recAmount">
                ${(ethPrice * (props.data.fdv / 1000000000000000000)).toFixed(2)}
            </div>
            <svg id="recArrow" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </div>
    );
}