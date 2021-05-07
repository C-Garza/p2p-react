const createInputs = [
  {
    type: "text",
    label: "Display Name",
    name: "username",
    required: true,
    username: "",
    id: "username-1"
  },
  {
    type: "text",
    label: "Room",
    name: "room",
    required: true,
    room: "",
    id: "room-1"
  }
];

const joinInputs = [
  {
    type: "text",
    label: "Display Name",
    name: "username",
    required: true,
    username: "",
    id: "username-2"
  },
  {
    type: "text",
    label: "Room ID",
    name: "room",
    required: true,
    room: "",
    id: "room-2"
  }
];

export {createInputs, joinInputs};