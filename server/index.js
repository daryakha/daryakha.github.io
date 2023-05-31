const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
app.use(cors);

const server = http.createServer(app);
const io = socketIo(server);

let lines = [];
io.on("connection", (socket) => {
  console.log("a user connected");
  io.emit("update_lines", lines);

  socket.on("line_drawn", (linedata) => {
    lines.push(linedata);
    io.emit("update_lines", lines);
  });
  socket.on("clear", () => {
    lines = [];
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
