import React from "react";
import "./messageStyle.css";

export default function Message(props) {

    return (
        <div className="msgFlex" id={props.fromUser ? "fromUser" : null}>
            <div className="message">
                {props.message.textContent}
            </div>
        </div>
    )
}