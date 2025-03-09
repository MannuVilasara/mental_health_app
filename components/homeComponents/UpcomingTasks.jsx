import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { TaskContext } from '../../context/taskContext';
import { AuthContext } from '../../context/authContext';
import url from '../../context/url';
import Heading from '../../ui/Headings';
import { Colors } from '../../ui/Colors';

const { width: screenWidth } = Dimensions.get('window'); // Get screen width

const UpcomingTasks = () => {
  const [tasks] = useContext(TaskContext);
  const [state] = useContext(AuthContext);
  const { token } = state;

  const [loadItems, setLoadItems] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(15);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const Min = new Date().getMinutes();
    const Hour = new Date().getHours();
    const currentMin = Hour * 60 + Min;
    let index = 15;

    if (currentMin < 9 * 60 + 30) {
      index = 0;
    } else if (currentMin < 22 * 60 + 30) {
      index = Math.floor((currentMin - 9 * 60 - 30) / 60) + 1;
    }

    setCurrentTimeIndex(index);
    getItems();
  }, []);

  const getItems = async () => {
    try {
      let data = await fetch(`${url}/api/v1/dailyTask/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      data = await data.json();
      if (data) {
        const sortedItems = data?.dailyTasks.sort(
          (a, b) => a.timeIndexValue - b.timeIndexValue,
        );
        setLoadItems(sortedItems);
      } else {
        setLoadItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const getCategoryIcon = (activity) => {
    const lowerActivity = activity?.toLowerCase() || '';
    if (lowerActivity.includes('study') || lowerActivity.includes('read')) return 'book';
    if (lowerActivity.includes('exercise') || lowerActivity.includes('gym')) return 'activity';
    if (lowerActivity.includes('meeting') || lowerActivity.includes('call')) return 'users';
    if (lowerActivity.includes('eat') || lowerActivity.includes('lunch') || lowerActivity.includes('dinner')) return 'coffee';
    return 'calendar';
  };

  const formatTime = (timeIndex) => {
    const baseHour = 8.3 + timeIndex;
    const hour = Math.floor(baseHour);
    const minute = Math.round((baseHour - hour) * 60);
    return `${hour}:${minute < 10 ? '0' + minute : minute}`;
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const upcomingTasks = loadItems.filter(
    item =>
      item.selectedDate === new Date().getDate() &&
      item.selectedDay === new Date().getDay() &&
      item.timeIndexValue > currentTimeIndex - 1,
  );

  return (
    <View style={styles.container}>
      <Heading title="Upcoming Tasks" onPress={getItems} buttonTitle="Refresh" />

      <View style={styles.scrollContainer}>
        <ScrollView
          style={styles.boxContainer}
          contentContainerStyle={styles.boxContent}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {upcomingTasks.length > 0 ? (
            upcomingTasks.slice(0, 4).map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.taskCard}
                onPress={() => openModal(item)}
              >
                <View style={styles.iconContainer}>
                  <Icon name={getCategoryIcon(item.newActivity)} size={20} color={Colors.text.accent} />
                </View>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle} numberOfLines={1}>{item.newActivity}</Text>
                  <View style={styles.timeContainer}>
                    <Icon name="clock" size={14} color={Colors.primaryDark} />
                    <Text style={styles.timeText}>{formatTime(item.timeIndexValue)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="calendar" size={32} color={Colors.background.accent} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No upcoming tasks for today</Text>
              <TouchableOpacity style={styles.addButton} onPress={getItems}>
                <Text style={styles.addButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        {upcomingTasks.length > 2 && (
          <Icon
            name="chevron-right"
            size={24}
            color={Colors.primaryDark}
            style={styles.rightArrow}
          />
        )}
      </View>

      {/* Modal code remains unchanged */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedTask && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedTask.newActivity}</Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Icon name="x" size={24} color={Colors.text.dark} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalContent}>
                  <View style={styles.modalRow}>
                    <Icon name="clock" size={18} color={Colors.text.accent} />
                    <Text style={styles.modalText}>
                      Time: {formatTime(selectedTask.timeIndexValue)}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Icon name="calendar" size={18} color={Colors.text.accent} />
                    <Text style={styles.modalText}>
                      Date: {selectedTask.selectedDate}/{new Date().getMonth() + 1}/{new Date().getFullYear()}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Icon name={getCategoryIcon(selectedTask.newActivity)} size={18} color={Colors.text.accent} />
                    <Text style={styles.modalText}>Category: {selectedTask.newActivity}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const getItems = UpcomingTasks.getItems;

export default UpcomingTasks;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    // margin: 16,
    marginVertical: 16,
    borderRadius: 0,
    padding: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 8,
    // elevation: 3,
  },
  scrollContainer: {
    position: 'relative',
  },
  boxContainer: {
    width: '100%',
  },
  boxContent: {
    flexDirection: 'row', // Horizontal layout
    paddingVertical: 10,
    paddingRight: 20, // Extra padding for the last item
  },
  taskCard: {
    width: screenWidth * 0.6, // 60% of screen width
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    padding: 16,
    marginRight: 16, // Space between tasks
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${Colors.background.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    color: Colors.text.dark,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontFamily: 'Poppins-Medium',
  },
  emptyContainer: {
    width: '100%',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    alignSelf: 'center',
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.text.dark,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginBottom: 16,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: `${Colors.background.accent}20`,
    borderRadius: 8,
  },
  addButtonText: {
    color: Colors.text.accent,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  rightArrow: {
    backgroundColor: Colors.background.accent,
    padding: 10,
    borderRadius: 50,
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -21 }], // Center vertically
  },
  // Modal styles remain unchanged
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: Colors.background.primary,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text.dark,
  },
  modalContent: {
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  modalText: {
    fontSize: 14,
    color: Colors.text.dark,
    fontFamily: 'Poppins-Medium',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.background.accent,
    borderRadius: 10,
  },
  closeButtonText: {
    color: Colors.text.primary,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
});