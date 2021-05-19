import styles from "./Loading.module.css";

const Loading = () => {
  return(
    <div className={styles.container}>
      <p className={styles.message}>Loading...</p>
    </div>
  );
};

export default Loading;