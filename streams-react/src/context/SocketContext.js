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
  const [users, setUsers] = useState({});
  const [displayName, setDisplayName] = useState("");
  const [roomName, setRoomName] = useState("");

  // TO DO: Find another solution for all these refs
  const videoRefs = useRef(videoStreams);
  const peersRefs = useRef(peers);
  const usersRefs = useRef(users);
  const displayNameRef = useRef(displayName);
  const roomNameRef = useRef(roomName);

  useEffect(() => {
    // SET REFS SO EVENT LISTENERS CAN ACCESS CURRENT STATE
    videoRefs.current = videoStreams;
    peersRefs.current = peers;
    usersRefs.current = users;
    displayNameRef.current = displayName;
    roomNameRef.current = roomName;
  }, [videoStreams, peers, users, displayName, roomName]);

  useEffect(() => {
    const initSocket = () => {
      socket = io("http://localhost:3001", {
        reconnection: true
      });
      socket.on("users-list", userList => {
        setUsers({...userList});
      });
      socket.on("room-name", room => {
        setRoomName(room);
      });
      socket.on("error", (e) => {
        console.log(e);
      });
    };
    
    const initPeer = () => {
      peer = new Peer({
        host: "/",
        port: "9000",
        path: "/peerjs"
      });
      peer.on("open", id => {
        socket.emit("join-room", params, id, displayNameRef.current, roomNameRef.current);
        getStream();
      });
      peer.on("error", (e) => {
        console.log(e);
        if(peer.disconnected) peer.reconnect();
      });
    };

    const getStream = () => {
      navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(currentStream => {
          // SET USER STREAM
          setVideoStreams(videoStreams => ({
            ...videoStreams, 
            [currentStream.id]: {
              streamID: currentStream,
              displayName: usersRefs.current[peer.id].displayName
            }
          }));
  
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
        connectToNewUser(userID, stream);
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
      socket.emit("stream-ready");
    };
    const setPeerListeners = (stream) => {
      // WHEN THE USER HAS CALLED
      peer.on("call", call => {
        call.answer(stream);
  
        // WHEN THE HOST RECIEVES A STREAM
        call.on("stream", userVideoStream => {
          addVideo(call.peer, userVideoStream, call, userVideoStream);
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
      call.on("close", () => {
        removeVideo();
      });
    };

    // IF IN ROOM SET UP LISTENERS
    if(params) {
      initSocket();
      initPeer();
    }

    return () => {
      if(socket) {
        socket.removeAllListeners("user-connected");
        socket.removeAllListeners("user-disconnected");
        socket.close();
        peer.destroy();
        setVideoStreams({});
        setPeers({});
      }
    };
  }, [params]);

  const addVideo = (id, stream, call, callStreamID) => {
    setVideoStreams(videoStreams => ({
      ...videoStreams, 
      [stream.id]: {
        streamID: stream,
        displayName: usersRefs.current[id].displayName
      }
    }));
    setPeers(peers => ({...peers, [id]: {call, callStreamID}}));
  };

  const removeVideo = async () => {
    // TO-DO: Figure out how to wait for peer to disconnect and remove video from view
    const prom = await new Promise(resolve => setTimeout(() => resolve(videoRefs.current)), 0);
    const streams = prom;
    for(const [key, value] of Object.entries(streams)) {
      if(!value.streamID.active) {
        let {[key]: tmp, ...rest} = streams;
        setVideoStreams(rest);
        return;
      }
    }
  };

  return (
    <SocketContext.Provider value={{
      videoStreams,
      displayNameRef,
      roomName,
      setDisplayName,
      setRoomName,
      setParams
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export {SocketContext, SocketContextProvider};