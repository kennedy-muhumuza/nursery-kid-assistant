import { useState, useRef, useEffect } from "react";
import styles from "./Chat.module.css";
import { firestore } from "../firebase";
import { FaMicrophoneLines } from "react-icons/fa6";
import { FaMicrophoneLinesSlash } from "react-icons/fa6";
import { PiTextOutdentBold } from "react-icons/pi";
import { MdRecordVoiceOver } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import bot from "/aipic.jpg";

import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import ai from "/aipic.jpg";
import { Link } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: uuidv4(),
      bot: "Hello human! Botly, your one and only friendly assistant at your service. I can do several things like playing music, telling you news updates, tell you the weather in any area you want, quickly surf the internet for you etc. Use me as you please",
      user: "",
    },
  ]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = useRef();
  const colletionRef = collection(firestore, "botly");
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [active, setActive] = useState("voice");
  let recognition;

  const initialMessage = {
    id: uuidv4(),
    bot: "Hello human! Botly, your one and only friendly assistant at your service. I can do several things like playing music, telling you news updates, tell you the weather in any area you want, quickly surf the internet for you etc. Use me as you please",
    user: "",
  };

  const startListening = () => {
    recognition = new window.webkitSpeechRecognition();
    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = async (event) => {
      const last = event.results.length - 1;

      setTranscript(event.results[last][0].transcript);

      // const response = await fetch("http://127.0.0.1:8000/botly", {
      const response = await fetch("https://botly-backend.onrender.com", {
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
      // setTranscript(event.results[last][0].transcript);
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
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("starting without try");

    try {
      console.log("starting");
      const response = await fetch("http://127.0.0.1:8000/botly", {
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

  const handleActiveTabChange = (tab) => {
    setActive(tab);
    scrollToBottom();
  };

  function convertIsoStringToCustomFormat(isoString) {
    const inputDate = new Date(isoString);

    if (isNaN(inputDate)) {
      return;
    }

    let hours = inputDate.getHours();
    let minutes = inputDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zeros if needed
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;
    return formattedTime;
  }

  return (
    <div className={styles["chat-container"]}>
      <section className={styles["home_header"]}>
        <span className={styles["header_img_container"]}>
          <img src={bot} className={styles["header_bot_img"]} />
          <p className={styles["welcome_msg"]}>
            Welcome back,
            <br /> <b className={styles["highlight"]}>Botly Friend</b>
          </p>
        </span>
        <span
          className={styles["options_container"]}
          onClick={() => setDropdownVisible(!isDropdownVisible)}
        >
          <span className={styles["option_dot"]}></span>
          <span className={styles["option_dot"]}></span>
          <span className={styles["option_dot"]}></span>
        </span>
        {isDropdownVisible && (
          <div className={styles["dropdown-content"]}>
            <Link to="/home">
              <span className={styles["dropdown-link"]}>Home</span>
            </Link>
            <Link to="/gallery">
              <span className={styles["dropdown-link"]}>Family Gallery</span>
            </Link>
            <Link to="/videos">
              <span className={styles["dropdown-link"]}>Anime Videos</span>
            </Link>
            <Link to="/chat">
              <span className={styles["dropdown-link"]}>Botly Chat</span>
            </Link>
          </div>
        )}
      </section>
      <div className={styles["tab"]}>
        <span
          className={`${styles["tab_option"]} ${
            active === "voice" && styles["active"]
          }`}
          onClick={() => handleActiveTabChange("voice")}
        >
          <MdRecordVoiceOver />
          <span> Voiced </span>
        </span>
        <span
          className={`${styles["tab_option"]} ${
            active === "text" && styles["active"]
          }`}
          onClick={() => handleActiveTabChange("text")}
        >
          <span>Text </span>
          <PiTextOutdentBold />
        </span>
      </div>
      {active === "text" && (
        <>
          <div className={styles["chat-messages"]} ref={messagesRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                ref={messagesRef}
                className={`${styles["message"]} ${styles[`${message?.user}`]}`}
              >
                {message?.user && (
                  <div className={styles["user-icon"]}>
                    {/* <span>👤</span>  */}
                    <span className={styles["user"]}>{message?.user}</span>
                    <span className={styles["time-user"]}>
                      {convertIsoStringToCustomFormat(message?.createdAt)}
                    </span>
                  </div>
                )}
                {message?.bot && (
                  <div className={styles["bot-container"]}>
                    <span className={styles["bot-image"]}>
                      <img
                        src={ai}
                        alt="ai_image"
                        className={styles["bot-image"]}
                      />
                    </span>
                    {/* <span className={styles["bot-image"]}>🤖</span> */}
                    <div className={styles["bot-icon"]}>
                      <span className={styles["bot-msg"]}>{message?.bot}</span>
                      <span className={styles["time"]}>
                        {convertIsoStringToCustomFormat(message?.createdAt)}
                      </span>
                      {/* <span>{botResponse}</span> */}
                    </div>
                  </div>
                )}

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
              className={styles["input_field"]}
            />
            <button type="submit">
              <IoMdSend />
            </button>
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
                    {/* <span></span> */}
                    <span className={styles["user"]}>{message?.user} </span>
                    <span className={styles["time-user"]}>
                      {convertIsoStringToCustomFormat(message?.createdAt)}
                    </span>
                  </div>
                )}
                {message?.bot ? (
                  <div className={styles["bot-container"]}>
                    <span className={styles["bot-image"]}>
                      <img
                        src={ai}
                        alt="ai_image"
                        className={styles["bot-image"]}
                      />
                    </span>
                    {/* <span className={styles["bot-image"]}>🤖</span> */}
                    <div className={styles["bot-icon"]}>
                      <span className={styles["bot-msg"]}>{message?.bot}</span>
                      <span className={styles["time"]}>
                        {convertIsoStringToCustomFormat(message?.createdAt)}
                      </span>
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
            <p>
              <b>Transcript:</b> {transcript}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
