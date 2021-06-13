import {useRef, useContext, useEffect} from "react";
import ChatUser from "../ChatUser/ChatUser";
import {ChatContext} from "../../context/ChatContext";
import styles from "./ChatMessages.module.css";

const ChatMessages = () => {
  const {messageList, isAtTop, setIsAtTop, hasOlderMessages, hasInitMessages} = useContext(ChatContext);
  const containerRef = useRef(null);
  const bottomMessagesRef = useRef(null);

  const lastScrollHeight = containerRef.current?.scrollHeight;

  useEffect(() => {
    const newMessageScroll = () => {
      if(!containerRef.current) return;

      const scrollTop = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight;
      const height = containerRef.current.clientHeight;

      if(scrollHeight === height && hasInitMessages && !isAtTop && hasOlderMessages) {
        setIsAtTop(true);
        return;
      }
      if(messageList.length && hasOlderMessages) {
        containerRef.current.scrollTop = scrollHeight - lastScrollHeight;
      }
      if((scrollHeight - scrollTop) <= (height + 125) && scrollHeight !== height) {
        bottomMessagesRef.current?.scrollIntoView();
      }
    };

    newMessageScroll();
  }, [messageList, isAtTop, lastScrollHeight, hasOlderMessages, setIsAtTop, hasInitMessages]);

  useEffect(() => {
    let containerRefValue = null;

    const handleScroll = () => {
      const scrollTop = containerRef.current.scrollTop;
  
      if(scrollTop === 0 && messageList.length && hasOlderMessages) {
        setIsAtTop(prev => true);
      }
      else {
        setIsAtTop(false);
      }
    };

    if(containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
      containerRefValue = containerRef.current;
    }

    return () => {
      if(containerRefValue) {
        containerRefValue.removeEventListener("scroll", handleScroll);
      }
    };
  }, [messageList, hasOlderMessages, setIsAtTop])

  const combineMessages = (messagesData) => {
    if(!messagesData.length) return [];

    let messages = messagesData.map(obj => ({...obj}));
    let newMessages = [];
    let currentUser = messages[0];
    currentUser.message = [currentUser.message];
    currentUser.id = [currentUser.id];
    currentUser.ogMeta = [currentUser.ogMeta];

    for(let i = 1; i < messages.length; i++) {
      if(!Array.isArray(currentUser.message)) currentUser.message = [currentUser.message];
      if(messages[i].streamID === currentUser.streamID) {
        currentUser.message = [...currentUser.message, messages[i].message];
        currentUser.id = [...currentUser.id, messages[i].id];
        currentUser.ogMeta = [...currentUser.ogMeta, messages[i].ogMeta];
        
      }
      else {
        newMessages.push(currentUser);
        currentUser = messages[i];
        currentUser.message = [currentUser.message];
        currentUser.id = [currentUser.id];
        currentUser.ogMeta = [currentUser.ogMeta];
      }
    }
    
    newMessages.push(currentUser);
    return newMessages;
  };

  const renderMessages = () => {
    const messages = combineMessages(messageList);
    return messages.map((msg)=> {
      return <ChatUser key={msg.id[0]} messageData={msg} />;
    });
  };

  return(
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        {hasOlderMessages
          ? <div className={isAtTop ? styles.loading : ""}></div>
          : <p className={styles.welcome__message}>Welcome to the Chat Room!</p>
        }
      </div>
      {renderMessages()}
      <div ref={bottomMessagesRef}></div>
    </div>
  );
};

export default ChatMessages;