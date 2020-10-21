import BotState from "../../models/ChatBot/BotState";
import ActionProvider from "./ActionProvider";

class MessageParser {
  actionProvider;
  state;
  constructor(actionProvider: ActionProvider, state: BotState) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  private contains = (target: string, pattern: string[]): boolean => {
    let value = 0;
    pattern.forEach((word: string): void => {
      if (target.toLowerCase().includes(word.toLowerCase())) {
        value++;
      }
    });
    return value >= 1;
  };

  parse(message: string) {
    if (message.toLowerCase().includes("hello")) {
      this.actionProvider.greet();
    } else if (this.contains(message, ["transaction", "transactions"])) {
      this.actionProvider.askAbout("transactions");
    } else if (this.contains(message, ["notification", "notifications"])) {
      this.actionProvider.askAbout("notifications");
    } else if (this.contains(message, ["yes", "y"])) {
      console.log(this.state.messages[this.state.messages - 1]);
    } else {
      this.actionProvider.startChat();
    }
  }
}

export default MessageParser;
