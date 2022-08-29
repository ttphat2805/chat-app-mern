import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authSerivce";
import "./style.css";
const SignUp = (props) => {
  const [formValue, setFormValue] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const toast = useToast();

  const Navigate = useNavigate();

  const onInputChange = (e) => {
    let { value, name } = e.target;
    let formValueNew = { ...formValue, [name]: value };

    setFormValue(formValueNew);
  };

  const handleUploadImage = (e) => {
    setLoading(true);
    let files = e.target.files[0];

    let allowedTypeImage = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
    ];
    if (!files) {
      toast({
        title: "Please Select an Image !",
        status: "warning",
        position: "top",
        duration: 2000,
        isClosable: true,
      });

      return;
    }

    if (allowedTypeImage.indexOf(files.type) > -1) {
      const data = new FormData();
      data.append("file", files);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "djuk3wjsq");
      try {
        authService.uploadImage(data).then((res) => {
          setImage(res.data.url.toString());
          setLoading(false);
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setLoading(false);
      toast({
        title: "Please Select an Image !",
        status: "warning",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const toggleShowHide = () => setShow(!show);

  const handleSubmitForm = (e) => {
    setLoading(true);
    let dataPost = {
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      password: formValue.password,
      avatar: image,
    };

    try {
      authService.signUp(dataPost).then(
        (res) => {
          if (res.status === 201) {
            setFormValue([]);
            toast({
              title: "Sign Up Successfully !",
              status: "success",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          }
          Navigate("/");
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          let message = error.response.data.message;
          if (message === "User already exists") {
            toast({
              title: message,
              status: "warning",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          } else {
            toast({
              title: message,
              status: "warning",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          }

          console.log(error);
        }
      );
    } catch (error) {
      setLoading(false);
      toast({
        title: "Sign Up Failed !",
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="signUp">
      <VStack spacing="5px" align="stretch">
        <Flex>
          <FormControl width="48%" marginRight={2} isRequired>
            <FormLabel> First Name</FormLabel>
            <Input
              className="input-auth"
              type="text"
              value={formValue?.firstName || ""}
              name="firstName"
              placeholder="Enter First Name.."
              onChange={onInputChange}
            />
          </FormControl>
          <FormControl width="48%" isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              className="input-auth"
              type="text"
              value={formValue?.lastName || ""}
              name="lastName"
              placeholder="Enter Last Name.."
              onChange={onInputChange}
            />
          </FormControl>
        </Flex>
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
              className="input-auth"
              pr="4.5rem"
              name="password"
              value={formValue?.password || ""}
              type={show ? "text" : "password"}
              onChange={onInputChange}
              placeholder="Enter Password"
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="md"
                colorScheme="red"
                marginRight={2}
                onClick={toggleShowHide}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic" className="control-image">
          <FormLabel>Upload Your Picture</FormLabel>

          <div className="avatar-preview">
            <Input
              className="inputFile"
              type="file"
              name="imageAvatar"
              id="imageAvatar"
              p={1.5}
              accept="image/*"
              onChange={handleUploadImage}
            />
            <label htmlFor="imageAvatar" className="uploadImage">
              <MdOutlineDriveFileRenameOutline />
            </label>
            <div
              id="imagePreview"
              className="imagePreview"
              style={{
                backgroundImage: `url(${
                  image
                    ? image
                    : "https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png"
                })`,
              }}
            ></div>
          </div>
        </FormControl>
        <Button
          type="submit"
          style={{ marginTop: 20 }}
          w="100%"
          colorScheme="green"
          onClick={handleSubmitForm}
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </div>
  );
};

export default SignUp;
