import {useEffect, useContext} from "react";
import styles from "./RoomContainer.module.css";
import {SocketContext} from "../../context/SocketContext";
import {ChatContext} from "../../context/ChatContext";
import {useLocation} from "react-router-dom";
import VideoRoomHeader from "../VideoRoomHeader/VideoRoomHeader";
import VideoContainer from "../VideosContainer/VideosContainer";
import ChatContainer from "../ChatContainer/ChatContainer";
import useStateToLocalStorage from "../../hooks/useStateToLocalStorage";

const RoomContainer = () => {
  const {
    isHost,
    setParams, 
    setDisplayName, 
    roomName: hostRoomName, 
    setRoomName: setHostRoomName, 
    videoStreams, 
    isTalking, 
    gainStreams,
    hasPeerError,
    hasSocketError
  } = useContext(SocketContext);
  const {isChatOpen} = useContext(ChatContext);
  const location = useLocation();
  const [userName] = useStateToLocalStorage("userName");
  const [roomName, setRoomName] = useStateToLocalStorage("roomName");

  const searchParams = location.pathname.split("/");
  const roomID = searchParams[searchParams.length - 1];

  useEffect(() => {
    setDisplayName(userName);
    setHostRoomName(roomName);
  }, [userName, setDisplayName, roomName, setHostRoomName]);

  useEffect(() => {
    setParams(roomID);

    return () => {
      setParams("");
    };
  }, [setParams, roomID, location]);

  return(
    <div className={`${styles.container} ${isChatOpen ? styles["container--shrink"] : ""}`}>
      <VideoRoomHeader room={hostRoomName ? hostRoomName : roomName} setRoomName={setRoomName} isHost={isHost} />
      <VideoContainer 
        videos={videoStreams} 
        isTalking={isTalking} 
        gainStreams={gainStreams}
        hasPeerError={hasPeerError}
        hasSocketError={hasSocketError}
      />
      <ChatContainer />
    </div>
  );
};

export default RoomContainer;