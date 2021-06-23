import { useContext } from "react";
import {Link} from "react-router-dom";
import { ChatContext } from "../../context/ChatContext";
import { SocketContext } from "../../context/SocketContext";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const {isChatOpen, setIsChatOpen} = useContext(ChatContext);
  const {socket} = useContext(SocketContext);

  const handleClick = () => {
    setIsChatOpen(c => !c);
  };

  const handleKeyDown = (e) => {
    if(e.keyCode === 32 || e.keyCode === 13) {
      handleClick();
    }
  };

  return(
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.logo__container}>
          <Link to="/" className={styles.logo}>P2P React</Link>
          <div className={styles.underline}></div>
        </div>
        <div className={`${socket ? styles.hamburger : styles.hidden}`} onClick={handleClick} onKeyDown={handleKeyDown} tabIndex="0">
          <div className={`${styles.line} ${styles.line__one} ${isChatOpen ? styles.hidden : styles["line__one--closed"]}`}></div>
          <div className={`${styles.line} ${styles.line__two} ${isChatOpen ? styles.hidden : styles["line__two--closed"]}`}></div>
          <div className={`${styles.line} ${styles.line__three} ${isChatOpen ? styles.hidden : styles["line__three--closed"]}`}></div>
          <div className={`${styles.line} ${styles.line__one} ${isChatOpen ? styles["line__one--open"] : styles.hidden}`}></div>
          <div className={`${styles.line} ${styles.line__two} ${isChatOpen ? styles["line__two--open"] : styles.hidden}`}></div>
          <div className={`${styles.line} ${styles.line__three} ${isChatOpen ? styles["line__three--open"] : styles.hidden}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;