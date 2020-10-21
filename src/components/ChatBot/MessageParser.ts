import chatBotMessage from "../../models/ChatBot/chatBotMessage";
import ActionProvider from "./ActionProvider";

class MessageParser {
  actionProvider;
  state;
  constructor(actionProvider: ActionProvider, state: chatBotMessage[]) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message: string) {
    if (message.toLowerCase().includes("hello")) {
      this.actionProvider.greet();
    }
  }
}

export default MessageParser;
