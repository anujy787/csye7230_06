class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }

    parse(message) {
      if (message.toLowerCase().includes("hello")) {
        return "Hi there!";
      } else if (message.toLowerCase().includes("how are you")) {
        return "I'm just a bot, but thanks for asking!";
      } else {
        return "Sorry, I didn't understand that.";
      }
    }
  }

  export default MessageParser;