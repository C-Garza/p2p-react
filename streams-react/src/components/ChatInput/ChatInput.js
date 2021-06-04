import FormInputs from "../FormInputs/FormInputs";
import useForm from "../../hooks/useForm";
import styles from "./ChatInput.module.css";
import {messageInputs} from "../../data/messageInputs";

const ChatInput = () => {
  const {values, handleChange, clearInput} = useForm({message: ""});

  const formInputs = messageInputs.map(input => {
    return {
      ...input,
      [input.name]: values[input.name]
    }
  });

  return(
    <div className={styles.container}>
      <div className={styles.input__container}>
        <FormInputs inputs={formInputs} handleChange={handleChange} clearInput={clearInput} />
      </div>
      <div className={styles.controls__container}>
        <button type="button" className={styles.send__button}><i className="fas fa-play"></i></button>
      </div>
    </div>
  );
};

export default ChatInput;