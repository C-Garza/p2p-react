import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";
import Loading from "../Loading/Loading";
import Video from "../Video/Video";
import styles from "./VideosContainer.module.css";

const VideoContainer = ({videos, isTalking, gainStreams, hasPeerError, hasSocketError}) => {
  console.log(videos);
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

  if(hasSocketError) {
    return(
      <div className={styles.error}>
        <ErrorDisplay error={hasSocketError} />
      </div>
    );
  }

  if(hasPeerError) {
    return(
      <div className={styles.error}>
        <ErrorDisplay error={hasPeerError} />
      </div>
    );
  }

  if(!Object.keys(videos).length) {
    return(
      <div className={styles.loading}>
        <Loading />
      </div>
    );
  }

  return(
    <div className={styles.videos}>
      {renderVideo()}
    </div>
  );
};

export default VideoContainer;