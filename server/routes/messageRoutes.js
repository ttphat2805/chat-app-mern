const express = require("express");
const {
  sendMessage,
  getAllMessage,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendMessage);

router.get("/:chatId", protect, getAllMessage);

module.exports = router;
