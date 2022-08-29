import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
const ProfileModal = (props) => {
  const { user, children } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<AiOutlineInfoCircle />} />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize={30} border="1px solid #ccc">
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.avatar}
              alt={user.name}
            />
          </ModalBody>

          <ModalFooter>
            <Button color="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
