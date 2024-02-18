import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {ActivityIndicator} from 'react-native-paper';
import { WebSocket } from 'react-native';

const Vision = () => {
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();

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
  return (
    <View style={styles.container}>    
    <View style={styles.cameraContainer}>
      {/* <Text style={{color: 'black'}}>Vision</Text> */}
      <Camera style={styles.camera} device={device} isActive={true} />
    </View>
    </View>
  );
};

export default Vision;

const styles = StyleSheet.create({
    container:{
        // backgroundColor:'red',
        alignItems:'center'
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
});
