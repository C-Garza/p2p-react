const socketio = require("socket.io");
const {addUser, removeUser, getUsersInRoom} = require("../utils/users");

const peerSocketConnection = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  io.on("connection", socket => {
    socket.on("join-room", (roomID, userID, displayName) => {
      console.log(roomID, userID, displayName);
      socket.join(roomID);
      
      addUser(userID, socket.id, displayName, roomID);
      const users = getUsersInRoom(roomID);
      
      io.to(roomID).emit("users-list", users);

      socket.broadcast.to(roomID).emit("user-connected", userID);
  
      socket.on("disconnect", () => {
        socket.broadcast.to(roomID).emit("user-disconnected", userID);
      });
    });
    
    socket.on("disconnect", () => {
      removeUser(socket.id);
    })
  });
};

module.exports = peerSocketConnection;