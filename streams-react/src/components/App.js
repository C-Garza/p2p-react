import {BrowserRouter, Switch, Route} from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import HomeContainer from "./HomeContainer/HomeContainer";
import RoomContainer from "./RoomContainer/RoomContainer";
import styles from "./App.module.css";

const App = () => {

  return(
    <BrowserRouter>
      <NavBar />
      <div style={{height: "70px"}}></div>
      <Switch>
        <Route path="/" exact component={HomeContainer} />
        <Route path="/room/:id" component={RoomContainer} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;