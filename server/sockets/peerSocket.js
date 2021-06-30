const socketio = require("socket.io");
const {addUser, setUserHost, changeUserName, changeWebcamStatus, removeUser, getUsersInRoom} = require("../utils/users");
const {addRoom, updateRoom, getRoom, removeRoom} = require("../utils/rooms");
const {
  addMessageRoom, 
  addMessage, 
  updateMessageOG,
  messageHasLink,
  getRoomMessages, 
  removeMessageRoom
} = require("../utils/messages");

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
      socket.join(roomID);
      
      addUser(userID, socket.id, displayName, roomID, false);
      if(roomName.length) addRoom(roomID, roomName);

      const users = getUsersInRoom(roomID);
      const room = getRoom(roomID);
      let messageOffset = 20;
      let chatMessages = getRoomMessages(roomID);

      if(!chatMessages.length) {
        addMessageRoom(roomID);
        chatMessages = getRoomMessages(roomID);
      }

      setUserHost(userID, roomID);

      socket.emit("peer-server-connected");

      // SEND USERS IN ROOM TO CLIENT
      socket.on("get-users-list", (hasWebcam, init=true) => {
        if(init) changeWebcamStatus(userID, hasWebcam);
        const users = getUsersInRoom(roomID);

        io.to(roomID).emit("users-list", users);
      });

      // BROADCAST TO ROOM A NEW CLIENT HAS JOINED
      socket.on("stream-ready", () => {
        socket.broadcast.to(roomID).emit("user-connected", userID);
        socket.emit("joined-room");
      });

      // SEND HOST ROOM NAME IF NOT HOST
      if(!users[userID].isHost) {
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

      socket.on("change-webcam-status", (id, streamID, hasWebcam) => {
        changeWebcamStatus(id, hasWebcam);
        const newUsers = getUsersInRoom(roomID);
        socket.broadcast.to(roomID).emit("webcam-status-changed", id, newUsers, streamID, hasWebcam);
      });

      // CHAT LISTENERS
      socket.on("get-messages-list", () => {
        const lastMessages = chatMessages.slice(-messageOffset);
        socket.emit("messages-list", lastMessages);
      });

      socket.on("send-message", async (message) => {
        const newMessage = addMessage(roomID, message);
        io.to(roomID).emit("message-received", newMessage);
        const linksArray = messageHasLink(roomID, newMessage);
        if(linksArray) {
          const updatedMessage = await updateMessageOG(roomID, newMessage, linksArray);
          io.to(roomID).emit("updated-message", updatedMessage);
        }
      });

      socket.on("get-older-messages", offset => {
        messageOffset += offset;
        const lastMessages = getRoomMessages(roomID).slice(-messageOffset);
        socket.emit("older-messages-received", lastMessages);
        if(lastMessages.length < messageOffset) {
          socket.emit("all-older-messages-received", true);
        }
      });
  
      socket.on("disconnect", () => {
        socket.broadcast.to(roomID).emit("user-disconnected", userID);

        removeUser(socket.id);

        // IF NO ONE IS IN ROOM, REMOVE ROOM
        if(!io.sockets.adapter.rooms.get(roomID)?.size) {
          removeRoom(roomID);
          removeMessageRoom(roomID);
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