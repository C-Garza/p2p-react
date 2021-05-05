import {useEffect, useRef} from "react";

const Video = ({stream}) => {
  const video = useRef(stream);

  useEffect(() => {
    if(video.current) {
      video.current.srcObject = stream;
    }
  }, [video, stream]);
  return (
    <video id={video.current.id} playsInline ref={video} autoPlay muted></video>
  );
};

export default Video;