import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import "./style.css";
const UserListItem = (props) => {
  const { user, handlerAccessFunc } = props;

  return (
    <div className="box-item-user" onClick={() => handlerAccessFunc()}>
      <Avatar
        mr={2}
        size="md"
        cursor="pointer"
        name={user?.name}
        src={user?.avatar}
      />
      <Box>
        <Text fontWeight="500">{user?.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user?.email}
        </Text>
      </Box>
    </div>
  );
};

export default UserListItem;
