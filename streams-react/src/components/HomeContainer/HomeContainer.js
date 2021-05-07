import {createInputs, joinInputs} from "../../data/homeInputs";
import CreateRoom from "../CreateRoom/CreateRoom";
import JoinRoom from "../JoinRoom/JoinRoom";
import styles from "./HomeContainer.module.css";

const HomeContainer = () => {

  return(
    <div className={styles.container}>
      <div className={`${styles.forms}`}>
        <CreateRoom header={"Create Room"} inputs={createInputs} />
        <JoinRoom header={"Join Room"} inputs={joinInputs} />
      </div>
    </div>
  );
};

export default HomeContainer;