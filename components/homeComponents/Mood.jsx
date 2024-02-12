import {StyleSheet, Text, View, Image, StatusBar} from 'react-native';
import React, { useContext } from 'react';
import Header from '../Header';
import {ScrollView} from 'react-native-gesture-handler';
import { AuthContext } from '../../context/authContext';

const Mood = () => {
  //globale
  const [state] = useContext(AuthContext)
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
          <View>
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
          </View>

          <View>
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
          </View>

          <View>
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
          </View>

          <View>
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
          </View>
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
