import {useState, useEffect, useContext} from "react";
import EditWrapper from "../EditWrapper/EditWrapper";
import useForm from "../../hooks/useForm";
import useStateToLocalStorage from "../../hooks/useStateToLocalStorage";
import { SocketContext } from "../../context/SocketContext";
import styles from "./VideoControls.module.css";
import {nameInput} from "../../data/roomInputs";

const VideoControls = ({stream, hasWebcam, displayName, gainStreams, handleMuted, handleFullScreen, isFullScreen}) => {
  const {setDisplayName, stream: myStream, setHasWebcam, shareScreen, setShareScreen} = useContext(SocketContext);
  const {values, setValues, handleChange, clearInput} = useForm({volume: gainStreams?.isHost ? 0 : 1, username: displayName});
  const [isMuted, setMuted] = useState(gainStreams?.isHost ? true : false);
  const [isVolumeFocused, setVolumeFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastName, setLastName] = useState(displayName);
  const [, setUserName] = useStateToLocalStorage("userName");
  const [playVideo, setPlayVideo] = useState(stream?.getVideoTracks()[0].enabled ? true : false);
  const [playMic, setPlayMic] = useState(stream?.getAudioTracks().length ? true : false);
  const [isMyStream] = useState(stream?.id === myStream?.id);
  const [isFocused, setIsFocused] = useState(false);

  const formInputs = nameInput.map(input => {
    return {
      ...input,
      [input.name]: values[input.name]
    }
  });

  //TO-DO: FIX STATE NOT UPDATING WHEN RANGE HITS 0
  if(gainStreams && values.volume >= 0) gainStreams.gainNode.gain.value = values.volume;

  useEffect(() => {
    if(values.volume > 0 && isMuted) {
      setMuted(false);
      handleMuted();
    }
    if(values.volume <= 0 && !isMuted) {
      setMuted(true);
      handleMuted();
    }
  }, [values.volume, isMuted, handleMuted]);

  useEffect(() => {
    if(hasWebcam) {
      setPlayVideo(p => true);
    }
    else {
      setPlayVideo(p => false);
    }
  }, [hasWebcam]);

  const handleMicClick = () => {
    if(!stream.getAudioTracks().length) return;
    if(playMic) {
      stream.getAudioTracks()[0].enabled = false;
      setPlayMic(false);
    }
    else {
      stream.getAudioTracks()[0].enabled = true;
      setPlayMic(true);
    }
    handleMuted();
  };

  const handleVideoClick = () => {
    if(!stream.getVideoTracks().length) return;
    if(stream.getVideoTracks()[0].canvas) return;
    if(playVideo) {
      stream.getVideoTracks()[0].enabled = false;
      setPlayVideo(false);
      setHasWebcam(false);
    }
    else {
      stream.getVideoTracks()[0].enabled = true;
      setPlayVideo(true);
      setHasWebcam(true);
    }
  };

  const handleScreenClick = () => {
    setShareScreen(!shareScreen);
  };

  const handleVolumeClick = (e) => {
    if(isMuted) {
      setValues(values => ({...values, volume: 1}));
    }
    else {
      setValues(values => ({...values, volume: 0}));
    }
  };

  const handleNameClick = () => {
    if(!values.username.length && !isEditing) {
      setIsEditing(true);
    }
    if(values.username.length) {
      if(lastName !== values.username) {
        setUserName(values.username);
        setDisplayName(values.username);
        setLastName(values.username);
      }
      setIsEditing(!isEditing);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(lastName !== values.username) {
      setUserName(values.username);
      setDisplayName(values.username);
      setLastName(values.username);
    }
    setIsEditing(false);
  };

  const handleFocus = () => {
    setVolumeFocused(!isVolumeFocused);
    setIsFocused(!isFocused);
  };

  const handleControlsFocus = () => {
    setIsFocused(!isFocused);
  };

  const volumeTitle = Math.floor(values.volume * 100);

  return(
    <div className={styles.video__tray}>
      <EditWrapper 
        inputs={formInputs} 
        handleChange={handleChange} 
        clearInput={clearInput}
        handleSubmit={handleSubmit}
        handleClick={handleNameClick}
        isEditing={isEditing}
        hidden={true}
        formStyles={isEditing ? "formDisplayName--active" : "formDisplayName"}
      >
        <button 
          type="button" 
          className={`${styles.displayname} ${isMyStream ? "" : styles["displayName--disabled"]}`} 
          onClick={handleNameClick}
          disabled={!isMyStream}
        >
          {displayName || "Silly Goose"}
        </button>
      </EditWrapper>
      <div className={`${styles.controls__tray} ${isFocused ? styles["controls__tray--active"] : ""}`}>
        {isMyStream
          ? <>
              <button 
                type="button" 
                className={`${styles.video__button} ${styles.control__button}`} 
                title={playVideo ? "Stop Video" : "Show Video"}
                onClick={handleVideoClick}
                onFocus={handleControlsFocus}
                onBlur={handleControlsFocus}
              >
                <i className={`fas ${!playVideo ? `fa-video-slash ${styles["button--stop"]}` : `fa-video`}`}></i>
              </button>
              <button 
                type="button" 
                className={`${styles.mic__button} ${styles.control__button}`} 
                title={playMic ? "Mute" : "Unmute"}
                onClick={handleMicClick}
                onFocus={handleControlsFocus}
                onBlur={handleControlsFocus}
              >
                <i className={`fas ${!playMic ? `fa-microphone-slash ${styles["button--stop"]}` : `fa-microphone`}`}></i>
              </button>
              <button 
                type="button" 
                className={`${styles.screen__button} ${styles.control__button}`}
                title={shareScreen ? "Stop Screen Share" : "Share Screen"}
                onClick={handleScreenClick}
                onFocus={handleControlsFocus}
                onBlur={handleControlsFocus}
              >
                <i className={`fas fa-desktop ${!shareScreen ? "" : styles["button--stop"]}`}></i>
              </button>
            </>
          : <div className={`${styles.volume__controls} ${isVolumeFocused ? styles[`volume__controls--focus`]: ""}`}>
              <button type="button" className={styles.volume__button} onClick={handleVolumeClick} onFocus={handleControlsFocus} onBlur={handleControlsFocus}>
                <i className={`fas ${!isMuted ? `fa-volume-up`: `fa-volume-mute`} ${styles.volume}`}></i>
              </button>
              <input 
                className={styles.slider}
                type="range" 
                min="-0.01"
                max="2" 
                step="0.01" 
                name="volume"
                value={values.volume} 
                title={volumeTitle}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFocus}
              />
            </div>
        }
        <button
          type="button"
          className={`${styles.fullscreen__button} ${styles.control__button}`}
          title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
          onClick={handleFullScreen}
          onFocus={handleControlsFocus}
          onBlur={handleControlsFocus}
        >
          <i className={`fas ${!isFullScreen ? "fa-expand" : "fa-compress"}`}></i>
        </button>
      </div>
    </div>
  );
};

export default VideoControls;