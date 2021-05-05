const express = require("express");
const cors = require("cors");
const http = require("http");
const {v4: uuidV4} = require("uuid");

const app = express();

app.use(cors());

const server = http.createServer(app);

app.get("/api/uuid", (req, res) => {
  res.send({id: uuidV4()});
});

module.exports = server;