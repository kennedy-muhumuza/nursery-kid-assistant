import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./chat/Chat";
import "./App.css";
import { Home } from "./components/home/Home";
import { NoPage } from "./components/no_page/NoPage";
import { Gallery } from "./components/gallery/Gallery";
import { Videos } from "./components/videos/Videos";
import { Landing } from "./components/landing/Landing";

// import { Chatbot } from "./Chatbot/Chatbot";
// import Transcript from "./Transcript/Transcript";
// netlify deploy --prod
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
