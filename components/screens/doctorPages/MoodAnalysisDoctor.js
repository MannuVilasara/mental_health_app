import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { AuthContext } from '../../../context/authContext';
import url from '../../../context/url';

const MoodAnalysis = ({ userID }) => {
  const [state] = useContext(AuthContext);
  const { token } = state;

  const [moodData, setMoodData] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  const getData = async () => {
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
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setItem1();
  }, [moodData]);

  const thresholdDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const setItem1 = () => {
    const morningData = moodData
      ?.filter(item =>
        new Date(item.createdAt) > thresholdDate &&
        new Date(item.createdAt).getHours() >= 4 &&
        new Date(item.createdAt).getHours() < 10
      )
      .map(item => item.feelNumber) || [];
    setCurrentData(morningData);
  };

  const setItem2 = () => {
    const noonData = moodData
      ?.filter(item =>
        new Date(item.createdAt) > thresholdDate &&
        new Date(item.createdAt).getHours() >= 10 &&
        new Date(item.createdAt).getHours() < 18
      )
      .map(item => item.feelNumber) || [];
    setCurrentData(noonData);
  };

  const setItem3 = () => {
    const eveningData = moodData
      ?.filter(item =>
        new Date(item.createdAt) > thresholdDate &&
        (new Date(item.createdAt).getHours() < 4 ||
          new Date(item.createdAt).getHours() >= 18)
      )
      .map(item => item.feelNumber) || [];
    setCurrentData(eveningData);
  };

  const counts = {};
  currentData.forEach(num => {
    counts[num] = (counts[num] || 0) + 1;
  });

  const zero = counts[0] || 0;
  const one = counts[1] || 0;
  const two = counts[2] || 0;
  const three = counts[3] || 0;

  const data2 = [
    { value: zero, color: '#ff7f0e', text: 'Sad' },
    { value: one, color: '#1f77b4', text: 'Normal' },
    { value: two, color: '#2ca02c', text: 'Happy' },
    { value: three, color: '#9467bd', text: 'Excited' },
  ];

  const sliceColor = ['#ff7f0e', '#1f77b4', '#2ca02c', '#9467bd'];
  const series = [zero, one, two, three];
  const sum = series.reduce((acc, val) => acc + val, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mood Analysis</Text>

        <View style={styles.timeSelectBox}>
          <TouchableOpacity
            onPress={() => {
              setSelectedTime(1);
              setItem1();
            }}
          >
            <View
              style={[
                styles.timeSelect,
                selectedTime === 1
                  ? styles.selectedTimeButton
                  : styles.unselectedTimeButton,
              ]}
            >
              <Text
                style={[
                  styles.timeSelectText,
                  selectedTime === 1 ? styles.selectedTimeText : styles.unselectedTimeText,
                ]}
              >
                Morning
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSelectedTime(2);
              setItem2();
            }}
          >
            <View
              style={[
                styles.timeSelect,
                selectedTime === 2
                  ? styles.selectedTimeButton
                  : styles.unselectedTimeButton,
              ]}
            >
              <Text
                style={[
                  styles.timeSelectText,
                  selectedTime === 2 ? styles.selectedTimeText : styles.unselectedTimeText,
                ]}
              >
                Noon
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSelectedTime(3);
              setItem3();
            }}
          >
            <View
              style={[
                styles.timeSelect,
                selectedTime === 3
                  ? styles.selectedTimeButton
                  : styles.unselectedTimeButton,
              ]}
            >
              <Text
                style={[
                  styles.timeSelectText,
                  selectedTime === 3 ? styles.selectedTimeText : styles.unselectedTimeText,
                ]}
              >
                Evening
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.pieChartBox}>
          {sum !== 0 ? (
            <PieChart
              widthAndHeight={160}
              series={series}
              sliceColor={sliceColor}
              coverRadius={0.45}
              coverFill={'#FFF'}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No Data Available</Text>
            </View>
          )}

          <View style={styles.legendContainer}>
            {data2.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.colorBox, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendLabel}>{item.text}: </Text>
                <Text style={styles.legendValue}>{series[index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  timeSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  timeSelect: {
    width: 80,
    padding: 10,
    borderRadius: 10,
  },
  selectedTimeButton: {
    backgroundColor: '#3498db',
  },
  unselectedTimeButton: {
    backgroundColor: '#ecf0f1',
  },
  timeSelectText: {
    textAlign: 'center',
    fontSize: 15,
  },
  selectedTimeText: {
    color: '#fff',
  },
  unselectedTimeText: {
    color: '#333',
  },
  pieChartBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  noDataContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
  },
  legendContainer: {
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  colorBox: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  legendLabel: {
    color: '#333',
    fontSize: 14,
  },
  legendValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MoodAnalysis;