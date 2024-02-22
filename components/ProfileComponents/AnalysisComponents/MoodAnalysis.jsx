import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  BarChart,
  LineChart,
  // PieChart,
  PopulationPyramid,
} from 'react-native-gifted-charts';
import PieChart from 'react-native-pie-chart';
import Bottom from '../../Bottom';
import {AuthContext} from '../../../context/authContext';
import {TouchableOpacity} from 'react-native-gesture-handler';
import url from '../../../context/url';

const MoodAnalysis = () => {
  //global
  const [state] = useContext(AuthContext);
  const {token} = state;

  //store mood data
  const [moodData, setMoodData] = useState([]);
  const [selectedTime, setSelectedTime] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [countedFeelings, setCountedFeelings] = useState([]);

  //function to get data
  const getData = async () => {
    let result = await fetch(`${url}/api/v1/feel/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    result = await result.json();
    if (result) {
      setMoodData(result?.feel); 
      // console.log(`Data: ${JSON.stringify(result)}`);
    } else {
      setMoodData([]);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setItem1();
  }, [moodData]);

  //date filter
  // Parse the date string into a JavaScript Date object
  const date = new Date();
  // Calculate the threshold date, 7 days before the given date
  const thresholdDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);

  // let dateFilter = []

  const setItem1 = () => {
    let morningData = moodData
      .filter(
        item =>
          new Date(item.createdAt) > new Date(thresholdDate) &&
          new Date(item.createdAt).getHours() >= 4 &&
          new Date(item.createdAt).getHours() < 10,
      )
      .map(item => item.feelNumber);

    // console.log('Morning Data:', morningData);
    setCurrentData(morningData.length > 0 ? morningData : []);
  };

  const setItem2 = () => {
    let noonData = moodData
      .filter(
        item =>
          new Date(item.createdAt) > new Date(thresholdDate) &&
          new Date(item.createdAt).getHours() >= 10 &&
          new Date(item.createdAt).getHours() < 18,
      )
      .map(item => item.feelNumber);

    // noonData?setCurrentData(dateFilter):setCurrentData([0,0,0,0])
    // console.log('Noon Data:', noonData);
    setCurrentData(noonData.length > 0 ? noonData : []);
  };

  const setItem3 = () => {
    let eveningData = moodData
      .filter(
        item =>
          new Date(item.createdAt) > new Date(thresholdDate) &&
          (new Date(item.createdAt).getHours() < 4 ||
            new Date(item.createdAt).getHours() >= 18),
      )
      .map(item => item.feelNumber);

    // dateFilter?setCurrentData(dateFilter):setCurrentData([0,0,0,0])
    // console.log('Evening Data:', eveningData);
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
    {value: zero, color: '#ff7f0e', text: 'Sad'},
    {value: one, color: '#1f77b4', text: 'Normal'},
    {value: two, color: '#2ca02c', text: 'Happy'},
    {value: three, color: '#9467bd', text: 'Excited'},
  ];
  const sliceColor = ['#ff7f0e', '#1f77b4', '#2ca02c', '#9467bd'];
  const series = [zero, one, two, three];
  const sum = series[0] + series[1] + series[2] + series[3];
  // const data2 = [{value: 15}, {value: 30}, {value: 26}, {value: 40}];
 

  //According to selected time

  return (
    <View>
      <View style={{margin: 10}}>
        <Text
          style={[
            styles.color_black,
            {fontSize: 17, fontWeight: 600, width: '50%'},
          ]}>
          Mood Analysis
        </Text>

        <View style={styles.timeSelectBox}>
          <TouchableOpacity
            onPress={() => {
              {
                setSelectedTime(1);
              }
              setItem1();
            }}>
            <View
              style={[
                styles.timeSelect,
                selectedTime === 1
                  ? {backgroundColor: 'rgba(111,145,103,1)'}
                  : {backgroundColor: 'white'},
              ]}>
              <Text
                style={[
                  styles.timeSelectText,
                  selectedTime === 1 ? {color: 'white'} : {color: 'black'},
                ]}>
                Morning
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              {
                setSelectedTime(2);
              }
              setItem2();
            }}>
            <View
              style={[
                styles.timeSelect,
                selectedTime === 2
                  ? {backgroundColor: 'rgba(111,145,103,1)'}
                  : {backgroundColor: 'white'},
              ]}>
              <Text
                style={[
                  styles.timeSelectText,
                  selectedTime === 2 ? {color: 'white'} : {color: 'black'},
                ]}>
                Noon
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              {
                setSelectedTime(3);
              }
              setItem3();
            }}>
            <View
              style={[
                styles.timeSelect,
                selectedTime === 3
                  ? {backgroundColor: 'rgba(111,145,103,1)'}
                  : {backgroundColor: 'white'},
              ]}>
              <Text
                style={[
                  styles.timeSelectText,
                  selectedTime === 3 ? {color: 'white'} : {color: 'black'},
                ]}>
                Evening
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.pieChartBox}>
          {/* <PieChart
            data={data2}
            focusOnPress
            // showText
            textSize={20}
            textColor="black"
            radius={80}
          /> */}
          {sum != 0 ? (
            <PieChart
              widthAndHeight={150}
              series={series}
              sliceColor={sliceColor}
              coverRadius={0.45}
              coverFill={'#FFF'}
            />
          ) : (
            <><View style={{width:150, height:150, justifyContent:'center', alignItems:'center'}}><Text style={{color:'black', fontWeight:'300'}}>No Data Available</Text></View></>
          )}

          <View
            style={{
              height: '100%',
              width: '40%',
              padding: 20,
              justifyContent: 'center',
            }}>
            <View style={styles.feelColor}>
              <View
                style={[styles.colorBox, {backgroundColor: data2[0].color}]}
              />
              <Text
                style={[styles.color_black, styles.textStyle, {fontSize: 15}]}>
                Sad:{' '}
              </Text>
              <Text style={styles.color_black}>{zero}</Text>
            </View>

            <View style={styles.feelColor}>
              <View
                style={[styles.colorBox, {backgroundColor: data2[1].color}]}
              />
              <Text
                style={[styles.color_black, styles.textStyle, {fontSize: 15}]}>
                Normal:{' '}
              </Text>
              <Text style={styles.color_black}>{one}</Text>
            </View>

            <View style={styles.feelColor}>
              <View
                style={[styles.colorBox, {backgroundColor: data2[2].color}]}
              />
              <Text
                style={[styles.color_black, styles.textStyle, {fontSize: 15}]}>
                Happy:{' '}
              </Text>
              <Text style={styles.color_black}>{two}</Text>
            </View>

            <View style={styles.feelColor}>
              <View
                style={[styles.colorBox, {backgroundColor: data2[3].color}]}
              />
              <Text
                style={[styles.color_black, styles.textStyle, {fontSize: 15}]}>
                Excited:{' '}
              </Text>
              <Text style={styles.color_black}>{three}</Text>
            </View>
          </View>
        </View>

        <Text
          style={[
            styles.color_black,
            {fontSize: 17, fontWeight: 600, width: '50%'},
          ]}>
          Test Report
        </Text>
        <Text style={styles.color_black}>Test Report of a Patient</Text>
      </View>
      <Bottom />
    </View>
  );
};

export default MoodAnalysis;

const styles = StyleSheet.create({
  color_black: {
    color: 'black',
  },
  color_white: {
    color: 'white',
  },
  timeSelectBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  timeSelect: {
    backgroundColor: 'white',
    width: 80,
    padding: 5,
    borderRadius: 10,
  },
  timeSelectText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 15,
  },
  pieChartBox: {
    // backgroundColor:'grey',
    paddingRight: 7,
    marginTop: 7,
    flexDirection: 'row',
    height: 170,
    marginBottom: 20,
    alignItems: 'center',
    margin: 10,
  },
  feelColor: {
    flexDirection: 'row',
  },
  textStyle: {
    fontWeight: '500',
  },
  colorBox: {
    width: 10,
    marginRight: 5,
  },
});
