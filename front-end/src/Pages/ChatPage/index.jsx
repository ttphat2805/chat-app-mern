import { Box } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import ChatBox from "../../components/Chat/ChatBox";
import MyChats from "../../components/Chat/MyChats";
import { SideDrawer } from "../../components/Chat/SideDrawer";
import { ChatState } from "../../Context/ChatProvider";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchChat, setFetchChat] = useState(false);
  return (
    <div className="chat-page">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchChat={fetchChat} setFetchChat={setFetchChat} />}
        {user && <ChatBox fetchChat={fetchChat} setFetchChat={setFetchChat} />}
      </Box>
    </div>
  );
};

export default ChatPage;
