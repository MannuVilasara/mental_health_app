import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../context/authContext';
import url from '../../context/url';
import { Colors } from '../../ui/Colors';
import Heading from '../../ui/Headings';

const SleepTrack = () => {
  const [state] = useContext(AuthContext);
  const { token } = state;

  // State Management
  const [bedTime, setBedTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);
  const [showBedPicker, setShowBedPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [sleepStats, setSleepStats] = useState({ hours: 0, minutes: 0, score: 0 });
  const [scaleAnim] = useState(new Animated.Value(1)); // Always visible
  const [isSaving, setIsSaving] = useState(false);

  // Debug function to help track state changes
  useEffect(() => {
    console.log('Sleep stats updated:', sleepStats);
    console.log('Bed time:', bedTime);
    console.log('Wake time:', wakeTime);
  }, [sleepStats, bedTime, wakeTime]);

  // Calculate sleep metrics
  useEffect(() => {
    const calculateSleepMetrics = () => {
      if (!bedTime || !wakeTime) {
        setSleepStats({ hours: 0, minutes: 0, score: 0 });
        return;
      }

      // Get time difference in milliseconds, handling overnight sleep
      let bedTimeMs = bedTime.getTime();
      let wakeTimeMs = wakeTime.getTime();

      // If wake time is earlier than bed time, add a day to wake time
      if (wakeTimeMs < bedTimeMs) {
        wakeTimeMs += 24 * 60 * 60 * 1000;
      }

      let diffMs = wakeTimeMs - bedTimeMs;

      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      // Calculate sleep score - values between 0 and 10
      // Optimal sleep is around 7-9 hours (420-540 minutes)
      // Adjust formula based on your preferred sleep duration
      let score;
      if (totalMinutes < 300) { // Less than 5 hours
        score = (totalMinutes / 300) * 5; // Max 5 points for less than ideal
      } else if (totalMinutes <= 540) { // 5-9 hours (ideal range)
        score = 5 + ((totalMinutes - 300) / 240) * 5; // 5-10 points for ideal range
      } else { // More than 9 hours
        score = 10 - ((totalMinutes - 540) / 180); // Decrease for oversleeping
      }

      // Ensure score is between 0 and 10
      score = Math.min(10, Math.max(0, score));

      // Update state with new values
      setSleepStats({
        hours,
        minutes,
        score
      });

      // Animate for visual feedback
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true
        })
      ]).start();
    };

    // Only calculate if both times are set
    if (bedTime && wakeTime) {
      calculateSleepMetrics();
    }
  }, [bedTime, wakeTime, scaleAnim]);

  // API call
  const saveSleepData = async () => {
    if (!bedTime || !wakeTime) {
      Alert.alert('Error', 'Please set both bed and wake times.', [{ text: 'OK' }]);
      return;
    }

    setIsSaving(true);
    try {
      // Calculate time difference, handling overnight sleep
      let bedTimeMs = bedTime.getTime();
      let wakeTimeMs = wakeTime.getTime();

      if (wakeTimeMs < bedTimeMs) {
        wakeTimeMs += 24 * 60 * 60 * 1000;
      }

      const diffMs = wakeTimeMs - bedTimeMs;

      const response = await fetch(`${url}/api/v1/sleep/send`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bedTime,
          wakeTime,
          differenceInMill: diffMs,
        }),
      });

      if (response.ok) {
        resetTimes();
        Alert.alert('Success', 'Sleep data saved!', [{ text: 'OK' }]);
      } else {
        throw new Error('Failed to save sleep data');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to save. Try again.', [{ text: 'OK' }]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimeChange = (type) => (event, selectedDate) => {
    // Handle Android cancelation or manual return
    if (!selectedDate) {
      if (type === 'bed') {
        setShowBedPicker(false);
      } else {
        setShowWakePicker(false);
      }
      return;
    }

    if (type === 'bed') {
      setShowBedPicker(false);
      setBedTime(selectedDate);
    } else {
      setShowWakePicker(false);
      setWakeTime(selectedDate);
    }
  };

  const resetTimes = () => {
    setBedTime(null);
    setWakeTime(null);
    setSleepStats({ hours: 0, minutes: 0, score: 0 });

    // Small animation for reset feedback
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true })
    ]).start();
  };

  const formatTime = (date) => {
    if (!date) return 'Set Time';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determine circle color based on score
  const getScoreColor = (score) => {
    if (score === 0) return Colors.border.medium; // Gray for no score
    if (score < 4) return '#FF6347'; // Red for low score (0-3.9)
    if (score < 7) return '#FFD700'; // Yellow for medium score (4-6.9)
    return '#32CD32'; // Green for high score (7-10)
  };

  return (
    <View
      style={styles.container}
    >
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.title}>Sleep Tracker</Text>
        <TouchableOpacity onPress={resetTimes} disabled={isSaving}>
          <Icon
            name="refresh-ccw"
            size={20}
            color={isSaving ? Colors.border.medium : Colors.primary}
          />
        </TouchableOpacity>
      </View> */}
      <Heading title="Sleep Tracker" buttonTitle="Refresh" onPress={resetTimes} />
      {/* Time Selection */}
      <View style={styles.timeContainer}>
        <TimeCard
          icon="moon"
          title="Sleep"
          time={formatTime(bedTime)}
          onPress={() => setShowBedPicker(true)}
          color={Colors.primary}
          disabled={isSaving}
        />
        <TimeCard
          icon="sunrise"
          title="Wake"
          time={formatTime(wakeTime)}
          onPress={() => setShowWakePicker(true)}
          color={Colors.primaryDark}
          disabled={!bedTime || isSaving}
        />
      </View>

      {/* Sleep Score Circle - Always Visible */}
      {bedTime && wakeTime &&

        <View style={styles.scoreContainer}>
          <Animated.View style={[styles.scoreCircle, {
            transform: [{ scale: scaleAnim }],
            backgroundColor: getScoreColor(sleepStats.score),
          }]}>
            <Text style={styles.scoreText}>{sleepStats.score.toFixed(1)}</Text>
            <Text style={styles.scoreLabel}>Sleep Score</Text>
          </Animated.View>

          {/* Always show stats row but conditionally show duration */}
          <View style={styles.statsRow}>
            <StatItem
              icon="clock"
              value={sleepStats.hours > 0 ? `${sleepStats.hours}h ${sleepStats.minutes}m` : "-"}
              label="Duration"
            />
            {(bedTime && wakeTime) && (
              <TouchableOpacity
                style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                onPress={saveSleepData}
                disabled={isSaving}
              >
                <Text style={styles.saveText}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      }

      {/* Time Pickers */}
      {showBedPicker && (
        <DateTimePicker
          value={bedTime || new Date()}
          mode="time"
          display="spinner"
          onChange={handleTimeChange('bed')}
          accentColor={Colors.primary}
        />
      )}
      {showWakePicker && (
        <DateTimePicker
          value={wakeTime || new Date()}
          mode="time"
          display="spinner"
          onChange={handleTimeChange('wake')}
          accentColor={Colors.primary}
        />
      )}
    </View>
  );
};

const TimeCard = ({ icon, title, time, onPress, color, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[styles.timeCard, disabled && styles.disabledCard]}
  >
    <View style={[styles.timeIconCircle, { backgroundColor: color }]}>
      <Icon name={icon} size={20} color={Colors.text.light} />
    </View>
    <Text style={styles.timeTitle}>{title}</Text>
    <Text style={styles.timeText}>{time}</Text>
  </TouchableOpacity>
);

const StatItem = ({ icon, value, label }) => (
  <View style={styles.statItem}>
    <Icon name={icon} size={18} color={Colors.text.secondary} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.dark,
    fontFamily: 'Poppins-Bold',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  timeCard: {
    width: '48%',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.border.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledCard: {
    opacity: 0.6,
  },
  timeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  timeTitle: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  timeText: {
    color: Colors.text.primary,
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 5,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  scoreText: {
    color: Colors.text.light,
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
  },
  scoreLabel: {
    color: Colors.text.light,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: Colors.primary,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginVertical: 5,
  },
  statLabel: {
    color: Colors.text.secondary,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 2,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.border.medium,
    opacity: 0.8,
  },
  saveText: {
    color: Colors.text.light,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SleepTrack;