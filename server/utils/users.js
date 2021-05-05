let users = {};
// peerID: {
//  id,
//  displayName,
//  roomID 
// }

const addUser = (id, socketID, displayName, roomID) => {
  users[id] = {id: socketID, displayName, roomID}
};

const removeUser = (id) => {
  users = Object.fromEntries(Object.entries(users).filter(([key, user]) => id !== user.id));
};

const getUsersInRoom = (roomID) => {
  let usersInRoom = Object.fromEntries(Object.entries(users).filter(([key, user]) => roomID === user.roomID));

  return usersInRoom;
};

module.exports = {
  addUser,
  removeUser,
  getUsersInRoom
};