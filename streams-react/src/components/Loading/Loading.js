import styles from "./Loading.module.css";

const Loading = () => {
  return(
    <div className={styles.container}>
      <h2 className={styles.message}>Connecting to server...</h2>
      <div className={styles.loading}></div>
    </div>
  );
};

export default Loading;