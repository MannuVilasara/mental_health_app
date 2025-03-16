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
} from 'react-native';
import Modal from 'react-native-modal';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import SecondSignup from './SecondSignup';
import { AuthContext } from '../../../../context/authContext';
import url from '../../../../context/url';
import LinearGradient from 'react-native-linear-gradient';
function SignupScreen({ navigation }) {
  //global
  const [state] = useContext(AuthContext)
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleNewClick = () => {
    try {
      setLoading(true);
      if (!email || !password || !confirmPassword) {
        Alert.alert('All fields are compulsory');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Passwords do not match');
        setLoading(false);
        return;
      }
      checkUser();
      console.log(`Varified Data: `, { email, password });
      // sendMailPass()
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const checkUser = async () => {
    try {
      setLoading(true);
      const data = { email };
      const response = await fetch(`${url}/api/v1/auth/check`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        Alert.alert('Failed', errorMessage);
        setLoading(false);
        return;
      }

      const responseData = await response.json();

      if (responseData.success) {
        navigation.navigate('SecondSignup', { email1: email, password1: password, doctorId: doctorId || null });

      } else {
        Alert.alert('User already registered', responseData.message);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while processing your request');
      setLoading(false);
    }
  };

  const handleCameraLaunch = () => {

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 100,
      maxWidth: 100,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;

        setSelectedImage(imageUri);
        // toggleModal();
        // console.log('calling signup');
      }
    });
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 100,
      maxWidth: 100,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;

        setSelectedImage(imageUri);
      }
    });
  };

  return (
    <LinearGradient colors={['#83C3C4', 'rgba(3,85,83,0.9)']} style={{ flex: 1 }}
      start={{ x: 1, y: 0.2 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.navigate('Welcome');
              }}>
              <Image source={require('../../../../img/icons/assets/LoginSignup/backbutton.png')} />
            </TouchableOpacity>

          </View>
          <View style={styles.imageContainer}>
            <View>
              <Image
                source={
                  selectedImage
                    ? { uri: selectedImage }
                    : require('../../../../img/icons/assets/LoginSignup/userProfile.png')
                }
                style={styles.profileImage}
                resizeMode="contain"
              />
              {/* <TouchableOpacity style={styles.cameraIconContainer} onPress={toggleModal}>
            <Image
              source={require('../../../../img/icons/assets/LoginSignup/camera.png')}
              style={styles.cameraIcon}
            />
          </TouchableOpacity> */}
            </View>
          </View>

          <View style={styles.mainContainer}>
            <Text style={styles.title}>Create Your Account</Text>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Your email id"
                onChangeText={setEmail}
                placeholderTextColor={'#fff'}
              />
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Your password"
                  placeholderTextColor={'#fff'}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
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
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input, password !== confirmPassword ? { color: 'red' } : { color: 'white' }]}
                placeholder="Confirm your password"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                placeholderTextColor={'#fff'}
                secureTextEntry
              />
              <Text style={styles.label}>Doctor ID</Text>
              <TextInput
                value={doctorId}
                onChangeText={setDoctorId}
                style={styles.input}
                placeholder="Enter Doctor ID (if any)"
                placeholderTextColor={'#fff'}
              />
            </View>
            <View style={styles.footer}>
              <TouchableOpacity style={styles.button} onPress={handleNewClick}>
                <Text style={styles.buttonText}>{loading ? 'Checking...' : 'Next'}</Text>
              </TouchableOpacity>
              <View style={styles.signupContainer}>
                <Text style={[styles.signupText, { opacity: 0.6 }]}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={[styles.signupText, { paddingLeft: 5 }]}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Modal
            isVisible={isModalVisible}
            style={styles.modal}
            animationInTiming={400}
            animationOutTiming={800}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalOption} onPress={handleCameraLaunch}>
                <Image
                  source={require('../../../../img/icons/assets/LoginSignup/camera3.png')}
                  style={styles.modalIcon}
                />
                <Text style={styles.optionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalOption, styles.borderBottom]} onPress={openImagePicker}>
                <Image
                  source={require('../../../../img/icons/assets/LoginSignup/gallery.png')}
                  style={styles.modalIcon}
                />
                <Text style={styles.optionText}>Choose from gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={toggleModal}>
                <Text style={styles.optionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,

    // backgroundColor: 'white',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,

  },
  imageContainer: {
    alignItems: 'center',
    // marginTop: 10,
    marginBottom: 6,
    position: 'relative', // Added for positioning camera icon
    // backgroundColor:'green'
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 65,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0, // Adjusted for proper position
    right: 0,
  },
  cameraIcon: {
    width: 44,
    height: 44,
  },
  mainContainer: {
    // backgroundColor: 'rgba(240, 240, 240, 0.9)',
    // paddingTop: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: 10,
    height: '100%'
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    height: 'auto',
    borderColor: '#fff',
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 15,
    color: 'white',
    height: 'auto',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#fff'
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 0,
  },
  eyeIcon: {
    width: 20,
    height: 16,
  },
  footer: {
    justifyContent: 'flex-end',
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 20,
    width: '85%',
  },
  buttonText: {
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
  signupLink: {
    // textDecorationLine: 'underline',
    fontWeight: 'bold',


  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
    height: '50%',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  modalIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  optionText: {
    fontSize: 18,
    color: 'black',
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
});

export default SignupScreen;
