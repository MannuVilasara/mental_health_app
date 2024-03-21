import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AuthContext } from '../../../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from '../../../../context/url';
import LinearGradient from 'react-native-linear-gradient';
function SecondSignup(props) {
  const {email1, password1} = props.route.params
  // const email1 = 'jo';
  // const password1 = 'g';
  //global
  const [state] = useContext(AuthContext); 
  const { token } = state;

  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ]);

  console.log(`Props email: ${email1}`);

  const [loading, setLoading] = useState(false);
  const [selectedDate, setselectedDate] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState();
  const [mobile, setMobile] = useState();
  const [address, setAddress] = useState('');
  const [occupation, setOccupation] = useState('');
  const [email, setEmail] = useState(email1);
  const [password, setPassword] = useState(password1);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const dt = new Date(date);
    const x = dt.toISOString().split('T');
    const x1 = x[0].split('-');
    console.log(x1[2] + '/' + x1[1] + '/' + x1[0]);
    setselectedDate(x1[2] + '/' + x1[1] + '/' + x1[0]);
    hideDatePicker();
  };

  const handleRegister = () => {
    try {
      setLoading(true);
      if (!email1 || !password1) {
        Alert.alert('all fields compulsory');
        setLoading(false);
        return;
      }
      setLoading(false);
      registerUser();
      console.log(`Register Data: `, { email1, password1 });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const registerUser = () => {
    let data = {
      email : email1,
      password : password1,
      name,
      age: parseInt(age), // Ensure age is a number
      gender: value,
      mobile,
      address,
      occupation,
      DOB: selectedDate
    };
    fetch(`${url}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
      if (response.ok) {
        // Registration successful, navigate to login page
        console.log(data);
        Alert.alert('Account created',`Please login`)
        navigation.navigate("Login");
      } else {
        // Registration failed, show error message from server
        response.json().then(data => {
          Alert.alert('Registration failed', data.message);
        });
      }
    })
    .catch(error => {
      // Network error or other issues
      console.error('Error during registration:', error);
      Alert.alert('Registration failed', 'Please check your network connection and try again.');
    });
  };

  return (
    <LinearGradient colors={['#83C3C4','rgba(3,85,83,0.9)']} style={{flex:1}}
    start={{x:1,y:0}}
    end={{x:1,y:1}}>
    <ScrollView contentContainerStyle={styles.scrollView}>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.navigate('SignUp');
          }}>
          <Image source={require('../../../../img/icons/assets/LoginSignup/backbutton.png')} />
        </TouchableOpacity>
        <Text style={styles.title}>Sign-up</Text>
      </View>
      <View style={styles.imageContainer}>
      </View>
      
      <View style={styles.mainContainer}>
        {/* <Text style={{fontSize: 20, color:'#fff', fontWeight:'600', textAlign:'center', margin: 20}}>Little more about yourself</Text> */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
            style={styles.input}
            placeholder="Enter your name"
            onChangeText={text => { setName(text) }}
            value={name}
            placeholderTextColor={'#fff'} />
        <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            onChangeText={text => { setAge(text) }}
            value={age}
            placeholderTextColor={'#fff'} />
        <Text style={styles.label}>Date of birth</Text>
        <View style={{position:'relative'}}>
          <TextInput
            style={styles.input}
            placeholder="D.O.B (DD/MM/YYYY)"
            value={selectedDate}
            onChangeText={text => { setselectedDate(text) }}
            keyboardType="numeric"
            placeholderTextColor={'#fff'} />
          <TouchableOpacity
            style={{ position: 'absolute', right: 0,top:12 }}
            onPress={showDatePicker}>
            <Image
              source={require('../../../../img/icons/assets/LoginSignup/calender.png')}
              style={{
                width: 25,
                height: 25,
                resizeMode: 'contain',
                right:0
              }}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Gender</Text>
        <View style={{}}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select"
            style={[styles.input, {backgroundColor:'rgba(240, 240, 240, 0.1)', borderWidth:0}]}
            textStyle={{
              fontSize: 16,
              fontWeight: '400',
              color: 'black',
            }}
            placeholderStyle={{
              fontSize: 16,
              fontWeight: '400',
              color: '#fff',
            }}
          />
        </View>

        <Text style={styles.label}>Mobile no.</Text>
        <TextInput
            style={styles.input}
            placeholder="+91"
            onChangeText={text => { setMobile(text) }}
            value={mobile}
            placeholderTextColor={'#fff'}/>
      <Text style={styles.label}>Occupation</Text>
      <TextInput
            style={styles.input}
            placeholder="Occupation"
            onChangeText={text => { setOccupation(text) }}
            value={occupation}
            placeholderTextColor={'#fff'} />
      <Text style={styles.label}>Address</Text>
      <TextInput
            style={styles.input}
            placeholder="Residential Address"
            onChangeText={text => { setAddress(text) }}
            value={address}
            placeholderTextColor={'#fff'} />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'SignUp'}</Text>
        </TouchableOpacity>
        {/* <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.signupText, styles.signupLink]}>Login</Text>
          </TouchableOpacity>
        </View> */}
      </View>
      </View>
    </View>
    <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode="date"
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
    />
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
    // backgroundColor:'rgba(111,145,103,0.8)'
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
    textAlign:'center',
    alignItems:'center'
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
    position: 'relative', // Added for positioning camera icon
    // backgroundColor:'green'
  },
  profileImage: {
    width: 130,
    height: 130,
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
  mainContainer:{
    // backgroundColor: 'rgba(240, 240, 240, 0.9)',
    // paddingTop: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: 15,
    height:'100%'
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
    color: '#fff',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fff',
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
    backgroundColor: 'white',
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
    textDecorationLine: 'underline',
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
    color: '#fff',
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
});

export default SecondSignup;
