import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../ui/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';


const inputHeight = 70;

export default function ChatBot() {
  const [chat, setChat] = useState([
    { sender: 'bot', message: 'Hello! How may I assist you today?' },
  ]);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [callForWaiting, setCallForWaiting] = useState(false);
  const [user, setUser] = useState(null);
  const scrollViewRef = useRef();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('@auth');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error fetching user from AsyncStorage:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.86.191:5000');
    ws.onopen = () => {
      setSocket(ws);
      setIsLoading(false);
    };
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setCallForWaiting(data.waitingRequired);
        const botMessage = { sender: 'bot', message: data.message.toString() };
        setChat((prev) => [...prev, botMessage]);
        setIsLoading(false);
      } catch (error) {
        console.error('Message parsing error:', error);
      }
    };
    ws.onerror = (e) => {
      console.error('WebSocket error:', e.message);
      setIsLoading(false);
    };
    ws.onclose = (e) => {
      console.log('WebSocket closed:', e.code, e.reason);
      setSocket(null);
      setIsLoading(false);
    };
    return () => ws.close();
  }, []);

  // Add effect to scroll to bottom when chat updates
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat]);

  const sendMessage = () => {
    if (!socket || !text.trim()) {
      console.log('Socket or text is empty');
      return;
    }
    setIsLoading(true);
    const userMessage = { sender: 'user', message: text };
    socket.send(JSON.stringify({ message: text, _id: user.user._id }));
    setChat((prev) => [...prev, userMessage]);
    setText('');
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View style={styles.outerContainer}>
      <ImageBackground
        source={require('../../img/ChatBot/background.png')}
        style={styles.keyboardAvoidingContainer}
        resizeMode="cover"
      >
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {chat.map((data, id) => (
            <View
              key={id}
              style={[
                styles.messageBubble,
                data.sender === 'bot' ? styles.botMessage : styles.userMessage,
              ]}
            >
              <Text style={styles.messageText}>{data.message}</Text>
            </View>
          ))}
          {callForWaiting && <Text>Please wait...</Text>}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, isFocused ? { borderColor: Colors.background.accent } : { borderColor: 'transparent' }]}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={setText}
            value={text}
            placeholder="Type your message..."
            placeholderTextColor="#999"
            multiline
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={isLoading || !text.trim()}
            style={{
              backgroundColor: Colors.background.accent,
              padding: 10,
              borderRadius: 50,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.text.dark} />
            ) : (
              <Ionicons name="send" size={24} color={Colors.text.dark} />
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1, // Ensure the outer container takes up the full 
    backgroundColor: Colors.background.primary,
  },
  keyboardAvoidingContainer: {
    flex: 1, // Allow KeyboardAvoidingView to manage the layout
  },
  chatContainer: {
    flex: 1, // ScrollView takes up remaining space above the input
    padding: 10,
  },
  chatContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
  },
  botMessage: {
    backgroundColor: Colors.background.tertiary,
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: Colors.background.accent,
    color: 'white',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    height: inputHeight,
    padding: 10,
    backgroundColor: Colors.text.light,
    elevation: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -100 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    maxHeight: 100,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
    color: Colors.text.dark,
  },
});