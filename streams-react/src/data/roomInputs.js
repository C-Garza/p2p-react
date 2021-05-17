const roomInput = [
  {
    type: "text",
    label: "Room Name",
    name: "room",
    required: true,
    room: "",
    id: "room-1",
    autoComplete: "on"
  }
];

const nameInput = [
  {
    type: "text",
    label: "Display Name",
    name: "username",
    required: true,
    username: "",
    id: "username-1",
    // max: "32",
    autoComplete: "on"
  }
];

export {roomInput, nameInput};