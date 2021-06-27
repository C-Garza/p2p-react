import styles from "./VideoControlsButton.module.css";

const VideoControlsButton = ({buttonClass, spanClass, title, iconClass, handleClick, handleFocus}) => {
  return(
    <button 
      type="button" 
      className={`${buttonClass} ${styles.control__button}`} 
      title={title}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleFocus}
    >
      <span className={`${spanClass}`}><i className={iconClass}></i></span>
    </button>
  );
};

export default VideoControlsButton;