import React from "react";
import config from "./config";
import ActionProvider from "./ActionProvider";
import Chatbot from "react-chatbot-kit";

import MessageParser from "./MessageParser";
//taskkill /f /im node.exe
const Bot: React.FC = () => {
  return (
    <div className="Bot">
      <Chatbot config={config} actionProvider={ActionProvider} messageParser={MessageParser} />
    </div>
  );
};

export default Bot;
