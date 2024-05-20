import React, { useEffect, useState } from "react";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { useNavigate } from 'react-router-dom';
import { useWeb3Modal } from '@web3modal/ethers/react'
import axios from "axios";
import ChatPreview from "./ChatPreview";
import NavBottom from "../../components/NavBottom";
import coinImg from "../../assets/coin.png"
import CreateModal from "./CreateModal";
import crown from "../../assets/crown.png";
import "./exploreStyle.css";

export default function Explore(props) {
    const navigate = useNavigate();
    const { open } = useWeb3Modal();
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider()

    const [activeTab, setActiveTab] = useState("top");
    const [searchValue, setSearchValue] = useState("");
    const [topTokens, setTopTokens] = useState([]);
    const [creating, setCreating] = useState(false);

    const [king, setKing] = useState();

    const ethPrice = 3300;

    useEffect(() => {
        setTopTokens([]);
        if(activeTab === "top") {
            getTopTokens();
        } else if(activeTab === "hot") {
            getTopTokens();
        } else if(activeTab === "new") {
            getNewTokens();
        }
    }, [activeTab]);

    useEffect(() => {
        getKing();
    }, []);
    
    useEffect(() => {
        if(address) {
            connect();
        }
    }, [address]);

    async function connect() {

        try {
            const {data} = await axios.post("/register-with-wallet", {address: address});
            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }

    async function getTopTokens() {
        try {
            const { data } = await axios.get("/token/all-tokens");
            const sortedTokens = data.slice().sort((a, b) => b.fdv - a.fdv); 
            setTopTokens(sortedTokens);
        } catch (error) {
            console.log(error);
        }
    }

    async function getKing() {
        try {
            const { data } = await axios.get("/token/all-tokens");
            const sortedTokens = data.slice().sort((a, b) => b.fdv - a.fdv);
            console.log(sortedTokens[0]) 
            setKing(sortedTokens[0]);
        } catch (error) {
            console.log(error);
        }
    }

    async function getHotTokens() {
        try {
            const { data } = await axios.get("/token/hot");
            const sortedTokens = data.slice().sort((a, b) => b.fdv - a.fdv); 
            setTopTokens(sortedTokens);
        } catch (error) {
            console.log(error);
        }
    }

    async function getNewTokens() {
        try {
            const { data } = await axios.get("/token/all-tokens");
            setTopTokens([...data].reverse())
        } catch (error) {
            console.log(error);
        }
    }

    async function addToken() {
        if (address && searchValue) {
            try {
                const { data } = await axios.post("/token/add-token", {newToken: {tokenAddress: searchValue, tokenImg: "https://www.dextools.io/resources/tokens/logos/base/0x532f27101965dd16442e59d40670faf5ebb142e4.png?1708849040618" }});
            } catch (error) {
                console.log(error);
            }
        }
    }

    function closeAndRefresh() {
        getNewTokens();
        setActiveTab("new");
        setCreating(false);
    }

    const currentDate = new Date();

    // Get the individual components of the date (month, day, year)
    const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();

    // Format the date to 'm/d/y' format
    const formattedDate = `${month}/${day}/${year}`;

    return (
        <div id="mainBody">
            {creating ? <CreateModal close={() => setCreating(false)} closeAndRefresh={() => closeAndRefresh()}/> : null}
            <div id="exploreCenter">
                <div id="headerFlex">
                    <img id="headerLogo" src={coinImg}></img>
                    <div id="siteTitle">
                        TokenChat
                    </div>
                    {address ?
                        <div id="createBtn" onClick={() => setCreating(true)}>
                            create +
                        </div>
                        :
                        <div id="createBtn" onClick={() => open()}>
                            connect
                        </div>
                    }
                    {/* <img onClick={() => navigate("/envy")} id="headerUserImg" src={"https://pbs.twimg.com/profile_images/1768901940761780224/IkopmkkJ_400x400.jpg"}></img> */}
                </div>
                <div>
                    {/* <div id="searchContainer">
                        <svg id="searchIcon" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <input onChange={(e) => setSearchValue(e.target.value)} value={searchValue} id="searchInput"></input>
                    </div> */}

                        <div id="exploreResults">
                            <div id="kothBG" onClick={() => navigate("/trade/" + king?.tokenAddress)}>
                            <div id="koth">
                                <img id="kothImg" src={king?.tokenImage}></img>
                                <div>
                                    <div id="kothName">
                                     ${king?.tokenSymbol} • {king?.tokenName}
                                    </div>
                                    <div id="kothSub">
                                        ${(ethPrice * (king?.fdv / 1000000000000000000)).toFixed(2)} • ${  (ethPrice * king?.lastPrice).toFixed(2) > 0 ? (ethPrice * king?.lastPrice).toFixed(2) : 0.01} • {king?.holderCount} holders
                                    </div>
                                </div>
                            </div>
                            <div id="kothLabelArea">
                                <div id="leftKothLabel">
                                <img src={crown} id="crownImg"></img>
                                <div id="kothText">
                                    KING OF THE HILL
                                </div>
                                </div>
                                <div id="crownedLabel">
                                    crowned: {formattedDate}
                                </div>
                            </div>
                            </div>
                            <div className="tabRowExplore">
                                <div className="tab" onClick={() => setActiveTab("top")} id={activeTab === "top" ? "activeTab" : null}>
                                    🪙 TOP
                                </div>
                                <div className="tab" onClick={() => setActiveTab("hot")} id={activeTab === "hot" ? "activeTab" : null}>
                                    🔥 HOT
                                </div>
                                <div className="tab" onClick={() => setActiveTab("new")} id={activeTab === "new" ? "activeTab" : null}>
                                    🌈 NEW
                                </div>
                            </div>
                            {topTokens.map((item) => {
                                return (
                                    <ChatPreview 
                                    data={item}
                                    key={item._id}
                                     />
                                )
                            })}
                        </div>

                </div>
                <NavBottom page="explore" />
            </div>
        </div>
    );
}