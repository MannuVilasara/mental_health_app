

import React, {useState,useRef}from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  FlatList,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';




const {width, height} = Dimensions.get('window');



const slides = [
  {
      id: '1',
      image:require('../../../../img/icons/assets/LoginSignup/Frame_6(1).gif'),
    title: 'Welcome',
    subtitle: 'Ready to take steps towards a happier, healthier you?',
},
{
    id: '2',
    image:require('../../../../img/icons/assets/LoginSignup/meditation.png'),
    title: 'Nurture Your Mind',
    subtitle: 'Capture your moods and experiences through the languages of emojis.',
  },
//   {
//     id: '3',
//     image:require('../../../../img/icons/assets/LoginSignup/loginImg2.png'),
//     title: 'Increase Your Value',
//     subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//   },
];

const Slide = ({item}) => {
  return (
    <View style={{alignItems: 'center',justifyContent:"space-evenly"}}>
      <FastImage
        source={item?.image}
        style={{height: '67%', width, resizeMode: 'contain'}}
        

      />
      <View >
        <Text style={styles.title}>{item?.title}</Text>
        <Text style={styles.subtitle}>{item?.subtitle}</Text>
      </View>
    </View>
  );
};

const WelcomeScreen = ({navigation}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
  const ref = React.useRef();
  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current.scrollToOffset({offset});
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref?.current.scrollToOffset({offset});
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Footer = () => {
    return (
      <View
        style={{
            // backgroundColor:'red',
          height: height * 0.25,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingBottom:20

        }}>
        {/* Indicator container */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: '#fff',
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{marginBottom: 20}}>
          {currentSlideIndex == slides.length - 1 ? (
           <View style={{flexDirection: 'row'}}>
           <TouchableOpacity
             activeOpacity={0.8}
             style={[
               styles.btn,
               {
                 borderColor: '#fff',
                 borderWidth: 1,
                 backgroundColor: 'transparent',
               },
             ]}
             onPress={() => {
              navigation.navigate('Login');
            }}>
             <Text
               style={{
                 fontWeight: 'bold',
                 fontSize: 15,
                 color: '#fff',
               }}>
               Login
             </Text>
           </TouchableOpacity>
           <View style={{width: 15}} />
           <TouchableOpacity
             activeOpacity={0.8}
             onPress={() => {
              navigation.navigate('SignUp');
            }}
             style={styles.btn}>
             <Text
               style={{
                 fontWeight: 'bold',
                 fontSize: 15,
                 color:'#458194'
               }}>
               Sign-up
             </Text>
           </TouchableOpacity>
         </View>
          ) : (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: '#fff',
                    borderWidth: 1,
                    backgroundColor: 'transparent',
                  },
                ]}
                onPress={skip}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: '#fff',
                  }}>
                  SKIP
                </Text>
              </TouchableOpacity>
              <View style={{width: 15}} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color:'#458194'
                  }}>
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#b1f1f2','rgba(3,85,83,0.9)']} style={{flex:1}}
    start={{x:1,y:0.2}}
    end={{x:1,y:0.9}}>
        <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={'#282534'} />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        contentContainerStyle={{height: height * 0.75}}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={({item}) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
     </LinearGradient>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    flexWrap:'wrap',
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    marginBottom:25,
    maxWidth: '70%',
    textAlign: 'center',
    lineHeight: 23,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: 'grey',
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default WelcomeScreen;