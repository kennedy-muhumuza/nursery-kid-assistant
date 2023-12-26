import styles from "./Gallery.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export const Gallery = () => {
  const [activeImage, setActiveImage] = useState("img/bg1.jpg");
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
      <div className={styles["container"]}>
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
