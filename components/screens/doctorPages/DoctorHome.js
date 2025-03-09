import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { AuthContext } from '../../../context/authContext';
import url from '../../../context/url';
import MoodAnalysisDoctor from './MoodAnalysisDoctor';
import Bottom from '../../Bottom';
import LinearGradient from 'react-native-linear-gradient';

const DoctorHome = () => {
  const [state] = useContext(AuthContext);
  const { user } = state;
  const [userDetails, setUserDetails] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [weeklyTestReports, setWeeklyTestReports] = useState([]);

  // ... (Keep your existing fetch functions unchanged)

  const getUserDetails = async () => {
    try {
      let details = await fetch(`${url}/api/v1/auth/doctor/getDetails/${user._id}`, {
        method: "GET"
      });
      details = await details.json();
      console.log(`details: ${JSON.stringify(details, null, 2)}`);
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

  useEffect(() => {
    getUserDetails();
  }, [state]);

  useEffect(() => {
    if (selectedUserId) {
      getUserTestReports();
    }
  }, [selectedUserId]);

  const renderPatientItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedUser(index);
        setSelectedUserId(item._id);
      }}
      style={[
        styles.patientItem,
        selectedUser === index && styles.selectedPatientItem
      ]}
    >
      <Text style={styles.patientId}>{item._id.substring(0, 8)}...</Text>
      <Text style={styles.patientName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTestReportItem = ({ item }) => (
    <View style={styles.reportItem}>
      <Text style={styles.reportDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.reportScore}>{item.score}</Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#f0f4f8', '#ffffff']}
      style={styles.gradientContainer}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Doctor's Dashboard</Text>
          <Text style={styles.subtitle}>Welcome, Dr. {user.name}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Select Patient</Text>
          {
            userDetails.length > 0 &&
            userDetails.map((item, index) => (
              <View key={index} style={styles.listHeader}>
                <Text style={styles.headerText}>Date</Text>
                <Text style={styles.headerText}>Score</Text>
              </View>))
          }
          <FlatList
            data={userDetails}
            renderItem={renderPatientItem}
            keyExtractor={(item) => item._id}
            style={styles.patientList}
            scrollEnabled
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.headerText}>ID</Text>
                <Text style={styles.headerText}>Name</Text>
              </View>
            }
          />
        </View>

        {selectedUserId && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Beck's Test Results</Text>
            <FlatList
              data={weeklyTestReports}
              renderItem={renderTestReportItem}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={
                <View style={styles.listHeader}>
                  <Text style={styles.headerText}>Date</Text>
                  <Text style={styles.headerText}>Score</Text>
                </View>
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>No test reports available</Text>
              }
            />
          </View>
        )}

        <MoodAnalysisDoctor userID={selectedUserId} />
      </ScrollView>
      <Bottom />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#2c3e50',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#7f8c8d',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#34495e',
    marginBottom: 12,
  },
  patientList: {
    maxHeight: 200,
  },
  listHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#3498db',
    borderRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
  patientItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    alignItems: 'center',
  },
  selectedPatientItem: {
    backgroundColor: '#e8f4f8',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  patientId: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2c3e50',
  },
  patientName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2c3e50',
    textAlign: 'center',
  },
  reportItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  reportDate: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2c3e50',
    textAlign: 'center',
  },
  reportScore: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#2c3e50',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#7f8c8d',
    textAlign: 'center',
    padding: 20,
  },
});

export default DoctorHome;