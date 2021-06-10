import React, {useState, useRef, useEffect, createRef} from "react";
import styles from "./FormInputs.module.css";

const FormInputs = ({inputs, handleChange, clearInput, handleSubmit}) => {
  const textAreaHeightStyle = 40;
  const [isFocused, setFocused] = useState(false);
  const [currentFocus, setCurrentFocus] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState(textAreaHeightStyle);
  const textAreaRefs = useRef(inputs.map(() => createRef()));

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

  useEffect(() => {
    const textAreaResize = (textArea) => {
      textArea.style.height = "0px";
      const scrollHeight = textArea.scrollHeight;
      textArea.style.height = scrollHeight + "px";
      setTextAreaHeight(scrollHeight);
    };

    for(let value of textAreaRefs.current) {
      const textArea = value.current;
      if(!textArea) return;
      textAreaResize(textArea);
    }
  }, [inputs]);

  useEffect(() => {
    const textAreaRefsValue = textAreaRefs.current;
    const handleEnterPress = (e) => {
      if(e.keyCode === 13 && !e.shiftKey) {
        handleSubmit(e);
      }
    };
    for(let value of textAreaRefs.current) {
      const textArea = value.current;
      if(!textArea) return;
      textArea.addEventListener("keypress", handleEnterPress);
    }

    return () => {
      for(let value of textAreaRefsValue) {
        const textArea = value.current;
        if(!textArea) return;
        textArea.removeEventListener("keypress", handleEnterPress);
      }
    }
  }, [inputs, handleSubmit]);

  const renderInputs = inputs.map((input, i) => {
    let formInput = null;
    switch(input.formType) {
      case "textarea":
        formInput = <textarea
          id={input.id}
          className={`${styles.input} ${styles.textarea}`}
          style={{height: `${textAreaHeight}px`}}
          name={input.name} 
          placeholder={input.label} 
          required={input.required}
          value={input[input.name]}
          onChange={handleChange}
          autoComplete={input.autoComplete}
          ref={textAreaRefs.current[i]}
        ></textarea>
        break;
      default:
        formInput = <input 
          id={input.id}
          className={styles.input}
          type={input.type} 
          name={input.name} 
          placeholder={input.label} 
          required={input.required}
          value={input[input.name]}
          onChange={handleChange}
          maxLength={input.max}
          autoComplete={input.autoComplete}
        />
    };
    return (
      <React.Fragment key={input.name}>
        <label className={styles.label} htmlFor={input.id}>{input.label}</label>
        <div className={`${styles.container} ${styles.container__input}`}>
          {formInput}
          <div 
            className={
              `${styles.input__options} 
              ${isFocused && currentFocus === input.id ? styles["input__options--active"] : ""}
              ${input.formType === "textarea" ? textAreaHeight + 4 === textAreaHeightStyle ? "" : styles.move__scrollbar : ""}`
            }
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