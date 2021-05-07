import {BrowserRouter, Switch, Route} from "react-router-dom";
import HomeContainer from "./HomeContainer/HomeContainer";
import RoomContainer from "./RoomContainer/RoomContainer";
import styles from "./App.module.css";

const App = () => {

  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={HomeContainer} />
        <Route path="/room/:id" component={RoomContainer} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;