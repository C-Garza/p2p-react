import CopyButton from "../CopyButton/CopyButton";
import styles from "./VideoRoomHeader.module.css";

const VideoRoomHeader = ({room}) => {
  return(
    <div className={styles.header}>
      <h1 className={styles.heading}>{room}</h1>
      <CopyButton />
    </div>
  );
};

export default VideoRoomHeader;