import {useEffect, useContext} from "react";
import {SocketContext} from "../../context/SocketContext";
import {useLocation} from "react-router-dom";
import VideoRoomHeader from "../VideoRoomHeader/VideoRoomHeader";
import VideoContainer from "../VideosContainer/VideosContainer";
import useStateToLocalStorage from "../../hooks/useStateToLocalStorage";
import styles from "./RoomContainer.module.css";

const RoomContainer = () => {
  const {setParams, setDisplayName, roomName: hostRoomName, setRoomName: setHostRoomName, videoStreams} = useContext(SocketContext);
  const location = useLocation();
  const [userName, setUserName] = useStateToLocalStorage("userName");
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
      <VideoRoomHeader room={roomName || hostRoomName} />
      <VideoContainer videos={videoStreams} />
    </div>
  );
};

export default RoomContainer;