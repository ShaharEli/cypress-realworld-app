import ChatBotMessage from "../../models/ChatBot/chatBotMessage";
interface BotState {
  messages: ChatBotMessage[];
}
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

  updateChatbotState(message: ChatBotMessage): void {
    this.setState((prevState: BotState) => {
      console.log(typeof prevState, prevState);
      return {
        ...prevState,
        messages: [...prevState.messages, message],
      };
    });
  }
}

export default ActionProvider;
