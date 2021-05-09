import {useState} from "react";
import {useLocation} from "react-router-dom";
import styles from "./CopyButton.module.css";

const CopyButton = () => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const searchParams = location.pathname.split("/");
  const roomID = searchParams[searchParams.length - 1];

  const handleClick = () => {
    if("clipboard" in navigator) {
      navigator.clipboard.writeText(roomID)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1000);
        }).catch(err => {
          console.log(err);
        });
    }
    else if(document.queryCommandSupported("copy")) {
      let tmp = document.getElementById("blank_copy_url");
      tmp.style.display = "block";
      tmp.value = roomID;
      tmp.focus();
      tmp.select();
      document.execCommand("copy");
      tmp.style.display = "none";
    }
  };

  return(
    <>
    <button className={styles.button} type="button" onClick={handleClick} disabled={copied}>
      {copied ? `Copied!` : `Copy Room ID`}
      <i className={`fas fa-copy ${styles.copy}`}></i>
    </button>
    <input id="blank_copy_url" className={styles.hidden}></input></>
  );
};

export default CopyButton;