import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../../context/authContext';
import { Dimensions } from 'react-native';


export default function LoginScreen({ navigation }) {
  //global
  const [state, setState] = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert('All fields are compulsory');
        setLoading(false);
        return;
      }

      loginUser();
      console.log(`Login Data: `, { email, password });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const loginUser = () => {
    let data = { email, password };
    fetch('http://192.168.190.191:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          // Login successful, store received data
          response.json().then(data => {
            setState(data);
            storeData(data);
            navigation.navigate('MainApp');
          });
        } else {
          // Login failed, show error message from server
          response.json().then(data => {
            Alert.alert('Login failed', data.message);
          });
        }
      })
      .catch(error => {
        // Network error or other issues
        console.error('Error during login:', error);
        Alert.alert(
          'Login failed',
          'Please check your network connection and try again.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('@auth', JSON.stringify(value));
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@auth');
      if (value !== null) {
        console.log(`stored data: ${value}`);
      }
    } catch (e) {
      console.log(e);
    }
  };
  getData();

  // Get the dimensions of the screen
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Calculate the aspect ratio of the original image
  const originalAspectRatio = 1956 / 1516;

  // Calculate the width based on the screen width
  const imageWidth = screenWidth * 0.7; // Adjust the percentage as needed

  // Calculate the height based on the width and the aspect ratio
  const imageHeight = imageWidth / originalAspectRatio;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1,backgroundColor:'rgba(111,145,103,0.8)', }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
        <View style={{flexDirection:'row', alignItems:'center', alignContent:'center',margin:10}}>
      <TouchableOpacity
        style={styles.backButton} // Add or modify a style for the back button
        onPress={() => {
           navigation.navigate('Welcome');
        }}>
         <Image
             source={require('../../../../img/icons/assets/LoginSignup/backbutton.png')}
          />
      </TouchableOpacity>
      <Text style={styles.heading}>Login</Text>
        </View>

      <View style={styles.curvedcontainer}>
        <Image
          source={require('../../../../img/icons/assets/LoginSignup/loginImg2.png')}
          style={{ width: imageWidth, height: imageHeight }}
          resizeMode="cover"
        />
      </View>

      <ScrollView contentContainerStyle={styles.maincontainer}>
        <Text style={styles.heading2}>Enter your details</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Your email id"
            placeholderTextColor={'gray'}
            onChangeText={email => {
              setEmail(email);
            }}
            value={email}
          />
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Your password"
              placeholderTextColor={'gray'}
              secureTextEntry={!showPassword}
              onChangeText={text => {
                setPassword(text);
              }}
              value={password}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => {
                setShowPassword(!showPassword);
              }}>
              <Image
                source={
                  showPassword
                    ? require('../../../../img/icons/assets/LoginSignup/eye.png')
                    : require('../../../../img/icons/assets/LoginSignup/closedeye.png')
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>{!loading ? 'Login' : 'Logging in...'}</Text>
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.signupText, styles.signupLink]}> Sign-up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  curvedcontainer: {
    height: '35%',
    overflow: 'hidden',
    justifyContent:'center',
    alignItems:'center'
    // paddingVertical: 40,
    // paddingHorizontal: 70,
  },
  fullscreen: {
    width: '100%',
    height: '100%',
  },
  maincontainer: {
    flexGrow: 1,
    backgroundColor: 'rgba(240, 240, 240, 0.9)',
    paddingTop: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 7
    // backgroundColor:'blue'
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign:'center',
    textDecorationLine:'underline'
    // backgroundColor:'blue'
  },
  formContainer: {
    flex: 0.5,
    justifyContent: 'center',
    // backgroundColor:'orange'
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
    // backgroundColor:'green'
  },
  input: {
    height: 'auto',
    borderColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    color: 'black'
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'black',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 'auto',
    fontSize: 16,
    color:'black'
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 0,
  },
  eyeIcon: {
    width: 20,
    height: 16,
  },
  loginButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  signupLink: {
    textDecorationLine: 'underline',
  },
  backButton: {
    // position: 'absolute',
    // top: 10, 
    // left: 10, 
    // zIndex: 10,
  },
});
