import Identicon from "../Identicon/Identicon";
import ChatUserHeader from "../ChatUserHeader/ChatUserHeader";
import ChatUserMessage from "../ChatUserMessage/ChatUserMessage";
import styles from "./ChatUser.module.css";

const ChatUser = ({messageData}) => {

  const renderMessage = () => {
    return messageData.message.map((message, i) => {
      return <ChatUserMessage key={messageData.id[i]} message={message} ogMeta={messageData.ogMeta[i]} />
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