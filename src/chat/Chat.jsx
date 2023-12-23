import { useState, useRef, useEffect } from "react";
import styles from "./Chat.module.css";
import { firestore } from "../firebase";
import { FaMicrophoneLines } from "react-icons/fa6";
import { FaMicrophoneLinesSlash } from "react-icons/fa6";

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import ai from "/aipic.jpg";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: uuidv4(), bot: "Hello human! How can I help you today?", user: "" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = useRef(null);
  const colletionRef = collection(firestore, "botly");
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [active, setActive] = useState("voice");
  let recognition;

  const initialMessage = {
    id: uuidv4(),
    bot: "Hello human! How can I help you today?",
    user: "",
  };

  const handleActiveTabChange = (tab) => {
    setActive(tab);
  };
  const startListening = () => {
    recognition = new window.webkitSpeechRecognition();
    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = async (event) => {
      const last = event.results.length - 1;
      console.log("starting");
      const response = await fetch("http://127.0.0.1:8000/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: event.results[last][0].transcript }),
        mode: "cors",
      });

      const responseData = await response.json(); // Parse the JSON content

      console.log("done");
      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }
      console.log("resonse:", responseData);
      const botResponse = responseData.bot;

      const dbMessages = {
        id: uuidv4(),
        user: event.results[last][0].transcript,
        bot: botResponse,
        createdAt: new Date().getTime(),
      };
      setTranscript(event.results[last][0].transcript);
      const messageDataRef = doc(colletionRef, dbMessages.id);
      await setDoc(messageDataRef, dbMessages);
      const updatedMessages = [
        ...messages,
        {
          id: uuidv4(),
          bot: botResponse,
          user: event.results[last][0].transcript,
        },
      ];

      setMessages(updatedMessages);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    // recognition.stop();
    setListening(false);
  };

  useEffect(() => {
    startListening();

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    const getTestData = async () => {
      try {
        const docSnap = await getDocs(colletionRef);

        if (!docSnap.empty) {
          const data = await docSnap.docs.map((doc) => doc.data());
          data.unshift(initialMessage);
          // message.unshift(data);
          setMessages(() => data);
          // setMessages([
          //   ...messages,
          //   { id: item.id, user: item.user, bot: item.bot },
          // ]);

          console.log("Document data:", data);
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.log("Error getting cached document:", e);
      }
    };
    getTestData();
    // console.log(tests);
  }, []);

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

      const dbMessages = {
        id: uuidv4(),
        user: newMessage,
        bot: botResponse,
        createdAt: new Date().getTime(),
      };

      const unsubscribe = await onSnapshot(
        doc(firestore, "botly", dbMessages.id),
        (snapshot) => {
          console.log("snapshot:", snapshot.data());
        }
      );
      console.log("before snapshot execution");
      unsubscribe();
      console.log("after snapshot execution");

      const updatedMessages = [
        ...messages,
        { id: uuidv4(), bot: botResponse, user: newMessage },
      ];

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
      <div className={styles["tab"]}>
        <span
          className={`${styles["tab_option"]} ${
            active === "voice" && styles["active"]
          }`}
          onClick={() => handleActiveTabChange("voice")}
        >
          Voiced input
        </span>
        <span
          className={`${styles["tab_option"]} ${
            active === "text" && styles["active"]
          }`}
          onClick={() => handleActiveTabChange("text")}
        >
          Text based
        </span>
      </div>
      {active === "text" && (
        <>
          <div className={styles["chat-messages"]} ref={messagesRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles["message"]} ${styles[`${message?.user}`]}`}
              >
                {message?.user && (
                  <div className={styles["user-icon"]}>
                    {/* <span>👤</span>  */}
                    <span></span>
                    <span className={styles["user"]}>{message.user}</span>
                  </div>
                )}
                {message?.bot ? (
                  <div className={styles["bot-msg"]}>
                    <span className={styles["bot-image"]}>
                      <img
                        src={ai}
                        alt="ai_image"
                        className={styles["bot-image"]}
                      />
                    </span>
                    {/* <span className={styles["bot-image"]}>🤖</span> */}
                    <div className={styles["bot-icon"]}>
                      <span>{message.bot}</span>
                      {/* <span>{botResponse}</span> */}
                    </div>
                  </div>
                ) : null}

                {/* <div className="message-text">{message.text}</div> */}
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
        </>
      )}

      {active === "voice" && (
        <>
          <div className={styles["chat-messages"]} ref={messagesRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles["message"]} ${styles[`${message?.user}`]}`}
              >
                {message?.user && (
                  <div className={styles["user-icon"]}>
                    {/* <span>👤</span>  */}
                    <span></span>
                    <span className={styles["user"]}>{message.user}</span>
                  </div>
                )}
                {message?.bot ? (
                  <div className={styles["bot-msg"]}>
                    <span className={styles["bot-image"]}>
                      <img
                        src={ai}
                        alt="ai_image"
                        className={styles["bot-image"]}
                      />
                    </span>
                    {/* <span className={styles["bot-image"]}>🤖</span> */}
                    <div className={styles["bot-icon"]}>
                      <span>{message.bot}</span>
                      {/* <span>{botResponse}</span> */}
                    </div>
                  </div>
                ) : null}

                {/* <div className="message-text">{message.text}</div> */}
              </div>
            ))}
          </div>
          <div className={styles["voice_container"]}>
            <button
              onClick={listening ? stopListening : startListening}
              className={styles["listen_btn"]}
            >
              <span>
                {listening ? <FaMicrophoneLines /> : <FaMicrophoneLinesSlash />}
              </span>
              <span>{listening ? "Stop Listening" : "Start Listening"}</span>
            </button>
            <p>Transcript: {transcript}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
