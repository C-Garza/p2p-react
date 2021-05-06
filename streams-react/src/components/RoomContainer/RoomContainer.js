import {useEffect, useContext} from "react";
import {SocketContext} from "../../context/SocketContext";
import {useLocation} from "react-router-dom";
import Video from "../Video";
import useStateToLocalStorage from "../../hooks/useStateToLocalStorage";

const RoomContainer = () => {
  const {setParams, setDisplayName, roomName: hostRoomName, setRoomName: setHostRoomName, videoStreams} = useContext(SocketContext);
  const location = useLocation();
  const [userName, setUserName] = useStateToLocalStorage("userName");
  const [roomName, setRoomName] = useStateToLocalStorage("roomName");

  const searchParams = location.pathname.split("/");
  const roomID = searchParams[searchParams.length - 1];
  
  const renderVideo = () => {
    return Object.values(videoStreams).map((video, i) => {
      return <Video key={i} stream={video.streamID} displayName={video.displayName} />;
    });
  };

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
    <div>
      <h2>Room Name: {roomName || hostRoomName}</h2>
      {renderVideo()}
    </div>
  );
};

export default RoomContainer;