import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from 'react-native-vision-camera';
import {ActivityIndicator} from 'react-native-paper';
import {WebSocket} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Video from 'react-native-video';
import {AuthContext} from '../../../context/authContext';
import url from '../../../context/url';
//permissions
import { PermissionsAndroid, Platform } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import RNFetchBlob from 'rn-fetch-blob'
import DiaryAndAI from '../DiaryAndAI';
const { width, height } = Dimensions.get('window')

const Vision = () => {
  //global
  const [state] = useContext(AuthContext);
  const {user} = state;
  const camera = useRef(null);
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [uri, setUri] = useState();
  const [isRecording, setIsRecording] = useState(false)
  let newPath;
  const format = useCameraFormat(device, [
    {videoAspectRatio: 1 / 1},
    {videoResolution: {width: 360, height: 360}},
    {fps: 10},
    { videoStabilizationMode: 'cinematic-extended' }
  ]);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return <ActivityIndicator />;
  }

  if (!device) {
    return <Text style={{color: 'black'}}>Camera not found</Text>;
  }

  const recordVideo = async () => {
    try {
      camera.current.startRecording({
        videoBitRate: 2,
        
        onRecordingFinished: video => {
          console.log('Recorded video:', video);
          newPath = video.path;
          setUri(video.path);
        },
        onRecordingError: error => console.log(error),
      });
      // setIsRecording(true)
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = async () => {
    try {
      await camera.current.stopRecording();
      send();
      // setIsRecording(false)
    } catch (error) {
      console.log(error);
    }
  };
    const send = () => {
      RNFetchBlob.fetch(
        'POST',
        `${url}/upload`,
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {
            name: 'video',
            filename: `${user._id}.mp4`,
            type: 'video/quicktime',
            data: RNFetchBlob.wrap(newPath),
          },
        ],
      )
        .then((resp) => {
          console.log('Response', resp);
        })
        .catch((err) => {
          console.log(err);
        });
    };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {/* <Text style={{color: 'black'}}>Vision</Text> */}
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          // style={styles.camera}
          format={format}
          device={device}
          isActive={true}
          video={true}
        />
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={recordVideo}>
        <Text
          style={styles.button}>
          record
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stopRecording}>
        <Text
          style={styles.button}>
          stop
        </Text>
      </TouchableOpacity>
      </View>
      <View style={styles.diaryStyle}>
        {/* <DiaryAndAI isRecording={isRecording}/> */}
      </View>
    </View>
  );
};

export default Vision;

const styles = StyleSheet.create({
  container: {
    // backgroundColor:'red',
    alignItems: 'center',
  },
  cameraContainer: {
    height: height-42,
    backgroundColor: 'green',
    width: width,
    // borderRadius: 150,
    alignContent: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },
  camera: {
    width: width,
    height: height,
    borderColor: 'black',
    borderWidth: 20,
  },
  video: {
    width: 'auto',
    height: '100%',
  },
  buttonContainer:{
    flexDirection:'row',
    position:'absolute',
    bottom: 120
  },
  button:{
    backgroundColor:"rgba(111,145,103,0.8)",
    fontFamily:"Poppins-Regular",
    width: 90,
    textAlign:'center',
    justifyContent:'center',
    margin: 5,
    fontSize: 17,
    padding: 5,
    borderRadius: 10,
  },
  diaryStyle:{
    position:"absolute"
  }
});
