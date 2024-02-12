import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Mood from '../homeComponents/Mood';
import UpcomingTasks from '../homeComponents/UpcomingTasks';
import DailyTasks from './Daily_tasks';
import SleepTrack from '../homeComponents/SleepTrack';
import Bottom from '../Bottom';
import {useFocusEffect} from '@react-navigation/native';

const Home = () => {
  return (
    <ScrollView style={{flex: 1, marginHorizontal: 15}}>
      <Mood />
      <UpcomingTasks />
      <SleepTrack />
      {/* <DailyTasks/> */}
      <Bottom />
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});
