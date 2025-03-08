import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { TaskContext } from '../../context/taskContext';
import { AuthContext } from '../../context/authContext';
import url from '../../context/url';
import PieChart from 'react-native-pie-chart';
import Heading from '../../ui/Headings';
import { Colors } from '../../ui/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('screen');

const UpcomingTasks = () => {
  //global
  const [tasks] = useContext(TaskContext);
  const [state] = useContext(AuthContext);
  const { token } = state;

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
      let data = await fetch(
        `${url}/api/v1/dailyTask/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      data = await data.json();
      // const data = tasks
      if (data) {
        // Sort items based on timeIndexValue
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

  // Task category icons mapping
  const getCategoryIcon = (activity) => {
    const lowerActivity = activity?.toLowerCase() || '';
    if (lowerActivity.includes('study') || lowerActivity.includes('read')) return 'book';
    if (lowerActivity.includes('exercise') || lowerActivity.includes('gym')) return 'activity';
    if (lowerActivity.includes('meeting') || lowerActivity.includes('call')) return 'users';
    if (lowerActivity.includes('eat') || lowerActivity.includes('lunch') || lowerActivity.includes('dinner')) return 'coffee';
    return 'calendar';
  };

  // Format time from index to readable format
  const formatTime = (timeIndex) => {
    const baseHour = 8.3 + timeIndex;
    const hour = Math.floor(baseHour);
    const minute = Math.round((baseHour - hour) * 60);
    return `${hour}:${minute < 10 ? '0' + minute : minute}`;
  };

  return (
    <View style={styles.container}>
      <View>
        <Heading title="Upcoming Tasks" onPress={getItems} buttonTitle="Refresh" />

        <View style={styles.boxContainer}>
          {loadItems
            .filter(
              item =>
                item.selectedDate === new Date().getDate() &&
                item.selectedDay === new Date().getDay() &&
                item.timeIndexValue > currentTimeIndex - 1,
            )
            .slice(0, 4).length > 0 ? (
            loadItems
              .filter(
                item =>
                  item.selectedDate === new Date().getDate() &&
                  item.selectedDay === new Date().getDay() &&
                  item.timeIndexValue > currentTimeIndex - 1,
              )
              .slice(0, 4)
              .map((item, index) => (
                <View key={index} style={styles.taskCard}>
                  <View style={styles.iconContainer}>
                    <Icon name={getCategoryIcon(item.newActivity)} size={20} color={Colors.text.accent} />
                  </View>
                  <View style={styles.taskContent}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{item.newActivity}</Text>
                    <View style={styles.timeContainer}>
                      <Icon name="clock" size={14} color={Colors.text.accent} />
                      <Text style={styles.timeText}>
                        {formatTime(item.timeIndexValue)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="calendar" size={32} color={Colors.background.accent} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>
                No upcoming tasks for today
              </Text>
              <TouchableOpacity style={styles.addButton} onPress={getItems}>
                <Text style={styles.addButtonText}>Refresh</Text>
              </TouchableOpacity>
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
  container: {
    backgroundColor: Colors.background.primary,
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 10,
  },
  taskCard: {
    width: '48%',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
    color: Colors.text.accent,
    fontFamily: 'Poppins-Medium',
  },
  emptyContainer: {
    width: '100%',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
});
