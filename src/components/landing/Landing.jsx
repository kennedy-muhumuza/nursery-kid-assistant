import styles from "./Landing.module.css";
import botly from "/bot-no-bg.png";
import { TiNews } from "react-icons/ti";
import { FaUserFriends } from "react-icons/fa";
import { FaBook } from "react-icons/fa6";
import { ImMusic } from "react-icons/im";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { CgWebsite } from "react-icons/cg";
import { TbMath } from "react-icons/tb";
import { GiCardJoker } from "react-icons/gi";
import { MdAutoStories } from "react-icons/md";
import { MdFactCheck } from "react-icons/md";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Landing = () => {
  const [activeCard, setActiveCard] = useState("chat");

  const cards = ["chat", "internet", "friend", "math"];

  const handleDotClick = (card) => {
    setActiveCard(() => card);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      const currentIndex = cards.indexOf(activeCard);

      const nextIndex = (currentIndex + 1) % cards.length;

      setActiveCard(cards[nextIndex]);
    }, 2500);

    return () => clearInterval(timer);
  }, [activeCard, cards]);
  return (
    <div className={styles["landing_container"]}>
      <div className={styles["bot_introduction"]}>
        <p className={styles["bot_header"]}>
          Hello there! <br />
          I&apos;m Noble&apos;s Botly
        </p>
        <img src={botly} alt="bot picture" className={styles["bot_image"]} />
        <h4 className={styles["heading"]}>
          Your <b className={styles["highlight"]}>Intelligent Chat</b>
          <br /> companion
        </h4>
        <div className={styles["slider_container"]}>
          {activeCard === "chat" && (
            <span className={styles["slider_card"]}>
              <b className={styles["card_highlight"]}>Instant Chat Responses</b>{" "}
              <ul className={styles["card_msg"]}>
                <li>
                  <TiNews /> &nbsp;Trending news updates
                </li>
                <li>
                  <FaUserFriends /> &nbsp;Friendly conversations
                </li>
                <li>
                  <FaBook /> &nbsp;Context knowledge
                </li>
              </ul>
            </span>
          )}

          {activeCard === "internet" && (
            <span className={styles["slider_card"]}>
              <b className={styles["card_highlight"]}>Realtime Internet</b>{" "}
              <ul className={styles["card_msg"]}>
                <li>
                  <ImMusic /> &nbsp;Instant music access
                </li>
                <li>
                  <TiNews /> &nbsp;Latest news updates
                </li>
                <li>
                  <TiWeatherPartlySunny /> &nbsp;Weather status
                </li>
              </ul>
            </span>
          )}

          {activeCard === "math" && (
            <span className={styles["slider_card"]}>
              <b className={styles["card_highlight"]}>
                Multifunctional Capabilities
              </b>{" "}
              <ul className={styles["card_msg"]}>
                <li>
                  <CgWebsite /> &nbsp;Oral website access
                </li>
                <li>
                  <TbMath /> &nbsp;Math computations
                </li>
              </ul>
            </span>
          )}
          {activeCard === "friend" && (
            <span className={styles["slider_card"]}>
              <b className={styles["card_highlight"]}>Companionship</b>{" "}
              <ul className={styles["card_msg"]}>
                <li>
                  <GiCardJoker /> &nbsp;Random Jokes
                </li>
                <li>
                  <MdAutoStories /> &nbsp;Random Stories
                </li>
                <li>
                  <MdFactCheck /> &nbsp;Random facts
                </li>
              </ul>
            </span>
          )}
        </div>
        <div className={styles["progress_dots_container"]}>
          <div className={styles["progress_dots"]}>
            <span
              className={`${styles["dot"]} ${
                activeCard === "chat" && styles["active"]
              }`}
              onClick={() => handleDotClick("chat")}
            ></span>

            <span
              className={`${styles["dot"]} ${
                activeCard === "internet" && styles["active"]
              }`}
              onClick={() => handleDotClick("internet")}
            ></span>
            <span
              className={`${styles["dot"]} ${
                activeCard === "friend" && styles["active"]
              }`}
              onClick={() => handleDotClick("friend")}
            ></span>
            <span
              className={`${styles["dot"]} ${
                activeCard === "math" && styles["active"]
              }`}
              onClick={() => handleDotClick("math")}
            ></span>
          </div>
        </div>
      </div>
      <button className={styles["start_btn"]}>
        <Link to="home" className={styles["start_btn_link"]}>
          Get started
        </Link>
      </button>
      <span className={styles["bottom_border"]}></span>
    </div>
  );
};
