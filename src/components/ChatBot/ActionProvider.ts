import { history } from "../../utils/historyUtils";
import { BotState, ChatBotMessage } from "../../models/ChatBot/BotStateSchema";

class ActionProvider {
  createChatBotMessage;
  setState;
  createClientMessage;
  constructor(
    createChatBotMessage: (message: string) => ChatBotMessage,
    setStateFunc: Function,
    createClientMessage: (message: string) => ChatBotMessage
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  greet() {
    const greetingMessage = this.createChatBotMessage("Hi, friend.");
    this.updateChatbotState(greetingMessage);
  }

  askAbout(subject: string) {
    const question = this.createChatBotMessage(`Are you asking about ${subject}?`);
    this.updateChatbotState(question);
  }

  startChat() {}

  redirectTo(location: string, msg: string) {
    const message = this.createChatBotMessage(`Ok, redirecting you to the ${msg} page.`);
    this.updateChatbotState(message);
    history.push(location);
  }

  updateChatbotState(message: ChatBotMessage): void {
    this.setState((prevState: BotState) => {
      return {
        ...prevState,
        messages: [...prevState.messages, message],
      };
    });
  }
}

export default ActionProvider;
