
import React, {useState} from 'react';
import {ScrollView, View, Alert,StyleSheet,Text} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Dimensions } from 'react-native';
import Bottom from '../Bottom';

const width = Dimensions.get('screen')

export default function CBTTab() {
  const [playing, setPlaying] = useState(false);
  const onStateChange = (state) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('video has finished playing!');
    }
  }
  const togglePlaying = () => {
    setPlaying((prev) => !prev);
  }
  return (
    <View style={styles.maincontainer}>
        
        <ScrollView style={styles.Scrollcontainer}>
         
         <View style={styles.fullcontainer}>
           
         <View style={styles.videocontainer}>
      <YoutubePlayer
        height={250}
        play={playing}
        videoId={'c8GumLZYBXQ'}
        onChangeState={onStateChange}
      />

    </View>
    <Text style={styles.videoheading}>Relaxation exercises</Text>
    </View>
         <View style={styles.fullcontainer}>
            
         <View style={styles.videocontainer}>
      <YoutubePlayer
        height={250}
        play={playing}
        videoId={'Ub4hPERRenY'}
        onChangeState={onStateChange}
      />
    </View>
    <Text style={styles.videoheading}>Depression Let's Talk Hindi</Text>
    </View>
         <View style={styles.fullcontainer}>
           
         <View style={styles.videocontainer}>
      <YoutubePlayer
        height={250}
        play={playing}
        videoId={'IwWZopSio-A'}
        onChangeState={onStateChange}
      />
    </View>
    <Text style={styles.videoheading}>Depression - symptoms, treatment</Text>
    </View>
    <Bottom/>
    </ScrollView>
    </View>
    
   
  );
};


const styles = StyleSheet.create({
    fullcontainer:{
        flex:1,
        // backgroundColor:'red',
    },

    maincontainer:{
        flex:1,
        paddingTop:25,
    },

    Scrollcontainer: {
      flex:1,
    //   overflow: 'hidden',
      // backgroundColor:'red'
      // paddingVertical: 40,
      // paddingHorizontal: 70,
  
    },

    videocontainer:{
        // marginHorizontal:20,
        // marginBottom:1,
        marginHorizontal:10,
        overflow:'hidden',
        borderRadius:15,
        // backgroundColor:'blue',
        height:190,
    },
    videoheading:{
        fontSize:20,
        marginBottom:25,
        marginHorizontal:20,
        marginTop:5,
        color:'#444444',

        fontWeight:'500'
    }
});