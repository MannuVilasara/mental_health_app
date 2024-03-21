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
    startSpeechRecognizing();
  } else {
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
      setStart(false);
      onSpeechResults()
    } catch (error) {
      console.log(error);
    }
  };
  const handleManualEdit = (text) => {
    setFinalResult(text); 
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
      </View>
      <View style={{alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
         
        </View>
        <View style={{padding:5, width:300, backgroundColor:'rgba(111,145,103,0.4)', flexDirection:'row', alignItems:'center', borderRadius:5}}>
          <ScrollView horizontal>
            <Text style={{padding:5}}>{finalResult}</Text>
          </ScrollView>
          <TouchableOpacity onPress={()=>{setFinalResult([])}}>
            <Text style={{backgroundColor:'rgba(111,145,103,1)', padding:2, paddingHorizontal: 8, borderRadius: 5}}>Clear</Text>
          </TouchableOpacity>
        </View>
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
