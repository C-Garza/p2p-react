import {createInputs, joinInputs} from "../../data/homeInputs";
import CreateRoom from "../CreateRoom/CreateRoom";
import HomeHeader from "../HomeHeader/HomeHeader";
import JoinRoom from "../JoinRoom/JoinRoom";
import {mainHeader, subHeader} from "../../data/homeHeader";
import styles from "./HomeContainer.module.css";

const HomeContainer = () => {

  return(
    <div className={styles.container}>
      <section className={styles.header__container}>
        <HomeHeader mainHeader={mainHeader} subHeader={subHeader} cycle={true} />
      </section>
      <section className={`${styles.forms}`}>
        <CreateRoom header={"Create Room"} inputs={createInputs} />
        <JoinRoom header={"Join Room"} inputs={joinInputs} />
      </section>
    </div>
  );
};

export default HomeContainer;