import {StyleSheet, Text, View} from 'react-native';
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

const Vision = () => {
  //global
  const [state] = useContext(AuthContext);
  const {user} = state;
  const camera = useRef(null);
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [uri, setUri] = useState();
  let newPath;
  const format = useCameraFormat(device, [
    {videoAspectRatio: 1 / 1},
    {videoResolution: {width: 480, height: 480}},
    {fps: 30},
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
        videoBitRate: "2 Mbps",
        
        onRecordingFinished: video => {
          console.log('Recorded video:', video);
          newPath = video.path;
          setUri(video.path);
        },
        onRecordingError: error => console.log(error),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = async () => {
    try {
      await camera.current.stopRecording();
      send();
    } catch (error) {
      console.log(error);
    }
  };
    const send = () => {
      RNFetchBlob.fetch(
        'POST',
        'http://192.168.72.191:5000/upload',
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
      <TouchableOpacity onPress={recordVideo}>
        <Text
          style={{
            color: 'white',
            backgroundColor: 'green',
            padding: 10,
            borderRadius: 20,
          }}>
          record
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={stopRecording}>
        <Text
          style={{
            color: 'white',
            backgroundColor: 'green',
            padding: 10,
            borderRadius: 20,
          }}>
          stop
        </Text>
      </TouchableOpacity>
      {/* <View style={{width: 300, height: 300, backgroundColor: 'yellow'}}>
        <Video source={{uri}} style={styles.video} />
      </View> */}
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
    height: 300,
    backgroundColor: 'green',
    width: 300,
    // borderRadius: 150,
    alignContent: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  },
  camera: {
    width: 300,
    height: 300,
    borderColor: 'black',
    borderWidth: 20,
  },
  video: {
    width: 'auto',
    height: '100%',
  },
});
