import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Home from '../Home';
import DailyTasks from '../Daily_tasks';
import DiaryAndAI from '../DiaryAndAI';
import ProfilePageNavigator from '../ProfileNavigation/ProfilePageNavigator';
import DailyDiary from '../DailyDiary';
import ChatBot from '../../chatBot/ChatBot';

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              position: route.name==='chatWithAI'?"relative":"absolute",
              bottom: route.name==='chatWithAI'?0:30,
              left: route.name==='chatWithAI'?0:20,
              right: route.name==='chatWithAI'?0:20,
              height: route.name==='chatWithAI'?60:75,
              borderRadius: route.name==='chatWithAI'?20:401,
              // backgroundColor: '#8ca785',
              backgroundColor: 'rgba(140, 167, 133, 0.7)',
              elevation: 0,
            },
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              let iconBackgroundColor = focused ? 'white' : 'transparent';

              if (route.name === 'Home') {
                <View style={styles.iconBackground}>
                  {(iconName = focused ? 'home' : 'home')};
                </View>;
              } else if (route.name === 'dailyTask') {
                iconName = focused ? 'tasks' : 'tasks';
              } else if (route.name === 'MainProfile') {
                iconName = focused ? 'user-alt' : 'user-alt';
              } else if (route.name === 'Diary') {
                iconName = focused ? 'book' : 'book';
              } else if(route.name == 'chatWithAI') {
                iconName = focused ? 'robot' : 'robot'
              }

              // You can return any component that you like here!
              return (
                <View
                  style={[
                    styles.iconBackground,
                    {backgroundColor: iconBackgroundColor},
                  ]}>
                  <Icon name={iconName} size={20} color={color} />
                </View>
              );
            },
            tabBarActiveTintColor: '#8ca785',
            tabBarInactiveTintColor: 'white',
          })}>
          {/* <Tab.Screen name="Home" component={Home} /> */}
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="dailyTask" component={DailyTasks} />
          <Tab.Screen name="Diary" component={DailyDiary}/>
          <Tab.Screen name="MainProfile" component={ProfilePageNavigator} />
          <Tab.Screen name="chatWithAI" component={ChatBot}/>
        </Tab.Navigator>
    </>
  )
}

export default AppNavigation

const styles = StyleSheet.create({
  iconBackground: {
    height: 55,
    width: 55,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
})