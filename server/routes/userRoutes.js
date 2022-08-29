const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  allUsers,
  getUser,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);

router.get("/getUser", protect, getUser);

router.post("/login", loginUser);

router.get("/", protect, allUsers);

module.exports = router;
