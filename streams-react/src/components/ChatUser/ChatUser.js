import Identicon from "../Identicon/Identicon";
import ChatUserHeader from "../ChatUserHeader/ChatUserHeader";
import ChatUserMessage from "../ChatUserMessage/ChatUserMessage";
import styles from "./ChatUser.module.css";

const ChatUser = ({messageData}) => {

  return (
    <div className={styles.container}>
      <div className={styles.message__header}>
        <div className={styles.identicon}>
          <Identicon seed={messageData.streamID} />
        </div>
        <ChatUserHeader username={messageData.userName} timestamp={messageData.createdAt} />
      </div>
      <div className={styles.message}>
        <ChatUserMessage message={messageData.message} />
      </div>
    </div>
  )
};

export default ChatUser;