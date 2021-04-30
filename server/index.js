const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {v4: uuidV4} = require("uuid");

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);
const io = socketio(server);

app.get("/api/uuid", (req, res) => {
  res.send({id: uuidV4()});
});

io.on("connection", socket => {
  socket.on("join-room", (roomID, userID) => {
    console.log(roomID, userID);
  });
});

server.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});