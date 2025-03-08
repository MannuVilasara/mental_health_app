import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../context/authContext';
import url from '../../context/url';
import { Colors } from '../../ui/Colors';
import Icon from 'react-native-vector-icons/Feather';

const Mood = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const { token } = state;

  const [feelNumber, setFeelNumber] = useState(null);
  const [feel, setFeel] = useState('');

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    loadStreak();
  }, []);

  useEffect(() => {
    if (feel !== '' && feelNumber !== null) {
      handleClick();
    }
  }, [feel, feelNumber]);

  const handleClick = () => {
    let data = { feelNumber, feel };
    fetch(`${url}/api/v1/feel/send`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(result => {
        Alert.alert('Updated', `You are feeling ${feel}`);
        updateStreak();
        setFeelNumber(null);
        setFeel('');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const updateStreak = async () => {
    const updatedStreak = streak + 1;
    console.log('Updated Streak:', updatedStreak);
    setStreak(updatedStreak);
    try {
      await AsyncStorage.setItem('streak', updatedStreak.toString());
      console.log('Streak updated in AsyncStorage');
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const loadStreak = async () => {
    try {
      const savedStreak = await AsyncStorage.getItem('streak');
      if (savedStreak !== null) {
        const parsedStreak = parseInt(savedStreak);
        console.log('Loaded Streak:', parsedStreak);
        setStreak(parsedStreak);
      }
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };


  return (
    <View>
      <StatusBar backgroundColor={'#ededed'} />
      <View style={styles.moodContainer}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>
              Hello, <Text style={styles.userName}>{state?.user.name}</Text>
            </Text>
            <Image style={styles.profileImage} source={require('../../img/icons/assets/LoginSignup/userProfile.png')} />
          </View>

          <TouchableOpacity
            onPress={() => navigation?.navigate('chatWithAI')}
            style={styles.chatButton}
          >
            <Icon name="message-circle" size={20} color={Colors.text.dark} style={styles.chatIcon} />
            <Text style={styles.chatButtonText}>Chat with personal assistant...</Text>
            <View style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.moodSection}>
          <Text style={styles.moodTitle}>How are you feeling now?</Text>
          <View style={styles.emojiContainer}>
            {[
              { feel: 'sad', emoji: require('../../img/emoji/sad.png') },
              { feel: 'normal', emoji: require('../../img/emoji/smile.png') },
              { feel: 'happy', emoji: require('../../img/emoji/happy.png') },
              { feel: 'excited', emoji: require('../../img/emoji/excited.png') }
            ].map((item, index) => (
              <TouchableOpacity
                key={item.feel}
                onPress={() => {
                  setFeel(item.feel);
                  setFeelNumber(index);
                  handleClick();
                }}
                style={styles.emojiButton}
              >
                <View style={[styles.emojiBox, feel === item.feel && styles.selectedEmojiBox]}>
                  <Image style={styles.emoji} source={item.emoji} />
                </View>
                <Text style={styles.emojiText}>{item.feel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View >
  );
};

export default Mood;

const styles = StyleSheet.create({
  moodContainer: {
    backgroundColor: Colors.background.accent,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    padding: 20,
  },
  header: {
    gap: 20,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    color: Colors.text.light,
    fontFamily: 'Poppins-Regular',
  },
  userName: {
    fontFamily: 'Poppins-SemiBold',
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    padding: 12,
    borderRadius: 25,
    gap: 10,
  },
  chatButtonText: {
    flex: 1,
    color: Colors.text.dark,
    fontFamily: 'Poppins-Regular',
  },
  shareButton: {
    backgroundColor: Colors.background.accent,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  shareButtonText: {
    color: Colors.text.light,
    fontFamily: 'Poppins-SemiBold',
  },
  moodSection: {
    marginTop: 20,
  },
  moodTitle: {
    fontSize: 18,
    color: Colors.text.light,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 15,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  emojiButton: {
    alignItems: 'center',
    gap: 8,
  },
  emojiBox: {
    height: 60,
    width: 60,
    backgroundColor: Colors.background.primary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  selectedEmojiBox: {
    borderWidth: 2,
    borderColor: Colors.background.accent,
  },
  emoji: {
    height: 35,
    width: 35,
  },
  emojiText: {
    color: Colors.text.light,
    fontFamily: 'Poppins-SemiBold',
    textTransform: 'capitalize',
  },
});
