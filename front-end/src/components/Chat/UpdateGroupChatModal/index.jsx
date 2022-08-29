import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import UserBadgeItem from "components/User/UserBadgeItem";
import UserListItem from "components/User/UserListItem";
import Config from "config";
import { ChatState } from "Context/ChatProvider";
import Loading from "Pages/common/Loading";
import { useEffect, useState } from "react";
import { IoIosEye } from "react-icons/io";
import { authService } from "services/authSerivce";
import { chatService } from "services/chatService";
import io from "socket.io-client";
import { UPDATE_GROUP_NAME, UPDATE_GROUP_USER } from "utils/typeSocket";

let socket;

const UpdateGroupChatModal = (props) => {
  const { fetchChat, setFetchChat, fetchMessages } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();

  useEffect(() => {
    socket = io(Config.apiUrl);
  }, []);

  const handleDelete = async (userItem) => {
    setLoading(true);
    if (selectedChat.groupAdmin._id !== user._id && userItem._id !== user._id) {
      toast({
        title: "Only admin can remove User !",
        status: "warning",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else {
      try {
        const dataPost = {
          chatId: selectedChat._id,
          userId: userItem._id,
        };
        let dataRemove = await chatService.removeUSerToGroup(dataPost);
        if (dataRemove) {
          if (dataRemove.data === "Delete Group Chat Successfully") {
            toast({
              title: dataRemove.data,
              status: "error",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          }

          socket.emit("handle Group", {
            action: UPDATE_GROUP_USER,
            payload: userItem._id,
          });

          setFetchChat(!fetchChat);
          setSelectedChat();
          onClose();
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      } catch (error) {
        toast({
          title: "Error Handle Delete  !",
          status: "error",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const SearchHandler = async (e) => {
    let { value } = e.target;
    if (!value) {
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
      const data = await authService.search(value);
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

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setRenameLoading(true);
    if (!groupChatName) {
      toast({
        title: "Please fill filed Chat Name",
        status: "warning",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    } else {
      try {
        let dataPost = {
          chatName: groupChatName,
          chatId: selectedChat._id,
        };
        let newGroupChat = await chatService.renameGroupChat(dataPost);
        if (newGroupChat) {
          //
          socket.emit("handle Group", {
            action: UPDATE_GROUP_NAME,
            payload: newGroupChat.data,
          });

          setGroupChatName("");
          setSelectedChat(newGroupChat.data);
          setFetchChat(!fetchChat);
          fetchMessages();
          onClose();
          setTimeout(() => {
            setRenameLoading(false);
          }, 1000);
        }
      } catch (error) {
        toast({
          title: "Error Rename Group Chat  !",
          status: "error",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        setRenameLoading(false);
        setGroupChatName("");
      }
    }
  };

  const handleAddUser = async (userItem) => {
    if (!!selectedChat.users.find((u) => u._id === userItem._id)) {
      toast({
        title: "User Already in Group !",
        status: "warning",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add User to Group  !",
        status: "warning",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const dataPost = {
        chatId: selectedChat._id,
        userId: userItem._id,
      };

      let dataAddUser = await chatService.addUSerToGroup(dataPost);
      if (dataAddUser) {
        socket.emit("handle Group", {
          action: UPDATE_GROUP_USER,
          payload: dataAddUser.data,
        });
        setSelectedChat(dataAddUser.data);
        setFetchChat(!fetchChat);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      toast({
        title: "Error Add User  !",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });

      setLoading(false);
      setGroupChatName("");
    }
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<IoIosEye />}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" gap="10px" mb={2}>
              {selectedChat.users.map((userItem) => {
                return (
                  <UserBadgeItem
                    key={userItem._id}
                    user={userItem}
                    selectedChat={selectedChat}
                    handleFunction={() => handleDelete(userItem)}
                  />
                );
              })}
            </Box>
            <form onSubmit={handleSubmitForm}>
              <FormControl display="flex" mt={5}>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupChatName || ""}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="solid"
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameLoading}
                >
                  Update
                </Button>
              </FormControl>
            </form>

            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={SearchHandler}
              />
              {loading ? (
                <Box display="flex" justifyContent="center" mt="20px">
                  <Loading />
                </Box>
              ) : (
                dataUsers &&
                dataUsers?.map((userItem) => (
                  <UserListItem
                    key={userItem._id}
                    user={userItem}
                    handlerAccessFunc={() => handleAddUser(userItem)}
                  />
                ))
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleDelete(user)} colorScheme="red">
              Leave Group
            </Button>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
