import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView, StyleSheet, Text, TextInput, View,
  TouchableOpacity, ActivityIndicator, ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../ui/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TypingDots from './Typing';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';

const inputHeight = 70;

// New component for word-by-word animation
const AnimatedText = ({ message }) => {
  const [displayedText, setDisplayedText] = useState('');
  const words = message.split(' ');

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= words.length) {
        setDisplayedText(words.slice(0, currentIndex).join(' '));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [message]);

  return <Text style={styles.messageText}>{displayedText}</Text>;
};

export default function ChatBot() {
  const [chat, setChat] = useState([
    { sender: 'bot', message: 'Hello! How may I assist you today?', isTypingComplete: true }
  ]);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForBot, setWaitingForBot] = useState(false);
  const [user, setUser] = useState(null);
  const scrollViewRef = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);

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
    const ws = new WebSocket('ws://perfect-gabbey-bhaichara-19a32374.koyeb.app');
    ws.onopen = () => {
      setSocket(ws);
      setIsLoading(false);
    };
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setWaitingForBot(false);
        const botMessage = {
          sender: 'bot',
          message: data.message.toString(),
          isTypingComplete: false
        };
        setChat((prev) => [...prev, botMessage]);
        setIsLoading(false);

        setTimeout(() => {
          setChat(prev => prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, isTypingComplete: true } : msg
          ));
        }, data.message.split(' ').length * 200 + 500);
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

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat, waitingForBot]);

  const sendMessage = () => {
    if (!socket || !text.trim()) {
      console.log('Socket or text is empty');
      return;
    }
    setIsLoading(true);
    setWaitingForBot(true);
    const userMessage = {
      sender: 'user',
      message: text,
      isTypingComplete: true
    };
    socket.send(JSON.stringify({ message: text, _id: user.user._id }));
    setChat((prev) => [...prev, userMessage]);
    setText('');
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isNearBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50; // 50px threshold
    setShowScrollDown(!isNearBottom);
  };

  const scrollToBottom = () => {
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
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {chat.map((data, id) => (
            <View
              key={id}
              style={[{
                flexDirection: data.sender === 'bot' ? 'row' : 'row-reverse',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                gap: 5,
                marginVertical: 5,
              },
              data.sender === 'bot' ? { alignSelf: 'flex-start' } : { alignSelf: 'flex-end' },
              ]}
            >
              <View style={[
                data.sender === 'bot' ? styles.botMessage : styles.userMessage,
                {
                  padding: 7,
                  aspectRatio: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: Colors.background.accent,
                }
              ]}>
                <Icon
                  name={data.sender === 'bot' ? "robot" : "user-alt"}
                  size={18}
                  color={Colors.text.dark}
                />
              </View>
              <View
                style={[
                  styles.messageBubble,
                  data.sender === 'bot' ? styles.botMessage : styles.userMessage,
                ]}
              >
                <Text style={styles.messageText}>{data.message}</Text>
              </View>
            </View>
          ))}

          {waitingForBot && (
            <View style={[styles.messageBubble, {
              width: 'min-content',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: 5,
              marginVertical: 5,
            }]}>
              <View style={[
                styles.botMessage,
                {
                  padding: 7,
                  aspectRatio: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 50,
                  borderWidth: 1,
                  borderColor: Colors.background.accent,
                }
              ]}>
                <Icon
                  name={"robot"}
                  size={18}
                  color={Colors.text.dark}
                />
              </View>
              <View style={[styles.messageBubble, styles.botMessage]}>
                <TypingDots
                  dotSize={7}
                  dotColor="#888"
                  spacing={5}
                  animationDuration={1000}
                />
              </View>
            </View>
          )}
        </ScrollView>

        {showScrollDown && (
          <TouchableOpacity
            style={styles.scrollDownButton}
            onPress={scrollToBottom}
          >
            <Ionicons name="chevron-down" size={24} color={Colors.text.dark} />
          </TouchableOpacity>
        )}

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
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatContent: {
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
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
    fontSize: 15,
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
  scrollDownButton: {
    position: 'absolute',
    bottom: inputHeight + 20,
    alignSelf: 'center',
    backgroundColor: Colors.background.accent,
    padding: 10,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});