import { useState, useRef, useEffect } from "react";
import styles from "./Chat.module.css";
import { firestore } from "../firebase";
import { FaMicrophoneLines } from "react-icons/fa6";
import { FaMicrophoneLinesSlash } from "react-icons/fa6";
import { PiTextOutdentBold } from "react-icons/pi";
import { MdRecordVoiceOver } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import bot from "/aipic.jpg";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
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

      const response = await fetch("http://127.0.0.1:8000/botly", {
        // const response = await fetch("https://botly-backend.onrender.com", {
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
            <span
              className={styles["dropdown-link"]}
              onClick={() => navigate("/home")}
            >
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M946.5 505L534.6 93.4a31.93 31.93 0 00-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z" />
              </svg>
              <span>Home</span>
            </span>

            <span
              className={styles["dropdown-link"]}
              onClick={() => navigate("/gallery")}
            >
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M450.29 112H142c-34 0-62 27.51-62 61.33v245.34c0 33.82 28 61.33 62 61.33h308c34 0 62-26.18 62-60V173.33c0-33.82-27.68-61.33-61.71-61.33zm-77.15 61.34a46 46 0 11-46.28 46 46.19 46.19 0 0146.28-46.01zm-231.55 276c-17 0-29.86-13.75-29.86-30.66v-64.83l90.46-80.79a46.54 46.54 0 0163.44 1.83L328.27 337l-113 112.33zM480 418.67a30.67 30.67 0 01-30.71 30.66H259L376.08 333a46.24 46.24 0 0159.44-.16L480 370.59z" />
                <path d="M384 32H64A64 64 0 000 96v256a64.11 64.11 0 0048 62V152a72 72 0 0172-72h326a64.11 64.11 0 00-62-48z" />
              </svg>
              <span>Family Gallery</span>
            </span>

            <span
              className={styles["dropdown-link"]}
              onClick={() => navigate("/videos")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M4 8H2v12a2 2 0 002 2h12v-2H4z" />
                <path d="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm-9 12V6l7 4z" />
              </svg>
              <span>Noble&apos;s Videos</span>
            </span>
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
          <div
            className={styles["chat-messages"]}
            ref={messagesRef}
            onClick={() => setDropdownVisible(false)}
          >
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
          <div
            className={styles["chat-messages"]}
            ref={messagesRef}
            onClick={() => setDropdownVisible(false)}
          >
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
