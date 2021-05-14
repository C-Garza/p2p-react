const socketio = require("socket.io");
const {addUser, setUserHost, changeUserName, removeUser, getUsersInRoom} = require("../utils/users");
const {addRoom, updateRoom, getRoom, removeRoom} = require("../utils/rooms");

const peerSocketConnection = (server) => {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const isHost = (user, socketID) => {
    if(user) {
      io.to(socketID).emit("is-host", true);
    }
    else {
      io.to(socketID).emit("is-host", false);
    }
  };
  
  io.on("connection", socket => {
    socket.on("join-room", (roomID, userID, displayName, roomName) => {
      console.log(roomID, userID, displayName, roomName);
      socket.join(roomID);
      
      addUser(userID, socket.id, displayName, roomID);
      if(roomName.length) addRoom(roomID, roomName);

      const users = getUsersInRoom(roomID);
      const room = getRoom(roomID);

      setUserHost(userID, roomID);
      
      // SEND USERS IN ROOM TO CLIENT
      io.to(roomID).emit("users-list", users);

      // SEND USER CONFIRMATION LIST HAS ARRIVED
      io.to(socket.id).emit("users-list-ready");

      // BROADCAST TO ROOM A NEW CLIENT HAS JOINED
      socket.on("stream-ready", () => {
        socket.broadcast.to(roomID).emit("user-connected", userID);
      });

      // SEND HOST ROOM NAME IF NOT HOST
      if(!roomName.length) {
        io.to(socket.id).emit("room-name", room);
      }

      isHost(users[userID].isHost, socket.id);

      socket.on("change-username", (id, currentID, newID) => {
        changeUserName(id, currentID, newID);
        socket.broadcast.to(roomID).emit("username-changed", id, currentID, newID);
      });

      socket.on("change-roomname", (currentID, newID) => {
        updateRoom(roomID, newID);
        socket.broadcast.to(roomID).emit("room-name", newID);
      });
  
      socket.on("disconnect", () => {
        socket.broadcast.to(roomID).emit("user-disconnected", userID);

        removeUser(socket.id);

        // IF NO ONE IS IN ROOM, REMOVE ROOM
        if(!io.sockets.adapter.rooms.get(roomID)?.size) {
          removeRoom(roomID);
          return;
        }

        // SET UP NEW HOST
        const hasHost = setUserHost(undefined, roomID);
        if(hasHost === true) return;

        // EMIT TO NEW HOST THEY ARE HOST
        isHost(hasHost.isHost, hasHost.id);
      });
    });
  });
};

module.exports = peerSocketConnection;