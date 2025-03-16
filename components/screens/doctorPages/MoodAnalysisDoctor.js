import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { AuthContext } from '../../../context/authContext';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../../../ui/Colors';
import url from '../../../context/url';

const MOOD_TYPES = [
  { id: 0, text: 'Sad', color: '#FF6B6B', icon: 'frown' },
  { id: 1, text: 'Normal', color: '#4ECDC4', icon: 'meh' },
  { id: 2, text: 'Happy', color: '#FFD166', icon: 'smile' },
  { id: 3, text: 'Excited', color: '#6A0572', icon: 'grin-stars' }
];

const TIME_PERIODS = [
  { id: 1, text: 'Morning', icon: 'sun', hours: [4, 10] },
  { id: 2, text: 'Afternoon', icon: 'cloud-sun', hours: [10, 18] },
  { id: 3, text: 'Evening', icon: 'moon', hours: [18, 4] }
];

const MoodAnalysis = ({ userID }) => {
  const [state] = useContext(AuthContext);
  const { token } = state;
  const [moodData, setMoodData] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animatedValue] = useState(new Animated.Value(0));
  const [expandedLegend, setExpandedLegend] = useState(null);

  const getData = async () => {
    setIsLoading(true);
    try {
      let result = await fetch(`${url}/api/v1/feel/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      result = await result.json();
      if (result?.feel) {
        setMoodData(result.feel);
      } else {
        setMoodData([]);
      }
    } catch (error) {
      console.error('Error fetching mood data:', error);
      setMoodData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filterDataByTime(selectedTime);
    startAnimation();
  }, [moodData, selectedTime]);

  const startAnimation = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const filterDataByTime = (timeId) => {
    const thresholdDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const period = TIME_PERIODS.find(p => p.id === timeId);

    if (!period) return;

    let filteredData;
    if (period.id === 3) { // Evening (special case spanning midnight)
      filteredData = moodData?.filter(item => {
        const itemDate = new Date(item.createdAt);
        const hour = itemDate.getHours();
        return itemDate > thresholdDate && (hour >= 18 || hour < 4);
      });
    } else {
      filteredData = moodData?.filter(item => {
        const itemDate = new Date(item.createdAt);
        const hour = itemDate.getHours();
        return itemDate > thresholdDate && hour >= period.hours[0] && hour < period.hours[1];
      });
    }

    setCurrentData(filteredData?.map(item => item.feelNumber) || []);
  };

  // Calculate mood counts
  const moodCounts = currentData.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for the pie chart
  const series = MOOD_TYPES.map(mood => moodCounts[mood.id] || 0);
  const sliceColor = MOOD_TYPES.map(mood => mood.color);
  const sum = series.reduce((acc, val) => acc + val, 0);

  // Calculate percentages for each mood
  const percentages = series.map(value => (sum > 0 ? Math.round((value / sum) * 100) : 0));

  // Find the dominant mood
  const dominantMoodIndex = series.indexOf(Math.max(...series));
  const dominantMood = sum > 0 ? MOOD_TYPES[dominantMoodIndex] : null;

  const toggleLegendExpansion = (index) => {
    setExpandedLegend(expandedLegend === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background.primary, Colors.background.secondary]}
        style={styles.gradientContainer}
      >
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <FontAwesome5Icon name="chart-pie" size={20} color={Colors.primary} />
            <Text style={styles.headerText}>Mood Analysis</Text>
          </View>

          <TouchableOpacity onPress={getData} style={styles.refreshButton}>
            <FontAwesome5Icon name="sync-alt" size={16} color={Colors.background.primary} />
          </TouchableOpacity>
        </View>

        {/* Time Period Selection */}
        <View style={styles.timeSelectBox}>
          {TIME_PERIODS.map((period) => (
            <TouchableOpacity
              key={period.id}
              onPress={() => {
                setSelectedTime(period.id);
                animatedValue.setValue(0);
              }}
              style={styles.timeSelectButton}
            >
              <LinearGradient
                colors={selectedTime === period.id ?
                  [Colors.primary, Colors.primaryDark] :
                  [Colors.background.tertiary, Colors.background.tertiary]}
                style={[
                  styles.timeSelect,
                  selectedTime === period.id ? styles.selectedTimeButton : styles.unselectedTimeButton,
                ]}
              >
                <FontAwesome5Icon
                  name={period.icon}
                  size={14}
                  color={selectedTime === period.id ? Colors.text.light : Colors.text.secondary}
                />
                <Text
                  style={[
                    styles.timeSelectText,
                    selectedTime === period.id ? styles.selectedTimeText : styles.unselectedTimeText,
                  ]}
                >
                  {period.text}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Analysis Content */}
        <View style={styles.analysisContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading mood data...</Text>
            </View>
          ) : (
            <>
              {/* Pie Chart */}
              <View style={styles.chartContainer}>
                <Animated.View
                  style={[
                    styles.pieChartBox,
                    {
                      opacity: animatedValue,
                      transform: [
                        {
                          scale: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {sum > 0 ? (
                    <PieChart
                      widthAndHeight={160}
                      series={series}
                      sliceColor={sliceColor}
                      coverRadius={0.45}
                      coverFill={Colors.background.primary}
                    />
                  ) : (
                    <View style={styles.noDataContainer}>
                      <FontAwesome5Icon name="chart-pie" size={40} color={Colors.text.secondary} />
                      <Text style={styles.noDataText}>No Data Available</Text>
                    </View>
                  )}
                </Animated.View>

                {sum > 0 && (
                  <View style={styles.dominantMoodContainer}>
                    <Text style={styles.dominantMoodLabel}>Dominant Mood:</Text>
                    <View style={styles.dominantMoodContent}>
                      <FontAwesome5Icon
                        name={dominantMood.icon}
                        size={24}
                        color={dominantMood.color}
                      />
                      <Text style={[styles.dominantMoodText, { color: dominantMood.color }]}>
                        {dominantMood.text}
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Legend */}
              <View style={styles.legendContainer}>
                {MOOD_TYPES.map((mood, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.legendItem,
                      expandedLegend === index && styles.expandedLegendItem
                    ]}
                    onPress={() => toggleLegendExpansion(index)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.legendItemHeader}>
                      <View style={[styles.colorBox, { backgroundColor: mood.color }]} />
                      <FontAwesome5Icon name={mood.icon} size={14} color={mood.color} />
                      <Text style={styles.legendLabel}>{mood.text}</Text>
                      <Text style={styles.legendValue}>{series[index]}</Text>
                      {sum > 0 && (
                        <View style={styles.percentageContainer}>
                          <Text style={styles.percentageText}>{percentages[index]}%</Text>
                        </View>
                      )}
                    </View>

                    {expandedLegend === index && (
                      <View style={styles.legendDetails}>
                        <Text style={styles.legendDetailsText}>
                          {series[index]} instance{series[index] !== 1 ? 's' : ''} of {mood.text.toLowerCase()} mood recorded
                          during {TIME_PERIODS.find(p => p.id === selectedTime).text.toLowerCase()} hours in the past week.
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.dark,
    marginLeft: 8,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeSelectButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  selectedTimeButton: {
    elevation: 2,
  },
  unselectedTimeButton: {
    backgroundColor: Colors.background.tertiary,
  },
  timeSelectText: {
    textAlign: 'center',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  selectedTimeText: {
    color: Colors.text.light,
  },
  unselectedTimeText: {
    color: Colors.text.secondary,
  },
  analysisContainer: {
    paddingBottom: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pieChartBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  noDataContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 80,
  },
  noDataText: {
    color: Colors.text.secondary,
    fontSize: 14,
    marginTop: 8,
  },
  dominantMoodContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  dominantMoodLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  dominantMoodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dominantMoodText: {
    marginLeft: 6,
    fontSize: 18,
    fontWeight: '600',
  },
  legendContainer: {
    marginTop: 8,
  },
  legendItem: {
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  expandedLegendItem: {
    backgroundColor: Colors.background.secondary,
  },
  legendItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    color: Colors.text.primary,
    fontSize: 14,
    flex: 1,
    marginLeft: 4,
  },
  legendValue: {
    color: Colors.text.dark,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  percentageContainer: {
    backgroundColor: Colors.background.accent,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  percentageText: {
    color: Colors.text.light,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MoodAnalysis;