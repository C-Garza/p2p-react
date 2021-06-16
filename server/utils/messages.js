const {v4: uuidV4} = require("uuid");
const {isURL} = require("validator");
const ogs = require("open-graph-scraper");

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
  return message;
};

const updateMessageOG = (id, message, linksArray) => {
  const options = {url: linksArray[0]};

  return ogs(options).then(data => {
    const {error, result} = data;
    message.ogMeta = {...result};
    return message;
  }).catch(err => {
    console.log(err);
    return message;
  });
};

const messageHasLink = (id, message) => {
  let messageArr = message.message.replace(/\n/g, " ").split(" ");
  let linksArray = messageArr.filter(msg => isURL(msg, {require_protocol: true}));
  if(!linksArray.length) return false;
  return linksArray;
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
  updateMessageOG,
  messageHasLink,
  getRoomMessages,
  removeMessageRoom
};