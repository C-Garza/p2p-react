import {useState} from "react";
import {useHistory} from "react-router-dom";
import RoomForm from "../RoomForm/RoomForm";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import useForm from "../../hooks/useForm";
import useStateToLocalStorage from "../../hooks/useStateToLocalStorage";

const CreateRoom = ({header, inputs}) => {
  const history = useHistory();
  const {values, handleChange} = useForm({username: "", room: ""});
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
      const res = await fetch("/api/uuid");
      const uuid = (await res.json()).id;
      setUsername(values.username);
      setRoomName(values.room);
      history.push(`/room/${uuid}`);
      console.log(uuid);
    } catch(e) {
      setFetchError(e);
      console.log(e);
    }
  };

  return(
    <div>
      <h1>{header}</h1>
      <RoomForm inputs={formInputs} handleChange={handleChange} handleSubmit={onSubmit} />
      <ErrorMessage error={fetchError} />
    </div>
  );
};

export default CreateRoom;