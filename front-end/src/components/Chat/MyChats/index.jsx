import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import { chatService } from "../../../services/chatService";
import { HiPlus } from "react-icons/hi";
import Loading from "../../../Pages/common/Loading";
import { getSender } from "../../../utils/ChatLogic";
import GroupChatModal from "../GroupChatModal";
import io from "socket.io-client";
import { authService } from "services/authSerivce";
import Config from "config";
import { HiOutlineUserGroup } from "react-icons/hi";

let socket;

const MyChats = (props) => {
  const { fetchChat, setFetchChat } = props;

  const [loggedUser, setLoggedUser] = useState();
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const listDataChat = await chatService.fetchChats();
      if (listDataChat) {
        setChats(listDataChat.data);
      }
    } catch (error) {
      toast({
        title: "Get List Data Chat Failed",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    socket = io(Config.apiUrl);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      authService.getUser().then((user) => {
        setLoggedUser(user.data);
        fetchChats();
      });
    }
  }, [fetchChat]);

  useEffect(() => {
    // HANDLE GROUP FETCH CHAT

    socket.on("CreateGroup", (UserGroupNew) => {
      UserGroupNew.users.forEach((userItem) => {
        if (userItem._id === user._id) {
          setFetchChat(!fetchChat);
        }
      });
    });

    socket.on("UpdateGroupName", (GroupChatNameNew) => {
      GroupChatNameNew.users.forEach((userItem) => {
        if (userItem._id === user._id) {
          setFetchChat(!fetchChat);
        }
      });
    });

    socket.on("UpdateGroupUser", (GroupChatUserNew) => {
      if (typeof GroupChatUserNew === "object") {
        // UPDATE ADD USER NEW TO GROUP
        GroupChatUserNew?.users?.forEach((userItem) => {
          if (userItem._id === user._id) {
            setFetchChat(!fetchChat);
          }
        });
        // UPDATE DELETE USER FROM GROUP
      } else {
        if (GroupChatUserNew === user._id) {
          setFetchChat(!fetchChat);
        }
      }
    });

    // CHECK LASTEST MESSAGE
    socket.on("check latestMessage", (ListUserInGroup) => {
      ListUserInGroup.forEach((u) => {
        if (u._id === user._id) {
          setFetchChat(!fetchChat);
        }
      });
    });
  });

  const handleSelectedChat = (chat) => {
    setSelectedChat(chat);
    setNotification(
      notification.filter((notif) => notif.chat._id !== chat._id)
    );
  };

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        w="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        fontSize={{ base: "20px", md: "24px" }}
      >
        <Text fontWeight="500" colorScheme="teal">
          My Message
        </Text>
        <GroupChatModal setFetchChat={setFetchChat} fetchChat={fetchChat}>
          <Button>
            New Group Chat
            <HiPlus />
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => handleSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat?._id === chat?._id ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat?._id === chat?._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat?._id}
              >
                <Text>
                  {!chat.isGroupChat ? (
                    getSender(loggedUser, chat.users)
                  ) : (
                    <span className="name-group">
                      {chat.chatName}
                      <HiOutlineUserGroup
                        style={{
                          display: "inline-block",
                          fontSize: 20,
                          marginLeft: 3,
                        }}
                      />
                    </span>
                  )}
                </Text>
                {chat?.lastestMessage && (
                  <Text fontSize="14px">
                    <b>{chat.lastestMessage.sender.name} : </b>
                    {chat.lastestMessage.content.length > 50
                      ? chat.lastestMessage.content.substring(0, 51) + "..."
                      : chat.lastestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <Loading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
