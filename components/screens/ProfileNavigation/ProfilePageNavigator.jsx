import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Profile from '../Profile';
import Analysis from '../../ProfileComponents/Analysis';
import ProfileData from '../../ProfileComponents/ProfileData';
import CBTTab from '../../ProfileComponents/CBTTab';
import { Colors } from '../../../ui/Colors';

const Stack = createStackNavigator();

const ProfilePageNavigator = () => {
  return (
    <Stack.Navigator

      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background.accent,
        },
        headerTintColor: Colors.text.light,
        headerTitleStyle: {
          fontFamily: 'Poppins-Medium',
        },
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS, // This will make the transition from right to left
      }}>
      <Stack.Screen
        name="mainScreen"
        options={{ headerShown: false }}
        component={Profile}
      />
      <Stack.Screen name="Weekly Reports" component={Analysis} />
      <Stack.Screen name="Profile" component={ProfileData} />
      <Stack.Screen name="D-CBT" component={CBTTab} />
    </Stack.Navigator>
  );
};

export default ProfilePageNavigator;
