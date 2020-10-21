export default interface ChatBotMessage {
  id: number;
  loading: boolean;
  message: string;
  type: "bot";
}
