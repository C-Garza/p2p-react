import {useEffect, useRef} from "react";
import styles from "./Video.module.css";
import VideoControls from "../VideoControls/VideoControls";

const Video = ({stream, displayName, isTalking, gainStreams}) => {
  const video = useRef(stream);

  useEffect(() => {
    if(video.current) {
      video.current.srcObject = stream;
    }
  }, [video, stream]);

  return (
    <div className={`${styles.container} ${isTalking ? styles.speaking : styles.silent}`}>
      <div className={styles.wrapper}>
        <video 
          id={video.current.id} 
          className={styles.video} 
          playsInline 
          ref={video} 
          autoPlay 
          muted 
          data-video-stream="video-stream"
        >
        </video>
        <VideoControls 
          stream={stream} 
          displayName={displayName} 
          gainStreams={gainStreams} 
        />
      </div>
    </div>
  );
};

export default Video;