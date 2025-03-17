import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../../context/authContext';
import WelcomeScreen from '../auth/Screens/WelcomeScreen';
import LoginScreen from '../auth/Screens/LoginScreen';
import SignupScreen from '../auth/Screens/SignupScreen';
import SecondSignup from '../auth/Screens/SecondSignup';
import AppNavigation from './AppNavigation';
import DoctorNavigation from './DoctorNavigation';
import ChatBot from '../../chatBot/ChatBot';
import PatientDetailsScreen from '../doctorPages/PatientDetailsScreen';
import { Colors } from '../../../ui/Colors';

const Stack = createStackNavigator();

const RootNavigation = () => {
  const [state] = useContext(AuthContext);
  const { user } = state;
  const authenticateUser = state?.user && state?.token;
  console.log('Authenticated:', authenticateUser);

  const MainApp = user?.role === 'doctor' ? DoctorNavigation : AppNavigation;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
      }}
    >
      {authenticateUser ? (
        <Stack.Group>
          <Stack.Screen
            name="MainApp"
            component={MainApp}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} options={
            {
              headerTitle: 'Patient Details', headerStyle: {
                backgroundColor: Colors.background.accent,
              },
            }
          } />


          <Stack.Screen
            name="chatWithAI"
            component={ChatBot}
            options={({ navigation }) => ({
              headerShown: true,
              headerTitle: () => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    marginLeft: -10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: 'Poppins-medium',
                      fontWeight: 'bold',
                      color: 'black',
                    }}
                  >
                    AI Assistant
                  </Text>
                  <MaterialIcons name="assistant" size={25} color="black" />
                </View>
              ),
              headerLeft: () => (
                <TouchableOpacity
                  style={styles.iconBackground}
                  onPress={() => {
                    if (!navigation) {
                      Alert.alert('Error', 'Navigation is not available');
                      return;
                    }
                    if (user?.role === 'doctor') {
                      navigation.navigate('MainApp', { screen: 'DoctorHome' });
                    } else {
                      navigation.navigate('MainApp', { screen: 'Home' });
                    }
                  }}
                >
                  <Icon name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
              ),
            })}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SecondSignup"
            component={SecondSignup}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;

const styles = StyleSheet.create({
  iconBackground: {
    height: 55,
    width: 55,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});