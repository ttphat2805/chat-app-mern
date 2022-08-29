import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import SignIn from "../../components/SignIn";
import SignUp from "../../components/SignUp";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const Navigate = useNavigate();

  useEffect(() => {
    const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (UserInfo) {
      Navigate("/chats");
    }
  }, [Navigate]);
  return (
    <div>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          {/* 5 */}
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          {/* 10 */}
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="box-auth">
        <Box
          d="flex"
          borderRadius="lg"
          bg="white"
          p={3}
          w="100%"
          textAlign="center"
          justifyContent="center"
          borderWidth="1px"
        >
          <Text fontSize="20px" fontWeight="500">
            Chat App
          </Text>
        </Box>
        <Box
          className="box-login"
          marginTop={5}
          w="600px"
          bg="white"
          p={4}
          borderRadius="lg"
        >
          <Tabs defaultIndex={0} variant="soft-rounded" colorScheme="teal">
            <TabList>
              <Tab width="50%" color="#fff">
                Sign In
              </Tab>
              <Tab width="50%" color="#fff">
                Sign Up
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/* Sign In Components */}
                <SignIn />
              </TabPanel>
              <TabPanel>
                {/* Sign Up Components */}
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </div>
    </div>
  );
};

export default HomePage;
