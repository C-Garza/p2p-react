import FormInputs from "../FormInputs/FormInputs";
import SubmitButton from "../SubmitButton/SubmitButton";
import styles from "./RoomForm.module.css";

const RoomForm = ({inputs, handleChange, handleSubmit, clearInput}) => {

  return(
    <form className={styles.container} onSubmit={handleSubmit}>
      <FormInputs inputs={inputs} handleChange={handleChange} clearInput={clearInput} />
      <SubmitButton text="Join" />
    </form>
  );
};

export default RoomForm;