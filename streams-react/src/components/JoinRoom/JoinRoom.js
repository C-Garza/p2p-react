import {useState} from "react";
import {useHistory} from "react-router-dom";
import RoomForm from "../RoomForm/RoomForm";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import useForm from "../../hooks/useForm";
import useStateToLocalStorage from "../../hooks/useStateToLocalStorage";
import styles from "./JoinRoom.module.css";

const JoinRoom = ({header, inputs}) => {
  const history = useHistory();
  const {values, handleChange, clearInput} = useForm({username: "", room: ""});
  const [, setUsername] = useStateToLocalStorage("userName");
  const [, setRoomName] = useStateToLocalStorage("roomName");
  const [fetchError, setFetchError] = useState(false);


  const formInputs = inputs.map(input => {
    return {
      ...input,
      [input.name]: values[input.name]
    }
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setUsername(values.username);
      await setRoomName("");
      history.push(`/room/${values.room}`);
    } catch(e) {
      setFetchError(e);
      console.log(e);
    }
  };

  return(
    <div className={styles.container}>
      <h1 className={styles.header}>{header}</h1>
      <RoomForm inputs={formInputs} handleChange={handleChange} handleSubmit={onSubmit} clearInput={clearInput} />
      <ErrorMessage error={fetchError} />
    </div>
  );
};

export default JoinRoom;