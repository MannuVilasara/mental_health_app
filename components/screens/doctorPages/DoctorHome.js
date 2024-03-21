import React, { useState, useEffect, useCallback, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../../context/authContext';
import url from '../../../context/url';
import SleepAnalysis from '../../ProfileComponents/AnalysisComponents/SleepAnalysis';
import Bottom from '../../Bottom';
import MoodAnalysis from '../../ProfileComponents/AnalysisComponents/MoodAnalysis';
import MoodAnalysisDoctor from './MoodAnalysisDoctor';

const DoctorHome = () => {
  const [state] = useContext(AuthContext)
  const {user} = state
  const [userDetails, setUserDetails] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [selectedUserId, setSelectedUserId] = useState();
  const [weeklyTestReports, setWeeklyTestReports] = useState([]);

  const getUserDetails = async () => {
    try {
      let details = await fetch(`${url}/api/v1/auth/doctor/getDetails/${user._id}`, {
        method: "GET"
      });
      details = await details.json();
      setUserDetails(details);
      console.log(`user details: ${JSON.stringify(details)}`);
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }

  const getUserTestReports = async () => {
    try {
      let testReports = await fetch(`${url}/api/v1/auth/doctor/getTestReport/${selectedUserId}`, {
        method: "GET"
      });
      testReports = await testReports.json();
      setWeeklyTestReports(testReports);
      console.log(`test details: ${JSON.stringify(testReports)}`);
    } catch (error) {
      console.log(`error: ${error}`);
    }
  }

  const getUerSleepReport=()=>{
    
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      getUserTestReports();
    }
  }, [selectedUserId]);

  return (
    <ScrollView nestedScrollEnabled={true}>
    <View style={styles.container}>
      <Text style={[styles.color, styles.heading]}>Monitor you patients</Text>
      <Text style={[styles.color, { fontSize: 16, marginHorizontal: 5 }]}>Hi Dr.{user.name}</Text>
      <View style={styles.selectContainer}>
        <Text style={[styles.color, { fontSize: 15, fontFamily: "Poppins-SemiBold" }]}>Select your patient</Text>
        <View style={{ height: 150, backgroundColor: 'rgba(111,145,103,0.2)' }}>
          <View style={{ flexDirection: 'row', padding: 4, backgroundColor: 'rgba(111,145,103,0.8)' }}>
            <Text style={[styles.color, { fontSize: 15, width: '50%', textAlign: 'center', color: 'white' }]}>
              User ID
            </Text>
            <Text style={[styles.color, { fontSize: 15, width: '50%', textAlign: 'center', color: 'white' }]}>
              Name
            </Text>
          </View>
          <ScrollView nestedScrollEnabled={true}>
            {userDetails.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => {
                setSelectedUser(index);
                setSelectedUserId(item._id);
              }}>
                <View style={[{ flexDirection: 'row', padding: 4, margin: 3 }, selectedUser == index ? { backgroundColor: 'rgba(111,145,103,0.5)' } : {}]}>
                  <Text style={[styles.color, { fontSize: 15, width: '50%' }]}>
                    {item._id}
                  </Text>
                  <Text style={[styles.color, { fontSize: 15, width: '50%', textAlign: 'center' }]}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <View>
        <Text style={[styles.color, { fontSize: 15, fontFamily: "Poppins-SemiBold" }]}>Becks Test Results:</Text>
        <View style={{ height: 200, backgroundColor: 'rgba(111,145,103,0.2)' }}>
          <View style={{ flexDirection: 'row', padding: 4, backgroundColor: 'rgba(111,145,103,0.8)' }}>
            <Text style={[styles.color, { fontSize: 15, width: '50%', textAlign: 'center', color: 'white' }]}>
              Date
            </Text>
            <Text style={[styles.color, { fontSize: 15, width: '50%', textAlign: 'center', color: 'white' }]}>
              Score
            </Text>
          </View>
          <ScrollView nestedScrollEnabled={true}>
            {weeklyTestReports.length > 0 && (
              weeklyTestReports.map((item, index) => (
                <View key={index} style={[{ flexDirection: 'row', padding: 4, margin: 3 }]}>
                  <Text style={[styles.color, { fontSize: 15, width: '50%', textAlign:'center' }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={[styles.color, { fontSize: 15, width: '50%', textAlign: 'center' }]}>
                    {item.score}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </View>
    <MoodAnalysisDoctor userID={selectedUserId}/>
    <Bottom/>
    </ScrollView>
  )
}

export default DoctorHome;

const styles = StyleSheet.create({
  color: {
    color: '#444444',
    fontFamily: 'Poppins-Regular',
  },
  heading: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  container: {
    margin: 10
  },
  selectContainer: {
    marginVertical: 20
  }
})
