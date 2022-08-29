const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://huyhoanhotel.com/wp-content/uploads/2016/05/765-default-avatar.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userModel);

module.exports = User;
