import React from "react";
import SubmitButton from "../SubmitButton/SubmitButton";

const RoomForm = ({inputs, handleChange, handleSubmit}) => {
  const renderInputs = inputs.map(input => {
    return (
      <React.Fragment key={input.name}>
        <label htmlFor={input.label}>{input.label}</label>
        <input 
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
    <form onSubmit={handleSubmit}>
      {renderInputs}
      <SubmitButton text="Join" />
    </form>
  );
};

export default RoomForm;