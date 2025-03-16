import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { AuthContext } from '../../../context/authContext';
import url from '../../../context/url';
import Bottom from '../../Bottom';
import LinearGradient from 'react-native-linear-gradient';
import TopBlock from './Components/TopBlock';
import Heading from '../../../ui/Headings';
import { Colors } from '../../../ui/Colors';

const DoctorHome = ({ navigation }) => {
  const selectPatientImg = require('../../../img/activity/Select-cuate.png');
  const [state] = useContext(AuthContext);
  const { user } = state;
  const [userDetails, setUserDetails] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [textData, setTextData] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  const getUserDetails = async () => {
    try {
      let details = await fetch(`${url}/api/v1/auth/doctor/getDetails/${user._id}`, {
        method: "GET"
      });
      details = await details.json();
      setUserDetails(details);
      setFilteredPatients(details);
    } catch (error) {
      console.log(`error: ${error}`);
    }
  };

  useEffect(() => {
    getUserDetails();
    return () => {
      setUserDetails(null);
      setFilteredPatients(null);
    };
  }, [state]);

  const searchUser = useCallback(() => {
    if (textData.trim() === '') {
      setFilteredPatients(userDetails);
      return;
    }
    const filtered = userDetails.filter(patient =>
      patient.name.toLowerCase().includes(textData.toLowerCase()) ||
      patient._id.toLowerCase().includes(textData.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [textData, userDetails]);

  const handleTextChange = (text) => {
    setTextData(text);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(setTimeout(() => {
      searchUser();
    }, 500));
  };

  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PatientDetails', { patient: item })}
      style={styles.patientItemContainer}
    >
      <Image
        src={`https://avatar.iran.liara.run/username?username=${item.name}`}
        resizeMode='contain'
        style={styles.patientAvatar}
      />
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <Text style={styles.patientId}>...{item?._id.slice(-15)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[Colors.background.secondary, Colors.background.primary]}
      style={styles.gradientContainer}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TopBlock
          user={user}
          textData={textData}
          setTextData={handleTextChange}
          searchUser={searchUser}
        />

        <View style={styles.listContainer}>
          <Image
            source={selectPatientImg}
            style={styles.backgroundImage}
            resizeMode="contain"
          />
          <View style={styles.listContent}>
            <Heading title={"Patient's List"} buttonTitle={'Refresh'} onPress={getUserDetails} />
            <View style={styles.listHeaderContainer}>
              <View style={styles.listHeader}>
                <Text style={styles.headerText}>Patient Information</Text>
              </View>
            </View>
            <FlatList
              data={filteredPatients}
              renderItem={renderPatientItem}
              keyExtractor={(item) => item._id}
              style={styles.patientList}
              scrollEnabled
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No patients found</Text>
              }
            />
          </View>
        </View>
        <View style={styles.spacer} />
      </ScrollView>
      <Bottom />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    height: '100%',
  },
  container: {
    height: '100%',
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: Colors.background.primary,
    elevation: 3,
    position: 'relative',
    minHeight: 600, // Adjust this value based on your needs
  },
  backgroundImage: {
    position: 'absolute',
    marginTop: 100,
    width: '80%',
    height: 400,
    objectFit: 'contain',
    opacity: 0.6,
    alignSelf: 'center'
  },
  listContent: {
    flex: 1,
    padding: 20,
  },
  listHeaderContainer: {
    marginBottom: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.background.accent,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text.light,
    textAlign: 'center',
  },
  patientList: {
    flex: 1,
  },
  patientItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 10,
    borderRadius: 12,
    backgroundColor: Colors.background.tertiary,
  },
  patientAvatar: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 50,
    shadowColor: Colors.text.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patientInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  patientId: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.secondary,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    padding: 20,
  },
  separator: {
    height: 8,
  },
  spacer: {
    height: 80,
  }
});

export default DoctorHome;