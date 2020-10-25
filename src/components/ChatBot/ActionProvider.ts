import { history } from "../../utils/historyUtils";
import { BotState, ChatBotMessage } from "../../models/ChatBot/BotStateSchema";
import { httpClient } from "../../utils/asyncUtils";

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

  async getId() {
    const {
      data: { user },
    } = await httpClient.get(`http://localhost:3001/checkAuth`);
    return user.id;
  }

  increaseTransactionSteps() {
    this.setState((prev: BotState) => {
      return { ...prev, transactionSteps: prev.transactionSteps + 1 };
    });
  }

  async getCurrentBalance() {
    const {
      data: { user },
    } = await httpClient.get(`http://localhost:3001/checkAuth`);
    const message = this.createChatBotMessage(`Your current balance is ${user.balance}`);
    this.updateChatbotState(message);
  }

  async greet() {
    const {
      data: { user },
    } = await httpClient.get(`http://localhost:3001/checkAuth`);
    const greetingMessage = this.createChatBotMessage(`Hi, ${user.firstName}.`);
    this.updateChatbotState(greetingMessage);
  }

  reset() {
    this.setState((prev: BotState) => {
      return {
        ...prev,
        transactionData: {
          transactionType: "",
          amount: 0,
          description: "",
          senderId: "",
          receiverId: "",
        },
        transactionSteps: 0,
      };
    });
    const message = this.createChatBotMessage(`What do you want to do?`);
    this.updateChatbotState(message);
  }

  userNotFound() {
    const message = this.createChatBotMessage(`User not found, please enter a different name.`);
    this.updateChatbotState(message);
  }

  askTransactionType() {
    this.setState((prev: BotState) => {
      return {
        ...prev,
        transactionData: {
          transactionType: "",
          amount: 0,
          description: "",
          senderId: "",
          receiverId: "",
        },
        transactionSteps: 1,
      };
    });
    const message1 = this.createChatBotMessage(`Do you want to send or request a transaction?`);
    this.updateChatbotState(message1);
    const message2 = this.createChatBotMessage(`Type 1 to 'send' money or 2 to 'request' money`);
    this.updateChatbotState(message2);
    const message3 = this.createChatBotMessage(
      `If you want to stop the conversation about transactions, just type 'q'`
    );
    this.updateChatbotState(message3);
  }

  async askAmountOfMoney(type: string) {
    this.setState((prev: BotState) => {
      return {
        ...prev,
        transactionData: { ...prev.transactionData, transactionType: type },
      };
    });
    this.getCurrentBalance();
    const message = this.createChatBotMessage(
      "Please enter the amount you want to send / receive:"
    );
    this.updateChatbotState(message);
  }

  invalidNum() {
    const message = this.createChatBotMessage("Please enter valid number");
    this.updateChatbotState(message);
  }

  askForUserName(amount: number) {
    this.setState((prev: BotState) => {
      return {
        ...prev,
        transactionData: { ...prev.transactionData, amount: amount },
      };
    });
    const message = this.createChatBotMessage(
      "Please enter the UserName of the user you want to make your transaction with:"
    );
    this.updateChatbotState(message);
  }

  askAbout(subject: string) {
    const question = this.createChatBotMessage(`Are you asking about ${subject}?`);
    this.updateChatbotState(question);
  }

  confirmTransaction(userId: string, userName: string, transactionType: string, amount: number) {
    this.setState((prev: BotState) => {
      return {
        ...prev,
        transactionData: { ...prev.transactionData, receiverId: userId },
      };
    });
    const message = this.createChatBotMessage(
      transactionType === "payment"
        ? `Please confirm you would like to send ${amount} dollars to ${userName} (Type 'y' or 'n')`
        : `Please confirm you would like to request ${amount} dollars from ${userName} (Type 'y' or 'n')`
    );
    this.updateChatbotState(message);
  }

  async makeTransaction(transactionData: any) {
    const id = await this.getId();
    this.setState((prev: BotState) => {
      return {
        ...prev,
        transactionData: { ...prev.transactionData, senderId: id },
      };
    });
    transactionData.senderId = id;
    const resp = await httpClient.post(`http://localhost:3001/transactions`, transactionData);
    if (!resp) {
      const message = this.createChatBotMessage("faild to complete the transaction");
      this.updateChatbotState(message);
    } else {
      const message = this.createChatBotMessage("successfully competed the transaction");
      this.updateChatbotState(message);
    }
  }

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
