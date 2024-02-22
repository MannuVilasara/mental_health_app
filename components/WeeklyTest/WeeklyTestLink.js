import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import WeeklyTest from './WeeklyTest'


const WeeklyTestLink = () => {

  return (
    <View>
      <Text style={[styles.color_black,{fontSize: 17, fontWeight: 600, width: '50%'},]}>
                   Weekly Test
              </Text>

            <TouchableOpacity onPress={weeklyTestScreen}>
                <View style={styles.container}>
                    <Text style={{textAlign:'center', color:'white'}}>Your Weekly Test is Live</Text>
                </View>
            </TouchableOpacity>
    </View>
  )
}

export default WeeklyTestLink

const styles = StyleSheet.create({
    color_black:{
        color:'black'
    },
    container:{
        alignContent:'center',
        backgroundColor: 'rgba(111,145,103,0.9)',
        margin: 10,
        padding: 10,
        borderRadius: 20
    }
})