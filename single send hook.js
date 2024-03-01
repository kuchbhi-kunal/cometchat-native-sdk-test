import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import useSendMessage from './useSendMessage';
import { CometChat } from '@cometchat-pro/react-native-chat';


const App = () => {
  const { isInitialized, sendMessage } = useSendMessage();

  useEffect(() => {
    if (isInitialized) {
      let receiverID = "supergroup";
      let receiverType = CometChat.RECEIVER_TYPE.GROUP;
      let messageText = "Testing CometChat SDK";
      sendMessage(receiverID, messageText, receiverType);
    }
  }, [isInitialized]);

  return (
    <View style={styles.container}>
      <Text>ReactChat</Text>
      <StatusBar style="auto" />
    </View>
  );

  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
