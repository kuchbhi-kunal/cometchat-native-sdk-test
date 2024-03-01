import { useEffect, useState } from 'react';
import { CometChat } from '@cometchat-pro/react-native-chat';




const useSendMessage = () => {
  const [isInitialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        let appID = "251999cf28304704";
        let region = "in";
        let appSetting = new CometChat.AppSettingsBuilder()
          .subscribePresenceForAllUsers()
          .setRegion(region)
          .autoEstablishSocketConnection(true)
          .build();

        await CometChat.init(appID, appSetting);

        const user = await CometChat.getLoggedinUser();
         
        if (!user) {
          const authToken = "superhero1_1706774936dec58897370136976d6d52a5dd6624";
          const uid = "superhero1";
          const authKey = "72474af98bc1f639ddd4afa4067b2603e822a322"
          await CometChat.login(uid, authKey);
        }

        setInitialized(true);
      } catch (error) {
        console.log("Initialization failed with error:" + error);
      }
    };

    initializeChat();
  }, []);

  const sendMessage = async (receiverID, messageText, receiverType) => {
    try {
      const textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);
      const message = await CometChat.sendMessage(textMessage);
      console.log("Message sent successfully:", message);
    } catch (error) {
      console.log("Message sending failed with error:", error);
    }
  };

  return { isInitialized, sendMessage };
};

export default useSendMessage;
