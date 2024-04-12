class ActionProvider {
    constructor(createChatBotMessage) {
      this.createChatBotMessage = createChatBotMessage;
    }
  
    handleHello = () => {
      const message = this.createChatBotMessage("Hello! How can I assist you today?");
      this.createChatBotMessage(message);
    };
  
    handleGoodbye = () => {
      const message = this.createChatBotMessage("Goodbye! Have a great day!");
      this.createChatBotMessage(message);
    };
  }
  
  export default ActionProvider;