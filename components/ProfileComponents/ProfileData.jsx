import {StyleSheet, Text, View} from 'react-native';
import React, { useContext } from 'react';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Fontisto';

import { AuthContext } from '../../context/authContext';


const ProfileData = () => {
  //global state
  const [state] = useContext(AuthContext)
  return (
    <View>
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
            {state?.user.name}
          </Text>
          <Text
            style={[styles.color_white, {fontSize: 16, textAlign: 'center'}]}>
            {state?.user.occupation}
          </Text>
        </View>
      </View>

      <View style={styles.detailBox}>
        <View style={styles.itemBox}>
          <View style={{flexDirection: 'row', width:'32%'}}>
            <Icon
              name="user"
              color={'black'}
              size={17}
              style={styles.frontIconStyle}
            />
            <Text style={styles.text}>Name:</Text>
          </View>
          <Text style={styles.text2}>{state?.user.name}</Text>
        </View>

        <View style={styles.itemBox}>
        <View style={{flexDirection: 'row', width:'32%'}}>
          <Icon2
            name="email"
            color={'black'}
            size={17}
            style={styles.frontIconStyle}
          />
          <Text style={styles.text}>Email:</Text>
          </View>
          <Text style={styles.text2}>{state?.user.email}</Text>
        </View>
        
        <View style={styles.itemBox}>
          <View style={{flexDirection: 'row', width:'32%'}}>
          <Icon3
            name={state?.user.gender=="Male"?'male':'female'}
            color={'black'}
            size={17}
            style={styles.frontIconStyle}
          />
          <Text style={styles.text}>Gender</Text>
          </View>
          <Text style={styles.text2}>{state?.user.gender}</Text>
        </View>

        <View style={styles.itemBox}>
          <View style={{flexDirection: 'row', width:'32%'}}>
          <Icon
            name={"hourglass-half"}
            color={'black'}
            size={17}
            style={styles.frontIconStyle}
          />
          <Text style={styles.text}>Age</Text>
          </View>
          <Text style={styles.text2}>{state?.user.age}</Text>
        </View>

        <View style={styles.itemBox}>
          <View style={{flexDirection: 'row', width:'32%'}}>
          <Icon1
            name="call"
            color={'black'}
            size={17}
            style={styles.frontIconStyle}
          />
          <Text style={styles.text}>Mobile no.:</Text>
          </View>
          <Text style={styles.text2}>{state?.user.mobile}</Text>
        </View>

        <View style={styles.itemBox}>
          <View style={{flexDirection: 'row', width:'32%'}}>
          <Icon1
            name="location-sharp"
            color={'black'}
            size={17}
            style={styles.frontIconStyle}
          />
          <Text style={styles.text}>Address:</Text>
          </View>
          <Text style={styles.text2}>{state?.user.address}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileData;

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
  text: {
    color: 'black',
    fontWeight: '600',
    fontSize: 17,
  },
  text2: {
    color: 'black',
    fontWeight: '400',
    fontSize: 17,
    // backgroundColor:'green',
    width:'70%'
  },
  detailBox: {
    margin: 10,
  },
  frontIconStyle: {
    verticalAlign: 'middle',
    width: 20,
  },
  itemBox:{
    flexDirection: 'row',
    marginHorizontal:5,
    marginVertical:15
  }
});
