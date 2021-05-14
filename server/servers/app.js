const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const {v4: uuidV4} = require("uuid");

const app = express();

app.use(express.static(path.join(__dirname, "..", "..", "streams-react/build")));

app.use(cors());

const server = http.createServer(app);

app.get("/api/uuid", (req, res) => {
  res.send({id: uuidV4()});
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..","..","/streams-react/build/index.html"));
});

module.exports = server;