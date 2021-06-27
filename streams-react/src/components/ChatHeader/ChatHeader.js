import { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import styles from "./ChatHeader.module.css";

const ChatHeader = () => {
  const {users, roomName} = useContext(SocketContext);
  const totalOnline = Object.keys(users).length;

  return(
    <div className={styles.container}>
      <h2 className={styles.chat__header}>{roomName}</h2>
      <p className={styles.chat__online}>Currently Online: {totalOnline}</p>
    </div>
  );
};

export default ChatHeader;