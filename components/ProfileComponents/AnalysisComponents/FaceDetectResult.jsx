import { StyleSheet, Text, View, Dimensions, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import url from '../../../context/url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { Colors } from '../../../ui/Colors';
import { Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FaceDetectResult = ({ patientId }) => {
  const [result, setResult] = useState([]);
  const [emotionCounts, setEmotionCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const allEmotions = [
    { name: 'happy', color: '#36A2EB', icon: '😊' },
    { name: 'sad', color: '#FF6384', icon: '😢' },
    { name: 'angry', color: '#FF4D4D', icon: '😠' },
    { name: 'fear', color: '#9966FF', icon: '😨' },
    { name: 'excited', color: '#4BC0C0', icon: '😃' },
    { name: 'disgust', color: '#FF9F40', icon: '🤢' },
    { name: 'anxiety', color: '#FFCD56', icon: '😰' },
    { name: 'neutral', color: '#CCCCCC', icon: '😐' },
    { name: 'depressed', color: '#666699', icon: '😔' },
    { name: 'mixed', color: '#FFB6C1', icon: '😕' },
    { name: 'disappointed', color: '#D3D3D3', icon: '😞' },
    { name: 'critical', color: '#8B0000', icon: '⚠️' },
    { name: 'tired', color: '#808080', icon: '😴' },
  ];

  const getUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('@auth');
      const userData = JSON.parse(user);
      if (userData) setUserId(userData.user._id);
    } catch (error) {
      console.log('Error getting user data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!userId && !patientId) return;
      let data = await fetch(`${url}/getSentimentalData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: patientId || userId }),
      });
      data = await data.json();
      if (data && data.length > 0) {
        setResult(data);
        const counts = allEmotions.reduce((acc, emotion) => {
          acc[emotion.name] = data.filter(item => item.emotionType.toLowerCase() === emotion.name).length;
          return acc;
        }, {});
        setEmotionCounts(counts);
      } else {
        const defaultCounts = allEmotions.reduce((acc, emotion) => {
          acc[emotion.name] = 0;
          return acc;
        }, {});
        defaultCounts['happy'] = 1;
        setEmotionCounts(defaultCounts);
        setResult([]);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
      const defaultCounts = allEmotions.reduce((acc, emotion) => {
        acc[emotion.name] = 0;
        return acc;
      }, {});
      defaultCounts['happy'] = 1;
      setEmotionCounts(defaultCounts);
    } finally {
      setIsLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }
  };

  useEffect(() => {
    if (userId || patientId) fetchData();
  }, [userId, patientId]);

  const chartData = allEmotions
    .map(emotion => ({
      name: emotion.name,
      count: emotionCounts[emotion.name] || 0,
      color: emotion.color,
      legendFontColor: Colors.text.secondary,
      legendFontSize: 12,
      icon: emotion.icon,
    }))
    .filter(item => item.count > 0);

  const displayChartData = chartData.length > 0
    ? chartData
    : [{ name: 'No data', count: 1, color: '#CCCCCC', legendFontColor: Colors.text.secondary, legendFontSize: 12 }];

  const dominantEmotion = chartData.length > 0
    ? chartData.reduce((prev, current) => (prev.count > current.count ? prev : current))
    : null;

  const filteredResults = selectedEmotion === 'all'
    ? result
    : result.filter(item => item.emotionType.toLowerCase() === selectedEmotion);

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
              chartConfig={{ backgroundColor: '#ffffff', backgroundGradientFrom: '#ffffff', backgroundGradientTo: '#ffffff', color: () => '#000' }}
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
                  <Text style={styles.dominantEmotionText}>{dominantEmotion.name.charAt(0).toUpperCase() + dominantEmotion.name.slice(1)}</Text>
                  <Text style={styles.emotionDescription}>{dominantEmotion.count} instances detected</Text>
                </View>
              </View>
            </View>
          )}

          {patientId && (
            <View style={styles.emotionListContainer}>
              <Text style={styles.emotionListTitle}>Emotion Log</Text>
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter by Emotion:</Text>
                <Picker
                  selectedValue={selectedEmotion}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedEmotion(itemValue)}
                >
                  <Picker.Item label="All Emotions" value="all" />
                  {allEmotions.map(emotion => (
                    <Picker.Item
                      key={emotion.name}
                      label={`${emotion.icon} ${emotion.name.charAt(0).toUpperCase() + emotion.name.slice(1)}`}
                      value={emotion.name}
                    />
                  ))}
                </Picker>
              </View>

              <ScrollView
                style={styles.scrollView}
                nestedScrollEnabled={true} // Enable nested scrolling
                showsVerticalScrollIndicator={true}
              >
                {filteredResults.length > 0 ? (
                  filteredResults.map((item, index) => {
                    const emotion = allEmotions.find(e => e.name === item.emotionType.toLowerCase());
                    return (
                      <TouchableOpacity key={index} style={styles.emotionCard}>
                        <Text style={[styles.emotionCardIcon, { color: emotion?.color || '#000' }]}>
                          {emotion?.icon || '😐'}
                        </Text>
                        <View style={styles.emotionCardContent}>
                          <Text style={styles.emotionCardType}>
                            {item.emotionType.charAt(0).toUpperCase() + item.emotionType.slice(1)}
                          </Text>
                          <Text style={styles.emotionCardReason}>
                            {item.emotionReason || 'No reason provided'}
                          </Text>
                          <Text style={styles.emotionCardDate}>
                            {new Date(item.createdAt).toLocaleString()}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={styles.noDataText}>No emotions logged for this filter.</Text>
                )}
              </ScrollView>
            </View>
          )}

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>
              Based on {result.length} sentimental {result.length === 1 ? 'analysis' : 'analyses'} from recent interactions.
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
  },
  emotionListContainer: {
    padding: 16,
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    maxHeight: 400, // Set a max height for the container
  },
  emotionListTitle: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Medium',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  scrollView: {
    flexGrow: 0, // Prevent it from expanding beyond its container
  },
  emotionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emotionCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emotionCardContent: {
    flex: 1,
  },
  emotionCardType: {
    fontSize: 16,
    color: Colors.text.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  emotionCardReason: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
    marginVertical: 2,
  },
  emotionCardDate: {
    fontSize: 12,
    color: Colors.text.tertiary,
    fontFamily: 'Poppins-Regular',
  },
  noDataText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    padding: 20,
  },
});
