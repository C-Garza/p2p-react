const {v4: uuidV4} = require("uuid");

let messages = {};
// messages = {
//   roomID: {
//     messages: [{},{},...]
//   } 
// }
//

const addMessageRoom = (id) => {
  if(!messages[id]) messages[id] = {messages: []};
};

const addMessage = (id, message) => {
  message.id = uuidV4() + message.createdAt;
  messages[id].messages.push(message);
};

const getRoomMessages = (id) => {
  if(!messages[id]) return [];
  return messages[id].messages;
};

const removeMessageRoom = (id) => {
  let {[id]: tmp, ...rest} = messages;

  messages = rest;
};

module.exports = {
  addMessageRoom,
  addMessage,
  getRoomMessages,
  removeMessageRoom
};