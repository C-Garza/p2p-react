let users = {};
// peerID: {
//  id,
//  displayName,
//  roomID 
// }

const addUser = (id, socketID, displayName, roomID) => {
  users[id] = {id: socketID, displayName, roomID, isHost: false};
};

const hasHost = (roomID) => {
  const usersInRoom = getUsersInRoom(roomID);

  return Object.entries(usersInRoom).find(([key, user]) => user.isHost);
};

const setUserHost = (id, roomID) => {
  const usersInRoom = getUsersInRoom(roomID);
  const doesHostExist = hasHost(roomID);

  if(doesHostExist) {
    return true;
  }
  if(!id) {
    let newHost = null;
    for(const [key, value] of Object.entries(usersInRoom)) {
      newHost = key;
      value.isHost = true;
    }
    return usersInRoom[newHost];
  }
  usersInRoom[id].isHost = true;
};

const changeUserName = (id, currentID, newID) => {
  users[id] = {...users[id], displayName: newID};
  return users[id];
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
  setUserHost,
  changeUserName,
  removeUser,
  getUsersInRoom
};