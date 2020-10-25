import { BotState } from "../../models/ChatBot/BotStateSchema";
import ActionProvider from "./ActionProvider";
import Fuse from "fuse.js";
import { httpClient } from "../../utils/asyncUtils";
interface User {
  avatar: string;
  balance: number;
  createdAt: string;
  defaultPrivacyLevel: string;
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  mobile: string;
  password: string;
  phoneNumber: string;
  username: string;
  uuid: string;
}
interface FuzzySearch {
  item: string;
  refIndex: number;
  score: number;
}

class MessageParser {
  actionProvider;
  state;
  constructor(actionProvider: ActionProvider, state: BotState) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  private contains(target: string, pattern: string[], minMatchCharLength: number): boolean {
    const fuse = new Fuse(pattern, { minMatchCharLength, includeScore: true });
    const searched = fuse.search(target);
    return searched.length > 0 && searched.some((search: FuzzySearch) => search.score < 0.3);
  }

  private conversationWasAbout(subject: string): boolean {
    const lastMessage = this.state.messages[this.state.messages.length - 1].message;
    return lastMessage.includes(subject);
  }

  private async searchUser(name: string) {
    const { data } = await httpClient.get(`http://localhost:3001/users/search?q=${name}`);
    const users: User[] = data.results;
    return users;
  }
  async parse(message: string) {
    console.log(this.state.transactionSteps);

    if (this.state.transactionSteps > 0) {
      if (message === "q") {
        this.actionProvider.reset();
      }
      if (this.state.transactionSteps === 1) {
        if (message === "1") {
          this.actionProvider.increaseTransactionSteps();
          this.actionProvider.askAmountOfMoney("payment");
        } else if (message === "2") {
          this.actionProvider.increaseTransactionSteps();
          this.actionProvider.askAmountOfMoney("request");
        }
      } else if (this.state.transactionSteps === 2) {
        try {
          this.actionProvider.increaseTransactionSteps();
          this.actionProvider.askForUserName(
            +this.state.messages[this.state.messages.length - 1].message
          );
        } catch (e) {
          this.actionProvider.invalidNum();
        }
      } else if (this.state.transactionSteps === 3) {
        const userToLookup = this.state.messages[this.state.messages.length - 1].message;
        const users = await this.searchUser(userToLookup);
        const typedUser = users.find((user) => user.username === userToLookup);
        if (users.length === 0 || !typedUser) {
          this.actionProvider.userNotFound();
        } else {
          const type = this.state.transactionData.transactionType;
          const amount = this.state.transactionData.amount;
          this.actionProvider.confirmTransaction(typedUser.id, userToLookup, type, amount);
          this.actionProvider.increaseTransactionSteps();
        }
      } else if (this.state.transactionSteps === 4) {
        this.actionProvider.makeTransaction(this.state.transactionData);
        this.actionProvider.reset();
      }
    } else {
      if (message.toLowerCase().includes("hello")) {
        this.actionProvider.greet();
      } else if (this.contains(message, ["transaction", "transactions"], 5)) {
        this.actionProvider.askAbout("transactions");
      } else if (this.contains(message, ["notification", "notifications"], 5)) {
        this.actionProvider.askAbout("notifications");
      } else if (this.contains(message, ["bank", "account", "accounts", "banks"], 3)) {
        this.actionProvider.askAbout("bank accounts");
      } else if (this.contains(message, ["settings", "password", "user"], 3)) {
        this.actionProvider.askAbout("your account settings");
      } else if (
        this.contains(message, ["yes", "y", "yeah"], 1) &&
        this.state.messages.length > 1
      ) {
        if (this.conversationWasAbout("transactions")) {
          this.actionProvider.increaseTransactionSteps();
          this.actionProvider.askTransactionType();
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
}

export default MessageParser;
