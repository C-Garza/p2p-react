import {createContext, useState, useEffect, useRef} from "react";
import {io} from "socket.io-client";
import Peer from "peerjs";

const SocketContext = createContext();

let socket = null;
let peer = null;

const SocketContextProvider = ({children}) => {
  const [params, setParams] = useState("");
  const [videoStreams, setVideoStreams] = useState({});
  const [peers, setPeers] = useState({});

  const videoRefs = useRef(videoStreams);
  const peersRefs = useRef(peers);

  useEffect(() => {
    // SET REFS SO EVENT LISTENERS CAN ACCESS CURRENT STATE
    videoRefs.current = videoStreams;
    peersRefs.current = peers;
  }, [videoStreams, peers]);

  useEffect(() => {
    const getStream = () => {
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(currentStream => {
          // SET USER STREAM
          setVideoStreams(videoStreams => ({...videoStreams, [currentStream.id]: currentStream}));
  
          // SET UP LISTENERS
          setUserConnection(currentStream);
          setPeerListeners(currentStream);
        }).catch(e => {
          console.log(e);
      });
    };
    const setUserConnection = (stream) => {
      socket.on("user-connected", userID => {
        console.log("HAS JOINED!: " + userID);
        // connectToNewUser(userID, stream);
        // TO-DO: Figure out why call is triggered before event listener
        setTimeout(() => connectToNewUser(userID, stream), 200);
      });
      socket.on("user-disconnected", (userID) => {
        console.log("User has disconnected!" + userID);
        const peers = peersRefs.current;
        if(peers[userID]) {
          peers[userID].call.close();
          let {[userID]: tmp, ...rest} = peers;
          setPeers(rest);
        }
      });
    };

    // IF IN ROOM SET UP LISTENERS
    if(params) {
      socket = io("http://localhost:3001", {
        reconnection: true
      });
      socket.on("error", (e) => {
        console.log(e);
      });
      peer = new Peer({
        host: "/",
        port: "9000",
        path: "/peerjs"
      });
      peer.on("open", id => {
        socket.emit("join-room", params, id);
        getStream();
      });
      peer.on("error", (e) => {
        console.log(e);
        if(peer.disconnected) peer.reconnect();
      });
    }

    return () => {
      if(socket) {
        socket.removeAllListeners("user-connected");
        socket.removeAllListeners("user-disconnected");
        peer.destory();
      }
    };
  }, [params]);

  const setPeerListeners = (stream) => {
    // WHEN THE USER HAS CALLED
    peer.on("call", call => {
      call.answer(stream);

      // WHEN THE HOST RECIEVES A STREAM
      call.on("stream", userVideoStream => {
        addVideo(call.peer, userVideoStream, call, userVideoStream)
      });
      // WHEN THE USER HAS CLOSED
      call.on("close", () => {
        removeVideo();
      });
    });
  };

  const connectToNewUser = (userID, stream) => {
    // CALLING A USER
    const call = peer.call(userID, stream);
    
    // WHEN USER IS CALLED
    call.on("stream", newUserStream => {
      addVideo(userID, newUserStream, call, call._remoteStream);
    });
    // WHEN USER HAS CLOSED
    call.on("close", async () => {
      removeVideo();
    });
  };

  const addVideo = (id, stream, call, streamID) => {
    setVideoStreams(videoStreams => ({...videoStreams, [stream.id]: stream}));
    setPeers(peers => ({...peers, [id]: {call, streamID}}));
  };

  const removeVideo = async () => {
    const prom = await new Promise(resolve => setTimeout(() => resolve(videoRefs.current)), 0);
    const streams = prom;
    for(const [key, value]of Object.entries(streams)) {
      if(!value.active) {
        let {[key]: tmp, ...rest} = streams;
        setVideoStreams(rest);
        return;
      }
    }
  };

  return (
    <SocketContext.Provider value={{
      videoStreams,
      setParams
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export {SocketContext, SocketContextProvider};