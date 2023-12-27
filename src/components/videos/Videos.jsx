import { useState } from "react";
import styles from "./Videos.module.css";
import { Link } from "react-router-dom";
import bot from "/aipic.jpg";

export const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const videoList = [
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
      {selectedVideo ? (
        <div className={styles["video_play_container"]}>
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
        <h4 className={styles["enjoy_msg"]}>
          Your Animation video will play here. <br />
          Enjoy 🎉
        </h4>
      )}
      <div className={styles["video_container"]}>
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
      <p className={styles["enjoy_msg_bottom"]}>
        {videoList.length} Cute & Educative Videos in total.
      </p>
    </div>
  );
};
