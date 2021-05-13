let rooms = {};

const addRoom = (id, name) => {
  if(!rooms[id]) rooms[id] = name;
};

const updateRoom = (id, name) => {
  rooms[id] = name;
};

const removeRoom = (id) => {
  let {[id]: tmp, ...rest} = rooms;

  rooms = rest;
};

const getRoom = (id) => {
  return rooms[id];
};

module.exports = {
  addRoom,
  updateRoom,
  removeRoom,
  getRoom
};