import {useState} from "react";
import useForm from "../../hooks/useForm";
import CopyButton from "../CopyButton/CopyButton";
import EditWrapper from "../EditWrapper/EditWrapper";
import {roomInput} from "../../data/roomInputs";
import styles from "./VideoRoomHeader.module.css";

const VideoRoomHeader = ({room, setRoomName, isHost}) => {
  const {values, handleChange, clearInput} = useForm({room});
  const [isEditing, setIsEditing] = useState(false);
  const [lastRoomName, setLastRoomName] = useState(room);

  const formInputs = roomInput.map(input => {
    return {
      ...input,
      [input.name]: values[input.name]
    }
  });

  const handleClick = () => {
    if(!values.room.length && !isEditing) {
      setIsEditing(true);
    }
    if(values.room.length) {
      if(lastRoomName !== values.room) {
        setRoomName(values.room);
        setLastRoomName(values.room);
      }
      setIsEditing(!isEditing);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(lastRoomName !== values.room) {
      setRoomName(values.room);
      setLastRoomName(values.room);
    }
    setIsEditing(false);
  };

  return(
    <div className={styles.header}>
      <div className={`${styles.header__container} ${isEditing ? styles["header__container--active"] : ""}`}>
        {isHost
          ? <EditWrapper 
              inputs={formInputs} 
              handleChange={handleChange} 
              clearInput={clearInput}
              handleSubmit={handleSubmit}
              handleClick={handleClick}
              isEditing={isEditing}
            >
              <h1 className={styles.heading}>{room}</h1>
            </EditWrapper>
          : <h1 className={styles.heading}>{room}</h1>
        }
      </div>
      <CopyButton />
    </div>
  );
};

export default VideoRoomHeader;