import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Profile from '../Profile';
import Analysis from '../../ProfileComponents/Analysis';
import ProfileData from '../../ProfileComponents/ProfileData';

const Stack = createStackNavigator();

const ProfilePageNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS, // This will make the transition from right to left
      }}>
      <Stack.Screen
        name="mainScreen"
        options={{headerShown: false}}
        component={Profile}
      />
      <Stack.Screen name="Weekly Reports" component={Analysis} />
      <Stack.Screen name="Profile" component={ProfileData} />
    </Stack.Navigator>
  );
};

export default ProfilePageNavigator;
