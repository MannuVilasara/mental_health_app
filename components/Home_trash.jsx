import React, {useEffect, useState} from 'react';
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
} from 'react-native';

import Header from './Header';

const {width, height} = Dimensions.get('screen');

function Home() {
  // State variables
  const [loadItems, setLoadItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const [timeIndexValue, setTimeIndexValue] = useState();

  useEffect(() => {
    // Fetch initial items on component mount
    getItems();
  }, []);

  // Fetch items from the server
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

  // Delete an item from the server
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

  // Handle pressing on a specific date
  const handleDatePress = index => {
    setSelectedDateIndex(index);
    setModalVisible(false);
    setNewActivity('');
  };

  // Toggle the visibility of the modal
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Send data to the server when saving a new activity
  const sendData = () => {
    let data = {newActivity, timeIndexValue, selectedDateIndex};

    fetch('http://192.168.190.191:5000/newItems', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(result => {
        toggleModal();
        setNewActivity('');
        getItems();
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  };

  // Determine the index of the current day
  const currentDayIndex = new Date().getDay();

  // JSX structure of the component
  return (
    <SafeAreaView>
      <ScrollView>
        <Header />
        <View>
          <Text style={styles.headingText}>Daily Tasks</Text>

          {/* Displaying days of the week */}
          <View>
            <View style={styles.itemRow}>
              {dates.map((item, dateIndex) => (
                <TouchableOpacity
                  key={dateIndex}
                  onPress={() => handleDatePress(dateIndex)}>
                  <View
                    style={[
                      styles.item,
                      selectedDateIndex === dateIndex && {
                        backgroundColor: '#6dc985',
                        borderColor: '#6dc985',
                      },
                      {width: boxWidth},
                    ]}>
                    <Text
                      style={{
                        color:
                          selectedDateIndex === dateIndex ? 'black' : 'black',
                      }}>
                      {item.weekday.slice(0, 3)}
                    </Text>
                    <Text
                      style={{
                        color:
                          selectedDateIndex === dateIndex ? 'black' : 'black',
                      }}>
                      {[item.date.getDate()]}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Displaying time slots and activities */}
            <View style={styles.timeBox}>
              <Text
                style={{
                  fontSize: 19,
                  marginVertical: 5,
                  color: 'black',
                  marginBottom: 10,
                }}>
                {daysOfWeek[selectedDateIndex]}
              </Text>
              <ScrollView>
                {time.map((item, timeIndex) => (
                  <View style={styles.inputRow} key={timeIndex}>
                    <Text style={styles.timeItems}>{item.time}</Text>
                    <ScrollView horizontal>
                      {/* Displaying activities for the selected time and date */}
                      {loadItems.map(
                        (items, itemIndex) =>
                          items.timeIndexValue === timeIndex &&
                          items.selectedDateIndex === selectedDateIndex && (
                            <TouchableOpacity
                              key={itemIndex}
                              onPress={() => deleteItem(items._id)}>
                              <Text
                                style={{
                                  color: 'black',
                                  borderWidth: 1,
                                  borderColor: '#cfcfcf',
                                  paddingVertical: 0,
                                  paddingHorizontal: 4,
                                  marginVertical: 6,
                                  borderRadius: 5,
                                  marginHorizontal: 2,
                                  textAlign: 'center',
                                }}>
                                {items.newActivity}
                              </Text>
                            </TouchableOpacity>
                          ),
                      )}

                      {/* Button to add a new activity */}
                      <TouchableOpacity
                        onPress={() => {
                          toggleModal();
                          setTimeIndexValue(timeIndex);
                        }}>
                        <Text
                          style={[
                            styles.addItems,
                            {textAlignVertical: 'center', marginLeft: 3},
                          ]}>
                          +
                        </Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Modal for adding new activities */}
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
                <View style={{flexDirection: 'row'}}>
                  {/* Buttons to close or save the modal */}
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
                  <TouchableOpacity onPress={sendData}>
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
    </SafeAreaView>
  );
}

// Styling for the component
const styles = StyleSheet.create({
  headingText: {
    fontSize: 25,
    margin: 5,
    marginBottom: 1,
    padding: 5,
    color: 'black',
  },
  itemRow: {
    width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  item: {
    padding: 7,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b3b1b1',
    borderRadius: 8,
    marginVertical: 8,
  },
  timeBox: {
    margin: 5,
    borderWidth: 1,
    borderColor: '#969393',
    borderRadius: 8,
    padding: 10,
    borderStyle: 'dashed',
    height: height / 2,
  },
  timeItems: {
    margin: 0,
    fontSize: 15,
    width: 80,
    color: 'black',
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
    color: 'black',
    backgroundColor: '#6dc985',
    width: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#6dc985',
    fontSize: 15,
    flex: 1,
    marginVertical: 9,
    height: 20,
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

export default Home;
