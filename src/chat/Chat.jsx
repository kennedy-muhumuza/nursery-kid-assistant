import { useState, useRef, useEffect } from "react";
import styles from "./Chat.module.css";
import { firestore } from "../firebase";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you?", user: "bot" },
    { id: 2, text: "Hi there!", user: "user" },
    // Add more messages as needed
  ]);
  // const [botResponse, setBotResponse] = useState("");

  const [newMessage, setNewMessage] = useState("");
  const messagesRef = useRef(null);
  const colletionRef = collection(firestore, "botly");

  useEffect(() => {
    // Set initial messages
    setMessages(messages);

    // Scroll to the bottom of the messages when new messages are added
    scrollToBottom();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the messages whenever new messages are added
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  //   const handleSendMessage = (e) => {
  //     e.preventDefault();
  //     if (newMessage.trim() === "") return;

  //     const updatedMessages = [
  //       ...messages,
  //       { id: messages.length + 1, text: newMessage, user: "user" },
  //     ];
  //     setMessages(updatedMessages);
  //     setNewMessage("");
  //   };
  //   const handleSubmit = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:8000/bot", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ text: newMessage }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }

  //       const data = await response.json();
  //       const updatedMessages = [
  //         ...messages,
  //         { id: messages.length + 1, text: newMessage, user: "user" },
  //         { id: messages.length + 1, text: data.bot, user: "bot" },
  //       ];
  //       setMessages(updatedMessages);
  //       setNewMessage("");

  //       // Assuming the bot response is in the response data
  //       setBotResponse(data.bot);
  //     } catch (error) {
  //       console.error("Error submitting user input:", error);
  //       // Handle error appropriately, e.g., show an error message to the user
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("starting without try");

    try {
      console.log("starting");
      const response = await fetch("http://127.0.0.1:8000/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newMessage }),
        mode: "cors",
      });

      const responseData = await response.json(); // Parse the JSON content

      console.log("done");
      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }
      console.log("resonse:", responseData);
      const botResponse = responseData.bot;
      const unsubscribe = onSnapshot(
        collection(firestore, "botlty"),
        (snapshot) => {
          console.log(
            "snapshot:",
            snapshot.docs.map((doc) => doc.data())
          );
        },
        (error) => {
          console.log(error);
          // ...
        }
      );
      console.log("before snapshot execution");
      unsubscribe();
      console.log("after snapshot execution");

      const updatedMessages = [
        ...messages,
        { id: messages.length++, text: newMessage, user: "user" },
        { id: messages.length + 2, text: botResponse, user: "bot" }, // Use a unique ID
      ];

      const dbMessages = {
        id: uuidv4(),
        user: newMessage,
        bot: botResponse,
        createdAt: new Date().getTime(),
      };
      const messageDataRef = doc(colletionRef, dbMessages.id);
      await setDoc(messageDataRef, dbMessages);

      console.log("before snapshot execution");
      unsubscribe();
      console.log("after snapshot execution");
      setMessages(updatedMessages);
      setNewMessage("");
    } catch (error) {
      console.error("Error submitting user input:", error);
      // Handle error appropriately, e.g., show an error message to the user
    }
  };

  return (
    <div className={styles["chat-container"]}>
      {/* Chat Header */}
      <div className={styles["chat-header"]}>
        <h2>ChatBot</h2>
      </div>

      {/* Chat Messages */}
      <div className={styles["chat-messages"]} ref={messagesRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles["message"]} ${styles[`${message.user}`]}`}
          >
            {message.user === "user" && (
              <div className={styles["user-icon"]}>
                {/* <span>👤</span>  */}
                <span>{message.text}</span>
              </div>
            )}
            {/* <div className="message-text">{message.text}</div> */}
            {message.user === "bot" ? (
              <>
                <span className={styles["bot-image"]}>🤖</span>
                <div className={styles["bot-icon"]}>
                  <span>{message.text}</span>
                  {/* <span>{botResponse}</span> */}
                </div>
              </>
            ) : null}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <form className={styles["chat-input"]} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
