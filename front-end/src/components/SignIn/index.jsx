import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authSerivce";

const SignIn = () => {
  const [formValue, setFormValue] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const Navigate = useNavigate();

  const onInputChange = (e) => {
    let { value, name } = e.target;
    let formValueNew = { ...formValue, [name]: value };
    setFormValue(formValueNew);
  };
  const toggleShowHide = () => setShow(!show);

  const handleSubmitForm = (e) => {
    setLoading(true);

    let dataPost = {
      email: formValue.email,
      password: formValue.password,
    };

    try {
      authService.signIn(dataPost).then(
        (res) => {
          if (res.status === 200) {
            toast({
              title: "Sign In Successfully !",
              status: "success",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
            localStorage.setItem("access_token", res.data.token);
            window.location.href = "/chats";
          }
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        },
        (error) => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
          let message = error.response.data.message;
          if (message === "Invalid Email or Password") {
            toast({
              title: message,
              status: "error",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          } else {
            toast({
              title: message,
              status: "error",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitGuest = (e) => {
    let data = {
      email: "guestchat@gmail.com",
      password: "123456",
    };

    setFormValue(data);

    setTimeout(() => {
      Navigate("/chats");
    }, 2000);
  };

  return (
    <div className="signIn">
      <VStack spacing="5px" align="stretch">
        <FormControl marginRight={2} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            className="input-auth"
            type="email"
            name="email"
            value={formValue?.email || ""}
            placeholder="Enter Your Email.."
            onChange={onInputChange}
          />
        </FormControl>

        <FormControl marginRight={2} isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              className="input-auth"
              name="password"
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              value={formValue?.password || ""}
              onChange={onInputChange}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="md"
                colorScheme="red"
                onChange={onInputChange}
                marginRight={2}
                onClick={toggleShowHide}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          style={{ marginTop: 20 }}
          w="100%"
          isLoading={loading}
          colorScheme="green"
          onClick={handleSubmitForm}
        >
          Sign In
        </Button>

        {/* <Button
          style={{ marginTop: 10 }}
          w="100%"
          color="telegram"
          onClick={handleSubmitGuest}
        >
          Login as Guest
        </Button> */}
      </VStack>
    </div>
  );
};

export default SignIn;
