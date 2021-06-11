import {useState, useEffect} from "react";
import styles from "./ChatUserMessage.module.css";

const ChatUserMessage = ({message}) => {
  const [hasURL, setHasURL] = useState(false);
  const [srcURL, setSrcURL] = useState("");
  const [messageURL, setMessageURL] = useState("");

  useEffect(() => {
    const checkMessagesForURL = () => {
      let regExp = null;
      let match = null;
      // https://stackoverflow.com/questions/28735459/how-to-validate-youtube-url-in-client-side-in-text-box
      if (message !== undefined || message !== "") { 
        regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      }
      let messages = message.replace(/\n/g, " ").split(" ");
      for(const value of messages) {
        match = value.match(regExp);
        if(match && match[1].length === 11) {
          setHasURL(true);
          setMessageURL(match[0]);
          setSrcURL(match[1]);
          return;
        }
      }
    };
    
    if(message.length) {
      checkMessagesForURL();
    }
  }, [message]);

  const handleStringToURL = () => {
    if(!hasURL) return message;

    let newMessage = message;
    let startIndex = message.indexOf(messageURL);
    let beginningString = newMessage.slice(0, startIndex);
    let link = <a href={messageURL}>{messageURL}</a>;
    let endString = newMessage.substring(startIndex + messageURL.length);
    newMessage = beginningString + link + endString;
    return (
      <>
        {beginningString}
        <a href={messageURL} className={styles.link} target="_blank" rel="noopener noreferrer" >{messageURL}</a>
        {endString}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <p className={styles.message}>{handleStringToURL()}</p>
      {hasURL &&
        <div className={styles.iframe__container}>
          <iframe 
            className={`embedded__video ${styles.iframe}`}
            title="video"
            type="text/html" 
            frameBorder="0" 
            height="200"
            allowFullScreen 
            src={`https://www.youtube.com/embed/${srcURL}?autoplay=1&enablejsapi=1&rel=0&version=3`}
          ></iframe>
        </div>
      }
    </div>
  );
};

export default ChatUserMessage;