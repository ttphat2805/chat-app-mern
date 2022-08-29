const { response } = require("express");
const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.sendStatus(400);
    throw new Error("Invalid data passed into req");
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name avatar");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name avatar email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getAllMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name avatar email")
      .populate("chat");

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  sendMessage,
  getAllMessage,
};
