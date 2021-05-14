import {createContext, useState, useEffect, useRef} from "react";
import {io} from "socket.io-client";
import Peer from "peerjs";
import hark from "hark";

const SocketContext = createContext();

let socket = null;
let peer = null;

const SocketContextProvider = ({children}) => {
  const [params, setParams] = useState("");
  const [stream, setStream] = useState({});
  const [isHost, setIsHost] = useState(false);
  const [videoStreams, setVideoStreams] = useState({});
  const [peers, setPeers] = useState({});
  const [users, setUsers] = useState({});
  const [displayName, setDisplayName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isTalking, setIsTalking] = useState({});
  const [gainStreams, setGainStreams] = useState({});

  // TO DO: Find another solution for all these refs
  const streamRef = useRef(stream);
  const videoRefs = useRef(videoStreams);
  const peersRefs = useRef(peers);
  const usersRefs = useRef(users);
  const displayNameRef = useRef(displayName);
  const roomNameRef = useRef(roomName);

  useEffect(() => {
    // RUNS WHEN USER CHANGES NAME
    if(Object.keys(videoStreams).length && socket && displayName !== displayNameRef.current) {
      const newVideos = Object.entries(videoStreams).find(video => video[1].displayName === displayNameRef.current);
      changeDisplayName(newVideos[0], displayName);
      socket.emit("change-username", peer.id, displayNameRef.current, displayName);
    }
  }, [displayName, videoStreams]);

  useEffect(() => {
    if(roomName !== roomNameRef.current && socket && isHost) {
      socket.emit("change-roomname", roomName.current, roomName);
    }
  }, [roomName, isHost]);

  useEffect(() => {
    // SET REFS SO EVENT LISTENERS CAN ACCESS CURRENT STATE
    streamRef.current = stream;
    videoRefs.current = videoStreams;
    peersRefs.current = peers;
    usersRefs.current = users;
    displayNameRef.current = displayName;
    roomNameRef.current = roomName;
  }, [stream, videoStreams, peers, users, displayName, roomName]);

  useEffect(() => {
    const initSocket = () => {
      socket = io(process.env.REACT_APP_SOCKET_HOST, {
        reconnection: true
      });
      socket.on("users-list", userList => {
        setUsers({...userList});
      });
      socket.on("users-list-ready", () => {
        getStream();
      });
      socket.on("room-name", room => {
        setRoomName(room);
      });
      socket.on("is-host", (bool) => {
        setIsHost(bool);
      });
      socket.on("error", (e) => {
        console.log(e);
      });
    };
    
    const initPeer = () => {
      peer = new Peer({
        host: process.env.REACT_APP_PEERJS_HOST,
        secure: process.env.REACT_APP_SECURE === "true",
        port: process.env.REACT_APP_PEERJS_PORT,
        path: process.env.REACT_APP_PEERJS_PATH,
        key: "peerjs"
      });
      peer.on("open", id => {
        socket.emit("join-room", params, id, displayNameRef.current, roomNameRef.current);
      });
      peer.on("error", (e) => {
        console.log(e);
        if(peer.disconnected) peer.reconnect();
      });
    };

    const getStream = () => {
      navigator.mediaDevices.getUserMedia({video: {width: {min: 640}, height: {min: 480}}, audio: true})
        .then(currentStream => {
          // SET UP LISTENERS
          setUserConnection(currentStream);
          setPeerListeners(currentStream);
          const harkListeners = setUpVolumeControl(currentStream, true);

          // SET USER STREAM
          setStream(currentStream);
          setVideoStreams(videoStreams => ({
            ...videoStreams, 
            [currentStream.id]: {
              streamID: currentStream,
              displayName: usersRefs.current[peer.id].displayName,
              hark: harkListeners
            }
          }));
        }).catch(e => {
          console.log(e);
          const currentStream = fakeAudio();

          // SET UP LISTENERS
          setUserConnection(currentStream);
          setPeerListeners(currentStream);
          const harkListeners = setUpVolumeControl(currentStream, true);

          // SET USER STREAM
          setStream(currentStream);
          setVideoStreams(videoStreams => ({
            ...videoStreams, 
            [currentStream.id]: {
              streamID: currentStream,
              displayName: usersRefs.current[peer.id].displayName,
              hark: harkListeners
            }
          }));
      });
    };
    const setUserConnection = (stream) => {
      socket.on("user-connected", userID => {
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
      socket.on("username-changed", (id, oldID, newUser) => {
        const peerStreamID = peersRefs.current[id].callStreamID.id;
        changeDisplayName(peerStreamID, newUser);
      });
      socket.emit("stream-ready");
    };

    // Fixes PeerJS calling listener for every media track in call
    let callList = [];

    const setPeerListeners = (stream) => {
      // WHEN THE USER HAS CALLED
      peer.on("call", call => {
        call.answer(stream);
  
        // WHEN THE HOST RECIEVES A STREAM
        call.on("stream", userVideoStream => {
          if(!callList[call.peer]) {
            const harkListeners = setUpVolumeControl(userVideoStream, false);
            addVideo(call.peer, userVideoStream, call, userVideoStream, harkListeners);
            callList[call.peer] = call;
          }
          else {
            callList = [];
          }
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
        if(!callList[call.peer]) {
          const harkListeners = setUpVolumeControl(newUserStream, false);
          addVideo(userID, newUserStream, call, call._remoteStream, harkListeners);
          callList[call.peer] = call;
        }
        else {
          callList = [];
        }
      });
      // WHEN USER HAS CLOSED
      call.on("close", () => {
        removeVideo();
      });
    };

    const speechListeners = (stream, audioCtx, gainNode) => {
      const options = {threshold: -55, audioContext: audioCtx};
      const speechEvents = hark(stream, options, gainNode);
  
      speechEvents.on("speaking", () => {
        setIsTalking(streams => ({...streams, [stream.id]: true}));
      });
  
      speechEvents.on("stopped_speaking", () => {
        setIsTalking(streams => ({...streams, [stream.id]: false}));
      });
  
      return speechEvents;
    };
  
    const setUpVolumeControl = (stream, isHost) => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const gainNode = audioCtx.createGain();
      setGainStreams(streams => ({...streams, [stream.id]: {gainNode, isHost: isHost}}));
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      return speechListeners(stream, audioCtx, gainNode);
    };

    // IF IN ROOM SET UP LISTENERS
    if(params) {
      initSocket();
      initPeer();
    }

    return () => {
      if(socket && params) {
        socket.removeAllListeners("user-connected");
        socket.removeAllListeners("user-disconnected");
        socket.close();
        socket = null;
        if(streamRef.current.getAudioTracks().length) {
          streamRef.current.getAudioTracks()[0].stop();
        }
        if(streamRef.current.getVideoTracks().length) {
          streamRef.current.getVideoTracks()[0].stop();
        }
        for(const value of Object.values(videoRefs.current)) {
          value.hark.stop();
        }
        peer.destroy();
        setVideoStreams({});
        setPeers({});
        setIsTalking({});
      }
    };
  }, [params]);

  const addVideo = (id, stream, call, callStreamID, harkListeners) => {
    setVideoStreams(videoStreams => ({
      ...videoStreams, 
      [stream.id]: {
        streamID: stream,
        displayName: usersRefs.current[id].displayName,
        hark: harkListeners
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
        streams[key].hark.stop();
        setVideoStreams(rest);
        return;
      }
    }
  };

  const changeDisplayName = (key, displayName) => {
    setVideoStreams(videos => ({...videos, [key]: {...videos[key], displayName}}));
  };

  const fakeAudio = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const fakeAudio = audioCtx.createMediaStreamDestination();
    const currentStream = new MediaStream(fakeAudio.stream);

    return currentStream;
  }

  return (
    <SocketContext.Provider value={{
      stream,
      isHost,
      videoStreams,
      displayNameRef,
      roomName,
      isTalking,
      gainStreams,
      setDisplayName,
      setRoomName,
      setParams
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export {SocketContext, SocketContextProvider};