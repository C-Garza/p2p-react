import {useEffect, useContext} from "react";
import {SocketContext} from "../../context/SocketContext";
import {useLocation} from "react-router-dom";
import Video from "../Video";

const RoomContainer = () => {
  const {setParams, videoStreams} = useContext(SocketContext);
  const location = useLocation();

  const searchParams = location.pathname.split("/");
  const roomID = searchParams[searchParams.length - 1];
  
  const renderVideo = () => {
    return Object.values(videoStreams).map((video, i) => {
      return <Video key={i} stream={video} />;
    });
  };

  useEffect(() => {
    setParams(roomID);

    return () => {
      setParams("");
    };
  }, [setParams, roomID, location]);

  return(
    <div>
      {renderVideo()}
    </div>
  );
};

export default RoomContainer;