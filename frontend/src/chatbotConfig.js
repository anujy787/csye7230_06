import { createChatBotMessage } from "react-chatbot-kit";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

const config = {
  initialMessages: [createChatBotMessage(`Hello! How can I assist you today?`)],
  messageParser: new MessageParser(ActionProvider),
  actionProvider: new ActionProvider(createChatBotMessage),
  // Add more configuration options as needed
};

export default config;