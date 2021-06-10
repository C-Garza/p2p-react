import {useEffect, useState, useRef, useContext} from "react";
import useForm from "../../hooks/useForm";
import {ChatContext} from "../../context/ChatContext";
import {messageInputs} from "../../data/messageInputs";
import {emojiTrayMap} from "../../data/emojiTrayMap";
import EditWrapper from "../EditWrapper/EditWrapper";
import {Picker, Emoji, emojiIndex} from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import styles from "./ChatInput.module.css";

const ChatInput = () => {
  const {values, handleChange, handleAdd, clearInput} = useForm({message: ""});
  const [showEmojis, setShowEmojis] = useState(false);
  const [trayEmoji, setTrayEmoji] = useState("blush");
  const [sent, setSent] = useState(false);
  const {setMessage} = useContext(ChatContext);
  const hasConvertedRef = useRef(false);
  const nodeRef = useRef(null);

  const formInputs = messageInputs.map(input => {
    return {
      ...input,
      [input.name]: values[input.name]
    }
  });

  useEffect(() => {
    const convertInputToEmoji = (userText) => {
      if(!userText.length) return;
      const textArray = userText.split(" ");
      let newValues = [];
  
      for(let value of textArray) {
        if(value[0] !== ":") {
          newValues.push(value);
          continue;
        }
  
        let emojiArray = [];
        let isEmojiCode = value[value.length - 1] === ":" && value.length > 1;
  
        if(isEmojiCode) value = value.replaceAll(":", "");
  
        emojiArray = emojiIndex.search(value).filter(emoji => {
          if(!isEmojiCode && emoji.emoticons.length) {
            for(let emoticon of emoji.emoticons) {
              if(emoticon === value) return emoji.native;
            }
          }
          if(value === emoji.id) return emoji.native;
          return false
        });
        
        if(emojiArray.length) newValues.push(emojiArray[0].native);
        else {
          newValues.push(value);
        }
      }
  
      let newText = newValues.join(" ");
      if(newText !== userText) {
        const pseudoTarget = {target : {value: newText, name: "message"}};
        hasConvertedRef.current = true;
        handleChange(pseudoTarget);
      }
    };

    if(!hasConvertedRef.current) {
      convertInputToEmoji(values.message);
    }
    else {
      hasConvertedRef.current = false;
    }
  }, [values, handleChange]);

  useEffect(() => {
    if(showEmojis) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    else {
      window.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showEmojis]);

  const handleClickOutside = (e) => {
    if(nodeRef.current.contains(e.target)) return;

    setShowEmojis(false);
  };

  const handleClick = () => {
    setShowEmojis(!showEmojis);
  };

  const handleSendClick = () => {
    if(values.message.length) {
      setMessage(values.message);
      clearInput("message");
      setSent(true);
      setTimeout(() => {setSent(false)}, 900);
    }
  };

  const handleSendSubmit = (e) => {
    e.preventDefault();
    handleSendClick();
  }
  
  const handleEmojiHover = () => {
    let newEmoji = emojiTrayMap[Math.floor(Math.random() * emojiTrayMap.length)];
    while(newEmoji === trayEmoji) {
      newEmoji = emojiTrayMap[Math.floor(Math.random() * emojiTrayMap.length)];
    }
    setTrayEmoji(newEmoji);
  };

  const handleEmoji = (e) => {
    const pseudoTarget = {target : {value: e.native, name: "message"}};
    handleAdd(pseudoTarget);
  };

  return(
    <div className={styles.container}>
      <div className={styles.input__container}>
        <EditWrapper 
          inputs={formInputs} 
          handleChange={handleChange} 
          clearInput={clearInput} 
          handleSubmit={handleSendSubmit} 
          isEditing={true} 
          hideButton={true}
        />
      </div>
      <div className={styles.controls__container}>
        <div ref={nodeRef} className={styles.emoji__container}>
          <button 
            type="button" 
            title={"Pick your emoji..."}
            className={styles.emoji__button} 
            onClick={handleClick} 
            onMouseOver={handleEmojiHover}
          >
            <Emoji emoji={trayEmoji} size={18} native={true} />
          </button>
          {showEmojis &&
            <div className={styles.emoji__mart}>
              <Picker 
                title={"Pick your emoji..."} 
                onSelect={handleEmoji}
                emoji={"wave"}
                native={true}
              />
            </div>
          }
        </div>
        <button type="button" className={`${styles.send__button}`} onClick={handleSendClick}>
          <i className={`fas fa-play ${styles.send__icon} ${sent ? styles["send__button--active"] : ""}`}></i>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;