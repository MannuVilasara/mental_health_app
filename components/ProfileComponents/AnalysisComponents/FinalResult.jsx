import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import url from '../../../context/url'
import { AuthContext } from '../../../context/authContext'
import { Colors } from '../../../ui/Colors'

const FinalResult = () => {
  //global
  const [state] = useContext(AuthContext)
  const { token } = state

  //becks Test
  const [becksTest, setBecksTestData] = useState([])
  const beckTestScore = becksTest?.map((item) => item.score)[0] / 8

  //feeling score
  const [feelingNumbers, setFeelingNumbers] = useState([]);

  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  console.log(beckTestScore)

  const getBecksData = async () => {
    try {
      let result = await fetch(`${url}/api/v1/weeklyTest/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      result = await result.json();
      console.log(result);
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
    }
  };

  const getFeelingScore = async () => {
    try {
      let result = await fetch(`${url}/api/v1/feel/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      result = await result.json();
      console.log(result);
      if (result && result.feel && result.feel.length > 0) {
        // Extract feelNumber values
        const feelNumbers = result.feel.map(feelObj => feelObj.feelNumber);
        setFeelingNumbers(feelNumbers); // Set the array of feelNumbers in state
        console.log(feelNumbers);
      } else {
        setFeelingNumbers([]); // Reset to an empty array if no data is available
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setFeelingNumbers([]); // Reset to an empty array in case of an error
    }
  };

  let addition = 0
  let sad = 0
  for (let i = 0; i < feelingNumbers.length; i++) {
    addition += feelingNumbers[i]
    if (feelingNumbers[i] == 1) {
      sad += 1
    }
  }
  let feelingS = (sad / addition) * 5
  const totalScore = 10 - (beckTestScore + feelingS)


  console.log(`Addition ${addition} Sad: ${sad}`)
  console.log(`=${feelingNumbers}`)


  useEffect(() => {
    getBecksData();
    getFeelingScore()
  }, []);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [totalScore]);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.scoreCard,
        {
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <Text style={styles.title}>Overall Analysis</Text>
        <Text style={styles.scoreText}>
          {totalScore.toFixed(2)}
        </Text>
        <Text style={styles.label}>Final Score</Text>
      </Animated.View>
    </View>
  )
}

export default FinalResult

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  scoreCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    color: Colors.text.secondary,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 16,
  },
  scoreText: {
    color: Colors.primary,
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  label: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
})