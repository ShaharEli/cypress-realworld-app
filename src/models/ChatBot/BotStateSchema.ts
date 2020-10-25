export interface ChatBotMessage {
  id: number;
  loading: boolean;
  message: string;
  type: "bot";
}

interface Transaction {
  transactionType: string;
  amount: number;
  description: string;
  senderId: string;
  receiverId: string;
}
export interface BotState {
  messages: ChatBotMessage[];
  transactionData: Transaction;
  transactionSteps: number;
}
