import {createContext,useContext, useEffect, useState} from "react";
import { SocketContext } from "./SocketContext";

const ChatContext = createContext();

const ChatContextProvider = ({children}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatDimensions, setChatDimensions] = useState({width: 0});
  const [message, setMessage] = useState(``);
  const [isAtTop, setIsAtTop] = useState(false);
  const [hasOlderMessages, setHasOlderMessages] = useState(true);
  const [messageList, setMessageList] = useState([]);
  const [hasInitMessages, setHasInitMessages] = useState(false);
  const {socket, stream, displayName} = useContext(SocketContext);

  useEffect(() => {
    const handleJoinedRoom = () => {
      socket.emit("get-messages-list");
    };

    if(socket) {
      if(message) {
        const messageObj = {
          message: `${message}`,
          streamID: stream.id,
          createdAt: new Date().getTime(),
          userName: displayName,
          ogMeta: {}
        };
        socket.emit("send-message", messageObj);
        setMessage(``);
      }
      if(isAtTop && hasOlderMessages) {
        socket.emit("get-older-messages", 20);
      }
      socket.on("joined-room", handleJoinedRoom);
      socket.on("message-received", handleMessageReceived);
      socket.on("updated-message", handleUpdatedMessage);
      socket.on("older-messages-received", handleOlderMessagesReceived);
      socket.on("messages-list", handleMessagesList);
      socket.on("all-older-messages-received", handleAllOlderMessagesReceived);
    }

    return () => {
      if(socket) {
        socket.removeListener("joined-room", handleJoinedRoom);
        socket.removeListener("message-received", handleMessageReceived);
        socket.removeListener("updated-message", handleUpdatedMessage);
        socket.removeListener("older-messages-received", handleOlderMessagesReceived);
        socket.removeListener("messages-list", handleMessagesList);
        socket.removeListener("all-older-messages-received", handleAllOlderMessagesReceived);
      }
      else {
        setHasOlderMessages(true);
        setMessageList([]);
        setHasInitMessages(false);
        setIsAtTop(false);
      }
    };
  }, [socket, message, displayName, isAtTop, stream.id, hasOlderMessages]);

  const handleMessageReceived = (message) => {
    setMessageList(messages => [...messages, message]);
  };

  const handleUpdatedMessage = (message) => {
    setMessageList(msgs => msgs.map(msg => {
      if(msg.id === message.id) return message;
      return msg;
    }));
  };

  const handleOlderMessagesReceived = (messages) => {
    setMessageList(msgs => [...messages]);
    setIsAtTop(false);
  };

  const handleAllOlderMessagesReceived = (hasMessages) => {
    setHasOlderMessages(false);
  };

  const handleMessagesList = (messages) => {
    setMessageList(msgs => [...msgs, ...messages]);
    setHasInitMessages(hasMsgs => true);
  };

return (
  <ChatContext.Provider value={{
    isChatOpen, 
    chatDimensions, 
    messageList,
    hasOlderMessages,
    isAtTop,
    hasInitMessages,
    setIsChatOpen, 
    setChatDimensions,
    setMessage,
    setIsAtTop
  }}>
    {children}
  </ChatContext.Provider>
);
};

export {ChatContext, ChatContextProvider};