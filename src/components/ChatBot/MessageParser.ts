import { BotState } from "../../models/ChatBot/BotStateSchema";
import ActionProvider from "./ActionProvider";

class MessageParser {
  actionProvider;
  state;
  constructor(actionProvider: ActionProvider, state: BotState) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  private contains(target: string, pattern: string[]): boolean {
    let value = 0;
    pattern.forEach((word: string): void => {
      if (target.toLowerCase().includes(word.toLowerCase())) {
        value++;
      }
    });
    return value >= 1;
  }

  private conversationWasAbout(subject: string): boolean {
    const lastMessage = this.state.messages[this.state.messages.length - 1].message;
    return lastMessage.includes(subject);
  }

  parse(message: string) {
    if (message.toLowerCase().includes("hello")) {
      this.actionProvider.greet();
    } else if (this.contains(message, ["transaction", "transactions"])) {
      this.actionProvider.askAbout("transactions");
    } else if (this.contains(message, ["notification", "notifications"])) {
      this.actionProvider.askAbout("notifications");
    } else if (this.contains(message, ["bank", "account", "accounts", "banks"])) {
      this.actionProvider.askAbout("bank accounts");
    } else if (this.contains(message, ["settings", "password", "user"])) {
      this.actionProvider.askAbout("your account settings");
    } else if (this.contains(message, ["yes", "y"]) && this.state.messages.length > 1) {
      if (this.conversationWasAbout("transactions")) {
        this.actionProvider.redirectTo("/transaction/new", "new transaction");
      } else if (this.conversationWasAbout("notifications")) {
        this.actionProvider.redirectTo("/notifications", "notifications");
      } else if (this.conversationWasAbout("bank accounts")) {
        this.actionProvider.redirectTo("/bankaccounts", "bank accounts");
      } else if (this.conversationWasAbout("settings")) {
        this.actionProvider.redirectTo("/user/settings", "settings");
      }
    }
  }
}

export default MessageParser;
