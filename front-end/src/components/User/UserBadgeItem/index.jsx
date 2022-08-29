import { Badge, Box } from "@chakra-ui/react";
import { ChatState } from "Context/ChatProvider";
import { CgClose } from "react-icons/cg";
import "./style.css";
const UserBadgeItem = (props) => {
  const { user, handleFunction, selectedChat } = props;
  const { user: UserContext } = ChatState();
  return (
    <Box>
      <Badge
        borderRadius="xl"
        display="flex"
        alignItems="center"
        variant="solid"
        colorScheme={
          user?._id === selectedChat?.groupAdmin?._id ? "teal" : "facebook"
        }
        py={2}
        px={3}
      >
        {user.name}

        {/* Check Role to Hide/On Button Close */}

        {selectedChat?.groupAdmin ? (
          <>
            {UserContext._id !== user._id &&
              selectedChat?.groupAdmin._id === UserContext._id && (
                <CgClose className="icon-close" onClick={handleFunction} />
              )}
          </>
        ) : (
          <>
            <CgClose className="icon-close" onClick={handleFunction} />
          </>
        )}
      </Badge>
    </Box>
  );
};

export default UserBadgeItem;
