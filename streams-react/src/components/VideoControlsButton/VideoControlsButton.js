import styles from "./VideoControlsButton.module.css";

const VideoControlsButton = ({buttonClass, title, iconClass, handleClick, handleFocus}) => {
  return(
    <button 
      type="button" 
      className={`${buttonClass} ${styles.control__button}`} 
      title={title}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleFocus}
    >
      <i className={iconClass}></i>
    </button>
  );
};

export default VideoControlsButton;