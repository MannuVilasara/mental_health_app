import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Vision from './diaryAiCpmponents/Vision'

const DailyDiary = () => {
  return (
    <ScrollView>
        <Text style={styles.headingText}>Diary and AI</Text>
        <Vision/>
    </ScrollView>
  )
}

export default DailyDiary

const styles = StyleSheet.create({
    headingText: {
        fontSize: 20,
        // margin: 5,
        marginBottom: 1,
        // backgroundColor: '#6dc985',
        padding: 5,
        //   textAlign: 'center',
        color: 'black',
        fontWeight: '600',
        fontFamily:'Poppins-SemiBold'
      },
})