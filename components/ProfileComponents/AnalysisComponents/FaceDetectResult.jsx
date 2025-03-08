import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import url from '../../../context/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { Colors } from '../../../ui/Colors';
import { Animated } from 'react-native';

const FaceDetectResult = () => {
  const [result, setResult] = useState([]);
  const [scores, setScores] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [userId, setUserId] = useState(null);
  const [emotionCounts, setEmotionCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // List of all possible emotions with colors
  const allEmotions = [
    { name: 'happy', color: '#36A2EB', icon: '😊' },
    { name: 'sad', color: '#FF6384', icon: '😢' },
    { name: 'angry', color: '#FF4D4D', icon: '😠' },
    { name: 'fear', color: '#9966FF', icon: '😨' },
    { name: 'excited', color: '#4BC0C0', icon: '😃' },
    { name: 'disgust', color: '#FF9F40', icon: '🤢' },
    { name: 'anxiety', color: '#FFCD56', icon: '😰' }
  ];

  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('@auth')
      const userData = JSON.parse(user)
      if (userData) {
        setUserId(userData.user._id);
      }
    } catch (error) {
      console.log('Error getting user data:', error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUserData()
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!userId) return;

      let data = await fetch(`${url}/getSentimentalData`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId
        })
      });
      data = await data.json();
      if (data && data.length > 0) {
        setResult(data);

        // Calculate emotion counts
        const counts = allEmotions.reduce((acc, emotion) => {
          acc[emotion.name] = data.filter(item =>
            item.emotionType.toLowerCase() === emotion.name
          ).length;
          return acc;
        }, {});

        setEmotionCounts(counts);

        const extractedScores = data.map(item => parseInt(item.score));
        setScores(extractedScores);
        const total = extractedScores.reduce((acc, score) => acc + score, 0);
        const avg = total / extractedScores.length;
        setAverageScore(avg);
      } else {
        // Initialize with default data to ensure chart renders
        const defaultCounts = {};
        allEmotions.forEach(emotion => {
          defaultCounts[emotion.name] = 0;
        });
        // Ensure at least one emotion has a count to make chart visible
        defaultCounts['happy'] = 1;

        setResult([]);
        setEmotionCounts(defaultCounts);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
      // Initialize with default data on error
      const defaultCounts = {};
      allEmotions.forEach(emotion => {
        defaultCounts[emotion.name] = 0;
      });
      defaultCounts['happy'] = 1;
      setEmotionCounts(defaultCounts);
    } finally {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Prepare data for pie chart
  const chartData = allEmotions.map(emotion => ({
    name: emotion.name,
    count: emotionCounts[emotion.name] || 0,
    color: emotion.color,
    legendFontColor: Colors.text.secondary,
    legendFontSize: 12,
    icon: emotion.icon
  })).filter(item => item.count > 0);

  // Ensure chart has data even if no emotions are detected
  const displayChartData = chartData.length > 0 ? chartData : [
    {
      name: 'No data',
      count: 1,
      color: '#CCCCCC',
      legendFontColor: Colors.text.secondary,
      legendFontSize: 12
    }
  ];

  // Find dominant emotion
  const dominantEmotion = chartData.length > 0
    ? chartData.reduce((prev, current) => (prev.count > current.count) ? prev : current)
    : null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Emotional Analysis</Text>
        <Text style={styles.subHeaderText}>Sentiment analysis by AI-Assistant</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Analyzing your emotional data...</Text>
        </View>
      ) : (
        <>
          <View style={styles.chartContainer}>
            <PieChart
              data={displayChartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: () => '#000',
              }}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>

          {dominantEmotion && (
            <View style={styles.insightCard}>
              <Text style={styles.insightTitle}>Primary Emotion</Text>
              <View style={styles.dominantEmotionContainer}>
                <Text style={styles.emotionIcon}>{dominantEmotion.icon || '😊'}</Text>
                <View style={styles.emotionTextContainer}>
                  <Text style={styles.dominantEmotionText}>
                    {dominantEmotion.name.charAt(0).toUpperCase() + dominantEmotion.name.slice(1)}
                  </Text>
                  <Text style={styles.emotionDescription}>
                    {dominantEmotion.count} instances detected
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Based on {result.length} facial expression {result.length === 1 ? 'analysis' : 'analyses'}
              from your recent interactions.
            </Text>
          </View>
        </>
      )}
    </Animated.View>
  );
};

export default FaceDetectResult;

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerText: {
    color: Colors.text.primary,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  subHeaderText: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  insightCard: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  insightTitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  dominantEmotionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emotionIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  emotionTextContainer: {
    flex: 1,
  },
  dominantEmotionText: {
    fontSize: 18,
    color: Colors.text.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  emotionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
  },
  summaryContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 20,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});
