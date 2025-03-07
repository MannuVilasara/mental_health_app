import React, { useEffect, useState } from 'react';
import { 
  Button, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function ChatBot() {
  const [chat, setChat] = useState([
    { sender: 'bot', message: 'Hello! How may I assist you today?' },
  ]);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = React.useRef();

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.86.191:5000');
    
    ws.onopen = () => {
      setSocket(ws);
      setIsLoading(false);
    };

    ws.onmessage = (e) => {
      try {
        const data = e.data;
        const botMessage = { sender: 'bot', message: data.toString() };
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

  const sendMessage = () => {
    if (!socket || !text.trim()) {
      console.log('Socket or text is empty');
      return;
    }

    setIsLoading(true);
    const userMessage = { sender: 'user', message: text };
    socket.send(text);
    setChat((prev) => [...prev, userMessage]);
    setText('');
    
    // Auto-scroll to bottom
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.heading}>AI Chat</Text>
        {isLoading && <ActivityIndicator size="small" color="#666" />}
      </View>

      <ScrollView 
        style={styles.chatContainer}
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContent}
      >
        {chat.map((data, id) => (
          <View 
            key={id} 
            style={[
              styles.messageBubble,
              data.sender === 'bot' ? styles.botMessage : styles.userMessage
            ]}
          >
            <Text style={styles.messageText}>{data.message}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setText}
          value={text}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          onSubmitEditing={sendMessage}
        />
        <Button 
          title="Send" 
          onPress={sendMessage}
          disabled={isLoading || !text.trim()}
          color="#007AFF"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
  },
  botMessage: {
    backgroundColor: '#E8ECEF',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
});