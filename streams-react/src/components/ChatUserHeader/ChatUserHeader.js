import {format} from "date-fns";
import styles from "./ChatUserHeader.module.css";

const ChatUserHeader = ({username, timestamp}) => {
  const formattedTimestamp = format(timestamp, "h:mm bbb");

  return(
    <div className={styles.container}>
      <h3 className={styles.header}>{username}</h3>
      <p className={styles.timestamp}>{formattedTimestamp}</p>
    </div>
  );
};

export default ChatUserHeader;