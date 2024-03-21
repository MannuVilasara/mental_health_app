import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/authContext'
import url from '../../../context/url'
import FinalResult from './FinalResult'

const BecksTestResult = () => {

    //global
    const [state] = useContext(AuthContext)
    const {token} = state

    const [becksTestData, setBecksTestData] = useState([])

    const getData = async () => {
        try {
          let result = await fetch(`${url}/api/v1/weeklyTest/get`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          result = await result.json();
          console.log(result);
          if (result && result.test && result.test.length > 0) {
            // Sort the test data by createdAt date in descending order
            result.test.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Get the latest test data
            const latestTestData = result.test[0];
      
            // Set the latest test data in state
            setBecksTestData([latestTestData]);

          } else {
            setBecksTestData([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setBecksTestData([]);
        }
      };
      
      useEffect(() => {
        getData();
      }, []);

      useEffect(() => {
        getData();
      }, []);

  return (
    <View style={{margin:10, marginBottom: 20}}>
      <Text
          style={[
            styles.color_black,
            {fontSize: 17, fontWeight: 600,},
          ]}>
          Becks Test Score:<Text style={[
            styles.color_black,
            {fontSize: 14, fontWeight: 400, marginHorizontal: 5},
          ]}>(Less is better)</Text>
        </Text>
        <View>
            {becksTestData?.map((item, id)=>{
                return(
                    <Text
                    style={[
                      styles.color_black,
                      {fontSize: 17, fontWeight: 400, marginHorizontal:5},
                    ]}>
                     {item.score}
                  </Text>
                )
            })}
        </View>
    </View>
  )
}

export default BecksTestResult

const styles = StyleSheet.create({
    color_black: {
        color: '#444444',
      },
})