import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
} from 'react-native-gifted-charts';
import Bottom from '../Bottom';

const Analysis = () => {
  const data = [
    {value: 5},
    {value: 8},
    {value: 12},
    {value: 6},
    {value: 7},
    {value: 8},
    {value: 5},
  ];
  const data2 = [{value: 5}, {value: 8}, {value: 12}, {value: 6}];
  return (
    <View>
      <View style={{margin: 10}}>
        <Text
          style={[
            styles.color_black,
            {fontSize: 17, fontWeight: 600, width: '50%'},
          ]}>
          Sleep Analysis
        </Text>
        <View style={styles.bargraphBox}>
          <BarChart
            data={data}
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
          />
        </View>
        <Text
          style={[
            styles.color_black,
            {fontSize: 17, fontWeight: 600, width: '50%'},
          ]}>
          Mood Analysis
        </Text>
        <View style={styles.pieChartBox}>
          <PieChart
            data={data2}
            focusOnPress
            showText
            textSize={20}
            textColor="black"
            radius={80}
          />
          <View
            style={{
              height: '100%',
              width: '40%',
              padding: 20,
              justifyContent: 'center',
            }}>
            <Text style={[styles.color_black, {fontSize: 15}]}>Happy: </Text>
            <Text style={[styles.color_black, {fontSize: 15}]}>Sad: </Text>
            <Text style={[styles.color_black, {fontSize: 15}]}>Excited: </Text>
            <Text style={[styles.color_black, {fontSize: 15}]}>Normal: </Text>
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
    </View>
  );
};

export default Analysis;

const styles = StyleSheet.create({
  color_black: {
    color: 'black',
  },
  color_white: {
    color: 'white',
  },
  profileBox: {
    backgroundColor: 'rgba(111,145,103,0.8)',
    // height: '70%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  imageView: {
    // backgroundColor:'green',
    alignItems: 'center',
    justifyContent: 'center',
    // width: '20%',
    margin: 15,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 2,
  },
  bargraphBox: {
    // backgroundColor:'grey',
    paddingRight: 7,
    marginVertical: 15,
    justifyContent: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  pieChartBox: {
    // backgroundColor:'grey',
    paddingRight: 7,
    marginTop: 7,
    flexDirection: 'row',
    height: 170,
    marginBottom: 20
  },
});
