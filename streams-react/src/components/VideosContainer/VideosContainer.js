import Video from "../Video/Video";
import styles from "./VideosContainer.module.css";

const VideoContainer = ({videos, isTalking, gainStreams}) => {
  const renderVideo = () => {
    return Object.values(videos).map((video, i) => {
      return (
        <Video 
          key={i} 
          stream={video.streamID} 
          displayName={video.displayName} 
          isTalking={isTalking?.[video.streamID.id]}
          gainStreams={gainStreams?.[video.streamID.id]}
        />
      );
    });
  };

  return(
    <div className={styles.videos}>
      {renderVideo()}
    </div>
  );
};

export default VideoContainer;