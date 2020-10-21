import { createChatBotMessage } from "react-chatbot-kit";
import ChatBotMessage from "../../models/ChatBot/chatBotMessage";
interface Config {
  initialMessages: ChatBotMessage[];
}
const config: Config = {
  initialMessages: [createChatBotMessage(`Welcome to the fucking ChatBot`)],
};

export default config;
