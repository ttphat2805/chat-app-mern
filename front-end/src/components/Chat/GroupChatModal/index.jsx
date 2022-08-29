import {
  Box,
  Button,
  FormControl,
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
import { useEffect, useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import { authService } from "../../../services/authSerivce";
import { chatService } from "../../../services/chatService";
import UserBadgeItem from "../../User/UserBadgeItem";
import UserListItem from "../../User/UserListItem";
import io from "socket.io-client";
import Config from "config";
import { CREATE_GROUP } from "utils/typeSocket";

let socket;

const GroupChatModal = (props) => {
  const { children, setFetchChat, fetchChat } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [dataUsers, setDataUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  // INIT CONNECT SOCKET IO

  useEffect(() => {
    socket = io(Config.apiUrl);
  }, []);

  const searchHandler = async (keyword) => {
    setSearch(keyword);
    if (!keyword) {
      return;
    }

    try {
      setLoading(true);

      let searchResult = await authService.search(search);
      setLoading(false);
      setDataUsers(searchResult.data);
      setSearch("");
    } catch (error) {
      setSearch("");
      toast({
        title: "Search Failed",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    } else {
      try {
        let dataPost = {
          name: groupChatName,
          users: selectedUsers,
        };
        const dataCreateGroup = await chatService.createGroupChat(dataPost);

        if (dataCreateGroup) {
          socket.emit("handle Group", {
            action: CREATE_GROUP,
            payload: dataCreateGroup.data,
          });
          setSearch("");
          setSelectedUsers([]);
          setDataUsers([]);
          setChats([dataCreateGroup.data, ...chats]);
          setFetchChat(!fetchChat);
          onClose();
          toast({
            title: "Created Group Successfully",
            status: "success",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.log(error);
        if (
          error.response.data.message ===
          "More than 2 users are required to form a group chat"
        ) {
          toast({
            title: error.response.data.message,
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Created Group Failed",
            description: error.messgae,
            status: "error",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (user) => {
    let NewDataDeleteUser = selectedUsers.filter(
      (item) => item._id !== user._id
    );
    setSelectedUsers(NewDataDeleteUser);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontWeight="bold">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" justifyContent="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users..."
                mb={3}
                onChange={(e) => searchHandler(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap" gap="10px" mb={2}>
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>

            {/* Render List Search  */}
            {loading
              ? "Loadinggg"
              : dataUsers
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handlerAccessFunc={() => handleGroup(user)}
                    />
                  ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
