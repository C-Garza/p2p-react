import {createContext, useState} from "react";

const ChatContext = createContext();

const ChatContextProvider = ({children}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatDimensions, setChatDimensions] = useState({width: 0});

return (
  <ChatContext.Provider value={{isChatOpen, setIsChatOpen, chatDimensions, setChatDimensions}}>
    {children}
  </ChatContext.Provider>
);
};

export {ChatContext, ChatContextProvider};