import {useContext} from "react";
import ChatList from "../ChatList/ChatList";
import styles from "./ChatContainer.module.css";
import {ChatContext} from "../../context/ChatContext";

const ChatContainer = () => {
  const {isChatOpen, setIsChatOpen} = useContext(ChatContext);

  const handleClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={`${styles.container} ${isChatOpen ? styles["container--on"] : ""}`}>
      <div className={styles.chat__container}>
        <ChatList />
      </div>
      <button type="button" className={styles.chat__button} onClick={handleClick}>
        <i className={`fas fa-chevron-left ${styles.chevron}`}></i>
      </button>
    </div>
  );
};

export default ChatContainer;