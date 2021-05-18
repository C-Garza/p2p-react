import {useState, useEffect, useRef} from "react";
import styles from "./Video.module.css";
import VideoControls from "../VideoControls/VideoControls";

const Video = ({stream, displayName, isTalking, gainStreams}) => {
  const video = useRef(stream);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if(video.current) {
      video.current.srcObject = stream;
    }
  }, [video, stream]);

  const handleMuted = () => {
    setIsMuted(!isMuted);
  }; 

  return (
    <div className={`${styles.container} ${isMuted ? styles.muted : ""} ${isTalking ? styles.speaking : styles.silent}`}>
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
          handleMuted={handleMuted}
        />
      </div>
    </div>
  );
};

export default Video;