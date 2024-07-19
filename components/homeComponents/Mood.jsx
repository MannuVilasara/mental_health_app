import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../context/authContext';
import url from '../../context/url';

const Mood = () => {
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
    <View style={{ marginHorizontal: 15 }}>
      <StatusBar backgroundColor={'#ededed'} />
      <View>
        <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 10 }}>
          <View style={{ width: '70%' }}>
            <Text style={[styles.color_black, { fontSize: 20, fontWeight: 600, fontFamily: 'Poppins-SemiBold' }]}>
              Hello {state?.user.name}
            </Text>
            <Text
              style={[
                styles.color_black,
                { fontSize: 15, marginTop: 5, marginBottom: 5 },
              ]}>
              How are you feeling now?
            </Text>
          </View>
          <View
            style={{
              width: '30%',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <Image style={styles.image} source={require('../../img/icons/assets/LoginSignup/userProfile.png')} /> 
            {/* <Text style={{backgroundColor:'rgba(111,145,103,0.7)', fontFamily:'Poppins-SemiBold', fontSize:19, borderRadius:150, height: 50, width: 50, textAlign:'center', textAlignVertical:'center', borderColor:'rgba(177, 252, 3,0.3)', borderWidth: 7}}>{streak}</Text>  */}
          </View>
        </View>

        <View style={styles.emojiContainer}>
          <TouchableOpacity onPress={() => { setFeel('sad'); setFeelNumber(0); handleClick(); }}>
            <View style={styles.emojiBox}>
              <Image
                style={styles.emojis}
                source={require('../../img/emoji/sad.png')}
              />
            </View>
            <Text
              style={[
                styles.color_black,
                styles.centerText,
                { marginTop: 4, fontWeight: 600 },
              ]}>
              Sad
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setFeel('normal'); setFeelNumber(1); handleClick(); }}>
            <View style={styles.emojiBox}>
              <Image
                style={styles.emojis}
                source={require('../../img/emoji/smile.png')}
              />
            </View>
            <Text
              style={[
                styles.color_black,
                styles.centerText,
                { marginTop: 4, fontWeight: 600 },
              ]}>
              Normal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setFeel('happy'); setFeelNumber(2); handleClick(); }}>
            <View style={styles.emojiBox}>
              <Image
                style={styles.emojis}
                source={require('../../img/emoji/happy.png')}
              />
            </View>
            <Text
              style={[
                styles.color_black,
                styles.centerText,
                { marginTop: 4, fontWeight: 600 },
              ]}>
              Happy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { setFeel('excited'); setFeelNumber(3); handleClick(); }}>
            <View style={styles.emojiBox}>
              <Image
                style={styles.emojis}
                source={require('../../img/emoji/excited.png')}
              />
            </View>
            <Text
              style={[
                styles.color_black,
                styles.centerText,
                { marginTop: 4, fontWeight: 600 },
              ]}>
              Excited
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Mood;

const styles = StyleSheet.create({
  color_black: {
    fontFamily: 'Poppins-Medium',
    color: '#444444',
  },
  centerText: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    color: '#444444',
  },
  emojis: {
    height: 35,
    width: 35,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiBox: {
    height: 70,
    width: 70,
    backgroundColor: '#ededed',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor:'rgba(177, 252, 3,0.3)', borderWidth: 7
  },
});
