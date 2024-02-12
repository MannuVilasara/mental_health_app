import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const SleepTrack = () => {
  const [date1, setDate1] = useState(new Date());
  const [showTimeText1, setShowTimeText1] = useState(false);
  const [showTimeText2, setShowTimeText2] = useState(false);
  const [show1, setShow1] = useState(false);
  const [mode1, setMode1] = useState('date');
  const [mode2, setMode2] = useState('date');
  const [date2, setDate2] = useState(new Date());
  const [date21, setDate21] = useState(null);
  const [show2, setShow2] = useState(false);
  const [difference, setDifference] = useState({ hours: 0, minutes: 0 });
  const [arrowPosition, setArrowPosition] = useState(0);
  const [score, setScore] = useState(0);
  const [changeTouchable, setChangeTouchable] = useState(true)

  useEffect(() => {
    const calculateDifference = () => {
      // If wake-up time is earlier than bed time, add a day to wake-up time
      const wakeUpAdjusted =
        date2 < date1 ? new Date(date2.getTime() + 24 * 60 * 60 * 1000) : date2;
      const diffInMilliseconds = wakeUpAdjusted.getTime() - date1.getTime();
      const hours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
      const minutes = Math.floor(
        (diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );
      setDifference({ hours, minutes });

      // Calculate sleep quality based on difference
      const totalMinutes = hours * 60 + minutes;
      const sleepQuality = Math.max(0, Math.min(1, (totalMinutes - 5) / 3)); // Normalize the value between 0 and 1
      const colorValue = Math.round(255 * (1 - sleepQuality)); // Interpolate between red (255,0,0) and green (0,255,0)

      // Calculate score
      let sleepScore = 0;
      if (totalMinutes >= 5 * 60) {
        sleepScore = totalMinutes >= 8 * 60 ? 10 : (totalMinutes - 5 * 60) / (3 * 60) * 10;
      }
      setScore(sleepScore);
       // Calculate arrow position based on the score
       const normalizedScore = sleepScore / 10; // Normalize score to range [0, 1]
       const position = normalizedScore * 100; // Convert to percentage
       setArrowPosition(Math.min(position, 94)); // Ensure position does not exceed 100%
    };

    calculateDifference();
  }, [date2]);

  const onChange1 = (e, selectedDate) => {
    setDate1(selectedDate);
    setShow1(false);
    setShowTimeText1(true);
    setChangeTouchable(false)
  };
  const onChange2 = (e, selectedDate) => {
    setDate2(selectedDate);
    setShow2(false);
    setShowTimeText2(true);
  };

  const showMode1 = modeToShow => {
    setShow1(true);
    setMode1(modeToShow);
  };
  const showMode2 = modeToShow => {
    setShow2(true);
    setMode2(modeToShow);
  };
  const hideTimeText = () => {
    setShowTimeText1(false);
    setShowTimeText2(false);
  };
  console.log(difference.hours)

  return (
    <View style={{ marginTop: 19 }}>
      <View style={{ flexDirection: 'row' }}>
        <Text
          style={[
            styles.color_black,
            { fontSize: 17, fontWeight: 600, width: '50%' },
          ]}
        >
          Sleep Track
        </Text>
        <TouchableOpacity style={{ width: '50%' }} onPress={() => hideTimeText()}>
          <Text
            style={[
              styles.color_black,
              { fontSize: 17, width: '100%', textAlign: 'right' },
            ]}
          >
            Clear
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sleepContainer}>
        <TouchableOpacity
          style={[styles.sleepBox, { backgroundColor: 'rgba(111,145,103,0.8)' }]}
          onPress={() => showMode1('time')}>
          <View style={{ flexDirection: 'column', width: 'auto', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name='moon' size={15} color='white' />
              <Text style={[styles.color_white, { fontWeight: 600, fontSize: 15 }]}>
                {' '}Bed Time {'  '}
              </Text>
            </View>
            {showTimeText1 ? (
              <Text style={[styles.color_white, { fontSize: 15 }]}>
                {' '}
                {date1.toLocaleTimeString(navigator.language, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            ) : (
              <></>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity disabled={changeTouchable}
          style={[styles.sleepBox, { backgroundColor: 'rgba(3,85,83,0.8)' }]}
          onPress={() => showMode2('time')}>
          <View style={{ flexDirection: 'column', width: 'auto', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name='sun' size={15} color='white' />
              <Text style={[styles.color_white, { fontWeight: 600, fontSize: 15 }]}>
                {' '}Wake Time
            </Text>
            </View>
            {showTimeText2 ? (
              <Text style={[styles.color_white, { fontSize: 15 }]}>
                {' '}
                {date2.toLocaleTimeString(navigator.language, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            ) : (
              <></>
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={{width:'100%', alignItems:'center', marginTop:10}}>
      <LinearGradient
        colors={['red', 'green']}
        style={styles.gradientLine}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
          {showTimeText2?<View style={[styles.arrowContainer, { left: `${arrowPosition}%` }]}>
          <View style={styles.arrow} />
        </View>:<></> }
      </LinearGradient>
      </View>


      <View style={styles.sleepDataBox}>
        {showTimeText2 ? (
          <>
          <View style={{flexDirection:'row'}}>
          <Text style={[styles.color_black, styles.sleepData,{fontWeight:600}]}>
            Sleep Hours: 
          </Text>
          <Text style={[styles.color_black, styles.sleepData]}>{" "}{difference.hours} hours {difference.minutes}{' '}minutes</Text>
          </View>

          <View style={{flexDirection:'row'}}>
          <Text style={[styles.color_black, styles.sleepData,{fontWeight:600}]}>
            Sleep score: 
           </Text>
          <Text style={[styles.color_black, styles.sleepData]}>
            {'  '}{score.toFixed(2)}
          </Text>
          </View>
          
          </>
        ) : (
            <></>
          )}
      </View>

      {show1 && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date1}
          mode={mode1}
          is24Hour={true}
          display="default"
          onChange={onChange1}
          
        />
      )}
      {show2 && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date2}
          mode={mode2}
          is24Hour={true}
          display="spinner"
          onChange={onChange2}
          negativeButton={{label: 'Cancel'}}
          positiveButton={{label: 'Set'}}
        />
      )}
    </View>
  );
};

export default SleepTrack;

const styles = StyleSheet.create({
  color_black: {
    color: 'black',
  },
  color_white: {
    color: 'white',
  },
  sleepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  sleepBox: {
    height: 60,
    width: '45%',
    borderRadius: 15,
    justifyContent: 'center',
    padding: 8,
    marginHorizontal: 8,
    margin: 5,
    alignItems: 'center',
  },
  sleepDataBox: {
    width: '100%',
    marginVertical: 5,
    height: 20,
    borderRadius: 10,
    // alignItems:'center',
    marginTop: 15,
    // backgroundColor:"pink",
    marginHorizontal:10
  },
  sleepData: {
    fontSize: 15,
    // textAlign: 'center',
    // backgroundColor:'green',
  },
  sleepQualityLine:{
    width: '80%',
    marginVertical: 5,
    height: 20,
    borderRadius: 10,
    marginHorizontal:20
  },
  gradientLine: {
    width: '90%',
    height: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8
  },
  arrowContainer: {
    position: 'absolute',
    // top: -9,
    bottom: -9,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 0,
    borderLeftWidth: 10,
    borderTopColor: 'black',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '180deg' }],
  }
});
