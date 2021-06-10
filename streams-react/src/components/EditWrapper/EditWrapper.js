import FormInputs from "../FormInputs/FormInputs";
import styles from "./EditWrapper.module.css";

const EditWrapper = ({inputs, clearInput, handleSubmit, handleChange, handleClick, isEditing, children, hidden = false, formStyles="", hideButton=false}) => {
  return(
    <form className={styles[formStyles]} onSubmit={handleSubmit}>
      {isEditing
        ? <FormInputs inputs={inputs} handleChange={handleChange} clearInput={clearInput} handleSubmit={handleSubmit}/>
        : children
      }
      <button 
        type="button" 
        className={
          `${styles.edit} 
          ${isEditing ? styles["edit--active"] : ""} 
          ${hidden && !isEditing ? styles.hidden : ""}
          ${hideButton ? styles.hidden : ""}
          `
        } 
        onClick={handleClick}
      >
        {isEditing
          ? <i className="far fa-check-circle"></i>
          :
            <i className={`fas fa-edit`}></i>
        }
      </button>
    </form>
  );
};

export default EditWrapper;