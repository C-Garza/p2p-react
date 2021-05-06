const socketio = require("socket.io");
const {addUser, removeUser, getUsersInRoom} = require("../utils/users");
const {addRoom, getRoom, removeRoom} = require("../utils/rooms");

const peerSocketConnection = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  io.on("connection", socket => {
    socket.on("join-room", (roomID, userID, displayName, roomName) => {
      console.log(roomID, userID, displayName, roomName);
      socket.join(roomID);
      
      addUser(userID, socket.id, displayName, roomID);
      if(roomName.length) addRoom(roomID, roomName);

      const users = getUsersInRoom(roomID);
      const room = getRoom(roomID);
      
      // SEND USERS IN ROOM TO CLIENT
      io.to(roomID).emit("users-list", users);

      // BROADCAST TO ROOM A NEW CLIENT HAS JOINED
      socket.on("stream-ready", () => {
        socket.broadcast.to(roomID).emit("user-connected", userID);
      });

      // SEND HOST ROOM NAME IF NOT HOST
      if(!roomName.length) {
        io.to(socket.id).emit("room-name", room);
      }
  
      socket.on("disconnect", () => {
        socket.broadcast.to(roomID).emit("user-disconnected", userID);

        removeUser(socket.id);

        // IF NO ONE IS IN ROOM, REMOVE ROOM
        if(!io.sockets.adapter.rooms.get(roomID)?.size) {
          removeRoom(roomID);
        }
      });
    });
  });
};

module.exports = peerSocketConnection;