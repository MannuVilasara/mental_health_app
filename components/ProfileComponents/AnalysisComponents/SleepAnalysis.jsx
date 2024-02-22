import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {BarChart} from 'react-native-gifted-charts';
import Bottom from '../../Bottom';
import {AuthContext} from '../../../context/authContext';
import url from '../../../context/url';

const SleepAnalysis = () => {
  //global
  const [state] = useContext(AuthContext);
  const {token} = state;

  const [sleepData, setSleepData] = useState([]);

  const weekday = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const getData = async () => {
    let result = await fetch(`${url}/api/v1/sleep/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    result = await result.json();
    if (result) {
      setSleepData(result?.sleep);
      // console.log(`Data: ${JSON.stringify(result)}`);
    } else {
      setSleepData([]);
    }
  };
  useEffect(() => {
    getData();
  }, []);

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

  // console.log(JSON.stringify(filteredData));
  const data = filteredData.map(item=>item.value)
  const date = filteredData.map(item=>item.day)
  console.log(data)
  console.log(date)
  return (
    <View>
      <View style={{margin: 10, marginTop: 2}}>
        <Text
          style={[
            styles.color_black,
            {fontSize: 17, fontWeight: 600, width: '50%'},
          ]}>
          Sleep Analysis
        </Text>
        <View style={styles.bargraphBox}>
          <BarChart
            data={filteredData}
            maxValue={10}
            initialSpacing={10}
            spacing={15}
            stepHeight={20}
            barWidth={25}
            frontColor={'rgba(3,85,83,0.8)'}
            rulesColor={'black'}
            sideColor={'black'}
            isAnimated
            yAxisTextStyle={{color: 'black'}}
            xAxisLabelTextStyle={{color:'black'}}
          />
        </View>
      </View>
    </View>
  );
};

export default SleepAnalysis;

const styles = StyleSheet.create({
  color_black: {
    color: 'black',
  },
  color_white: {
    color: 'white',
  },
  bargraphBox: {
    // backgroundColor:'grey',
    paddingRight: 7,
    marginVertical: 15,
    justifyContent: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
