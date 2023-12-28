import botly from "/download.png";
import bot from "/aipic.jpg";
import styles from "./Home.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();

  return (
    <div className={styles["home_container"]}>
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
              onClick={() => navigate("/")}
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

            <span
              className={styles["dropdown-link"]}
              onClick={() => navigate("/chat")}
            >
              <svg
                viewBox="0 0 640 512"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M320 0c17.7 0 32 14.3 32 32v64h128c35.3 0 64 28.7 64 64v288c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h128V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32zM264 256c0-22.1-17.9-40-40-40s-40 17.9-40 40 17.9 40 40 40 40-17.9 40-40zm152 40c22.1 0 40-17.9 40-40s-17.9-40-40-40-40 17.9-40 40 17.9 40 40 40zM48 224h16v192H48c-26.5 0-48-21.5-48-48v-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48h-16V224h16z" />
              </svg>
              <span>Botly Chat</span>
            </span>
          </div>
        )}
      </section>
      <section
        className={styles["bot_description_container"]}
        onClick={() => setDropdownVisible(false)}
      >
        <div className={styles["bot_description"]}>
          <div>
            <h1 className={styles["chat_heading"]}>Family Bot</h1>
            <p className={styles["chat_msg"]}>
              Begin your exciting journey of chatting with and even commanding
              Botly, your AI assistant. Dedicated to Noble.
            </p>
            {/* <Link to="/chat"> */}
            <button
              className={styles["start_btn"]}
              onClick={() => navigate("/chat")}
            >
              Get Started
            </button>
            {/* </Link> */}
          </div>
          <img src={botly} alt="bot_picture" className={styles["botly_img"]} />
        </div>
      </section>
      <section
        className={styles["explore_section"]}
        onClick={() => setDropdownVisible(false)}
      >
        <h1 className={styles["explore_heading"]}>Explore</h1>
      </section>
      <section
        className={styles["tab_section"]}
        onClick={() => setDropdownVisible(false)}
      >
        <span
          className={`${styles["tab_option"]} ${
            activeTab === "all" && styles["active"]
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </span>
        <span
          className={`${styles["tab_option"]} ${
            activeTab === "images" && styles["active"]
          }`}
          onClick={() => setActiveTab("images")}
        >
          Images
        </span>
        <span
          className={`${styles["tab_option"]} ${
            activeTab === "videos" && styles["active"]
          }`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </span>
        <span
          className={`${styles["tab_option"]} ${
            activeTab === "chat" && styles["active"]
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </span>
      </section>
      <section
        className={styles["tab_content_container"]}
        onClick={() => setDropdownVisible(false)}
      >
        {activeTab === "all" && (
          <div className={styles["all_container"]}>
            <div className={styles["all_card"]}>
              <div className={styles["all_icon"]}>
                <svg
                  viewBox="0 0 640 512"
                  fill="currentColor"
                  height="2em"
                  width="2em"
                  // {...props}
                >
                  <path d="M320 0c17.7 0 32 14.3 32 32v64h128c35.3 0 64 28.7 64 64v288c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h128V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32zM264 256c0-22.1-17.9-40-40-40s-40 17.9-40 40 17.9 40 40 40 40-17.9 40-40zm152 40c22.1 0 40-17.9 40-40s-17.9-40-40-40-40 17.9-40 40 17.9 40 40 40zM48 224h16v192H48c-26.5 0-48-21.5-48-48v-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48h-16V224h16z" />
                </svg>
              </div>
              <h3 className={styles["all_header"]}>Intelligent Chats</h3>
              <p className={styles["all_msg"]}>
                Chat with Botly, an AI assistant that responds both with words
                and action
              </p>
              <Link to="/chat" className={styles["all_link"]}>
                Click here
              </Link>
            </div>
            <div className={styles["all_card"]}>
              <div className={styles["all_icon"]}>
                <svg
                  viewBox="0 0 512 512"
                  fill="currentColor"
                  height="2em"
                  width="2em"
                >
                  <path d="M450.29 112H142c-34 0-62 27.51-62 61.33v245.34c0 33.82 28 61.33 62 61.33h308c34 0 62-26.18 62-60V173.33c0-33.82-27.68-61.33-61.71-61.33zm-77.15 61.34a46 46 0 11-46.28 46 46.19 46.19 0 0146.28-46.01zm-231.55 276c-17 0-29.86-13.75-29.86-30.66v-64.83l90.46-80.79a46.54 46.54 0 0163.44 1.83L328.27 337l-113 112.33zM480 418.67a30.67 30.67 0 01-30.71 30.66H259L376.08 333a46.24 46.24 0 0159.44-.16L480 370.59z" />
                  <path d="M384 32H64A64 64 0 000 96v256a64.11 64.11 0 0048 62V152a72 72 0 0172-72h326a64.11 64.11 0 00-62-48z" />
                </svg>
              </div>
              <h3 className={styles["all_header"]}>Family Gallery</h3>
              <p className={styles["all_msg"]}>
                Explore an interesting collection of Kenny&apos;s lousy moments,
                Noble, Timothy, Mummy and Vanny
              </p>
              <Link to="/gallery" className={styles["all_link"]}>
                Click here
              </Link>
            </div>
            <div className={styles["all_card"]}>
              <div className={styles["all_icon"]}>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="2em"
                  width="2em"
                >
                  <path d="M4 8H2v12a2 2 0 002 2h12v-2H4z" />
                  <path d="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm-9 12V6l7 4z" />
                </svg>
              </div>
              <h3 className={styles["all_header"]}>Noble&apos;s Animations</h3>
              <p className={styles["all_msg"]}>
                You wont regret watching these with your kid as they make
                learning for the kid so much fun. First Click plays video while
                second click on same video cancels it.
              </p>
              <Link to="/videos" className={styles["all_link"]}>
                Click here
              </Link>
            </div>
            <div className={styles["all_card"]}>
              <div className={styles["all_icon"]}>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="2em"
                  width="2em"
                >
                  <path d="M22.081.61v7.566h-7.223v6.661H7.566v6.634H0v1.92h9.471v-6.649h7.306v-6.66H24V.61z" />
                </svg>
              </div>
              <h3 className={styles["all_header"]}>Future Goals</h3>
              <p className={styles["all_msg"]}>
                The developer intends to add a section of fun and educative
                games both for kids and adults as well as advancing Botly&apos;s
                AI capabilities still further.
              </p>
              <Link to="/videos" className={styles["all_link"]}>
                Click here
              </Link>
            </div>
          </div>
        )}
        {activeTab === "images" && (
          <div className={styles["all_cards"]}>
            <div className={styles["all_icon"]}>
              <svg
                viewBox="0 0 512 512"
                fill="currentColor"
                height="2em"
                width="2em"
              >
                <path d="M450.29 112H142c-34 0-62 27.51-62 61.33v245.34c0 33.82 28 61.33 62 61.33h308c34 0 62-26.18 62-60V173.33c0-33.82-27.68-61.33-61.71-61.33zm-77.15 61.34a46 46 0 11-46.28 46 46.19 46.19 0 0146.28-46.01zm-231.55 276c-17 0-29.86-13.75-29.86-30.66v-64.83l90.46-80.79a46.54 46.54 0 0163.44 1.83L328.27 337l-113 112.33zM480 418.67a30.67 30.67 0 01-30.71 30.66H259L376.08 333a46.24 46.24 0 0159.44-.16L480 370.59z" />
                <path d="M384 32H64A64 64 0 000 96v256a64.11 64.11 0 0048 62V152a72 72 0 0172-72h326a64.11 64.11 0 00-62-48z" />
              </svg>
            </div>
            <h3 className={styles["all_header"]}>Family Gallery</h3>
            <p className={styles["all_msg"]}>
              Explore an interesting collection of Kenny&apos;s lousy moments,
              Noble, Timothy, Mummy and Vanny
            </p>
            <Link to="/gallery" className={styles["all_link"]}>
              Click here
            </Link>
          </div>
        )}
        {activeTab === "videos" && (
          <div className={styles["all_cards"]}>
            <div className={styles["all_icon"]}>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="2em"
                width="2em"
              >
                <path d="M4 8H2v12a2 2 0 002 2h12v-2H4z" />
                <path d="M20 2H8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2zm-9 12V6l7 4z" />
              </svg>
            </div>
            <h3 className={styles["all_header"]}>Noble&apos;s Animations</h3>
            <p className={styles["all_msg"]}>
              You wont regret watching these with your kid as they make learning
              for the kid so much fun. First Click plays video while second
              click on same video cancels it.
            </p>
            <Link to="/videos" className={styles["all_link"]}>
              Click here
            </Link>
          </div>
        )}
        {activeTab === "chat" && (
          <div className={styles["all_cards"]}>
            <div className={styles["all_icon"]}>
              <svg
                viewBox="0 0 640 512"
                fill="currentColor"
                height="2em"
                width="2em"
                // {...props}
              >
                <path d="M320 0c17.7 0 32 14.3 32 32v64h128c35.3 0 64 28.7 64 64v288c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h128V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16h-32zM264 256c0-22.1-17.9-40-40-40s-40 17.9-40 40 17.9 40 40 40 40-17.9 40-40zm152 40c22.1 0 40-17.9 40-40s-17.9-40-40-40-40 17.9-40 40 17.9 40 40 40zM48 224h16v192H48c-26.5 0-48-21.5-48-48v-96c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48h-16V224h16z" />
              </svg>
            </div>
            <h3 className={styles["all_header"]}>Intelligent Chats</h3>
            <p className={styles["all_msg"]}>
              Chat with Botly, an AI assistant that responds both with words and
              action
            </p>
            <Link to="/chat" className={styles["all_link"]}>
              Click here
            </Link>
          </div>
        )}
      </section>
      <footer className={styles["footer_msg"]}>
        &copy; 2023 JohnKennedy. All Rights Reserved.
      </footer>
      {/* <img src={botly} alt="bot picture" className={styles["bot-img"]} /> */}
    </div>
  );
};
