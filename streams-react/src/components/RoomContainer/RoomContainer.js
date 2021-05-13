import {useEffect, useContext} from "react";
import {SocketContext} from "../../context/SocketContext";
import {useLocation} from "react-router-dom";
import VideoRoomHeader from "../VideoRoomHeader/VideoRoomHeader";
import VideoContainer from "../VideosContainer/VideosContainer";
import useStateToLocalStorage from "../../hooks/useStateToLocalStorage";
import styles from "./RoomContainer.module.css";

const RoomContainer = () => {
  const {
    isHost,
    setParams, 
    setDisplayName, 
    roomName: hostRoomName, 
    setRoomName: setHostRoomName, 
    videoStreams, 
    isTalking, 
    gainStreams
  } = useContext(SocketContext);
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
    <div className={styles.container}>
      <VideoRoomHeader room={hostRoomName ? hostRoomName : roomName} setRoomName={setRoomName} isHost={isHost} />
      <VideoContainer 
        videos={videoStreams} 
        isTalking={isTalking} 
        gainStreams={gainStreams}
      />
    </div>
  );
};

export default RoomContainer;