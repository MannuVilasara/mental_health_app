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
  Alert,
} from 'react-native';
import Header from './Header';

// Getting screen dimensions
const {width} = Dimensions.get('screen');
const {height} = Dimensions.get('screen');

function Home() {

  // State variables
  const [loadItems, setloadItems] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [selectedDateIndex, setSelectedDateIndex] = useState(initialDayIndex);
  const [isInputEmpty, setInputEmpty] = useState(false)
  // State for selected time index
  const [timeIndexValue, setTimeIndexValue] = useState();

  // Initial day configuration
  const currentDay = new Date().getDay(); // Get the current day (0-6, where 0 is Sunday)
  const initialDayIndex = currentDay === 0 ? 6 : currentDay - 1; // Adjust to start from Monday

  // Days of the week
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Generating date objects for each day of the week
  const dates = daysOfWeek.map((day, index) => {
    const date = new Date();
    date.setDate(date.getDate() + (index - initialDayIndex));
    return {weekday: day, date};
  });

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
  const handleDatePress = index => {
    setSelectedDateIndex(index);
    setModalVisible(false); // Close the modal when a new date is pressed
    setNewActivity(''); // Reset the new activity input
  };

  // Toggling modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Sending data to the server
  function sendData() {
    // console.warn({newActivity})
    let data = {newActivity, timeIndexValue, selectedDateIndex};
    fetch('http://192.168.190.191:5000/newItems', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(result => {
      toggleModal();
      console.warn('result: ', result);
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
    let result = await fetch('http://192.168.190.191:5000/dailyTasks');
    result = await result.json();
    if(result){
        setloadItems(result)
    }
    else{
        setloadItems([])
    }
  };

  // Logging loaded items
  console.log(loadItems);

  // Deleting an item
  const deleteItem = async (itemId) => {
    try {
      let result = await fetch(`http://192.168.190.191:5000/delete/${itemId}`, {
        method: "DELETE",
      });
  
      if (result.ok) {
        getItems(); 
      } else {
        const errorResponse = await result.json();
        console.warn("Deletion failed:", errorResponse.message);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Rendering the UI
  return (
    <SafeAreaView>
      <ScrollView>
        <Header />
        <View>

          <Text style={styles.headingText}>Daily Tasks</Text>

          <View>
            {/* Days  */}
            <View style={styles.itemRow}>
              {dates.map((item, dateIndex) => {
                return (
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
                );
              })}
            </View>

            {/* Time  */}
            <View style={styles.timeBox}>
              <Text style={{fontSize: 19, marginVertical: 5, color: 'black',marginBottom: 10}}>
                {daysOfWeek[selectedDateIndex]}
              </Text>
              <ScrollView>
                {time.map((item, timeIndex) => {
                  return (
                    <View style={styles.inputRow}>
                      <Text style={styles.timeItems}>{item.time}</Text>

                      <ScrollView horizontal>
                      {loadItems.map((items, itemIndexe) => {
                        if (
                          items.timeIndexValue == timeIndex &&
                          items.selectedDateIndex == selectedDateIndex
                        ) {
                          return (
                            <TouchableOpacity
                            onPress={()=>{
                                deleteItem(items._id)
                            }}>
                            <Text
                              style={{
                                color: 'black',
                                textAlignVertical: 'center',
                                borderWidth: 1,
                                borderColor: '#cfcfcf',
                                paddingVertical: 0,
                                paddingHorizontal: 4,
                                marginVertical: 8,
                                borderRadius: 5,
                                marginHorizontal: 2,
                                textAlign: 'center'
                              }}>
                              {items.newActivity}
                            </Text>
                            </TouchableOpacity>
                          );
                        }
                      })}

                      <TouchableOpacity
                        onPress={() => {
                          toggleModal();
                          setTimeIndexValue(timeIndex);
                          console.log(timeIndex);
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
                {newActivity=="" ?
                  <Text style={{color:'#ff6666'}}>Input field cannot be empty</Text>: <Text></Text>
                }
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
                  <TouchableOpacity onPress={()=>{
                    if(newActivity != ""){
                      sendData()
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  upper: {
    backgroundColor: '#6dc985',
    height: 100,
    width: '100%',
  },
  headingText: {
    fontSize: 25,
    margin: 5,
    marginBottom: 1,
    // backgroundColor: 'black',
    padding: 5,
    //   textAlign: 'center',
    color: 'black',
  },
  itemRow: {
    // backgroundColor: 'black',
    width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  item: {
    // backgroundColor:'black',
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
    // backgroundColor: 'black',
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
    color: 'black',
    backgroundColor: '#6dc985',
    width: 20,
    // textAlign: 'center',
    borderWidth: 1,
    // borderRadius: 5,
    borderColor: '#6dc985',
    // fontSize: 15,
    flex: 1,
    // marginVertical: 8,
    // height: 15,

    paddingVertical: 0,
    paddingHorizontal: 4,
    marginVertical: 8,
    borderRadius: 5,
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

export default Home;
