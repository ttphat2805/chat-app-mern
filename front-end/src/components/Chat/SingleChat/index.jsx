import {
  Box,
  FormControl,
  IconButton,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import ScrollAbleChat from "components/User/ScrollAbleChat";
import Loading from "Pages/common/Loading";
import React, { useEffect, useState } from "react";
import { IoIosEye } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { messageSerive } from "services/messageService";
import { ChatState } from "../../../Context/ChatProvider";
import { getSender, getSenderFull } from "../../../utils/ChatLogic";
import ProfileModal from "../ProfileModal";
import UpdateGroupChatModal from "../UpdateGroupChatModal";
import io from "socket.io-client";
import Lottie from "react-lottie";
import "./style.css";
import Config from "config";
import animationData from "../../../utils/typingAnimate/typing.json";
let socket, selectedChatCompare;

const SingleChat = (props) => {
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const { fetchChat, setFetchChat } = props;
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    socket = io(Config.apiUrl);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    // typing

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      let newDataMessage = await messageSerive.fetchMessages(selectedChat._id);
      if (newDataMessage) {
        setMessage(newDataMessage.data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Get Message",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // Check User Chatting, ! && Give noti
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchChat(!fetchChat);
        }
      } else {
        setMessage([...message, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        let dataPost = {
          content: newMessage,
          chatId: selectedChat._id,
        };

        setNewMessage("");
        const dataMessage = await messageSerive.sendMessage(dataPost);
        if (dataMessage) {
          socket.emit("send new message", dataMessage.data);
          setMessage([...message, dataMessage.data]);
        }
      } catch (error) {
        toast({
          title: "Error Send Message",
          status: "error",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const typingHandler = (e) => {
    let { value } = e.target;
    setNewMessage(value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      // the time the user is not typing
      let timeNotTyping = timeNow - lastTypingTime;

      if (timeNotTyping >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {/* Icon Back Mobile */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<IoArrowBackOutline />}
              onClick={() => setSelectedChat("")}
            />
            {/* Name Chat || Group Name Chat */}
            {!selectedChat.isGroupChat ? (
              <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                alignItems="center"
              >
                <h3 style={{ marginLeft: "10px" }}>
                  {getSender(user, selectedChat.users)}
                </h3>
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <IconButton icon={<IoIosEye />} />
                </ProfileModal>
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="space-between"
                w="100%"
                alignItems="center"
              >
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchChat={fetchChat}
                  setFetchChat={setFetchChat}
                  fetchMessages={fetchMessages}
                />
              </Box>
            )}
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                h="100%"
                alignItems="center"
              >
                <Loading />
              </Box>
            ) : (
              <div className="messages">
                <ScrollAbleChat message={message} />
              </div>
            )}
          </Box>
          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            ) : (
              <></>
            )}
            <Input
              variant="filled"
              py={5}
              bg="#E0E0E0"
              placeholder="Enter a message..."
              onChange={typingHandler}
              value={newMessage || ""}
            />
          </FormControl>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chat
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
