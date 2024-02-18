import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TaskContext } from '../../context/taskContext';
import { AuthContext } from '../../context/authContext';

const { width } = Dimensions.get('screen');

const UpcomingTasks = () => {
    //global
    const [tasks] = useContext(TaskContext)
    const [state] = useContext(AuthContext)
    const {token} = state

  const [loadItems, setLoadItems] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(15); // Default value

  useEffect(() => {
    // Calculate current time index
    const Min = new Date().getMinutes();
    const Hour = new Date().getHours();
    const currentMin = Hour * 60 + Min;
    let index = 15; // Default value

    if (currentMin < 9 * 60 + 30) {
      index = 0;
    } else if (currentMin < 22 * 60 + 30) {
      index = Math.floor((currentMin - 9 * 60 - 30) / 60) + 1;
    }

    setCurrentTimeIndex(index);

    // Fetch items
    getItems();
  }, []);

  const getItems = async () => {
    try {
      let data = await fetch('http://192.168.190.191:5000/api/v1/dailyTask/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    data = await data.json();
      // const data = tasks
      if (data) {
        // Sort items based on timeIndexValue
        const sortedItems = data?.dailyTasks.sort((a, b) => a.timeIndexValue - b.timeIndexValue);
        setLoadItems(sortedItems);
      } else {
        setLoadItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  console.log(currentTimeIndex)
  return (
    <View>
      <View style={{ marginTop: 40 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              styles.color_black,
              { fontSize: 17, fontWeight: 600, width: '50%' },
            ]}
          >
            Upcoming Tasks
          </Text>
          <TouchableOpacity style={{ width: '50%'}} onPress={()=>{getItems()}}>
          <Text
            style={[
              styles.color_black,
              { fontSize: 17, width:'100%',textAlign: 'right' },
            ]}
          >
            Refresh
          </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.boxContainer}>
          {loadItems.length > 0 ? (
            loadItems
              .filter(
                item =>
                  item.selectedDate === new Date().getDate() &&
                  item.selectedDay === new Date().getDay() &&
                  item.timeIndexValue > currentTimeIndex-1
              ).slice(0,4)
              .map((item, index) => (
                <View
                  key={index}
                  style={[styles.boxes, { padding: 10, justifyContent: 'center' }]}
                >
                  {/* <View style={styles.emojiBox}>
                    <Image
                      source={require('../img/activity/yoga.png')}
                      style={styles.taskImage}
                    />
                  </View> */}
                  <Text
                    style={[
                      styles.color_black,
                      { fontWeight: 600, fontSize: 17, margin: 5 },
                    ]}
                  >
                    {item.newActivity}
                  </Text>
                  <Text
                    style={[
                      styles.color_black,
                      { fontSize: 17, marginBottom: 5, marginLeft: 5 },
                    ]}
                  >
                    {(item.timeIndexValue + 8.3).toFixed(2)}
                  </Text>
                </View>
              ))
          ) : (
            <View style={[styles.boxes, { padding: 10, justifyContent: 'center' }]}>
              <Text
                style={[
                  styles.color_black,
                  { fontSize: 17, marginBottom: 5, marginLeft: 5 },
                ]}
              >
                No upcoming tasks
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export const getItems = UpcomingTasks.getItems; // Export getItems function

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
