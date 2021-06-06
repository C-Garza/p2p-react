import {useEffect, useState, useRef, useContext} from "react";
import ErrorDisplay from "../ErrorDisplay/ErrorDisplay";
import Loading from "../Loading/Loading";
import Video from "../Video/Video";
import {ChatContext} from "../../context/ChatContext";
import styles from "./VideosContainer.module.css";

const VideoContainer = ({videos, isTalking, gainStreams, hasPeerError, hasSocketError}) => {
  const [containerStyles, setContainerStyles] = useState({});
  const {isChatOpen, chatDimensions} = useContext(ChatContext);
  const containerRef = useRef(null);

  useEffect(() => {
    const recalculateLayout = () => {
      let elFromTop = 0;
      let chatWidth = 0;
      
      if(containerRef.current) {
        elFromTop = Math.floor(containerRef.current.getBoundingClientRect().top + window.pageYOffset) + 15;
      }
      if(isChatOpen) chatWidth = chatDimensions.width;
      const aspectRatio = 16 / 9;
      const screenWidth = document.body.getBoundingClientRect().width - chatWidth;
      const screenHeight = window.innerHeight - elFromTop;
      const videoCount = Object.keys(videos).length;
  
      const calculateLayout = (
        containerWidth,
        containerHeight,
        videoCount,
        aspectRatio
      ) => {
        let bestLayout = {
          area: 0,
          cols: 0,
          rows: 0,
          width: 0,
          height: 0
        };
  
        for(let cols = 1; cols <= videoCount; cols++) {
          const rows = Math.ceil(videoCount / cols);
          const hScale = containerWidth / (cols * aspectRatio);
          const vScale = containerHeight / rows;
          let width;
          let height;
          if(hScale <= vScale) {
            width = Math.floor(containerWidth / cols);
            height = Math.floor(width / aspectRatio);
          }
          else {
            height = Math.floor(containerHeight / rows);
            width = Math.floor(height * aspectRatio);
          }
          
          const area = width * height;
          if(area > bestLayout.area) {
            bestLayout = {
              area,
              width,
              height,
              rows,
              cols
            };
          }
        }
        return bestLayout;
      };
  
      const {width, height, cols} = calculateLayout(screenWidth, screenHeight, videoCount, aspectRatio);
      setContainerStyles(style => ({...style, width, height, cols}));
    };

    window.addEventListener("resize", recalculateLayout);
    recalculateLayout();

    return () => {
      window.removeEventListener("resize", recalculateLayout);
    };
  }, [videos, isChatOpen, chatDimensions]);

  const renderVideo = () => {
    return Object.values(videos).map((video, i) => {
      return (
        <Video 
          key={i} 
          stream={video.streamID} 
          displayName={video.displayName} 
          isTalking={isTalking?.[video.streamID.id]}
          gainStreams={gainStreams?.[video.streamID.id]}
          hasWebcam={video.hasWebcam}
          containerStyles={containerStyles}
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
    <div ref={containerRef} className={styles.videos} style={{maxWidth: `calc(${containerStyles.width}px * ${containerStyles.cols})`}}>
      {renderVideo()}
    </div>
  );
};

export default VideoContainer;