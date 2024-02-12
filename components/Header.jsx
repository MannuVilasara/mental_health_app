import { Image, SafeAreaView, StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'

export default function Header() {
  return (
    <SafeAreaView style={styles.containerHeader}>
        <StatusBar
        // backgroundColor={'#6dc985'}
        />
        <View style={styles.textView}>
            <Text style={[styles.fontColor, styles.heading]}>Week Planner</Text>
            {/* <Text style={styles.fontColor}>How are you feeling today?</Text> */}
        </View>
        {/* <View style={styles.imageView}>
            <Image
            source={require('../img/logo1.jpg')}
            style={styles.image}
            />
        </View> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    containerHeader:{
        padding: 17,
        // backgroundColor: '#6dc985',
        backgroundColor: 'rgba(111,145,103,0.9)',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10
        // height:80
    },
    fontColor:{
        color: 'white'
    },
    heading:{
        fontSize: 20
    },
    textView:{
        // backgroundColor: 'red',
        justifyContent:'center',
        width: '80%'
    },
    imageView:{
        // backgroundColor:'green',
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '20%'
    },
    image:{
        height:50,
        width:50,
        borderRadius: 50,
        borderColor:'white',
        borderWidth: 2
    }
})