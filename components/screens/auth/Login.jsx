import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../context/authContext';


const Login = ({navigation}) => {
    //global state
  const [state, setState] = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      console.log(`Login Data: `, {email, password});
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const loginUser = () => {
    let data = {email, password};
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
            setState(data)
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Register');
        }}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  inputContainer: {
    width: '100%',
    marginTop: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;
