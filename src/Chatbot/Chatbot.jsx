import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";

const API_KEY = "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";

// const API_KEY = "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";
export const Chatbot = () => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Ask me anything",
      sender: "chatGPT",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };
  const processMessageToChatGPT = async (chatMessages) => {
    //chatMessages {sender: "user" or "chatGPT", message: "message here"}
    //apiMessages {role: "user" or "assistant", content: "message content here"}
    try {
      let apiMessages = chatMessages.map((messageObject) => {
        let role = "";
        if (messageObject.sender === "chatGPT") {
          role = "assistant";
        } else {
          role = "user";
        }
        return { role: role, content: messageObject.message };
      });
      const systemMessage = {
        role: "system",
        content:
          "Talk to me like a close friend that is willing to offer emotional support",
      };

      const apiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...apiMessages],
      };
      await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          console.log("data:", data);
        });
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // If rate limit is reached, wait for a short period and retry
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000 milliseconds (1 second)
        await processMessageToChatGPT(); // Retry the API request
      } else {
        // Handle other errors
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              typingIndicator={
                typing ? <TypingIndicator content="ChatGPT is typing" /> : null
              }
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type here ..." onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};
