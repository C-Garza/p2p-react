import {useState, useEffect} from "react";
import isURL from "validator/lib/isURL";
import styles from "./ChatUserMessage.module.css";

const ChatUserMessage = ({message, ogMeta}) => {
  const [hasURL, setHasURL] = useState(false);
  const [srcURL, setSrcURL] = useState("");

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
    let messageArr = message.replace(/\n/g, " ").split(" ");
    let linksArray = messageArr.filter(msg => isURL(msg, {require_protocol: true}));
    if(!linksArray.length) return message;

    let finalMessageArray = [];
    let linkIndex = 0;
    let startIndex = 0;
    let beginningString = 0;
    let link = null;

    for(let i = 0; i < linksArray.length; i++) {
      linkIndex = message.substring(beginningString).indexOf(linksArray[i]) + beginningString;
      beginningString = message.slice(startIndex, linkIndex);
      link = {link: linksArray[i]};
      finalMessageArray.push(beginningString, link);
      startIndex = linkIndex + linksArray[i].length;
      beginningString = linkIndex + linksArray[i].length;
    }
    finalMessageArray.push(message.slice(startIndex));

    return finalMessageArray.map((msg, i) => {
      if(typeof msg === "string") return <span key={i}>{msg}</span>
      return <a key={i} href={msg.link} className={styles.link} target="_blank" rel="noopener noreferrer">{msg.link}</a>;
    });
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
            src={`https://www.youtube.com/embed/${srcURL}?autoplay=0&enablejsapi=1&rel=0&version=3`}
          ></iframe>
        </div>
      }
      {!hasURL && ogMeta.success && 
        <div className={styles.ogCard__container}>
          <a href={ogMeta.requestUrl} className={styles.ogCard__link} target="_blank" rel="noopener noreferrer">
            <div className={`${styles.ogCard__image__container} ${ogMeta.ogImage ? "" : styles.hidden}`}>
              <img src={ogMeta.ogImage?.url} alt={ogMeta.ogTitle} className={styles.ogCard__image} />
            </div>
            <div className={styles.ogCard__description__container}>
              <p className={styles.ogCard__description}>{ogMeta.ogTitle}</p>
            </div>
          </a>
        </div>
      }
    </div>
  );
};

export default ChatUserMessage;