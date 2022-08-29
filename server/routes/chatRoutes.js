const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  removeGroupChat,
  addUserToGroupChat,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, accessChat);

router.get("/", protect, fetchChats);

router.post("/group", protect, createGroupChat);

router.put("/groupAdd", protect, addUserToGroupChat);

router.put("/groupRename", protect, renameGroupChat);

router.put("/groupRemove", protect, removeGroupChat);

module.exports = router;
