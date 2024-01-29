/* global SpeechSynthesisUtterance */
/* global window, speechSynthesis */
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
import { botJsonData } from "../data/bot_json_data";
// import YouTube from "react-youtube";

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

  const extractCity = (command) => {
    const locationKeywords = ["in", "at", "for"];

    for (const keyword of locationKeywords) {
      const pattern = new RegExp(`${keyword}\\s(\\w+)`, "i");
      const match = command.match(pattern);

      if (match) {
        return match[1];
      }
    }

    return "kampala"; // Default city if no match is found
  };
  const newsCategories = [
    "business",
    "entertainment",
    "health",
    "science",
    "sports",
    "technology",
    "general",
    "politics",
    "world",
    "music",
    "environment",
    "education",
    "travel",
    "food",
    "finance",
    "technology",
    "arts",
    "fashion",
    "lifestyle",
  ];

  const getRandomCategory = () => {
    return newsCategories[Math.floor(Math.random() * newsCategories.length)];
  };

  const getNews = async () => {
    const apiKey = "ea3019bd02c14cb6af4fa27dbc9ea6b0";

    for (let i = 0; i < newsCategories.length; i++) {
      const selectedCategory = getRandomCategory();
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=${selectedCategory}&apiKey=${apiKey}`
      );
      const newsData = await response.json();

      if (newsData.articles.length > 0) {
        const firstArticle = newsData.articles[0];
        const title = firstArticle.title || "N/A";
        const description =
          firstArticle.description || "No description available";
        const source = firstArticle.source?.name || "Unknown Source";

        const textResponse = `The Latest news is as follows: ${
          selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
        } News:\nTitle: ${title}\nDescription: ${description}\nSource: ${source}`;

        talk(textResponse);
        return textResponse;
      } else {
        console.log(
          `Oops, nothing in ${selectedCategory}. Let me try another category.`
        );
        talk(
          `Oops, nothing in ${selectedCategory}. Let me try another category.`
        );
        getNews();
      }
    }
  };

  const getWeather = async (city) => {
    const API_KEY = "349c27f24aeee03e34affd43ad60e8ce";
    const BASE_URL = "http://api.openweathermap.org/data/2.5/weather";

    const queryParams = new URLSearchParams({
      q: city,
      appid: API_KEY,
    });

    const url = `${BASE_URL}?${queryParams}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const weatherData = await response.json();
        return weatherData;
      } else {
        console.error("Error fetching weather data:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching weather data:", error.message);
      return null;
    }
  };

  const navigate = useNavigate();
  let recognition;

  // Create a new SpeechSynthesisUtterance object outside the function
  var msg = new SpeechSynthesisUtterance();

  // Listen for the voiceschanged event before fetching voices
  speechSynthesis.onvoiceschanged = function () {
    // Get the list of available voices
    var voices = window.speechSynthesis.getVoices();

    // Select a desired voice (you can customize this part)
    var desiredVoice = voices.find(
      (voice) => voice.voiceURI === "Google US English"
    );

    // Set the selected voice
    msg.voice = desiredVoice;
  };

  function randomString() {
    const randomList = [
      "Oops, seems I lost track of what you just said. Please rephrase",
      "Oh! It appears you spoke something I don't understand yet. Do you mind rephrasing",
      "Do you mind trying to rephrase that? It seems am yet to learn about that",
      "Sorry dear, I think I missed that. But am on my way to doing much better than this.",
      "I'm terribly sorry dear, I didn't quite catch that. But dont worry, I will soon be much better than this.",
      "Am sorry dear, can't answer that yet, but am looking forward to perfection. I promise!",
    ];

    const listCount = randomList.length;
    const randomItem = Math.floor(Math.random() * listCount);

    return randomList[randomItem];
  }

  // function extractUserName(inputString) {
  //   const namePattern =
  //     /(?i)(?:I\s+am\s+called|My\s+name\s+is)\s+([^\s.,;?!]+)/;
  //   const match = inputString.match(namePattern);
  //   return match ? match[1] : null;
  // }
  function extractUserName(inputString) {
    const namePattern = /(?:I\s+am\s+called|My\s+name\s+is)\s+([^\s.,;?!]+)/i;
    const match = inputString.match(namePattern);
    return match ? match[1] : null;
  }

  function calculateResponse(inputString) {
    const splitMessage = inputString.toLowerCase().split(/\s+|[,;?!.-]\s*/);
    const scoreList = [];

    const userName = extractUserName(inputString);

    if (userName) {
      const randomResponses = [
        `Hey ${userName}! Nice to hear from you. I am Botly by the way`,
        `Wow, I like your name ${userName}! Did your grandmother give it to you?`,
        `It feels nice to know you ${userName}! How are you?`,
        `You have a nice name ${userName}! I wish we could shake hands but sadly, I am yet to have some`,
        `Great knowing you ${userName}! I am Botly by the way.`,
      ];

      const listCount = randomResponses.length;
      const randomItem = Math.floor(Math.random() * listCount);

      return randomResponses[randomItem];
    }

    for (const response of botJsonData) {
      let responseScore = 0;
      let requiredScore = 0;
      const requiredWords = response.required_words;

      if (requiredWords.length > 0) {
        for (const word of splitMessage) {
          if (requiredWords.includes(word)) {
            requiredScore += 1;
          }
        }
      }

      if (requiredScore === requiredWords.length) {
        for (const word of splitMessage) {
          if (response.user_input.includes(word)) {
            responseScore += 1;
          }
        }
      }

      scoreList.push(responseScore);
    }

    const bestResponse = Math.max(...scoreList, 0);
    if (bestResponse !== 0) {
      const responseIndex = scoreList.indexOf(bestResponse);
      const possibleResponses = botJsonData[responseIndex].bot_response;

      const listCount = possibleResponses.length;
      const randomItem = Math.floor(Math.random() * listCount);
      const selectedResponse = possibleResponses[randomItem];
      return selectedResponse;
    }

    return randomString();
  }

  // Example usage:
  // const userInput = "tell me something specific about Emmanuella";
  // const response = calculateResponse(userInput);
  // console.log(response);
  // function talk(response) {
  //   // Check for Speech Synthesis support
  //   if ("speechSynthesis" in window) {
  //     // Set the text to be spoken
  //     msg.text = response;

  //     // Use the speech synthesis API to speak the text
  //     speechSynthesis.speak(msg);
  //   } else {
  //     console.error("Speech synthesis not supported in this browser.");
  //   }
  // }
  const talk = (response, onComplete) => {
    // Check for Speech Synthesis support
    if ("speechSynthesis" in window) {
      // var msg = new SpeechSynthesisUtterance();
      msg.text = response;

      // Listen for the end event before executing the callback
      msg.onend = () => {
        if (onComplete && typeof onComplete === "function") {
          onComplete();
        }
      };

      speechSynthesis.speak(msg);
    } else {
      console.error("Speech synthesis not supported in this browser.");
    }
  };
  const initialMessage = {
    id: uuidv4(),
    bot: "Hello human! Botly, your one and only friendly assistant at your service. I can do several things like playing music, telling you news updates, tell you the weather in any area you want, quickly surf the internet for you etc. Use me as you please",
    user: "",
  };

  const getTime = () => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return formattedTime;
  };

  const getDate = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();

    return formattedDate;
  };

  const randomStrings = [
    "Okay, let me search it out.",
    "Let me quickly find you internet results",
    "Searching for answers...",
    "Let me find that for you.",
    "On it! Fetching results.",
    "Scouring the web for info.",
    "Hold tight, searching in progress.",
    "Time to seek and find.",
    "Searching the web's archives.",
    "Finding answers, one click at a time.",
  ];

  const resultStrings = [
    "Okay, here we go!",
    "Alright!",
    "Got it!",
    "Perfect!",
    "Great, here's what I found.",
    "Ta-da! Here are the results.",
    "Voila! Information at your fingertips.",
    "Excellent! Check this out.",
    "Awesome! Here's what I discovered.",
    "Fantastic! Take a look at these results.",
  ];
  function getRandomResultString() {
    const randomIndex = Math.floor(Math.random() * resultStrings.length);
    return resultStrings[randomIndex];
  }
  function getRandomString() {
    const randomIndex = Math.floor(Math.random() * randomStrings.length);
    return randomStrings[randomIndex];
  }

  const introWords = [
    "Hey there human, it's good to see you again. How may I help you today.",
    "Hello dear, I'm happy to see you here. How are you doing?",
    "Greetings, friend! Ready for some delightful conversation?",
    "Hi! What's the latest scoop in your world?",
    "Well, hello sunshine! What brings you to me today?",
    "Ahoy there! What's the word on the street?",
    "Bonjour! How's your day shaping up so far?",
    "Greetings and salutations! What's on your mind?",
    "Hey! Are you ready for some chatbot magic?",
    "Hola amigo! What exciting tales do you have to share?",
  ];
  function getRandomIntroString() {
    const randomIndex = Math.floor(Math.random() * introWords.length);
    return introWords[randomIndex];
  }

  useEffect(() => {
    const word = getRandomIntroString();
    talk(word);
  }, []);
  const searchWikiPedia = async (transcript) => {
    try {
      if (transcript) {
        console.log("Transcript:", transcript);
        const searchResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=${encodeURIComponent(
            transcript
          )}&origin=*`
        );
        const searchData = await searchResponse.json();

        if (searchResponse.ok && searchData.query.search.length > 0) {
          const mostRelevantTitle = searchData.query.search[0].title;

          const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&titles=${encodeURIComponent(
              mostRelevantTitle
            )}&origin=*`
          );

          const data = await response.json();

          if (response.ok) {
            const pages = data.query.pages;

            if (Object.keys(pages).length > 0) {
              const pageId = Object.keys(pages)[0];
              const pageData = pages[pageId];

              if ("missing" in pageData) {
                console.error("No information found for the given title.");
                talk("Sorry, no information found.");
              } else {
                const info = pageData.extract;

                if (info) {
                  const sentences = info.split(/(?<=[.!?])\s+/);

                  // Take the first two sentences
                  const selectedInfo = sentences.slice(0, 2).join(" ");

                  // const selectedString = getRandomString();
                  const selectedString = getRandomString();
                  talk(selectedString);
                  const selectedResultString = getRandomResultString();
                  talk(`${selectedResultString} ${selectedInfo}`);
                } else {
                  console.error("No information found:", data);
                  talk("Sorry, no information found.");
                }
              }
            } else {
              console.error("No information found for the given title.");
              talk("Sorry, no information found.");
            }
          } else {
            console.error("Error fetching data from Wikipedia:", data);
            talk("Error fetching data from Wikipedia.");
          }
        } else {
          console.error(
            "No relevant search results found for the given transcript."
          );
          talk("Sorry, no information found.");
        }
      } else {
        talk("Speech recognition result is empty.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      talk("An unexpected error occurred. Please try again later.");
    }
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
      // const response = await fetch("https://botly-backend.onrender.com/botly", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ text: event.results[last][0].transcript }),
      //   mode: "cors",
      // });
      // const responseData = await response.json(); // Parse the JSON content

      if (
        ["play", "song", "sing"].some((keyword) =>
          event.results[last][0].transcript.includes(keyword)
        )
      ) {
        const keyword = ["play", "song", "sing"].find((keyword) =>
          event.results[last][0].transcript.includes(keyword)
        );
        const song = event.results[last][0].transcript
          .replace(keyword, "")
          .trim();
        // Set the videoId for react-youtube player
        talk(
          `Unfortunately, am not yet able to play ${song} for you. Am sorry.`
        );
        return;
      }
      const keywords = [
        "idea",
        "describe",
        "outline",
        "state",
        "distinguish",
        "differentiate",
        "illustrate",
        "assess",
        "classify",
        "synthesize",
        "derive",
        "propose",
        "construct",
        "investigate",
        "validate",
        "synthesize",
        "propose",
        "argue",
        "justify",
        "types of",
        "examples",
        "determine",
        "search",
        "discuss",
        "define",
        "explain",
        "interprete",
        "elaborate",
        "who is",
        "who are",
        "what is",
        "what are",
        "where is",
        "how is",
        "how are",
        "which",
        "why",
        "when",
        "tell me about",
        "details on",
        "overview of",
        "history of",
        "background on",
        "compare",
        "contrast",
        "analyze",
        "evaluate",
        "assess",
        "critique",
        "explore",
        "examine",
        "summarize",
        "demonstrate",
      ];
      const forbiddenWords = [
        "date",
        "today",
        "name",
        "you",
        "me",
        "my",
        "sister",
        "kennedy",
        "muhumuza",
        "emmanuella",
        "kopio",
        "timothy",
        "how are you",
        "vanessa",
        "vanesa",
        "noble",
        "kisembo",
        "santrina",
        "satrina",
        "latrina",
        "mummy",
        "daddy",
        "bed",
        "triza",
        "theresa",
        "brother",
        "kabamba",
        "natonda",
        "namitala",
        "teresa",
        "tereza",
        "kopio",
        "gift",
        "emmanuella",
        "kaducu",
        "lagen",
        "nasiima",
        "komugisa",
        "precious",
        "ninsiima",
        "timothy",
      ];

      if (
        keywords.some((keyword) =>
          event.results[last][0].transcript.toLowerCase().includes(keyword)
        ) &&
        !forbiddenWords.some((forbiddenWord) =>
          event.results[last][0].transcript
            .toLowerCase()
            .includes(forbiddenWord)
        )
      ) {
        // const transcript = event.results[last][0].transcript.trim();
        const transcript = event.results[last][0].transcript;

        if (transcript) {
          searchWikiPedia(transcript);
        }
        return;
      }

      if (
        ["time", "how are you by the sun"].some((keyword) =>
          event.results[last][0].transcript.includes(keyword)
        )
      ) {
        const time = getTime();
        talk(`Current time is ${time}.`);
        return;
      }
      if (
        ["news", "latest", "whats new", "headlines"].some((keyword) =>
          event.results[last][0].transcript.includes(keyword)
        )
      ) {
        // const news = getNews();

        talk(
          "Sorry dear, am not yet able to tell you any news updates for now. But soon I shall be able to."
        );
        // const dbMessages = {
        //   id: uuidv4(),
        //   user: event.results[last][0].transcript,
        //   bot: news,
        //   createdAt: new Date().getTime(),
        // };
        // const messageDataRef = doc(colletionRef, dbMessages.id);
        // await setDoc(messageDataRef, dbMessages);
        // const updatedMessages = [
        //   ...messages,
        //   {
        //     id: uuidv4(),
        //     bot: news,
        //     user: event.results[last][0].transcript,
        //   },
        // ];

        // setMessages(updatedMessages);
        return;
      }

      if (
        ["date"].some((keyword) =>
          event.results[last][0].transcript.includes(keyword)
        )
      ) {
        const date = getDate();
        talk(`The date today is ${date}.`);
        return;
      }

      if (
        ["weather", "forecast"].some((keyword) =>
          event.results[last][0].transcript.includes(keyword)
        )
      ) {
        // Extract the city from the command
        const city = extractCity(event.results[last][0].transcript);

        // Get weather information
        const weatherData = await getWeather(city);

        if (weatherData) {
          // Extract relevant weather information
          const temperature = weatherData.main.temp;
          const description = weatherData.weather[0].description;

          // Update state with weather information
          talk(
            `The current temperature in ${city} is ${temperature} degrees Celsius. ${description}.`
          );
          const dbMessages = {
            id: uuidv4(),
            user: event.results[last][0].transcript,
            bot: `The current temperature in ${city} is ${temperature} degrees Celsius. ${description}.`,
            createdAt: new Date().getTime(),
          };
          const messageDataRef = doc(colletionRef, dbMessages.id);
          await setDoc(messageDataRef, dbMessages);
          const updatedMessages = [
            ...messages,
            {
              id: uuidv4(),
              bot: `The current temperature in ${city} is ${temperature} degrees Celsius. ${description}.`,
              user: event.results[last][0].transcript,
            },
          ];

          setMessages(updatedMessages);
          return;
        } else {
          talk(
            "Sorry, I couldn't retrieve the weather information at the moment."
          );
          const dbMessages = {
            id: uuidv4(),
            user: event.results[last][0].transcript,
            bot: "Sorry, I couldn't retrieve the weather information at the moment.",
            createdAt: new Date().getTime(),
          };
          const messageDataRef = doc(colletionRef, dbMessages.id);
          await setDoc(messageDataRef, dbMessages);
          const updatedMessages = [
            ...messages,
            {
              id: uuidv4(),
              bot: "Sorry, I couldn't retrieve the weather information at the moment.",
              user: event.results[last][0].transcript,
            },
          ];

          setMessages(updatedMessages);
          return;
        }
      }
      const response = calculateResponse(event.results[last][0].transcript);

      console.log("pass 1: after response");

      console.log("done");
      // if (response.status !== 200) {
      //   throw new Error(`Error: ${response.statusText}`);
      // }
      console.log("resonse:", response);
      // const botResponse = responseData.bot;
      talk(response);

      const dbMessages = {
        id: uuidv4(),
        user: event.results[last][0].transcript,
        bot: response,
        createdAt: new Date().getTime(),
      };
      setTranscript(event.results[last][0].transcript);
      const messageDataRef = doc(colletionRef, dbMessages.id);
      await setDoc(messageDataRef, dbMessages);
      const updatedMessages = [
        ...messages,
        {
          id: uuidv4(),
          bot: response,
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
      // const response = await fetch("http://127.0.0.1:8000/botly", {
      // const response = await fetch("https://botly-backend.onrender.com/botly", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ text: newMessage }),
      //   mode: "cors",
      // });

      // const responseData = await response.json(); // Parse the JSON content
      if (
        ["play", "song", "sing"].some((keyword) => newMessage.includes(keyword))
      ) {
        const keyword = ["play", "song", "sing"].find((keyword) =>
          newMessage.includes(keyword)
        );
        const song = newMessage.replace(keyword, "").trim();

        talk(
          `Unfortunately, am not yet able to play ${song} for you. Am sorry.`
        );
        return;
      }
      if (
        ["time", "how are you by the sun"].some((keyword) =>
          newMessage.includes(keyword)
        )
      ) {
        const time = getTime();
        talk(`Current time is ${time}.`);
        const dbMessages = {
          id: uuidv4(),
          user: newMessage,
          bot: `Current time is ${time}.`,
          createdAt: new Date().getTime(),
        };
        const updatedMessages = [
          ...messages,
          { id: uuidv4(), bot: `Current time is ${time}.`, user: newMessage },
        ];
        const messageDataRef = doc(colletionRef, dbMessages.id);
        await setDoc(messageDataRef, dbMessages);
        setMessages(updatedMessages);
        setNewMessage("");

        return;
      }

      if (["date"].some((keyword) => newMessage.includes(keyword))) {
        const date = getDate();
        talk(`The date today is ${date}.`);
        const dbMessages = {
          id: uuidv4(),
          user: newMessage,
          bot: `The date today is ${date}.`,
          createdAt: new Date().getTime(),
        };
        const updatedMessages = [
          ...messages,
          { id: uuidv4(), bot: `The date today is ${date}.`, user: newMessage },
        ];
        const messageDataRef = doc(colletionRef, dbMessages.id);
        await setDoc(messageDataRef, dbMessages);
        setMessages(updatedMessages);
        setNewMessage("");

        return;
      }

      const keywords = [
        "idea",
        "describe",
        "outline",
        "state",
        "distinguish",
        "differentiate",
        "illustrate",
        "assess",
        "classify",
        "synthesize",
        "derive",
        "propose",
        "construct",
        "investigate",
        "validate",
        "synthesize",
        "propose",
        "argue",
        "justify",
        "types of",
        "examples",
        "determine",
        "search",
        "discuss",
        "define",
        "explain",
        "interprete",
        "elaborate",
        "who is",
        "who are",
        "what is",
        "what are",
        "where is",
        "how is",
        "how are",
        "which",
        "why",
        "when",
        "tell me about",
        "details on",
        "overview of",
        "history of",
        "background on",
        "compare",
        "contrast",
        "analyze",
        "evaluate",
        "assess",
        "critique",
        "explore",
        "examine",
        "summarize",
        "demonstrate",
      ];
      const forbiddenWords = [
        "name",
        "you",
        "me",
        "time",
        "date",
        "today",
        "my",
        "sister",
        "kennedy",
        "muhumuza",
        "emmanuella",
        "kopio",
        "timothy",
        "how are you",
        "vanessa",
        "vanesa",
        "noble",
        "kisembo",
        "santrina",
        "satrina",
        "latrina",
        "mummy",
        "daddy",
        "bed",
        "triza",
        "theresa",
        "brother",
        "kabamba",
        "natonda",
        "namitala",
        "teresa",
        "tereza",
        "kopio",
        "gift",
        "emmanuella",
        "kaducu",
        "lagen",
        "nasiima",
        "komugisa",
        "precious",
        "ninsiima",
        "timothy",
      ];

      if (
        keywords.some((keyword) =>
          newMessage.toLowerCase().includes(keyword)
        ) &&
        !forbiddenWords.some((forbiddenWord) =>
          newMessage.toLowerCase().includes(forbiddenWord)
        )
      ) {
        // const transcript = event.results[last][0].transcript.trim();
        // const transcript = event.results[last][0].transcript;

        if (newMessage) {
          searchWikiPedia(newMessage);
        }
        return;
      }

      if (
        ["news", "latest", "whats new", "headlines"].some((keyword) =>
          newMessage.includes(keyword)
        )
      ) {
        // const news = getNews();
        // talk(news);
        talk(
          "Sorry dear, am not yet able to tell you any news updates for now. But soon I shall be able to."
        );
        // const dbMessages = {
        //   id: uuidv4(),
        //   user: newMessage,
        //   bot: news,
        //   createdAt: new Date().getTime(),
        // };
        // const messageDataRef = doc(colletionRef, dbMessages.id);
        // await setDoc(messageDataRef, dbMessages);
        // const updatedMessages = [
        //   ...messages,
        //   {
        //     id: uuidv4(),
        //     bot: news,
        //     user: newMessage,
        //   },
        // ];

        // setMessages(updatedMessages);
        return;
      }

      if (newMessage.includes("calculate") || newMessage.includes("solve")) {
        const expression = newMessage.replace(/(calculate|solve)\s+/i, "");
        try {
          const result = eval(expression);

          const botResponse = `The result of the calculation is ${result}`;
          talk(botResponse);
          const dbMessages = {
            id: uuidv4(),
            user: newMessage,
            bot: botResponse,
            createdAt: new Date().getTime(),
          };
          const updatedMessages = [
            ...messages,
            { id: uuidv4(), bot: botResponse, user: newMessage },
          ];
          const messageDataRef = doc(colletionRef, dbMessages.id);
          await setDoc(messageDataRef, dbMessages);
          setMessages(updatedMessages);
          setNewMessage("");

          return;
        } catch (error) {
          talk(
            "Sorry, I couldn't perform the calculation. Please check your expression."
          );
          return;
        }
      }
      const response = calculateResponse(newMessage);

      console.log("done");
      // if (response.status !== 200) {
      //   throw new Error(`Error: ${response.statusText}`);
      // }
      console.log("resonse:", response);
      // const botResponse = responseData.bot;
      talk(response);
      const dbMessages = {
        id: uuidv4(),
        user: newMessage,
        bot: response,
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
        { id: uuidv4(), bot: response, user: newMessage },
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

  // const opts = {
  //   height: "390",
  //   width: "640",
  //   playerVars: {
  //     autoplay: 1,
  //   },
  //   origin: "*",
  //   // origin: window.location.origin, // Set the origin to the current window's origin
  // };

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
                  <>
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
                        <span className={styles["bot-msg"]}>
                          {message?.bot}
                        </span>
                        <span className={styles["time"]}>
                          {convertIsoStringToCustomFormat(message?.createdAt)}
                        </span>
                        {/* <span>{botResponse}</span> */}
                      </div>
                    </div>
                  </>
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
                  <>
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
                        <span className={styles["bot-msg"]}>
                          {message?.bot}
                        </span>
                        <span className={styles["time"]}>
                          {convertIsoStringToCustomFormat(message?.createdAt)}
                        </span>
                        {/* <span>{botResponse}</span> */}
                      </div>
                    </div>
                  </>
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
