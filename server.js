const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb+srv://chatuser:Chat%402026DB@cluster0.sbtblil.mongodb.net/chatapp?retryWrites=true&w=majority");

const messageSchema = new mongoose.Schema({
  room: String,
  name: String,
  message: String,
  time: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

io.on("connection", (socket) => {

  socket.on("joinRoom", async ({ room }) => {

    socket.join(room);

    const oldMessages = await Message.find({ room });

    socket.emit("previousMessages", oldMessages);

  });

  socket.on("chatMessage", async (data) => {

    const newMsg = new Message(data);

    await newMsg.save();

    io.to(data.room).emit("message", data);

  });

  socket.on("deleteChat", async ({ room }) => {

    await Message.deleteMany({ room });

    io.to(room).emit("chatDeleted");

  });

});

server.listen(3000, () => {

  console.log("Server running on http://localhost:3000");

});