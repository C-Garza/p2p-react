import {useState, useEffect, useRef} from "react";
import VideoControls from "../VideoControls/VideoControls";
import Identicon from "../Identicon/Identicon";
import styles from "./Video.module.css";

const Video = ({stream, displayName, isTalking, gainStreams, hasWebcam, containerStyles}) => {
  const video = useRef(stream);
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if(video.current) {
      video.current.srcObject = stream;
    }
  }, [video, stream, hasWebcam]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenExit, false);
    document.addEventListener('mozfullscreenchange', handleFullScreenExit, false);
    document.addEventListener('MSFullscreenChange', handleFullScreenExit, false);
    document.addEventListener('webkitfullscreenchange', handleFullScreenExit, false);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenExit, false);
      document.removeEventListener('mozfullscreenchange', handleFullScreenExit, false);
      document.removeEventListener('MSFullscreenChange', handleFullScreenExit, false);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenExit, false);
    };
  }, []);

  const handleMuted = () => {
    setIsMuted(!isMuted);
  };

  const handleFullScreen = () => {
    const element = wrapperRef.current;
    const doc = window.document;

    const requestFullScreen = 
                  element.requestFullscreen ||
                  element.mozRequestFullScreen ||
                  element.webkitRequestFullScreen ||
                  element.msRequestFullscreen;
    const cancelFullScreen = 
                  doc.exitFullscreen || 
                  doc.mozCancelFullScreen || 
                  doc.webkitExitFullscreen || 
                  doc.msExitFullscreen;
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && 
      !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(element);
      setIsFullScreen(true);
    } else {
      cancelFullScreen.call(doc);
      setIsFullScreen(false);
    }
  };

  const handleFullScreenExit = () => {
    const doc = window.document;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && 
      !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        setIsFullScreen(false);
      }
  };

  const contianerMarginStyles = containerRef.current ?  window.getComputedStyle(containerRef.current) : "0px";

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${isMuted ? styles.muted : ""} ${isTalking ? styles.speaking : styles.silent}`}
      style={{
        width: `calc(${containerStyles.width}px - (${contianerMarginStyles.marginLeft} + ${contianerMarginStyles.marginRight}))`, 
        height: `calc(${containerStyles.height}px - (${contianerMarginStyles.marginTop} + ${contianerMarginStyles.marginBottom}))`
      }}
    >
      <div className={styles.wrapper} ref={wrapperRef} onDoubleClick={handleFullScreen}>
        {hasWebcam
          ? <video 
              id={stream.id} 
              className={`${styles.video} ${isFullScreen ? styles["video--fullscreen"] : ""}`} 
              playsInline 
              ref={video} 
              autoPlay 
              muted 
              data-video-stream="video-stream"
            >
            </video>
          : <div id={stream.id} className={styles.identicon__container} data-video-stream="video-stream">
              <Identicon seed={stream.id} />
            </div>
        }
        <VideoControls 
          stream={stream} 
          hasWebcam={hasWebcam}
          displayName={displayName} 
          gainStreams={gainStreams} 
          handleMuted={handleMuted}
          handleFullScreen={handleFullScreen}
          isFullScreen={isFullScreen}
          videoWidth={containerStyles.width}
        />
      </div>
    </div>
  );
};

export default Video;