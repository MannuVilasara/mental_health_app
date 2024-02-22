import {StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Alert} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Header from '../Header';
import {ScrollView} from 'react-native-gesture-handler';
import { AuthContext } from '../../context/authContext';
import url from '../../context/url';

const Mood = () => {
  //globale
  const [state] = useContext(AuthContext)
  const {token} = state
  //feeling
  const [feelNumber, setFeelNumber] = useState(null); // Initialize with null to avoid setting to 0 unintentionally
  const [feel, setFeel] = useState('');

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
      // Handle success
      Alert.alert('Updated', `You are feeling ${feel}`);
      setFeelNumber(null); // Reset to null after successful submission
      setFeel('');
    })
    .catch(error => {
      // Handle error
      // console.error('There was a problem with the fetch operation:', error);
    });
  };
  return (
    <View>
      <StatusBar backgroundColor={'#ededed'} />
      <View>
        <View style={{flexDirection: 'row', marginBottom: 20, marginTop: 10}}>
          <View style={{width: '70%'}}>
            <Text style={[styles.color_black, {fontSize: 20, fontWeight: 600}]}>
              Hello {state?.user.name}
            </Text>
            <Text
              style={[
                styles.color_black,
                {fontSize: 15, marginTop: 5, marginBottom: 5},
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
            <Image style={styles.image} source={require('../../img/logo1.jpg')} />
          </View>
        </View>

        <View style={styles.emojiContainer}>

          <TouchableOpacity onPress={()=>{{setFeel('sad')} {setFeelNumber(0)} handleClick()}}>
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
                {marginTop: 4, fontWeight: 600},
              ]}>
              Sad
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>{{setFeel('normal')} {setFeelNumber(1)} handleClick()}}>
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
                {marginTop: 4, fontWeight: 600},
              ]}>
              Normal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>{{setFeel('happy')} {setFeelNumber(2)} handleClick()}}>
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
                {marginTop: 4, fontWeight: 600},
              ]}>
              Happy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>{{setFeel('excited')} {setFeelNumber(3)} handleClick()}}>
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
                {marginTop: 4, fontWeight: 600},
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
    color: 'black',
  },
  centerText: {
    // backgroundColor: 'yellow',
    textAlign: 'center',
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
    borderColor: 'white',
    borderWidth: 2,
  },
});
