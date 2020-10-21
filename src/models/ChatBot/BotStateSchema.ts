export interface ChatBotMessage {
  id: number;
  loading: boolean;
  message: string;
  type: "bot";
}

export interface BotState {
  messages: ChatBotMessage[];
}
