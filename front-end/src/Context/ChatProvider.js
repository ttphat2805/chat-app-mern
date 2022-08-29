import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "services/authSerivce";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    // const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (token) {
      authService.getUser().then((user) => {
        setUser(user.data);
        if (!user.data) {
          navigate("/");
        }
      });
    }
  }, [navigate]);

  let value = {
    user,
    setUser,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
