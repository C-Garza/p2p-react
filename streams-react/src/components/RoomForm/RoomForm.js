import React from "react";
import SubmitButton from "../SubmitButton/SubmitButton";
import styles from "./RoomForm.module.css";

const RoomForm = ({inputs, handleChange, handleSubmit}) => {
  const handleClick = async (e, name) => {
    if("clipboard" in navigator) {
      const text = await navigator.clipboard.readText();
      const synthEvent = {
        target: {
          name,
          value: text
        }
      };
      handleChange(synthEvent);
    }
    else {
      const input = document.getElementById(e);
      input.focus();
      document.execCommand("paste");
    }
  };

  const renderInputs = inputs.map(input => {
    return (
      <React.Fragment key={input.name}>
        <label className={styles.label} htmlFor={input.id}>{input.label}</label>
        <div className={`${styles.container} ${styles.container__input}`}>
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
          <button id={`${input.id}__paste`} className={styles.paste} type="button" onClick={() => handleClick(input.id, input.name)}>
            <i className={`fas fa-clipboard`}></i>
          </button>
        </div>
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