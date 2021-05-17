const createInputs = [
  {
    type: "text",
    label: "Display Name",
    name: "username",
    required: true,
    username: "",
    id: "username-1",
    max: "32",
    autoComplete: "on"
  },
  {
    type: "text",
    label: "Room",
    name: "room",
    required: true,
    room: "",
    id: "room-1",
    autoComplete: "on"
  }
];

const joinInputs = [
  {
    type: "text",
    label: "Display Name",
    name: "username",
    required: true,
    username: "",
    id: "username-2",
    max: "32",
    autoComplete: "on"
  },
  {
    type: "text",
    label: "Room ID",
    name: "room",
    required: true,
    room: "",
    id: "room-2",
    autoComplete: "off"
  }
];

export {createInputs, joinInputs};