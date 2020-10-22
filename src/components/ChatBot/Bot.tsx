import React, { useState } from "react";
import config from "./config";
import ActionProvider from "./ActionProvider";
import Chatbot from "react-chatbot-kit";
import MessageParser from "./MessageParser";
import botAvatar from "./botAvatar.png";
const botAvatarStyle = { width: 70, height: 70, cursor: "pointer" };
//taskkill /f /im node.exe
// {
//     transactionType: 'payment',
//     amount: 3500,
//     description: 'lml;m',
//     senderId: 't45AiwidW',
//     receiverId: 'qywYp6hS0U'
//   }
const Bot: React.FC = () => {
  const [showBot, setShowBot] = useState<boolean>(false);
  return (
    <div className="Bot">
      {showBot ? (
        <>
          <Chatbot config={config} actionProvider={ActionProvider} messageParser={MessageParser} />
          <img onClick={() => setShowBot((prev) => !prev)} src={botAvatar} style={botAvatarStyle} />
        </>
      ) : (
        <img onClick={() => setShowBot((prev) => !prev)} src={botAvatar} style={botAvatarStyle} />
      )}
    </div>
  );
};

export default Bot;
