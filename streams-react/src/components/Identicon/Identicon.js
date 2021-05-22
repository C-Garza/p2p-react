import {createAvatar} from "@dicebear/avatars";
import * as avatarStyle from "@dicebear/avatars-identicon-sprites";
import styles from "./Identicon.module.css";

const Identicon = ({seed}) => {
  const identicon = createAvatar(avatarStyle, {
    seed,
    dataUri: true
  });

  return(
    <img className={styles.identicon} src={identicon} alt="identicon" />
  );
};

export default Identicon;