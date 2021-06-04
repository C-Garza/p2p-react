import styles from "./ChatUserHeader.module.css";

const ChatUserHeader = ({username, timestamp}) => {
  return(
    <div className={styles.container}>
      <h3 className={styles.header}>{username}</h3>
      <p className={styles.timestamp}>{timestamp}</p>
    </div>
  );
};

export default ChatUserHeader;