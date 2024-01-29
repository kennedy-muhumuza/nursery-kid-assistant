import { useState } from "react";
import styles from "./Videos.module.css";
import bot from "/aipic.jpg";
import { useNavigate } from "react-router-dom";

export const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();

  const videoList = [
    { id: 25, title: "Colors", src: "/1an.mp4" },
    { id: 26, title: "Dance", src: "/1dance.mp4" },
    { id: 27, title: "Dance2", src: "/2an.mp4" },
    { id: 28, title: "Cry", src: "/3an.mp4" },
    { id: 29, title: "Kodi", src: "/4an.mp4" },
    { id: 30, title: "Chipmunks", src: "/al1.mp4" },
    { id: 31, title: "snacks", src: "/al2.mp4" },
    { id: 32, title: "Alvin", src: "/al3.mp4" },
    { id: 33, title: "Concert", src: "/al4.mp4" },
    { id: 34, title: "Mango", src: "/al5.mp4" },
    { id: 35, title: "Water", src: "/al6.mp4" },
    { id: 36, title: "Plane", src: "/al7.mp4" },
    { id: 37, title: "Wood", src: "/al8.mp4" },
    { id: 38, title: "Compete", src: "/al9.mp4" },
    { id: 39, title: "Stars", src: "/al10.mp4" },
    { id: 40, title: "Smart", src: "/al11.mp4" },
    { id: 41, title: "Cage", src: "/al12.mp4" },
    { id: 42, title: "Sing", src: "/al13.mp4" },
    { id: 1, title: "Pepe", src: "/an1.mp4" },
    { id: 2, title: "Cat", src: "/an2.mp4" },
    { id: 3, title: "Snowy", src: "/an3.mp4" },
    { id: 4, title: "Fish", src: "/an4.mp4" },
    { id: 5, title: "Shoes", src: "/an5.mp4" },
    { id: 6, title: "Toy", src: "/an6.mp4" },
    { id: 7, title: "My fav", src: "/an7.mp4" },
    { id: 8, title: "Finger", src: "/an8.mp4" },
    { id: 9, title: "Good night", src: "/an9.mp4" },
    { id: 10, title: "Sorry", src: "/an10.mp4" },
    { id: 11, title: "Rainy", src: "/an11.mp4" },
    { id: 12, title: "Bus", src: "/an12.mp4" },
    { id: 13, title: "Bike", src: "/an13.mp4" },
    { id: 14, title: "Spider", src: "/an14.mp4" },
    { id: 15, title: "Rain", src: "/an15.mp4" },
    { id: 16, title: "Monkey", src: "/an16.mp4" },
    { id: 17, title: "Knock", src: "/an17.mp4" },
    { id: 18, title: "Pepe2", src: "/an18.mp4" },
    { id: 19, title: "Laugh", src: "/an19.mp4" },
    { id: 20, title: "Buses", src: "/an20.mp4" },
    { id: 21, title: "You", src: "/an21.mp4" },
    { id: 22, title: "Scared", src: "/an22.mp4" },
    { id: 23, title: "Twinkle", src: "/an23.mp4" },
    { id: 24, title: "Beats", src: "/an24.mp4" },
  ];

  const playVideo = (video) => {
    // Check if the selected video is the same as the one currently playing
    if (selectedVideo && selectedVideo.id === video.id) {
      // If it is, cancel the video by setting selectedVideo to null
      setSelectedVideo(null);
    } else {
      // Otherwise, play the selected video
      setSelectedVideo(video);
    }
  };
  return (
    <div className={styles["main_container"]}>
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
      {selectedVideo ? (
        <div
          className={styles["video_play_container"]}
          onClick={() => setDropdownVisible(false)}
        >
          <h2
            onClick={() => playVideo(selectedVideo)}
            className={styles["video_title"]}
          >
            {selectedVideo.title} (Tap to Cancel)
          </h2>

          <video
            key={selectedVideo.id}
            controls
            autoPlay
            className={styles["video_playing"]}
            // width="640"
            // height="360"
          >
            <source src={selectedVideo.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <h4
          className={styles["enjoy_msg"]}
          onClick={() => setDropdownVisible(false)}
        >
          Your Animation video will play here. <br />
          Enjoy 🎉
        </h4>
      )}
      <div
        className={styles["video_container"]}
        onClick={() => setDropdownVisible(false)}
      >
        {videoList.map((video) => (
          <div
            key={video.id}
            onClick={() => playVideo(video)}
            className={`${styles["video_item"]} ${
              selectedVideo && selectedVideo.id === video.id && styles["active"]
            }`}
          >
            {video.title}
          </div>
        ))}
      </div>
      <p
        className={styles["enjoy_msg_bottom"]}
        onClick={() => setDropdownVisible(false)}
      >
        {videoList.length} Cute & Educative Videos in total.
      </p>
    </div>
  );
};
