import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import useCometChat from './useCometChat';

const App = () => {
  const {
    isInitialized,
    user,
    messages,
    sendMessage,
    addMessageListener,
    listGroupMessages,
    // logout,
  } = useCometChat();

  const [messageText, setMessageText] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      if (isInitialized && user) {
        const receiverID = 'superhero1';

        // listener for incoming text
        addMessageListener('incoming_message_listener', {
          onTextMessageReceived: (textMessage) => {
            console.log('Text message received successfully', textMessage);
          },
        });

        // Retrieve group messages for a specific group (replace 'supergroup' with your group ID)
        listGroupMessages('supergroup');
      }
    };

    initializeApp();
  }, [isInitialized, user]);

  const handleSendMessage = () => {
    if (messageText && messageText.trim() !== '') {
      const receiverID = 'supergroup';
      sendMessage(receiverID, messageText.trim());
      setMessageText('');
    }
  };

  const loadMoreMessages = useCallback(async () => {
    setLoadingMore(true);
    try {
      // Load more messages, passing the current count of messages
      await listGroupMessages('supergroup', messages.length);
    } catch (error) {
      console.log('Error loading more messages:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [messages.length, listGroupMessages]);
  
  const handleEndReached = () => {
    if (!loadingMore && messages.length > 0) {
      loadMoreMessages();
    }
  };
  
  

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: '90%' }}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={
              item.sentBy?.uid === user?.uid
                ? styles.sentMessageContainer
                : styles.receivedMessageContainer
            }
          >
            {item.sentBy?.uid !== user?.uid && (
              <View style={styles.senderInfoContainer}>
                {item.sentBy?.avatar ? (
                  <Image
                    source={{ uri: item.sentBy?.avatar }}
                    style={styles.senderAvatar}
                  />
                ) : null}
                <Text style={[styles.senderName, styles.whiteText]}>
                  {item.sentBy?.uid}
                </Text>
              </View>
            )}
            <Text style={[styles.textMessage, { fontSize: 14 }]}>
              {item.text}
            </Text>
          </View>
        )}
        inverted={true}
        onEndReached={handleEndReached}
        onEndReachedThreshold={.9}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Message"
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
          />
          <Pressable
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: '90%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  input: {
    flex: 1,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 0,
    marginRight: 5,
    padding: 14,
    height: 42,
    backgroundColor: '#eeeeee',
  },
  senderInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  senderAvatar: {
    width: 27,
    height: 27,
    borderRadius: 100,
    marginRight: 5,
    backgroundColor: '#fff',
  },
  senderName: {
    fontWeight: '600',
    color: '#22548A',
    fontSize: 15,
  },
  receivedMessageContainer: {
    padding: 10,
    backgroundColor: '#f4f4f4',
    marginTop: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  sentMessageContainer: {
    padding: 10,
    backgroundColor: '#8BB9EB',
    marginTop: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
    textAlign: 'left',
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  textMessage: {
    color: '#000',
    flexWrap: 'wrap',
  },
  sendButton: {
    backgroundColor: '#22548A',
    padding: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 100,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 100,
    height: 41,
  },
  sendButtonText: {
    color: '#fff',
  },
});

export default App;
