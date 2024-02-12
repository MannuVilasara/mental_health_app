import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Login from '../auth/Login';
import Register from '../auth/Register';

const Stack = createStackNavigator(); 

const authNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: true,
        // ...TransitionPresets.SlideFromRightIOS, // This will make the transition from right to left
      }}>
      <Stack.Screen
        name="Login"
        options={{headerShown: false}}
        component={Login}
      />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  )
}

export default authNavigation

const styles = StyleSheet.create({})