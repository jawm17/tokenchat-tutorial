import React, { useState } from "react";
import "./conversationsStyle.css";
import NavBottom from "../../components/NavBottom";

export default function Conversations(props) {

    const [selected, setSelected] = useState("explore");

    return (
        <div id="mainBody">
            conversations
            <NavBottom page="chat"/>
        </div>
    );
}