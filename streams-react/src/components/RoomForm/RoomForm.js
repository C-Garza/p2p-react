import React from "react";
import SubmitButton from "../SubmitButton/SubmitButton";
import styles from "./RoomForm.module.css";

const RoomForm = ({inputs, handleChange, handleSubmit}) => {
  const renderInputs = inputs.map(input => {
    return (
      <React.Fragment key={input.name}>
        <label className={styles.label} htmlFor={input.id}>{input.label}</label>
        <input 
          id={input.id}
          className={styles.input}
          type={input.type} 
          name={input.name} 
          placeholder={input.label} 
          required={input.required}
          value={input[input.name]}
          onChange={handleChange}
        />
      </React.Fragment>
    );
  });

  return(
    <form className={styles.container} onSubmit={handleSubmit}>
      {renderInputs}
      <SubmitButton text="Join" />
    </form>
  );
};

export default RoomForm;