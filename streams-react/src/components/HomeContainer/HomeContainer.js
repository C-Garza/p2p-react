import {createInputs, joinInputs} from "../../data/homeInputs";
import CreateRoom from "../CreateRoom/CreateRoom";
import JoinRoom from "../JoinRoom/JoinRoom";

const HomeContainer = () => {

  return(
    <div className="container">
      <CreateRoom header={"Create A Video Room"} inputs={createInputs} />
      <JoinRoom header={"Join A Video Room"} inputs={joinInputs} />
    </div>
  );
};

export default HomeContainer;