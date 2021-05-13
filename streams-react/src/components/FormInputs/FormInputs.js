import React, {useState} from "react";
import styles from "./FormInputs.module.css";

const FormInputs = ({inputs, handleChange, clearInput}) => {
  const [isFocused, setFocused] = useState(false);
  const [currentFocus, setCurrentFocus] = useState("");

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

  const handleFocus = (e) => {
    const id = e.target.id.split("__");
    setFocused(!isFocused);
    setCurrentFocus(id[0]);
  }

  const handleBlur = () => {
    setFocused(!isFocused);
    setCurrentFocus("");
  }

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
          <div 
            className={`
              ${styles.input__options} 
              ${isFocused && currentFocus === input.id ? styles["input__options--active"] : ""}
            `}
          >
            <button 
              id={`${input.id}__clear`}
              type="button" 
              className={styles.clear} 
              onClick={() => clearInput(input.name)}
              onFocus={handleFocus} 
              onBlur={handleBlur}
            >
              <i className="fas fa-times"></i>
            </button>
            <button 
              id={`${input.id}__paste`} 
              className={styles.paste} 
              type="button" 
              onClick={() => handleClick(input.id, input.name)}
              onFocus={handleFocus} 
              onBlur={handleBlur}
            >
              <i className={`fas fa-clipboard`}></i>
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  });
  return renderInputs;
};

export default FormInputs;