import React, { useState } from "react";
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react'
import { BrowserProvider, Contract, formatUnits } from 'ethers'
import Factory from "../../contracts/Factory.json";
import "./createModalStyle.css";

const FactoryAdress = "0xeBE19992927933bCf1D9f01977Dfe24Bcc760936";

export default function CreateModal(props) {
    const { walletProvider } = useWeb3ModalProvider()
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [deploymentCost, setDeploymentCost] = useState("");
    const [loading, setLoading] = useState(false);

    async function createToken() {
        if (!name || !symbol || !imageURL) {
            alert("Please provide name, symbol, and image URL.");
            return;
        }
    
        try {
            setLoading(true);
    
            const ethersProvider = new BrowserProvider(walletProvider)
            const signer = await ethersProvider.getSigner()
    
            const FACTORY = new Contract(FactoryAdress, Factory, signer)
    
            const tx = await FACTORY.createSimulatedERC(name, symbol, imageURL);
            await tx.wait();
            
            console.log("success");
            props.closeAndRefresh();
        } catch (error) {
            console.error("Error creating contract:", error);
            alert("Failed to create contract.");
            setLoading(false);
        }
    };

    return (
        <div>
            <div id="modalBlur" onClick={() => props.close()}></div>
            <div id="createModal">

                <div id="createModalTitle">create a token</div>

                <div className="createInputName">Name</div>
                <div className="createInputOuter">
                    <input className="createInput" value={name} onChange={(e) => setName(e.target.value)}></input>
                </div>
                <div className="createInputName">Symbol</div>
                <div className="createInputOuter">
                    <input className="createInput" value={symbol} onChange={(e) => setSymbol(e.target.value)}></input>
                </div>
                <div className="createInputName">Image url</div>
                <div className="createInputOuter">
                    <input className="createInput" value={imageURL} onChange={(e) => setImageURL(e.target.value)}></input>
                </div>

                <div id="costMsg">deployment cost ~0.00004 eth</div>
                <div onClick={() => createToken()} id={loading ? "publishBtnLoading" : "publishBtn"}>

                    <div className="buyKeyBtnText">
                        {loading ? "Confirming" : "create"}
                    </div>
                    {loading ?

                        <div className="loaderBtn">
                        </div>

                        : null
                    }
                </div>
            </div>
        </div>
    );
}