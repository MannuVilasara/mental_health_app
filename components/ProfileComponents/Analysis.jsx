import React from "react";
import SleepAnalysis from "./AnalysisComponents/SleepAnalysis";
import MoodAnalysis from "./AnalysisComponents/MoodAnalysis";
import { ScrollView, Text } from "react-native";
import Bottom from "../Bottom";

const Analysis = () => {

  const date = new Date();
  const thresholdDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
  return (
    <ScrollView>
      <Text style={{color: 'black', fontWeight:'600', textAlign:'center', margin: 5}}>{thresholdDate.getDate()}/{thresholdDate.getMonth()}/{thresholdDate.getFullYear()} to {date.getDate()}/{date.getMonth()}/{date.getFullYear()}</Text>
      <SleepAnalysis/>
      <MoodAnalysis/>
      <Bottom />
    </ScrollView>
  );
};

export default Analysis;
