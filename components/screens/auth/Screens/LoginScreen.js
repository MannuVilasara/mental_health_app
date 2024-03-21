import React, {useContext, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../../../context/authContext';
import {Dimensions} from 'react-native';
import url from '../../../../context/url';
import LinearGradient from 'react-native-linear-gradient';

export default function LoginScreen({navigation}) {
  //global
  const [state, setState] = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [LoginFormVisibility,setLoginFormVisiblity]= useState(false);
  const [LoginFormButtonVisibility,setLoginFormButtonVisiblity]= useState(true);

  const [UserType,setUserType]=useState('');


  console.log(state.url);
  console.log(state);
 const handlePatientUserType = () =>{
    setUserType('patient');

    setLoginFormButtonVisiblity(false)
    setLoginFormVisiblity(true);

 };

 const handleDoctorUserType = () =>{
  setUserType('doctor');

  
  setLoginFormButtonVisiblity(false);
  setLoginFormVisiblity(true);
 };

  const handleLogin = () => {
    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert('All fields are compulsory');
        setLoading(false);
        return;
      }

      loginUser();
      console.log(`Login Data: `, {email, password});
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const loginUser = () => {
    let data = {email, password};
    fetch(`${url}/api/v1/auth/${UserType}/login`, {
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
  const imageWidth = screenWidth * 1.2; // Adjust the percentage as needed

  // Calculate the height based on the width and the aspect ratio
  const imageHeight = imageWidth / originalAspectRatio;

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'rgba(111,145,103,0.8)'}}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}>
        <LinearGradient colors={['#b1f1f2','rgba(3,85,83,0.9)']} style={{flex:1}}
    start={{x:1,y:0.1}}
    end={{x:1,y:1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          // margin: 10,
        }}>
        <TouchableOpacity
          style={styles.backButton} // Add or modify a style for the back button
          onPress={() => {
            navigation.navigate('Welcome');
          }}>
          <Image
            source={require('../../../../img/icons/assets/LoginSignup/backbutton.png')}
          />
        </TouchableOpacity>
       
      </View>

      <View style={styles.curvedcontainer}>
        <Image
          source={require('../../../../img/icons/assets/LoginSignup/Doctorandpatient.png')}
          style={{width: imageWidth, height: imageHeight,}}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.heading}>Login</Text>

      
      


      <ScrollView contentContainerStyle={styles.maincontainer}>

        <View style={{marginTop:40,flex:0.5,justifyContent:'space-evenly',display: LoginFormButtonVisibility?'flex':'none'}}>
            <TouchableOpacity style={styles.DoctorPatientButton} onPress={handlePatientUserType}>
              <Text style={styles.DoctorPatientText}>Patient</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.DoctorPatientButton} onPress={handleDoctorUserType}>
              <Text style={styles.DoctorPatientText}>Doctor</Text>
            </TouchableOpacity>
        </View>

        <View style={[styles.formContainer,{display: LoginFormVisibility?'flex':'none'}]}>
         
          <View style={styles.emailpasswordInputContainer}>
            <Image source={require('../../../../img/icons/assets/LoginSignup/usericon.png')} style={{width:23,height:23,marginBottom:13}}/>
            <TextInput
              style={styles.input}
              placeholder="Your email id"
              placeholderTextColor={'#fff'}
              onChangeText={email => {
                setEmail(email);
              }}
              value={email}
            />
          </View>

          <View style={styles.emailpasswordInputContainer}>
          <Image source={require('../../../../img/icons/assets/LoginSignup/lock.png')} style={{width:23,height:23,marginBottom:13}}/>
            <TextInput
              style={styles.input}
              placeholder="Your password"
              placeholderTextColor={'#fff'}
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
            <Text style={styles.buttonText}>
              {!loading ? 'Login' : 'Logging in...'}
            </Text>
          </TouchableOpacity>
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText,{opacity:0.6}]}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={[styles.signupText]}>
                {' '}
                Sign-up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  curvedcontainer: {
    height: '50%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red'
    // paddingVertical: 40,
    // paddingHorizontal: 70,

  },
  fullscreen: {
    width: '100%',
    height: '100%',
  },
  maincontainer: {
    flexGrow: 1,
    // backgroundColor: 'rgba(240, 240, 240, 0.9)',
    // paddingTop: 15,
    paddingHorizontal: 20,
    
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    width:'100%',
    // paddingTop:20,

    // backgroundColor:'blue',
    textAlign:'center'
  },
  heading2: {
    fontSize: 16,
    // fontWeight: 'bold',
    
    color: '#fff',
    textAlign: 'center',
    

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
    flex:1,
    borderColor: '#fff',
    borderBottomWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    color: '#fff',
    // backgroundColor:'green'
  },
  emailpasswordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',



  },
 
  eyeIconContainer: {
    position: 'absolute',
    right: 0,
  },
  eyeIcon: {
    width: 20,
    height: 16,
    marginBottom:5
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 20,
    
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#458194',
    textAlign: 'center',
  },
  DoctorPatientButton:{
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 100,
    
  },

  DoctorPatientText:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#458194',
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
    color: '#fff',
  },
  
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
});
