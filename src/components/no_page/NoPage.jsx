import { Link } from "react-router-dom";
import styles from "./NoPage.module.css";
import bot from "/aipic.jpg";
import { useState } from "react";

export const NoPage = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  return (
    <div>
      <section className={styles["home_header"]}>
        <span className={styles["header_img_container"]}>
          <img src={bot} className={styles["header_bot_img"]} />
          <p className={styles["welcome_msg"]}>
            So sad, your here😔
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
      <p>⛔ Opps! It seems there is nothing on this page buddy.</p>
    </div>
  );
};
