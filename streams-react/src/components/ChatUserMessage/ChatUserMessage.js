import styles from "./ChatUserMessage.module.css";

const ChatUserMessage = ({message}) => {
  return (
    <div className={styles.container}>
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default ChatUserMessage;