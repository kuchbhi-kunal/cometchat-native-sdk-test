import { useEffect, useState } from 'react';
import { CometChat } from '@cometchat-pro/react-native-chat';

const useCometChat = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const initializeCometChat = async () => {
      let appID = "251811d5c11b95f7";
      let region = "in";
      let appSetting = new CometChat.AppSettingsBuilder()
        .subscribePresenceForAllUsers()
        .setRegion(region)
        .autoEstablishSocketConnection(true)
        .build();
  
      try {
        await CometChat.init(appID, appSetting);
        setIsInitialized(true);
        const loggedInUser = await CometChat.getLoggedinUser();
        if (!loggedInUser) {
          const loggedUser = await CometChat.login("superhero1", "72474af98bc1f639ddd4afa4067b2603e822a322");
          setUser(loggedUser);
        } else {
          setUser(loggedInUser);
        }
  
        // Fetch initial group messages
        listGroupMessages('supergroup');
      } catch (error) {
        console.log("Initialization failed with error:" + error);
      }
    };
  
    initializeCometChat();
  
    return () => {
    };
  }, []);
  

  const sendMessage = async (receiverID, messageText) => {
    try {
      const receiverType = CometChat.RECEIVER_TYPE.GROUP;
      const textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);
      
      // Set the sender information for consistency
      const sentMessage = { ...textMessage, sentBy: user };
  
      // Add the sent message to state
      setMessages((prevMessages) => [sentMessage, ...prevMessages]); // Append at the beginning
  
      await CometChat.sendMessage(textMessage);
      console.log("Message sent successfully:", sentMessage);
    } catch (error) {
      console.log("Message sending failed with error:", error);
    }
  };
  
  const addMessageListener = (listenerID, messageListener) => {
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: async (textMessage) => {
          // Fetch sender information to get avatar URL
          try {
            const sender = await CometChat.getUser(textMessage.sender.uid);
            const receivedMessage = { ...textMessage, sentBy: sender };
  
            // Add the received message to state
            setMessages((prevMessages) => [receivedMessage, ...prevMessages]); // Append at the beginning
  
            if (messageListener && messageListener.onTextMessageReceived) {
              messageListener.onTextMessageReceived(receivedMessage);
            }
          } catch (error) {
            console.log("Error fetching sender information:", error);
          }
        },
      })
    );
  };
  

  const listGroupMessages = async (groupID, messageCount = 20) => {
    try {
      // Replace MAX_ALLOWED_LIMIT with the actual maximum allowed limit for fetching messages
      const MAX_ALLOWED_LIMIT = 100; // Example: Set the maximum allowed limit to 100
  
      // Check if the requested message count exceeds the maximum allowed limit
      const limit = Math.min(messageCount, MAX_ALLOWED_LIMIT);
  
      // Determine the oldest message ID in the current message list
      const oldestMessageID = messages.length > 0 ? messages[messages.length - 1].id : undefined;
  
      const messagesRequest = new CometChat.MessagesRequestBuilder()
        .setGUID(groupID)
        .setLimit(limit)
        .setUID(oldestMessageID) // Fetch messages older than the oldest message ID
        .build();
  
      const messageList = await messagesRequest.fetchPrevious();
  
      const formattedMessages = messageList.map((message) => ({
        id: message.id,
        text: message.text,
        sentAt: message.sentAt,
        sentBy: message.sender,
      }));
  
      // Update the state with the fetched messages
      setMessages((prevMessages) => {
        // Filter out any duplicate messages
        const uniqueMessages = formattedMessages.filter(message => !prevMessages.some(prevMessage => prevMessage.id === message.id));
        return [...prevMessages, ...uniqueMessages];
      });
  
      console.log("Group messages fetched successfully:", formattedMessages);
    } catch (error) {
      if (error.code === "ERROR_SET_LIMIT_EXCEEDED") {
        console.log("Error: Maximum message limit exceeded");
      } else {
        console.log("Error fetching group messages:", error);
      }
    }
  };
  
  
  
  

  return {
    isInitialized,
    user,
    messages,
    sendMessage,
    addMessageListener,
    // logout,
    listGroupMessages,
  };
};

export default useCometChat;
