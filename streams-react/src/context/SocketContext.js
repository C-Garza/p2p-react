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
  const [hasWebcam, setHasWebcam] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [videoStreams, setVideoStreams] = useState({});
  const [peers, setPeers] = useState({});
  const [users, setUsers] = useState({});
  const [displayName, setDisplayName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isTalking, setIsTalking] = useState({});
  const [gainStreams, setGainStreams] = useState({});
  const [hasPeerError, setPeerError] = useState(false);
  const [hasSocketError, setSocketError] = useState(false);

  // TO DO: Find another solution for all these refs
  const videoRefs = useRef(videoStreams);
  const peersRefs = useRef(peers);
  const usersRefs = useRef(users);
  const displayNameRef = useRef(displayName);
  const roomNameRef = useRef(roomName);
  const shareScreenRef = useRef(shareScreen);

  useEffect(() => {
    // RUNS WHEN USER CHANGES NAME
    if(Object.keys(videoStreams).length && socket && displayName !== displayNameRef.current) {
      const newVideos = Object.entries(videoStreams).find(video => video[1].displayName === displayNameRef.current);
      changeDisplayName(newVideos[0], displayName);
      socket.emit("change-username", peer.id, displayNameRef.current, displayName);
    }
  }, [displayName, videoStreams]);

  useEffect(() => {
    // HANDLES ROOM NAME CHANGE
    if(roomName !== roomNameRef.current && socket && isHost) {
      socket.emit("change-roomname", roomNameRef.current, roomName);
    }
  }, [roomName, isHost]);

  useEffect(() => {
    // HANDLES WEBCAM CHANGE
    if(socket && stream.id) {
      changeWebcamStatus(stream.id, hasWebcam);
      if(Object.keys(peers).length) {
        socket.emit("change-webcam-status", peer.id, stream.id, hasWebcam);
      }
    }
  }, [hasWebcam, stream.id, peers]);

  useEffect(() => {
    // HANDLES SCREEN SHARING
    if(socket && stream.id && shareScreen !== shareScreenRef.current) {
      if(shareScreen) {
        navigator.mediaDevices.getDisplayMedia()
          .then(currentStream => {
            // EVENT LISTENER FOR WHEN CHROME STOP SHARE BUTTON CLICKED
            currentStream.getVideoTracks()[0].addEventListener("ended", () => {
              setShareScreen(false);
            });
            
            replaceVideoStream(stream, currentStream, peer);
          })
          .catch(e => {
            setShareScreen(false);
            console.log(e);
          });
      }
      else {
        navigator.mediaDevices.getUserMedia({video: {width: {min: 640}, height: {min: 480}}})
        .then(currentStream => {
          replaceVideoStream(stream, currentStream, peer);
        })
        .catch(e => {
          const video = fakeVideo();
          replaceVideoStream(stream, video, peer, true);
          setHasWebcam(false);
          console.log(e);
        });
      }
    }
  }, [shareScreen, stream]);

  useEffect(() => {
    // SET REFS SO EVENT LISTENERS CAN ACCESS CURRENT STATE
    videoRefs.current = videoStreams;
    peersRefs.current = peers;
    usersRefs.current = users;
    displayNameRef.current = displayName;
    roomNameRef.current = roomName;
    shareScreenRef.current = shareScreen;
  }, [videoStreams, peers, users, displayName, roomName, shareScreen]);

  useEffect(() => {
    const initSocket = () => {
      socket = io(process.env.REACT_APP_SOCKET_HOST, {
        reconnection: true
      });
      socket.on("peer-server-connected", () => {
        getStream();
      });
      socket.on("room-name", room => {
        setRoomName(room);
      });
      socket.on("is-host", (bool) => {
        setIsHost(bool);
      });
      socket.on("connect", e => {
        setSocketError(false);
      });
      socket.on("connect_error", e => {
        console.log(e);
        setSocketError(e);
      });
      socket.on("error", (e) => {
        console.log(e);
        setSocketError(e);
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
        setPeerError(false);
        socket.emit("join-room", params, id, displayNameRef.current, roomNameRef.current);
      });
      peer.on("error", (e) => {
        console.log(e);
        setPeerError(e);
        if(peer.disconnected && !peer.destroyed) peer.reconnect();
      });
    };

    const getStream = () => {
      navigator.mediaDevices.getUserMedia({video: {width: {min: 640}, height: {min: 480}}, audio: true})
        .then(currentStream => {
          // SET UP LISTENERS
          setUserConnection(currentStream, true);
          setPeerListeners(currentStream);
          const harkListeners = setUpVolumeControl(currentStream, true);

          // SET USER STREAM
          setStream(currentStream);
          setVideoStreams(videoStreams => ({
            ...videoStreams, 
            [currentStream.id]: {
              streamID: currentStream,
              displayName: displayNameRef.current,
              hark: harkListeners,
              hasWebcam: true
            }
          }));
          setHasWebcam(true);
        }).catch(e => {
          console.log(e);
          const currentStream = fakeAudio();
          const video = fakeVideo();
          currentStream.addTrack(video);

          // SET UP LISTENERS
          setUserConnection(currentStream, false);
          setPeerListeners(currentStream);
          const harkListeners = setUpVolumeControl(currentStream, true);

          // SET USER STREAM
          setStream(currentStream);
          setVideoStreams(videoStreams => ({
            ...videoStreams, 
            [currentStream.id]: {
              streamID: currentStream,
              displayName: displayNameRef.current,
              hark: harkListeners,
              hasWebcam: false
            }
          }));
          setHasWebcam(false);
      });
    };
    const setUserConnection = (stream, hasWebcam) => {
      socket.on("user-connected", userID => {
        connectToNewUser(userID, stream);
      });
      socket.on("user-disconnected", (userID) => {
        const peers = peersRefs.current;
        if(peers[userID]) {
          peers[userID].call.close();
          let {[userID]: tmp, ...rest} = peers;
          setPeers(rest);
        }
        socket.emit("get-users-list", null, false);
      });
      socket.on("users-list", userList => {
        setUsers({...userList});
      });
      socket.on("username-changed", (id, oldID, newUser) => {
        const peerStreamID = peersRefs.current[id].callStreamID.id;
        changeDisplayName(peerStreamID, newUser);
      });
      socket.on("webcam-status-changed", (id, newUsers, streamID, hasWebcam) => {
        setUsers({...newUsers});
        if(videoRefs.current[streamID]) {
          changeWebcamStatus(streamID, hasWebcam);
        }
      });
      socket.emit("get-users-list", hasWebcam);
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
      const options = {
        "constraints": {
          "mandatory": {
            "OfferToReceiveAudio": true,
            "OfferToReceiveVideo": true
          },
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 1,
        }
      };
      const call = peer.call(userID, stream, options);
  
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

      // TEMP FIX FOR AudioContext NEEDING USER GESTURE TO START
      // TO-DO: Create a state to show if AudioContext is suspended
      // and show text to click/press any key to hear sound
      speechEvents.on("volume_change", () => {
        if(audioCtx.state === "suspended") audioCtx.resume();
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
        socket.removeAllListeners();
        socket.close();
        socket = null;

        setStream(prevStream => {
          if(prevStream.id) {
            prevStream.getTracks().forEach(track => {
              track.stop();
            });
          }
          return {};
        });
        for(const value of Object.values(videoRefs.current)) {
          value.hark.stop();
        }

        peer.destroy();
        setHasWebcam(false);
        setVideoStreams({});
        setPeers({});
        setIsTalking({});
        setPeerError(false);
        setSocketError(false);
      }
    };
  }, [params]);

  const addVideo = (id, stream, call, callStreamID, harkListeners) => {
    setVideoStreams(videoStreams => ({
      ...videoStreams, 
      [stream.id]: {
        streamID: stream,
        displayName: usersRefs.current[id].displayName,
        hark: harkListeners,
        hasWebcam: usersRefs.current[id].hasWebcam
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

  const replaceVideoStream = (stream, currentStream, peer, isTrack) => {
    if(stream.getVideoTracks().length) {
      stream.getVideoTracks()[0].stop();
      stream.removeTrack(stream.getVideoTracks()[0]);
    }
    stream.addTrack(isTrack ? currentStream : currentStream.getVideoTracks()[0]);
    for(const [, value] of peer._connections) {
      // FIX PEERJS NOT CLEARING DESTROYED _CONNECTIONS
      if(value.length) {
        for(const connection of value[0].peerConnection?.getSenders()) {
          if(connection.track?.kind === "video" || connection.track === null) {
            connection.replaceTrack(isTrack ? currentStream : currentStream.getVideoTracks()[0]);
          }
        }
      }
    }
  };

  const changeDisplayName = (key, displayName) => {
    setVideoStreams(videos => ({...videos, [key]: {...videos[key], displayName}}));
  };

  const changeWebcamStatus = (key, hasWebcam) => {
    setVideoStreams(videos => ({...videos, [key]: {...videos[key], hasWebcam}}));
  };

  const fakeVideo = ({width = 640, height = 480} = {}) => {
    const canvas = Object.assign(document.createElement("canvas"), {width, height});
    canvas.getContext("2d").fillRect(0, 0, width, height);
    const stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], {enabled: false});
  };

  const fakeAudio = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const fakeAudio = audioCtx.createMediaStreamDestination();
    const currentStream = new MediaStream(fakeAudio.stream);

    return currentStream;
  }

  return (
    <SocketContext.Provider value={{
      socket,
      peer,
      stream,
      shareScreen,
      isHost,
      videoStreams,
      displayName,
      roomName,
      isTalking,
      gainStreams,
      users,
      hasPeerError,
      hasSocketError,
      setHasWebcam,
      setShareScreen,
      setDisplayName,
      setRoomName,
      setParams
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export {SocketContext, SocketContextProvider};