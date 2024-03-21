import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import url from '../../../context/url';

const FaceDetectResult = () => {
  const [result, setResult] = useState([]);
  const [scores, setScores] = useState([]);
  const [averageScore, setAverageScore] = useState(0);

  const fetchData = async () => {
    try {
      let data = await fetch(`${url}/faceData`, {
        method: "GET"
      });
      data = await data.json();
      if (data) {
        console.log(data);
        setResult(`face Data: ${data}`);
        const extractedScores = data.map(item => parseInt(item.score)); // Convert scores to integers
        setScores(extractedScores);
        const total = extractedScores.reduce((acc, score) => acc + score, 0);
        const avg = total / extractedScores.length;
        setAverageScore(avg);
      } else {
        setResult([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
<View style={{ margin: 10, marginVertical:10 }}>
      <Text style={[styles.color_black, { fontSize: 17, fontWeight: 600 }]}>
        AI Model Analysis Report
      </Text>
      {/* Display average score */}
      <Text style={{ color: 'black', fontSize: 16, margin:5 ,marginHorizontal: 10 }}>
  Average Mood: {averageScore > 0 ? "Happy" : "Sad"}
</Text>

    </View> 
  );
};

export default FaceDetectResult;

const styles = StyleSheet.create({
  color_black: {
    color: '#444444',
  },
});
