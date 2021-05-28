import {useState, useEffect, useRef} from "react";
import VideoControls from "../VideoControls/VideoControls";
import Identicon from "../Identicon/Identicon";
import styles from "./Video.module.css";

const Video = ({stream, displayName, isTalking, gainStreams, hasWebcam}) => {
  const video = useRef(stream);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if(video.current) {
      video.current.srcObject = stream;
    }
  }, [video, stream, hasWebcam]);

  const handleMuted = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`${styles.container} ${isMuted ? styles.muted : ""} ${isTalking ? styles.speaking : styles.silent}`}>
      <div className={styles.wrapper}>
        {hasWebcam
          ? <video 
              id={stream.id} 
              className={styles.video} 
              playsInline 
              ref={video} 
              autoPlay 
              muted 
              data-video-stream="video-stream"
            >
            </video>
          : <div className={styles.identicon__container} data-video-stream="video-stream">
              <Identicon seed={stream.id} />
            </div>
        }
        <VideoControls 
          stream={stream} 
          hasWebcam={hasWebcam}
          displayName={displayName} 
          gainStreams={gainStreams} 
          handleMuted={handleMuted}
        />
      </div>
    </div>
  );
};

export default Video;