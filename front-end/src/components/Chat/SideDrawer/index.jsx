import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import NotificationBadge from "react-notification-badge";
import { useNavigate } from "react-router-dom";
import { getSender } from "utils/ChatLogic";
import { ChatState } from "../../../Context/ChatProvider";
import SearchLoading from "../../../Pages/common/SearchLoading";
import { authService } from "../../../services/authSerivce";
import { chatService } from "../../../services/chatService";
import UserListItem from "../../User/UserListItem";
import ProfileModal from "../ProfileModal";
import "./style.css";
export const SideDrawer = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const [search, setSearch] = useState();
  const [dataUsers, setDataUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const toast = useToast();

  const Navigate = useNavigate();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    Navigate("/");
  };

  const SearchHandler = async () => {
    if (!search) {
      toast({
        title: "Please Enter text in search",
        status: "warning",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    }

    try {
      setLoading(true);
      const data = await authService.search(search);
      if (data) {
        setDataUsers(data.data);
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const searchHandlerEnter = (e) => {
    if (e.key === "Enter") {
      SearchHandler();
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      let dataAccessChat = await chatService.accessChat({ userId });
      if (dataAccessChat) {
        dataAccessChat = dataAccessChat.data;
        setSelectedChat(dataAccessChat);
        // Check user exist chat
        if (!chats.find((userChat) => userChat._id === dataAccessChat._id)) {
          let newDataChat = [dataAccessChat, ...chats];
          setChats(newDataChat);
        }
      }

      setTimeout(() => {
        setLoadingChat(false);
      }, 500);
      onClose();
    } catch (error) {
      toast({
        title: "Error Access Chat Failed",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSelectedChatNotif = (chat) => {
    if (chats.length === 0) {
      toast({
        title: "Message not exist or has been removed",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else {
      let isFlag = chats.some((chatItem) => chatItem._id === chat._id);
      if (isFlag) {
        setSelectedChat(chat);
      } else {
        setSelectedChat();
        toast({
          title: "Message not exist or has been removed",
          status: "error",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <div className="search">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
        borderColor="#fff"
      >
        <Tooltip label="Search Users to Chat" hasArrow>
          <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
            <BsSearch style={{ marginRight: 10 }} />
            <Text display={{ base: "none", md: "flex" }} px="4px">
              Search Here !
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontWeight={500}>
          MERN Chat App
        </Text>
        <div className="menu-right">
          <Menu>
            <MenuButton p={1} marginRight={2}>
              <NotificationBadge count={notification.length} />
              <FaRegBell fontSize="20px" />
            </MenuButton>
            <MenuList>
              <MenuItem>{!notification.length && "No New Messages"}</MenuItem>
              {notification.map((noti) => (
                <MenuItem
                  key={noti._id}
                  onClick={() => {
                    handleSelectedChatNotif(noti.chat);
                    setNotification(
                      notification.filter(
                        (notif) => notif.chat._id !== noti.chat._id
                      )
                    );
                  }}
                >
                  {noti.chat.isGroupChat ? (
                    <>
                      {`New Messages from group`}
                      <b style={{ marginLeft: 5 }}> {noti.chat.chatName}</b>
                    </>
                  ) : (
                    <>
                      {`New Messages from`}
                      <b style={{ marginLeft: 5 }}>
                        {getSender(user, noti.chat.users)}
                      </b>
                    </>
                  )}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} p={3}>
              <Avatar
                size="md"
                cursor="pointer"
                src={user.avatar}
                name={user?.name}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>
                  My Profile
                  <CgProfile fontSize={22} style={{ marginLeft: 10 }} />
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>
                Log out
                <TbLogout fontSize={22} style={{ marginLeft: 10 }} />
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                onKeyDown={searchHandlerEnter}
                placeholder="Search by name or email"
                mr={2}
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={SearchHandler}>
                <BsSearch fontSize={20} />
              </Button>
            </Box>
            {loading ? (
              <SearchLoading />
            ) : (
              dataUsers &&
              dataUsers?.map((userItem) => (
                <UserListItem
                  key={userItem._id}
                  user={userItem}
                  handlerAccessFunc={() => accessChat(userItem._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
