import {Alert, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import Bottom from '../Bottom';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native';
import {AuthContext} from '../../context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile({navigation}) {

  const [state, setState] = useContext(AuthContext);
const {user} = state
  const handleLogout = async() => {
    setState({token: "", user: ""});
    await AsyncStorage.removeItem("@auth");
    Alert.alert("Logout successfull")
    console.log(state)
  };

  return (
    <ScrollView>
      {/* <Text style={styles.color_black}>Profile</Text> */}
      <View style={styles.profileBox}>
        <View>
          <View style={styles.imageView}>
            <Image
              source={require('../../img/logo1.jpg')}
              style={styles.image}
            />
          </View>
          <Text
            style={[
              styles.color_white,
              {fontSize: 18, textAlign: 'center', fontWeight: '600'},
            ]}>
            {user.name}
          </Text>
          <Text
            style={[styles.color_white, {fontSize: 16, textAlign: 'center'}]}>
            {user.role}
          </Text>
        </View>
      </View>

      <View style={styles.boxContainer}>
        <TouchableOpacity
          style={styles.nextContainer}
          onPress={() => {
            navigation.navigate('Profile');
          }}>
          <View style={{flexDirection: 'row', width: '50%'}}>
            <Icon
              name="user"
              color={'black'}
              size={17}
              style={styles.frontIconStyle}
            />
            <Text style={[styles.color_black, styles.textStyle1]}>Profile</Text>
          </View>
          <Icon
            name="arrow-right"
            size={17}
            color={'black'}
            style={styles.iconStyle}
          />
        </TouchableOpacity>

          {user.role=="doctor"?<></>:<TouchableOpacity
          style={styles.nextContainer}
          onPress={() => navigation.navigate('Weekly Reports')}>
          <View style={{flexDirection: 'row', width: '50%'}}>
            <Icon1
              name="analytics"
              color={'black'}
              size={17}
              style={styles.frontIconStyle}
            />
            <Text style={[styles.color_black, styles.textStyle1]}>
              Weekly Reports
            </Text>
          </View>
          <Icon
            name="arrow-right"
            size={17}
            color={'black'}
            style={styles.iconStyle}
          />
        </TouchableOpacity>}
        

        <View style={styles.nextContainer}>
          <View style={{flexDirection: 'row', width: '50%'}}>
            <Icon
              name="circle-info"
              color={'black'}
              size={17}
              style={styles.frontIconStyle}
            />
            <Text style={[styles.color_black, styles.textStyle1]}>About</Text>
          </View>
          <Icon
            name="arrow-right"
            size={17}
            color={'black'}
            style={styles.iconStyle}
          />
        </View>

        <TouchableOpacity
          style={styles.nextContainer}
          onPress={handleLogout}>
          <View style={{flexDirection: 'row', width: '50%'}}>
            <Icon2
              name="logout"
              color={'black'}
              size={17}
              style={styles.frontIconStyle}
            />
            <Text style={[styles.color_black, styles.textStyle1]}>Log Out</Text>
          </View>
          <Icon
            name="arrow-right"
            size={17}
            color={'black'}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
      <Bottom />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  color_black: {
    color: 'black',
  },
  color_white: {
    color: 'white',
  },
  profileBox: {
    backgroundColor: 'rgba(111,145,103,0.8)',
    // height: '70%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  imageView: {
    // backgroundColor:'green',
    alignItems: 'center',
    justifyContent: 'center',
    // width: '20%',
    margin: 15,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 2,
  },
  boxContainer: {
    margin: 10,
  },
  nextContainer: {
    flexDirection: 'row',
    margin: 3,
    backgroundColor: 'white',
    padding: 17,
    alignItems: 'center',
    borderRadius: 20,
  },
  textStyle1: {
    fontSize: 17,
    fontWeight: '600',
  },
  iconStyle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
    // backgroundColor:'red',
    width: '50%',
    paddingHorizontal: 5,
  },
  frontIconStyle: {
    marginRight: 10,
    verticalAlign: 'middle',
    width: 20,
  },
});
