import {useState, useEffect, useRef} from "react";
import useForm from "../../hooks/useForm";
import styles from "./Video.module.css";

const Video = ({stream, displayName, isTalking, gainStreams}) => {
  const video = useRef(stream);
  const {values, setValues, handleChange} = useForm({volume: gainStreams?.isHost ? 0 : 1});
  const [isMuted, setMuted] = useState(gainStreams?.isHost ? true : false);
  const [isVolumeFocused, setVolumeFocused] = useState(false);

  //TO-DO: FIX STATE NOT UPDATING WHEN RANGE HITS 0
  if(gainStreams && values.volume >= 0) gainStreams.gainNode.gain.value = values.volume;

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

  const handleFocus = () => {
    setVolumeFocused(!isVolumeFocused);
  }

  const volumeTitle = Math.floor(values.volume * 100);
  return (
    <div className={`${styles.container} ${isTalking ? styles.speaking : styles.silent}`}>
      <div className={styles.wrapper}>
        <video id={video.current.id} className={styles.video} playsInline ref={video} autoPlay muted></video>
        <p className={styles.displayname}>{displayName || "Silly Goose"}</p>
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
  );
};

export default Video;