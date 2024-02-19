import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Welcomescreen from '../auth/Screens/WelcomeScreen';
import LoginScreen from '../auth/Screens/LoginScreen';
import SignupScreen from '../auth/Screens/SignupScreen';
import SecondSignup from '../auth/Screens/SecondSignup';
// import Welcomescreen from './Screens/Welcomescreen';
// import Loginscreen from './Screens/Loginscreen';
// import Signupscreen from './Screens/Signupscreen';
// import Testing from './Screens/Testing';
// import AnimatedButtons from './Screens/AnimatedButtons';
// import SecondSignup from './Screens/SecondSignup';

const Stack = createNativeStackNavigator();

function authNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="SecondSignup"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Welcome" component={Welcomescreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="SecondSignup" component={SecondSignup} />
    </Stack.Navigator>
  );
}
export default authNavigation;
