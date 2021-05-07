import styles from "./SubmitButton.module.css";

const SubmitButton = ({text}) => {
  return(
    <button className={styles.button} type="submit">{text}</button>
  )
};

export default SubmitButton;