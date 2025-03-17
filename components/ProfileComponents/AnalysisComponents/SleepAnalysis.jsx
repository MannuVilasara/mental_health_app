import { Image, ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { BarChart } from 'react-native-chart-kit';
import Bottom from '../../Bottom';
import { AuthContext } from '../../../context/authContext';
import url from '../../../context/url';

const SleepAnalysis = ({ patientId }) => {
  //global
  const [state] = useContext(AuthContext);
  const { token } = state;

  const [sleepData, setSleepData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getData = async () => {
    setIsLoading(true);
    try {
      let endpoint = `${url}/api/v1/sleep/get`;
      if (patientId) {
        endpoint += `?patientId=${patientId}`;
      }

      let result = await fetch(endpoint, {
        // let result = await fetch(`${url}/api/v1/sleep/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      result = await result.json();
      if (result) {
        setSleepData(result?.sleep);
      } else {
        setSleepData([]);
      }
    } catch (error) {
      console.log('Error fetching sleep data:', error);
      setSleepData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [patientId, token]);

  // Filter out data based on unique dates
  const filteredData = sleepData
    .filter((item, index, self) => {
      // Filter out data based on unique dates
      const currentDate = new Date();
      const itemDate = new Date(item.updatedAt);
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      return (
        self.findIndex(
          elem =>
            new Date(elem.updatedAt).toDateString() === itemDate.toDateString(),
        ) === index && itemDate >= sevenDaysAgo
      );
    })
    .map(item => ({
      value: parseFloat((item.differenceInMill / 3600000).toFixed(2)),
      label: weekday[new Date(item.updatedAt).getDay()]
    }));

  // Prepare data for chart-kit bar chart
  const labels = filteredData.map(item => item.label);
  const values = filteredData.map(item => item.value);

  // Ensure we have data to display
  const chartData = {
    labels: labels.length > 0 ? labels : ['No Data'],
    datasets: [
      {
        data: values.length > 0 ? values : [0],
        colors: values.map(() => (opacity = 1) => `rgba(111, 145, 103, ${opacity})`),
      }
    ]
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>
          Sleep Analysis
        </Text>
        <Text style={styles.subtitle}>
          Hours of sleep in the last 7 days
        </Text>

        <View style={styles.chartContainer}>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading sleep data...</Text>
          ) : filteredData.length > 0 ? (
            <BarChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              yAxisLabel=""
              yAxisSuffix="h"
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(111, 145, 103, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(68, 68, 68, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.7,
              }}
              style={styles.chart}
              showValuesOnTopOfBars={true}
              fromZero={true}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No sleep data available for the last 7 days</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {values.length > 0 ? Math.max(...values).toFixed(1) : '0'} h
            </Text>
            <Text style={styles.statLabel}>Longest Sleep</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {values.length > 0
                ? (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1)
                : '0'} h
            </Text>
            <Text style={styles.statLabel}>Average Sleep</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {values.length > 0 ? Math.min(...values).toFixed(1) : '0'} h
            </Text>
            <Text style={styles.statLabel}>Shortest Sleep</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SleepAnalysis;

const styles = StyleSheet.create({
  container: {
    margin: 15,
    marginTop: 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    color: '#444444',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  subtitle: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 15,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
    minHeight: 220,
    justifyContent: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loadingText: {
    color: '#666666',
    fontSize: 16,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  noDataText: {
    color: '#666666',
    fontSize: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#444444',
    fontSize: 18,
    fontWeight: '600',
  },
  statLabel: {
    color: '#666666',
    fontSize: 12,
    marginTop: 5,
  },
  color_black: {
    color: '#444444',
  },
  color_white: {
    color: 'white',
  },
});
