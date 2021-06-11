import {useEffect, useRef, useContext} from "react";
import ChatList from "../ChatList/ChatList";
import {ChatContext} from "../../context/ChatContext";
import styles from "./ChatContainer.module.css";

const ChatContainer = () => {
  const {isChatOpen, setIsChatOpen, chatDimensions, setChatDimensions} = useContext(ChatContext);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const width = containerRef.current.getBoundingClientRect()?.width;
  
      if(width !== chatDimensions.width) {
        setChatDimensions(dimensions => ({...dimensions, width}));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [chatDimensions, setChatDimensions]);

  useEffect(() => {
    if(!isChatOpen) handleVideosReset();
  }, [isChatOpen]);

  const handleVideosReset = () => {
    let videos = document.querySelectorAll(".embedded__video");
    if(!videos.length) return;
    videos.forEach(video => {
      video.contentWindow.postMessage(`{"event":"command","func":"stopVideo","args":""}`, "*");
    });
  };

  const handleClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${isChatOpen ? styles["container--on"] : ""}`}>
      <button type="button" className={styles.chat__button} onClick={handleClick}>
        <i className={`fas fa-chevron-left ${styles.chevron} ${isChatOpen ? styles["chevron--open"] : styles.hidden}`}></i>
        <i className={`fas fa-chevron-right ${styles.chevron} ${isChatOpen ? styles.hidden : styles["chevron--closed"]}`}></i>
      </button>
      <div className={`${styles.chat__container} ${isChatOpen ? "" : styles["chat__container--closed"]}`}>
        <ChatList />
      </div>
    </div>
  );
};

export default ChatContainer;