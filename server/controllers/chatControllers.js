const { response } = require("express");
const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    res.sendStatus(400);
    throw new Error("UserId param not send with req");
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastestMessage");

  isChat = await User.populate(isChat, {
    path: "lastestMessgae.sender",
    select: "name avatar email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(FullChat);
    } catch (error) {
      throw new Error(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res, next) => {
  try {
    let dataChat = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("lastestMessage")
      .sort({ updatedAt: -1 });
    dataChat = await User.populate(dataChat, {
      path: "lastestMessage.sender",
      select: "name avatar email",
    });

    if (dataChat) {
      res.status(200).send(dataChat);
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  let { users, name } = req.body;
  if (!users || !name) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  if (users.length < 2) {
    res.status(400);
    throw new Error("More than 2 users are required to form a group chat");
  }

  // PUSH USER ADMIN TO LIST USER IN GROUP
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    throw new Error("Create Group Failed");
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    res.json(updateChat);
  }
});

const addUserToGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const UserExist = await Chat.findOne({
    $and: [
      { _id: chatId },
      {
        users: userId,
      },
    ],
  });
  const addUserToGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (UserExist) {
    res.status(400);
    throw new Error("User already exist in Group Chat");
  } else if (addUserToGroup) {
    res.json(addUserToGroup);
  } else {
    res.status(400);
    throw new Error("Add User Failed");
  }
});

const removeGroupChat = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const ChatById = await Chat.findById({ _id: chatId });

  let UserLength = ChatById.users.length - 1;

  if (UserLength < 1) {
    const dataDeleteGroup = await Chat.findOneAndDelete({ _id: chatId });
    const deleteMessageInGroup = await Message.deleteMany({
      chat: chatId,
    });
    if (!dataDeleteGroup) {
      res.status(400);
      throw new Error("Remove User Failed");
    } else {
      res.status(200).send("Delete Group Chat Successfully");
    }
  } else {
    const removeGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removeGroup) {
      res.status(400);
      throw new Error("Remove User Failed");
    } else {
      res.json(removeGroup);
    }
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addUserToGroupChat,
  removeGroupChat,
};
