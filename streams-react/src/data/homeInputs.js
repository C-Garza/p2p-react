const createInputs = [
  {
    type: "text",
    label: "Display Name",
    name: "username",
    required: true,
    username: ""
  },
  {
    type: "text",
    label: "Room",
    name: "room",
    required: true,
    room: ""
  }
];

const joinInputs = [
  {
    type: "text",
    label: "Display Name",
    name: "username",
    required: true,
    username: ""
  },
  {
    type: "text",
    label: "Room ID",
    name: "room",
    required: true,
    room: ""
  }
];

export {createInputs, joinInputs};