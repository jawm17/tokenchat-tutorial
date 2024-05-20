import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import "./profilePreviewStyle.css";

export default function ProfilePreview() {
    const { user } = useParams();
    const navigate = useNavigate();
    const { loginAndRegister, isAuthenticated, globalUser } = useContext(AuthContext);

    async function createChat() {
        if (isAuthenticated) {
            navigate("/chat/" + user);
        } else {
            alert("login")
        }
    }

    return (
        <div id="mainBody">
            <div id="previewImgArea">
                <img id="profilePreviewImg" src="https://pbs.twimg.com/media/GHCaBpLXIAAq1qy?format=jpg&name=medium"></img>
            </div>
            <div id="previewName">
                Mia Khalifa
            </div>
            <div className="previewFlex">
                <div id="previewAmount">
                    $5.00 per message
                </div>
            </div>
            <div className="previewStat">
                last online: now
            </div>
            <div className="previewStat">
                messages sent: 4,530
            </div>
            <div className="previewStat">
                avg response time: 2 min
            </div>
            <div id="startChattingBtn" onClick={() => createChat()}>
                <div id="startChattingText">
                    Start Chatting
                </div>
                <svg id="startChattingIcon" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        </div>
    );
}