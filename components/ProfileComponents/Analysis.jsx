import React from "react";
import { ScrollView, Text, View, Animated } from "react-native";
import SleepAnalysis from "./AnalysisComponents/SleepAnalysis";
import MoodAnalysis from "./AnalysisComponents/MoodAnalysis";
import Bottom from "../Bottom";
import BecksTestResult from "./AnalysisComponents/BecksTestResult";
import FinalResult from "./AnalysisComponents/FinalResult";
import FaceDetectResult from "./AnalysisComponents/FaceDetectResult";
import { Colors } from "../../ui/Colors";

const Analysis = () => {
  const date = new Date();
  const thresholdDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Add fade-in animation
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {thresholdDate.getDate()}/{thresholdDate.getMonth() + 1}/{thresholdDate.getFullYear()}
            {" to "}
            {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <BecksTestResult />
          <SleepAnalysis />
          <FaceDetectResult />
          <MoodAnalysis />
          {/* <FinalResult /> */}
          <Bottom />
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  dateContainer: {
    backgroundColor: Colors.background.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  dateText: {
    color: Colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  contentContainer: {
    paddingBottom: 24,
  }
};

export default Analysis;
