import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../context/authContext';
import url from '../../context/url';
import { Colors } from '../../ui/Colors';

const SleepTrack = () => {
  const [state] = useContext(AuthContext);
  const { token } = state;

  // State Management
  const [bedTime, setBedTime] = useState(new Date());
  const [wakeTime, setWakeTime] = useState(new Date());
  const [showBedPicker, setShowBedPicker] = useState(false);
  const [showWakePicker, setShowWakePicker] = useState(false);
  const [sleepStats, setSleepStats] = useState({ hours: 0, minutes: 0, score: 0 });
  const [arrowAnim] = useState(new Animated.Value(0));
  const [isSaving, setIsSaving] = useState(false);

  // Calculate sleep metrics
  useEffect(() => {
    const calculateSleepMetrics = () => {
      let diffMs;

      // If wakeTime is earlier than bedTime, assume it's the next day
      if (wakeTime.getTime() < bedTime.getTime()) {
        diffMs = ((wakeTime.getTime() + 24 * 60 * 60 * 1000) - bedTime.getTime());
      } else {
        diffMs = wakeTime.getTime() - bedTime.getTime();
      }

      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      // Score calculation: 0-10 scale, where 5 hours (300 min) is minimum, 8 hours (480 min) is optimal
      const score = Math.min(10, Math.max(0, ((totalMinutes - 300) / 180) * 10));

      setSleepStats({ hours, minutes, score });

      Animated.timing(arrowAnim, {
        toValue: Math.min((score / 10) * 90, 90),
        duration: 500,
        useNativeDriver: false,
      }).start();
    };

    if (bedTime && wakeTime) calculateSleepMetrics();
  }, [bedTime, wakeTime, arrowAnim]);

  // API call to save sleep data
  const saveSleepData = async () => {
    setIsSaving(true);
    try {
      const diffMs = wakeTime.getTime() < bedTime.getTime()
        ? (wakeTime.getTime() + 24 * 60 * 60 * 1000) - bedTime.getTime()
        : wakeTime.getTime() - bedTime.getTime();

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
        Alert.alert(
          'Success',
          'Sleep data saved successfully!',
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('Failed to save sleep data');
      }
    } catch (error) {
      console.error('Error saving sleep data:', error);
      Alert.alert(
        'Error',
        'Failed to save sleep data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Time picker handlers
  const handleTimeChange = (type) => (event, selectedDate) => {
    if (type === 'bed') {
      setShowBedPicker(false);
      if (selectedDate) setBedTime(selectedDate);
    } else {
      setShowWakePicker(false);
      if (selectedDate) setWakeTime(selectedDate);
    }
  };

  // Reset handler
  const resetTimes = () => {
    setBedTime(new Date());
    setWakeTime(new Date());
    setSleepStats({ hours: 0, minutes: 0, score: 0 });
    Animated.timing(arrowAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Sleep Tracker</Text>
        <TouchableOpacity onPress={resetTimes} disabled={isSaving}>
          <Text style={[styles.resetText, isSaving && styles.disabledText]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      {/* Time Selection */}
      <View style={styles.timeContainer}>
        <TimeCard
          icon="moon"
          title="Bed Time"
          time={formatTime(bedTime)}
          onPress={() => setShowBedPicker(true)}
          gradientColors={['#6F9167', '#4A6B43']}
        />
        <TimeCard
          icon="sun"
          title="Wake Time"
          time={formatTime(wakeTime)}
          onPress={() => setShowWakePicker(true)}
          gradientColors={['#035553', '#023938']}
          disabled={!bedTime || isSaving}
        />
      </View>

      {/* Sleep Quality Indicator */}
      <View style={styles.qualityContainer}>
        <LinearGradient
          colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
          style={styles.gradientBar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Animated.View
            style={[
              styles.arrow,
              {
                left: arrowAnim.interpolate({
                  inputRange: [0, 90],
                  outputRange: ['0%', '90%'],
                }),
              },
            ]}
          />
        </LinearGradient>
        <View style={styles.qualityLabels}>
          <Text style={styles.label}>Poor</Text>
          <Text style={styles.label}>Excellent</Text>
        </View>
      </View>

      {/* Sleep Stats */}
      {sleepStats.hours > 0 && (
        <View style={styles.statsContainer}>
          <StatItem label="Duration" value={`${sleepStats.hours}h ${sleepStats.minutes}m`} />
          <StatItem label="Score" value={sleepStats.score.toFixed(1)} />
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={saveSleepData}
            disabled={isSaving}
          >
            <Text style={styles.saveText}>
              {isSaving ? 'Saving...' : 'Save Sleep'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Time Pickers */}
      {showBedPicker && (
        <DateTimePicker
          value={bedTime}
          mode="time"
          display="spinner"
          onChange={handleTimeChange('bed')}
        />
      )}
      {showWakePicker && (
        <DateTimePicker
          value={wakeTime}
          mode="time"
          display="spinner"
          onChange={handleTimeChange('wake')}
        />
      )}
    </View>
  );
};

// Reusable Components
const TimeCard = ({ icon, title, time, onPress, gradientColors, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={styles.timeCard}>
    <LinearGradient colors={gradientColors} style={styles.timeGradient}>
      <Icon name={icon} size={24} color="#fff" />
      <Text style={styles.timeTitle}>{title}</Text>
      <Text style={styles.timeText}>{time}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const StatItem = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  // Base Container
  container: {
    flex: 1,
    padding: 15,
    // backgroundColor: Colors.background.primary,
    borderRadius: 15,
    marginTop: 20,
    // margin: 10,
    // elevation: 4,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    fontFamily: 'Poppins-Bold',
  },
  resetText: {
    fontSize: 15,
    color: '#035553',
    fontFamily: 'Poppins-Medium',
    opacity: 0.9,
  },
  disabledText: {
    color: '#999999',
    opacity: 0.6,
  },

  // Time Selection Styles
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  timeCard: {
    width: '47%',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timeGradient: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  timeTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
    fontFamily: 'Poppins-SemiBold',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
    opacity: 0.95,
  },

  // Quality Indicator Styles
  qualityContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  gradientBar: {
    width: '90%',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    position: 'relative',
  },
  arrow: {
    position: 'absolute',
    bottom: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#444444',
  },
  qualityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 12,
  },
  label: {
    color: '#666666',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },

  statsContainer: {
    backgroundColor: '#F8F9FB',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 6,
  },
  statLabel: {
    color: '#444444',
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
  },
  statValue: {
    color: '#035553',
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },

  // Save Button Styles
  saveButton: {
    backgroundColor: 'rgba(3,85,83,0.9)',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
  },
  saveButtonDisabled: {
    backgroundColor: '#999999',
    opacity: 0.8,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
});

export default SleepTrack;