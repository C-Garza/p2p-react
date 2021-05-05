import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { SocketContextProvider } from "./context/SocketContext";

ReactDOM.render(
  <React.StrictMode>
    <SocketContextProvider>
      <App />
    </SocketContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);