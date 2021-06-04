import {createContext, useState} from "react";

const ChatContext = createContext();

const ChatContextProvider = ({children}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

return (
  <ChatContext.Provider value={{isChatOpen, setIsChatOpen}}>
    {children}
  </ChatContext.Provider>
);
};

export {ChatContext, ChatContextProvider};