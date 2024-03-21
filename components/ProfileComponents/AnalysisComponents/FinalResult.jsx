import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import url from '../../../context/url'
import { AuthContext } from '../../../context/authContext'

const FinalResult = () => {
    //global
    const [state] = useContext(AuthContext)
    const {token} = state

    //becks Test
    const [becksTest, setBecksTestData] = useState([])
    const beckTestScore = becksTest?.map((item)=>item.score)[0]/8

    //feeling score
    const [feelingNumbers, setFeelingNumbers] = useState([]);


    console.log(beckTestScore)

    const getBecksData = async () => {
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

      const getFeelingScore = async () => {
        try {
            let result = await fetch(`${url}/api/v1/feel/get`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            result = await result.json();
            console.log(result);
            if (result && result.feel && result.feel.length > 0) {
                // Extract feelNumber values
                const feelNumbers = result.feel.map(feelObj => feelObj.feelNumber);
                setFeelingNumbers(feelNumbers); // Set the array of feelNumbers in state
                console.log(feelNumbers);
            } else {
                setFeelingNumbers([]); // Reset to an empty array if no data is available
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setFeelingNumbers([]); // Reset to an empty array in case of an error
        }
    };

    let addition = 0
    let sad = 0
    for(let i=0; i<feelingNumbers.length; i++){
        addition += feelingNumbers[i]
        if(feelingNumbers[i]==1){
            sad += 1
        }
    }
    let feelingS = (sad/addition)*5
    const totalScore = 10-(beckTestScore+feelingS)

      
    console.log(`Addition ${addition} Sad: ${sad}`)
      console.log(`=${feelingNumbers}`)
      
      
      useEffect(() => {
        getBecksData();
        getFeelingScore()
      }, []);


  return (
    <View style={{margin:10}}>
       <Text
          style={[
            styles.color_black,
            {fontSize: 17, fontWeight: 600, textAlign:'center', fontFamily:"Poppins-SemiBold"},
          ]}>
          Final Score: {totalScore.toFixed(2)}
        </Text>
    </View>
  )
}

export default FinalResult

const styles = StyleSheet.create({
    color_black: {
        color: '#444444',
      },
})