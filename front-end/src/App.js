import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChatPage from "./Pages/ChatPage";
import NotFound from "./Pages/common/NotFound";
import HomePage from "./Pages/HomePage";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
