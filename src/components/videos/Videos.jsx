import { useState } from "react";

export const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoList = [
    { id: 1, title: "Cartoon 1", src: "/an1.mp4" },
    { id: 2, title: "Cartoon 2", src: "/an2.mp4" },
    { id: 3, title: "Cartoon 3", src: "/an3.mp4" },
    { id: 4, title: "Cartoon 4", src: "/an4.mp4" },
    { id: 5, title: "Cartoon 5", src: "/an5.mp4" },
    { id: 6, title: "Cartoon 6", src: "/an6.mp4" },
    { id: 7, title: "Cartoon 7", src: "/an7.mp4" },
    { id: 8, title: "Cartoon 8", src: "/an8.mp4" },
    { id: 9, title: "Cartoon 9", src: "/an9.mp4" },
    { id: 10, title: "Cartoon 10", src: "/an10.mp4" },
    { id: 11, title: "Cartoon 11", src: "/an11.mp4" },
    { id: 12, title: "Cartoon 12", src: "/an12.mp4" },
    { id: 13, title: "Cartoon 13", src: "/an13.mp4" },
  ];
  // const playVideo = (video) => {
  //   setSelectedVideo(video);
  // };
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
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {videoList.map((video) => (
          <div key={video.id} onClick={() => playVideo(video)}>
            {video.title}
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div>
          <h2>{selectedVideo.title}</h2>
          <div>
            <video
              key={selectedVideo.id}
              controls
              autoPlay
              // width="640"
              // height="360"
            >
              <source src={selectedVideo.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};
