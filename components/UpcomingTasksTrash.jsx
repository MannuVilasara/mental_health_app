import {StyleSheet, Text, View, Image, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {width} = Dimensions.get('screen');

const UpcomingTasks = () => {
  const [loadItems, setLoadItems] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState();

  useEffect(() => {
    // Current time
    const Min = new Date().getMinutes();
    const Hour = new Date().getHours();
    const currentMin = Hour * 60 + Min;
    console.log(currentMin);
    // Determine currentTimeIndex
    let index = 15; // Default value

    if (currentMin < 9 * 60 + 30) {
      index = 0;
    } else if (currentMin > 9 * 60 + 30 && currentMin < 10 * 60 + 30) {
      index = 1;
    } else if (currentMin > 10 * 60 + 30 && currentMin < 11 * 60 + 30) {
      index = 2;
    } else if (currentMin > 11 * 60 + 30 && currentMin < 12 * 60 + 30) {
      index = 3;
    } else if (currentMin > 12 * 60 + 30 && currentMin < 13 * 60 + 30) {
      index = 4;
    } else if (currentMin > 13 * 60 + 30 && currentMin < 14 * 60 + 30) {
      index = 5;
    } else if (currentMin > 14 * 60 + 30 && currentMin < 15 * 60 + 30) {
      index = 6;
    } else if (currentMin > 15 * 60 + 30 && currentMin < 16 * 60 + 30) {
      index = 7;
    } else if (currentMin > 16 * 60 + 30 && currentMin < 17 * 60 + 30) {
      index = 8;
    } else if (currentMin > 17 * 60 + 30 && currentMin < 18 * 60 + 30) {
      index = 9;
    } else if (currentMin > 18 * 60 + 30 && currentMin < 19 * 60 + 30) {
      index = 10;
    } else if (currentMin > 19 * 60 + 30 && currentMin < 20 * 60 + 30) {
      index = 11;
    } else if (currentMin > 20 * 60 + 30 && currentMin < 21 * 60 + 30) {
      index = 12;
    } else if (currentMin > 21 * 60 + 30 && currentMin < 22 * 60 + 30) {
      index = 13;
    } else if (currentMin > 22 * 60 + 30 && currentMin < 23 * 60 + 30) {
      index = 14;
    }

    setCurrentTimeIndex(index);

    // Fetch items on component mount
    getItems();
  }, []); // Empty dependency array ensures this effect runs only once on mount
  console.log(`current Time index: ${currentTimeIndex}`)


  const getItems = async () => {
    try {
      let result = await fetch('http://192.168.190.191:5000/dailyTasks');
      result = await result.json();
      if (result) {
        setLoadItems(result);
      } else {
        setLoadItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  console.log(currentTimeIndex);

  const nextTasks = () => {
    loadItems.map((item, index) => {
      if (
        item.selectedDate === new Date().getDate() &&
        item.selectedDay === new Date().getDay() &&
        item.timeIndexValue > currentTimeIndex &&
        item.timeIndexValue < currentTimeIndex + 5
      )
        return (
          <View
            key={index}
            style={[styles.boxes, {padding: 10, justifyContent: 'center'}]}>
            {/* <View style={styles.emojiBox}>
            <Image
              source={require('../img/activity/yoga.png')}
              style={styles.taskImage}
            />
          </View> */}
            <Text
              style={[
                styles.color_black,
                {fontWeight: 600, fontSize: 17, margin: 5},
              ]}>
              {item.newActivity}
            </Text>
            <Text
              style={[
                styles.color_black,
                {fontSize: 17, marginBottom: 5, marginLeft: 5},
              ]}>
              {(item.timeIndexValue + 8.3).toFixed(2)}
            </Text>
          </View>
        );
    });
  };

  return (
    <View>
      <View style={{marginTop: 40}}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              styles.color_black,
              {fontSize: 17, fontWeight: 600, width: '50%'},
            ]}>
            Upcoming Tasks
          </Text>
          <Text
            style={[
              styles.color_black,
              {fontSize: 17, width: '50%', textAlign: 'right'},
            ]}>
            More
          </Text>
        </View>
        <View style={styles.boxContainer}>
          {loadItems.some(
            item =>
              item.selectedDate === new Date().getDate() &&
              item.selectedDay === new Date().getDay() &&
              item.timeIndexValue > currentTimeIndex &&
              item.timeIndexValue < currentTimeIndex + 5,
          ) ? (
            loadItems.map((item, index) => {
              if (
                item.selectedDate === new Date().getDate() &&
                item.selectedDay === new Date().getDay() &&
                item.timeIndexValue > currentTimeIndex &&
                item.timeIndexValue < currentTimeIndex + 5
              )
                return (
                  <View
                    key={index}
                    style={[
                      styles.boxes,
                      {padding: 10, justifyContent: 'center'},
                    ]}>
                    {/* <View style={styles.emojiBox}>
              <Image
                source={require('../img/activity/yoga.png')}
                style={styles.taskImage}
              />
            </View> */}
                    <Text
                      style={[
                        styles.color_black,
                        {fontWeight: 600, fontSize: 17, margin: 5},
                      ]}>
                      {item.newActivity}
                    </Text>
                    <Text
                      style={[
                        styles.color_black,
                        {fontSize: 17, marginBottom: 5, marginLeft: 5},
                      ]}>
                      {(item.timeIndexValue + 8.3).toFixed(2)}
                    </Text>
                  </View>
                );
            })
          ) : (
            <View
              style={[styles.boxes, {padding: 10, justifyContent: 'center'}]}>
              <Text
                style={[
                  styles.color_black,
                  {fontSize: 17, marginBottom: 5, marginLeft: 5},
                ]}>
                No upcoming tasks
              </Text>
            </View>
          )}
        </View>
        {/* <Text style={[styles.color_black, { fontSize: 17, fontWeight: 500, width: 100,}]}>Add tasks</Text> */}
      </View>
    </View>
  );
};

export default UpcomingTasks;

const styles = StyleSheet.create({
  color_black: {
    color: 'black',
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  boxes: {
    width: width / 2.4,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
    marginTop: 10,
  },
  taskImage: {
    height: 30,
    width: 30,
  },
  emojiBox: {
    height: 50,
    width: 50,
    backgroundColor: '#ededed',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
