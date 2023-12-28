import styles from "./Gallery.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bot from "/aipic.jpg";

export const Gallery = () => {
  const [activeImage, setActiveImage] = useState("img/bg1.jpg");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const image = [
    "img/bg1.jpg",
    "img/bg2.jpg",
    "img/bg3.jpg",
    "img/bg4.jpg",
    "img/bg5.jpg",
    "img/bg6.jpg",
    "img/bg7.jpg",
    "img/bg8.jpg",
    "img/bg9.jpg",
    "img/bg10.jpg",
    "img/bg11.jpg",
    "img/bg12.jpg",
    "img/bg13.jpg",
    "img/bg14.jpg",
    "img/bg15.jpg",
    "img/bg16.jpg",
    "img/bg17.jpg",
    "img/bg18.jpg",
    "img/bg19.jpg",
    "img/bg20.jpg",
    "img/bg21.jpg",
    "img/bg22.jpg",
    "img/bg23.jpg",
    "img/bg24.jpg",
    "img/bg25.jpg",
    "img/bg26.jpg",
    "img/bg27.jpg",
    "img/bg28.jpg",
    "img/bg29.jpg",
    "img/bg30.jpg",
  ];

  const index = image.indexOf(activeImage);
  const navigate = useNavigate();

  const handleNext = () => {
    const next = (index + 1) % image.length;
    setActiveImage(image[next]);
  };
  const handlePrev = () => {
    const prev = (index - 1 + image.length) % image.length;
    setActiveImage(image[prev]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const currentIndex = image.indexOf(activeImage);

      const nextIndex = (currentIndex + 1) % image.length;

      setActiveImage(image[nextIndex]);
    }, 1500);

    return () => clearInterval(timer);
  }, [activeImage, image]);
  return (
    <>
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
      <div
        className={styles["container"]}
        onClick={() => setDropdownVisible(false)}
      >
        <div className={styles["background"]}>
          <img
            src={activeImage}
            className={`${styles["bg"]} ${styles["show"]}`}
            alt="Background 2"
          />
        </div>
        <div className={styles["slider-container"]}>
          <div className={styles["img"]} id={styles["first"]}>
            <img
              src={activeImage}
              alt="Slider Image 5"
              className={styles["slider_img"]}
            />
          </div>
        </div>
        <div className={styles["content"]}>
          <button
            className={styles["btn"]}
            id={styles["prev"]}
            onClick={handlePrev}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            className={styles["btn"]}
            id={styles["next"]}
            onClick={handleNext}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <ul className={styles["option_container"]}>
            <li
              onClick={() => setActiveImage(() => image[0])}
              className={`${styles["option"]} ${
                activeImage === image[0] && styles["colored"]
              }`}
              data-op-index="0"
            ></li>

            <li
              onClick={() => setActiveImage(() => image[1])}
              className={`${styles["option"]} ${
                activeImage === image[1] && styles["colored"]
              }`}
              data-op-index="1"
            ></li>
            <li
              onClick={() => setActiveImage(() => image[2])}
              className={`${styles["option"]} ${
                activeImage === image[2] && styles["colored"]
              }`}
              data-op-index="2"
            ></li>
            <li
              onClick={() => setActiveImage(() => image[3])}
              className={`${styles["option"]} ${
                activeImage === image[3] && styles["colored"]
              }`}
              data-op-index="3"
            ></li>
            <li
              onClick={() => setActiveImage(() => image[4])}
              className={`${styles["option"]} ${
                activeImage === image[4] && styles["colored"]
              }`}
              data-op-index="4"
            ></li>
          </ul>
        </div>
      </div>
    </>
  );
};
