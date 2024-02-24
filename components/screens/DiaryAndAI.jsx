import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Voice from '@react-native-voice/voice';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {err} from 'react-native-svg';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import Vision from './diaryAiCpmponents/Vision';
import { TextInput as GestureHandlerTextInput } from 'react-native-gesture-handler';

const DiaryAndAI = ({isRecording}) => {
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState('');
  const [result, setResult] = useState([]);
  const [finalResult, setFinalResult] = useState([]);
  // const [startAudio, setStartAudio] = useState(props.clicked)

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = e => {
    console.log(e);
    setStart(true);
  };
  const onSpeechEnd = e => {
    console.log(e);
    setStart(false);
  };
  const onSpeechResults = e => {
    console.log(e);
    const sentences = e.value.map(sentence => sentence);
    console.log(`sentences: ${sentences[0]}`)
    const finalSentence = sentences[0];
    setResult(finalSentence);
    setFinalResult(prevResult => {
        const newResult = [...prevResult, finalSentence];
        console.log(`finalResult: ${newResult}`);
        return newResult;
    });
};
useEffect(() => {
  if (isRecording) {
    // Start processing when recording starts
    startSpeechRecognizing();
  } else {
    // Stop processing when recording stops
    stopSpeechRecognizing();
  }
}, [isRecording]);
  const startSpeechRecognizing = async () => {
    try {
      await Voice.start('en-US');
      setResult([]);
    } catch (error) {
      console.log(error);
    }
  };
  const stopSpeechRecognizing = async () => {
    try {
      await Voice.stop();
      // await Voice.destroy();
      setStart(false);
      // setResult([]);
      // setFinalResult([]);
      onSpeechResults()
    } catch (error) {
      console.log(error);
    }
  };
  const handleManualEdit = (text) => {
    setFinalResult(text); // Update finalResult state on manual edit
  };
  return (
    <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 9,
          marginBottom: 5,
        }}>
        {/* <Icon name={'arrow-right'} color={'black'} size={13} /> */}
        {/* <Text style={styles.headingText}>Diary and AI</Text> */}
      </View>
      <View style={{alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          {/* {start ? (
            <View style={styles.startBox}>
              <TouchableOpacity
                onPress={() => {
                  stopSpeechRecognizing();
                }}>
                <Text
                  style={{color: 'white', textAlign: 'center', fontSize: 17}}>
                  End
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.startBox}>
              <TouchableOpacity
                onPress={() => {
                  startSpeechRecognizing();
                }}>
                <Text
                  style={{color: 'white', textAlign: 'center', fontSize: 17}}>
                  Start
                </Text>
              </TouchableOpacity> 
            </View>
          )} */}
        </View>
        <Text style={{padding:5, width:'95%'}}>{finalResult}</Text>
        {/* <GestureHandlerTextInput
          style={{ color: 'black', width: 200, height: 200, borderColor: 'black', borderWidth: 1 }}
          onChangeText={handleManualEdit} // Listen for manual edits
          value={finalResult} // Bind value to finalResult state
          multiline={true}
        /> */}
      </View>
    </ScrollView>
  );
};

export default DiaryAndAI;

const styles = StyleSheet.create({
  headingText: {
    fontSize: 20,
    // margin: 5,
    marginBottom: 1,
    // backgroundColor: '#6dc985',
    padding: 5,
    //   textAlign: 'center',
    color: '#444444',
    fontWeight: '600',
  },
  startBox: {
    margin: 10,
    backgroundColor: 'rgba(111,145,103,0.8)',
    width: 60,
    padding: 2,
    borderRadius: 10,
  },
});
