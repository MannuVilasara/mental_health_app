import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Mood from '../homeComponents/Mood';
import UpcomingTasks from '../homeComponents/UpcomingTasks';
import DailyTasks from './Daily_tasks';
import SleepTrack from '../homeComponents/SleepTrack';
import Bottom from '../Bottom';
import { useFocusEffect } from '@react-navigation/native';
import WeeklyTest from '../WeeklyTest/WeeklyTest';
import WeeklyTestLink from '../WeeklyTest/WeeklyTestLink';
import { AuthContext } from '../../context/authContext';
import HomeSlide from '../wellbeingComponents/HomeSlide';
import { Colors } from '../../ui/Colors';

const Home = ({ navigation }) => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        <Mood navigation={navigation} />
        <UpcomingTasks />
        <SleepTrack />
        <HomeSlide />
        {/* <DailyTasks/> */}
        <WeeklyTest />
        <Bottom />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
    gap: 16, // Consistent spacing between components
  }
});
