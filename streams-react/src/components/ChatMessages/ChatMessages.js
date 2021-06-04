import ChatUser from "../ChatUser/ChatUser";
import styles from "./ChatMessages.module.css";

const ChatMessages = () => {

  const testData = [
    {
      userName: "Chris",
      streamID: "stream1",
      message: `Hello there!`,
      createdAt: new Date().getTime()
    },
    {
      userName: "Chris",
      streamID: "stream1",
      message: `Second message!`,
      createdAt: new Date().getTime()
    },
    {
      userName: "Hans",
      streamID: "stream2",
      message: `How you doing?`,
      createdAt: new Date().getTime()
    },
    {
      userName: "Chris",
      streamID: "stream1",
      message: `Third Message!`,
      createdAt: new Date().getTime()
    }
  ];

  const combineMessages = (testData) => {
    if(!testData.length) return [];

    let messages = [...testData];
    let newMessages = [];
    let currentUser = messages[0];

    for(let i = 1; i < messages.length; i++) {
      if(messages[i].userName === currentUser.userName) {
        currentUser.message += `\n${messages[i].message}`;
      }
      else {
        newMessages.push(currentUser);
        currentUser = messages[i];
      }
    }
    
    newMessages.push(currentUser);
    return newMessages;
  };

  const renderMessages = () => {
    const messages = combineMessages(testData);
    return messages.map((msg, i)=> {
      return <ChatUser key={msg.createdAt + i} messageData={msg} />;
    });
  };

  return(
    <div className={styles.container}>
      {renderMessages()}
    </div>
  );
};

export default ChatMessages;