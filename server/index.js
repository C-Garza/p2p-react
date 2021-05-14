require("dotenv").config();
const server = require("./servers/app");
const peerApp = require("./servers/peer");
const peerSocketConnection = require("./sockets/peerSocket");

peerSocketConnection(server);

server.listen(process.env.PORT, () => {
  console.log(`Server is listening on ${process.env.PORT}`);
});

if(process.env.NODE_ENV === "development") {
  peerApp.listen(9000, () => {
    console.log(`Server is listening on 9000`);
  });
}