import { Avatar, Tooltip } from "@chakra-ui/react";
import { ChatState } from "Context/ChatProvider";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, SenderMargin } from "utils/ChatLogic";
const ScrollAbleChat = (props) => {
  const { message } = props;
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {message &&
        message.map((mes, index) => (
          <div style={{ display: "flex" }} key={mes._id}>
            {(isSameSender(message, mes, index, user._id) ||
              isLastMessage(message, index, user._id)) && (
              <Tooltip
                label={mes.sender.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={mes.sender.name}
                  src={mes.sender.avatar}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  mes.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginTop: "6px",
                marginLeft: SenderMargin(message, mes, index, user._id),
              }}
            >
              {mes.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollAbleChat;
