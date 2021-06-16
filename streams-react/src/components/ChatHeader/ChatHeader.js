import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { SocketContext } from "../../context/SocketContext";
import styles from "./ChatHeader.module.css";

const ChatHeader = () => {
  const {users, roomName} = useContext(SocketContext);
  const {setIsChatOpen} = useContext(ChatContext);
  const totalOnline = Object.keys(users).length;

  const handleClick = () => {
    setIsChatOpen(prev => !prev);
  };

  return(
    <div className={styles.container}>
      <button className={styles.close__button} onClick={handleClick}>
        <i className={`fas fa-times ${styles.close__icon}`}></i>
      </button>
      <h2 className={styles.chat__header}>{roomName}</h2>
      <p className={styles.chat__online}>Currently Online: {totalOnline}</p>
    </div>
  );
};

export default ChatHeader;