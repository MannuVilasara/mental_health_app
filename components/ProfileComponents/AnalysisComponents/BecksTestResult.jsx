import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/authContext';
import url from '../../../context/url';
import { Colors } from '../../../ui/Colors';

const BecksTestResult = ({ patientId }) => {
  // Global
  const [state] = useContext(AuthContext);
  const { token } = state;

  const [becksTestData, setBecksTestData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const getData = async () => {
    setIsLoading(true);
    try {
      let endpoint = `${url}/api/v1/weeklyTest/get`;
      if (patientId) {
        endpoint += `?patientId=${patientId}`;
      }

      let result = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      result = await result.json();
      console.log('Back test :-' + JSON.stringify(result, null, 2));
      if (result && result.test && result.test.length > 0) {

        // Sort the test data by createdAt date in descending order
        result.test.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Get the latest test data
        const latestTestData = result.test[0];

        // Set the latest test data in state  
        setBecksTestData([latestTestData]);
      } else {
        setBecksTestData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setBecksTestData([]);
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
    getData();
  }, [patientId, token]);

  // Function to determine severity level based on score
  const getSeverityLevel = (score) => {
    if (score <= 10) return { level: 'Minimal', color: '#4BC0C0' };
    if (score <= 16) return { level: 'Mild', color: '#FFCD56' };
    if (score <= 29) return { level: 'Moderate', color: '#FF9F40' };
    return { level: 'Severe', color: '#FF6384' };
  };

  // Function to get date in readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Beck's Depression Inventory</Text>
        <Text style={styles.subHeaderText}>Latest assessment results</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your assessment data...</Text>
        </View>
      ) : becksTestData.length > 0 ? (
        becksTestData.map((item, id) => {
          const severity = getSeverityLevel(item.score);
          return (
            <View key={id} style={styles.resultContainer}>
              <View style={styles.scoreContainer}>
                <View style={[styles.scoreCircle, { borderColor: severity.color }]}>
                  <Text style={styles.scoreText}>{item.score}</Text>
                </View>
                <View style={styles.scoreDetails}>
                  <Text style={styles.severityText}>
                    {severity.level} Depression
                  </Text>
                  <Text style={styles.dateText}>
                    Assessed on {formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  The Beck Depression Inventory (BDI) is a widely used self-assessment tool that measures the severity of depression symptoms.
                </Text>
                <View style={styles.scaleContainer}>
                  <Text style={styles.scaleTitle}>Score Interpretation:</Text>
                  <View style={styles.scaleItem}>
                    <View style={[styles.scaleIndicator, { backgroundColor: '#4BC0C0' }]} />
                    <Text style={styles.scaleText}>0-10: Minimal Depression</Text>
                  </View>
                  <View style={styles.scaleItem}>
                    <View style={[styles.scaleIndicator, { backgroundColor: '#FFCD56' }]} />
                    <Text style={styles.scaleText}>11-16: Mild Depression</Text>
                  </View>
                  <View style={styles.scaleItem}>
                    <View style={[styles.scaleIndicator, { backgroundColor: '#FF9F40' }]} />
                    <Text style={styles.scaleText}>17-29: Moderate Depression</Text>
                  </View>
                  <View style={styles.scaleItem}>
                    <View style={[styles.scaleIndicator, { backgroundColor: '#FF6384' }]} />
                    <Text style={styles.scaleText}>30-63: Severe Depression</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No assessment data available</Text>
          <Text style={styles.noDataSubText}>Complete a Beck's Depression Inventory assessment to see your results here.</Text>
        </View>
      )}
    </View>
  );
};

export default BecksTestResult;

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
  resultContainer: {
    padding: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  scoreDetails: {
    flex: 1,
  },
  severityText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  infoContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  scaleContainer: {
    marginTop: 8,
  },
  scaleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  scaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  scaleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  scaleText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  noDataContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  noDataSubText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});