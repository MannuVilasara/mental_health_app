import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen({ navigation }) {
  const [showNewButtons, setShowNewButtons] = useState(false);
  const opacity1 = useRef(new Animated.Value(1)).current;

  const handleButtonClick = () => {
    Animated.timing(opacity1, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setShowNewButtons(true);
      Animated.timing(opacity1, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
      }).start();
    });
  };

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      <View style={styles.curvedcontainer}>
        <Image
          source={require('../../../../img/icons/assets/LoginSignup/img2.png')}
          style={styles.fullscreen}
          resizeMode="cover"
        />
      </View>

      <View style={styles.maincontainer}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            height: '95%',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
          <Text style={styles.welcometext}> Welcome </Text>
          {!showNewButtons ? (
            <>
              <Animated.View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  opacity: opacity1,
                }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.push('Login');
                  }}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  opacity: opacity1,
                }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('SignUp');
                  }}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <>
              <Animated.View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  opacity: opacity1,
                }}>
                <TouchableOpacity
                  style={styles.buttonPatient}
                  onPress={() => {
                    navigation.push('Login');
                  }}>
                  <Text style={styles.buttonText}>Login as Patient</Text>
                </TouchableOpacity>
              </Animated.View>
              <Animated.View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  opacity: opacity1,
                }}>
                <TouchableOpacity
                  style={styles.buttonPatient}
                  onPress={() => {
                    navigation.navigate('Login');
                  }}>
                  <Text style={styles.buttonText}>Login as Doctor</Text>
                </TouchableOpacity>
              </Animated.View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  curvedcontainer: {
    height: '48%',
    width: '100%',
  },
  fullscreen: {
    width: '100%',
    height: '100%',
  },
  maincontainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 40,
  },
  button: {
    width: '65%',
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonPatient: {
    width: '80%',
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  welcometext: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'black',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
});
