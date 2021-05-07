import {useEffect, useRef} from "react";
import styles from "./Video.module.css";

const Video = ({stream, displayName}) => {
  const video = useRef(stream);

  useEffect(() => {
    if(video.current) {
      video.current.srcObject = stream;
    }
  }, [video, stream]);
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <video id={video.current.id} className={styles.video} playsInline ref={video} autoPlay muted></video>
        <p className={styles.displayname}>{displayName || "Silly Goose"}</p>
      </div>
    </div>
  );
};

export default Video;