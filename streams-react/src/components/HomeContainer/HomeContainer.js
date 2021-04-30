import {useState} from "react";
import {useHistory} from "react-router-dom";
import RoomForm from "../RoomForm/RoomForm";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import useForm from "../../hooks/useForm";
import homeInputs from "../../data/homeInputs";

const HomeContainer = () => {
  const history = useHistory();
  const {values, handleChange, resetForm, clearForm} = useForm({username: "", room: ""});
  const [fetchError, setFetchError] = useState(false);

  const inputs = homeInputs.map(input => {
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
      history.push(`/room/${uuid}`);
      console.log(uuid);
    } catch(e) {
      setFetchError(e);
      console.log(e);
    }
  };

  return(
    <div className="container">
      <h1>Join A Video Room</h1>
      <RoomForm inputs={inputs} handleChange={handleChange} handleSubmit={onSubmit} />
      <ErrorMessage error={fetchError} />
    </div>
  );
};

export default HomeContainer;