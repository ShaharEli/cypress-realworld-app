import { createChatBotMessage } from "react-chatbot-kit";
import { ChatBotMessage } from "../../models/ChatBot/BotStateSchema";
interface Config {
  initialMessages: ChatBotMessage[];
}
const config: Config = {
  initialMessages: [
    createChatBotMessage(`Welcome To Real World App ChatBot!`),
    createChatBotMessage(`What do you want to do?`),
  ],
};

export default config;
