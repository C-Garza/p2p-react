const express = require("express");
const cors = require("cors");
const http = require("http");
const {ExpressPeerServer} = require("peer");

const peerApp = express();
const pServer = http.createServer(peerApp);

const peerServer = ExpressPeerServer(pServer);

peerApp.use("/peerjs", peerServer);
peerApp.use(cors());

module.exports = pServer;