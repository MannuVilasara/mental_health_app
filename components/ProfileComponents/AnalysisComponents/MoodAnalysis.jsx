import { StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart';
import { AuthContext } from '../../../context/authContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import url from '../../../context/url';
import { Colors } from '../../../ui/Colors';

const MoodAnalysis = ({ patientId }) => {
  //global
  const [state] = useContext(AuthContext);
  const { token } = state;

  //store mood data
  const [moodData, setMoodData] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const [currentData, setCurrentData] = useState([]);

  //function to get data
  const getData = async () => {
    try {
      let endpoint = `${url}/api/v1/feel/get`;
      if (patientId) {
        endpoint += `?patientId=${patientId}`;
      }

      let result = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      result = await result.json();
      if (result) {
        setMoodData(result?.feel);
      } else {
        setMoodData([]);
      }
    } catch (error) {
      console.error("Error fetching mood data:", error);
      setMoodData([]);
    }
  };

  useEffect(() => {
    getData();
  }, [patientId, token]);

  useEffect(() => {
    setItem1();
  }, [moodData]);

  //date filter
  const date = new Date();
  const thresholdDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);

  const setItem1 = () => {
    let morningData = moodData?.filter(
      item =>
        new Date(item.createdAt) > new Date(thresholdDate) &&
        new Date(item.createdAt).getHours() >= 4 &&
        new Date(item.createdAt).getHours() < 10,
    )
      .map(item => item.feelNumber);

    setCurrentData(morningData.length > 0 ? morningData : []);
  };

  const setItem2 = () => {
    let noonData = moodData?.filter(
      item =>
        new Date(item.createdAt) > new Date(thresholdDate) &&
        new Date(item.createdAt).getHours() >= 10 &&
        new Date(item.createdAt).getHours() < 18,
    )
      .map(item => item.feelNumber);

    setCurrentData(noonData.length > 0 ? noonData : []);
  };

  const setItem3 = () => {
    let eveningData = moodData?.filter(
      item =>
        new Date(item.createdAt) > new Date(thresholdDate) &&
        (new Date(item.createdAt).getHours() < 4 ||
          new Date(item.createdAt).getHours() >= 18),
    )
      .map(item => item.feelNumber);

    setCurrentData(eveningData.length > 0 ? eveningData : []);
  };

  //calculate value
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
  const sum = series[0] + series[1] + series[2] + series[3];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Mood Analysis
        </Text>

        <View style={styles.timeSelectBox}>
          <TouchableOpacity
            onPress={() => {
              setSelectedTime(1);
              setItem1();
            }}>
            <View
              style={[
                styles.timeSelect,
                selectedTime === 1
                  ? styles.selectedTimeButton
                  : styles.unselectedTimeButton,
              ]}>
              <Text
                style={[
                  styles.timeSelectText,
                  selectedTime === 1 ? styles.selectedTimeText : styles.unselectedTimeText,
                ]}>
                Morning
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTime(2);
              setItem2();
            }}>
            <View
              style={[
                styles.timeSelect,
                selectedTime === 2
                  ? styles.selectedTimeButton
                  : styles.unselectedTimeButton,
              ]}>
              <Text
                style={[
                  styles.timeSelectText,
                  selectedTime === 2 ? styles.selectedTimeText : styles.unselectedTimeText,
                ]}>
                Noon
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTime(3);
              setItem3();
            }}>
            <View
              style={[
                styles.timeSelect,
                selectedTime === 3
                  ? styles.selectedTimeButton
                  : styles.unselectedTimeButton,
              ]}>
              <Text
                style={[
                  styles.timeSelectText,
                  selectedTime === 3 ? styles.selectedTimeText : styles.unselectedTimeText,
                ]}>
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
                <Text style={styles.legendLabel}>
                  {item.text}:{' '}
                </Text>
                <Text style={styles.legendValue}>{series[index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MoodAnalysis;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    margin: 10,
    elevation: 3,
    marginBottom: 16,
  },
  header: {
    padding: 16,
  },
  headerText: {
    color: '#444444',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  timeSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 20,
  },
  timeSelect: {
    width: 100,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedTimeButton: {
    backgroundColor: 'rgba(111,145,103,1)',
  },
  unselectedTimeButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeSelectText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTimeText: {
    color: 'white',
  },
  unselectedTimeText: {
    color: '#444444',
  },
  pieChartBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  noDataContainer: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 80,
  },
  noDataText: {
    color: '#666',
    fontWeight: '400',
    textAlign: 'center',
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 24,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 8,
    borderRadius: 4,
  },
  legendLabel: {
    color: '#444444',
    fontWeight: '500',
    fontSize: 14,
  },
  legendValue: {
    color: '#444444',
    fontSize: 14,
  },
});
