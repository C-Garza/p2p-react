import {Link} from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
  return(
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>P2P React</Link>
        <div className={styles.underline}></div>
      </div>
    </nav>
  );
};

export default NavBar;