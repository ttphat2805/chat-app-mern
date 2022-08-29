const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const colors = require("colors");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const {
  CREATE_GROUP,
  UPDATE_GROUP_NAME,
  UPDATE_GROUP_USER,
} = require("./config/typeSocket");
dotenv.config();

connectDB();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running Successfully");
});

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

// Deploy ment

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/front-end/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "front-end", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}

//  =================

const server = app.listen(
  PORT,
  console.log(`   Server started on PORT ${PORT}  `.bgBlue)
);
console.log(`------------------`);

// SOCKET IO
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.URL_CLIENT,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined Room " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("send new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat?.users) return console.log("Chat Users not defined");

    io.emit("check latestMessage", chat.users);

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("handle Group", ({ action, payload }) => {
    switch (action) {
      case CREATE_GROUP:
        io.emit("CreateGroup", payload);
        break;
      case UPDATE_GROUP_NAME:
        io.emit("UpdateGroupName", payload);
        break;
      case UPDATE_GROUP_USER:
        io.emit("UpdateGroupUser", payload);
        break;
      default:
        break;
    }
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
