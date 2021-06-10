import Identicon from "../Identicon/Identicon";
import ChatUserHeader from "../ChatUserHeader/ChatUserHeader";
import ChatUserMessage from "../ChatUserMessage/ChatUserMessage";
import {v4 as uuidv4} from "uuid";
import styles from "./ChatUser.module.css";

const ChatUser = ({messageData}) => {

  const renderMessage = () => {
    return messageData.message.map((message) => {
      return <ChatUserMessage key={uuidv4()} message={message} />
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.message__header}>
        <div className={styles.identicon}>
          <Identicon seed={messageData.streamID} />
        </div>
        <ChatUserHeader username={messageData.userName} timestamp={messageData.createdAt} />
      </div>
      <div className={styles.message}>
        {renderMessage()}
      </div>
    </div>
  )
};

export default ChatUser;