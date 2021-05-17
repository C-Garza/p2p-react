import {useState, useEffect, useRef, useContext} from "react";
import EditWrapper from "../EditWrapper/EditWrapper";
import useForm from "../../hooks/useForm";
import useStateToLocalStorage from "../../hooks/useStateToLocalStorage";
import { SocketContext } from "../../context/SocketContext";
import styles from "./Video.module.css";
import {nameInput} from "../../data/roomInputs";

const Video = ({stream, displayName, isTalking, gainStreams}) => {
  const video = useRef(stream);
  const {setDisplayName, stream: myStream} = useContext(SocketContext);
  const {values, setValues, handleChange, clearInput} = useForm({volume: gainStreams?.isHost ? 0 : 1, username: displayName});
  const [isMuted, setMuted] = useState(gainStreams?.isHost ? true : false);
  const [isVolumeFocused, setVolumeFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastName, setLastName] = useState(displayName);
  const [, setUserName] = useStateToLocalStorage("userName");

  const isMyStream = stream?.id === myStream?.id;

  //TO-DO: FIX STATE NOT UPDATING WHEN RANGE HITS 0
  if(gainStreams && values.volume >= 0) gainStreams.gainNode.gain.value = values.volume;

  const formInputs = nameInput.map(input => {
    return {
      ...input,
      [input.name]: values[input.name]
    }
  });

  useEffect(() => {
    if(video.current) {
      video.current.srcObject = stream;
    }
  }, [video, stream]);

  useEffect(() => {
    if(values.volume > 0 && isMuted) {
      setMuted(false);
    }
    if(values.volume <= 0 && !isMuted) {
      setMuted(true);
    }
  }, [values.volume, isMuted]);

  const handleClick = (e) => {
    if(isMuted) {
      setValues(values => ({...values, volume: 1}));
    }
    else {
      setValues(values => ({...values, volume: 0}));
    }
  };

  const handleNameClick = () => {
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
  }

  const volumeTitle = Math.floor(values.volume * 100);
  return (
    <div className={`${styles.container} ${isTalking ? styles.speaking : styles.silent}`}>
      <div className={styles.wrapper}>
        <video id={video.current.id} className={styles.video} playsInline ref={video} autoPlay muted></video>
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
          <div className={`${styles.controls} ${isVolumeFocused ? styles[`controls--focus`]: ""}`}>
            <button type="button" className={styles.volume__button} onClick={handleClick}>
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
        </div>
      </div>
    </div>
  );
};

export default Video;