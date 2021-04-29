const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const port = process.env.PORT || 3001;

const server = http.createServer(app);
const io = socketio(server);

server.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});