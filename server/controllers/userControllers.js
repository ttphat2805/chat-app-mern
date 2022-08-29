const asyncHandler = require("express-async-handler");
const generateToken = require("../config/jwt");
const User = require("../models/userModel");
const { comparePassword, encryptPassword } = require("../utils/hash");

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, avatar } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    {
      res.status(400);
      throw new Error("User already exists");
    }
  }

  let data = {
    name: `${firstName} ${lastName}`,
    email,
    password: encryptPassword(password),
    avatar,
  };

  const user = await User.create(data);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const user = await User.findOne({ email });
  if (user && comparePassword(user.password, password)) {
    res.json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

const getUser = asyncHandler(async (req, res) => {
  if (!req.user) return;

  res.send(req.user);
});

module.exports = { registerUser, loginUser, allUsers, getUser };
