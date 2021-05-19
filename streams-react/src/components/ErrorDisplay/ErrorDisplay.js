import styles from "./ErrorDisplay.module.css";

const ErrorDisplay = ({error}) => {
  return(
    <div className={styles.error}>
      <p className={styles.error__message}>Error: {error.type}: {error.message}</p>
    </div>
  );
};

export default ErrorDisplay;