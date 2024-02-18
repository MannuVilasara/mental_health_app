import React, {useContext, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {AuthContext} from '../../context/authContext';
import { TaskContext } from '../../context/taskContext';

// Getting screen dimensions
const {width} = Dimensions.get('screen');
const {height} = Dimensions.get('screen');
console.log(height);
console.log(width);

function DailyTasks() {
  //gloabal
  const [state] = useContext(AuthContext);
  const {token} = state;
  const [tasks] = useContext(TaskContext)

  // Current date
  const currentDate = new Date().getDate();
  console.log(`Current Date: ${currentDate}`);
  // Current day
  const currentDay = new Date().getDay();
  console.log(`Current Day: ${currentDay}`);

  // State variables
  const [loadItems, setloadItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  // State for selected time index
  const [timeIndexValue, setTimeIndexValue] = useState();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [selectedDay, setSelecteDay] = useState(currentDay);

  // Days of the week
  function dayss(dayIndex) {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const offset = dayIndex % 7; // To ensure we always stay within 0-6
    return daysOfWeek[offset];
  }

  // Days and Date object (in what series days are loading)
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate(); // Get the number of days in the current month
  const prevMonthLastDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0,
  ).getDate(); // Get the last date of the previous month

  const daysObj = [
    {
      date: currentDate - 1 === 0 ? prevMonthLastDate : currentDate - 1,
      day: (currentDay + 6) % 7,
    },
    {date: currentDate, day: (currentDay + 0) % 7},
    {
      date: currentDate + 1 > daysInMonth ? 1 : currentDate + 1,
      day: (currentDay + 1) % 7,
    },
    {
      date: currentDate + 2 > daysInMonth ? 2 : currentDate + 2,
      day: (currentDay + 2) % 7,
    },
    {
      date: currentDate + 3 > daysInMonth ? 3 : currentDate + 3,
      day: (currentDay + 3) % 7,
    },
    {
      date: currentDate + 4 > daysInMonth ? 4 : currentDate + 4,
      day: (currentDay + 4) % 7,
    },
    {
      date: currentDate + 5 > daysInMonth ? 5 : currentDate + 5,
      day: (currentDay + 5) % 7,
    },
  ];

  // Box width for each day (used for styling)
  const boxWidth = width / 7 - 6;

  // Time slots
  const time = [
    {time: '8.30'},
    {time: '9.30'},
    {time: '10.30'},
    {time: '11.30'},
    {time: '12.30 pm'},
    {time: '1.30'},
    {time: '2.30'},
    {time: '3.30'},
    {time: '4.30'},
    {time: '5.30'},
    {time: '6.30'},
    {time: '7.30'},
    {time: '8.30'},
    {time: '9.30'},
    {time: '10.30'},
    {time: '11.30'},
    {time: '12.30 am'},
  ];

  // Handling date press
  const handleDatePress = date => {
    setSelectedDate(date);
    setModalVisible(false); // Close the modal when a new date is pressed
    setNewActivity(''); // Reset the new activity input
  };
  const handleDayPress = day => {
    setSelecteDay(day);
  };

  // Toggling modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Sending data to the server
  function sendData() {
    // console.warn({newActivity})
    let data = {newActivity, timeIndexValue, selectedDate, selectedDay};
    fetch('http://192.168.190.191:5000/api/v1/dailyTask/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(result => {
      toggleModal();
      //   console.warn('result: ', result);
      setNewActivity('');
      getItems();
    });
  }

  // Fetching items on component mount
  useEffect(() => {
    getItems();
  }, []);

  // Fetching daily tasks
  const getItems = async () => {
    let result = await fetch('http://192.168.190.191:5000/api/v1/dailyTask/get', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    result = await result.json();
    if (result) {
      setloadItems(result?.dailyTasks);
    } else {
      setloadItems([]);
    }
  };

  console.log(`selected Date: ${selectedDate}`);
  console.log(`selected Day ${selectedDay}`);
  // Deleting an item
  const deleteItem = async itemId => {
    try {
      let result = await fetch(`http://192.168.190.191:5000/delete/${itemId}`, {
        method: 'DELETE',
      });

      if (result.ok) {
        getItems();
      } else {
        const errorResponse = await result.json();
        console.warn('Deletion failed:', errorResponse.message);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Rendering the UI
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 9,
          marginBottom: 5,
        }}>
        <Icon name={'arrow-right'} color={'black'} size={13} />
        <Text style={styles.headingText}>Week Planner</Text>
      </View>
      {/* <Header/> */}
      <ScrollView nestedScrollEnabled={true}>
        <View style={{marginHorizontal: 0}}>
          <View>
            <ScrollView horizontal style={{marginHorizontal: 5}}>
              <View style={styles.itemRow}>
                {daysObj.map((item, dateIndex) => {
                  return (
                    <TouchableOpacity
                      key={dateIndex}
                      onPress={() => {
                        handleDatePress(item.date), handleDayPress(item.day);
                      }}>
                      <View
                        style={[
                          styles.item,
                          selectedDate === item.date && {
                            // backgroundColor: '#6dc985',
                            backgroundColor: 'rgba(111,145,103,1)',
                            borderColor: '#6dc985',
                          },
                          item.date >= new Date().getDate() && {
                            borderBottomWidth: 1,
                            borderColor: '#b3b1b1',
                          },
                          item.date < new Date().getDate() && {
                            borderBottomWidth: 1,
                            borderTopColor: '#b3b1b1',
                            borderLeftColor: '#b3b1b1',
                            borderRightColor: '#b3b1b1',
                            borderBottomColor: '#ff6666',
                            borderColor: '#ffb3b3',
                          },
                          {width: boxWidth},
                        ]}>
                        <Text
                          style={[
                            {
                              color:
                                selectedDate === item.date ? 'white' : 'black',
                            },
                          ]}>
                          {dayss(item.day).slice(0, 3)}
                        </Text>
                        <Text
                          style={{
                            color:
                              selectedDate === item.date ? 'white' : 'black',
                          }}>
                          {item.date}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Time  */}
            <View style={styles.timeBox}>
              <Text
                style={{
                  fontSize: 19,
                  marginVertical: 5,
                  color: 'black',
                  marginBottom: 10,
                }}>
                {dayss(selectedDay)}
              </Text>
              <ScrollView nestedScrollEnabled={true} style={{flex: 1}}>
                {time.map((item, timeIndex) => {
                  return (
                    <View style={styles.inputRow} key={timeIndex}>
                      <Text style={styles.timeItems}>{item.time}</Text>
                      <View
                        style={{
                          width: width / 1.3,
                          flex: 1,
                          alignItems: 'flex-start',
                        }}>
                        <ScrollView horizontal>
                          {loadItems.map((items, itemIndexe) => {
                            if (
                              items.timeIndexValue == timeIndex &&
                              items.selectedDate == selectedDate &&
                              items.selectedDay == selectedDay
                            ) {
                              return (
                                <TouchableOpacity
                                  onPress={() => {
                                    selectedDate >= new Date().getDate()
                                      ? deleteItem(items._id)
                                      : deleteItem(null);
                                  }}
                                  key={items._id}>
                                  <Text
                                    style={{
                                      color: 'black',
                                      textAlignVertical: 'center',
                                      borderWidth: 1,
                                      borderColor: '#cfcfcf',
                                      // borderColor: 'white',
                                      paddingVertical: 0,
                                      paddingHorizontal: 4,
                                      marginVertical: 8,
                                      borderRadius: 5,
                                      marginHorizontal: 2,
                                      textAlign: 'center',
                                      backgroundColor: 'white',
                                    }}>
                                    {items.newActivity}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          })}
                          {selectedDate >= new Date().getDate() ? (
                            <TouchableOpacity
                              onPress={() => {
                                toggleModal();
                                setTimeIndexValue(timeIndex);
                                console.log(`Time Index: ${timeIndex}`);
                              }}>
                              <Text style={[styles.addItems]}>+</Text>
                            </TouchableOpacity>
                          ) : (
                            <Text></Text>
                          )}
                        </ScrollView>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text
                  style={{
                    color: 'black',
                    margin: 5,
                    marginLeft: 0,
                    fontSize: 17,
                  }}>
                  Enter a new activity:
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={newActivity}
                  onChangeText={text => setNewActivity(text)}
                />
                {newActivity == '' ? (
                  <Text style={{color: '#ff6666'}}>
                    Input field cannot be empty
                  </Text>
                ) : (
                  <Text></Text>
                )}
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity onPress={toggleModal}>
                    <Text
                      style={[
                        styles.modalButtons,
                        {
                          color: 'black',
                          backgroundColor: '#ff6666',
                          marginLeft: 0,
                        },
                      ]}>
                      Close
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (newActivity != '') {
                        sendData();
                      }
                    }}>
                    <Text
                      style={[
                        styles.modalButtons,
                        {color: 'black', backgroundColor: '#6dc985'},
                      ]}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  upper: {
    backgroundColor: '#6dc985',
    height: 100,
    width: '100%',
  },
  headingText: {
    fontSize: 20,
    // margin: 5,
    marginBottom: 1,
    // backgroundColor: '#6dc985',
    padding: 5,
    //   textAlign: 'center',
    color: 'black',
    fontWeight: '600',
  },
  itemRow: {
    // backgroundColor: 'yellow',
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-start',
    // justifyContent: "space-evenly",
    paddingHorizontal: 5,
    flex: 1,
    // flexWrap: 'wrap',
    marginVertical: 5,
    // height:900
  },
  item: {
    // backgroundColor:'white',
    padding: 7,
    alignItems: 'center',
    borderWidth: 1,
    // borderColor: '#b3b1b1',
    borderRadius: 15,
    marginVertical: 2,
    marginHorizontal: 3,
  },
  timeBox: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#969393',
    borderRadius: 15,
    padding: 10,
    borderStyle: 'dashed',
    height: height / 1.7,
    // backgroundColor: 'black',
  },
  timeItems: {
    margin: 0,
    fontSize: 15,
    width: 80,
    color: 'black',
    // backgroundColor: '#dedede',
    backgroundColor: '#dedede',
    padding: 0,
    paddingLeft: 3,
    height: 35,
    textAlignVertical: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginVertical: 1,
  },
  textInput: {
    // backgroundColor: 'red',
    margin: 0,
    padding: 0,
    paddingHorizontal: 5,
    borderColor: '#6e6d6d',
    borderWidth: 1,
    width: 250,
    color: 'black',
    borderRadius: 5,
    marginTop: 10,
  },
  addItems: {
    color: 'white',
    // backgroundColor: '#6dc985',
    backgroundColor: 'rgba(111,145,103,0.8)',
    width: 20,
    // textAlign: 'center',
    borderWidth: 1,
    // borderRadius: 5,
    // borderColor: '#6dc985',
    borderColor: 'rgba(111,145,103,1)',
    // fontSize: 15,
    flex: 1,
    // marginVertical: 8,
    // height: 15,
    paddingVertical: 0,
    paddingHorizontal: 4,
    marginVertical: 8,
    borderRadius: 50,
    marginHorizontal: 2,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 17,
    borderRadius: 10,
    elevation: 5,
  },
  modalButtons: {
    margin: 5,
    padding: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
});

export default DailyTasks;
