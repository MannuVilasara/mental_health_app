import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6';

const DiaryAndAI = () => {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 9, marginBottom:5 }}>
        <Icon name={'arrow-right'} color={'black'} size={13} />
        <Text style={styles.headingText}>Diary and AI</Text>
      </View>
    </View>
  )
}

export default DiaryAndAI

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
  },
})