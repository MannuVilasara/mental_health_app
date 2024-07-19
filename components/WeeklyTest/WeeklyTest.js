import React, { useState, useRef, useContext } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { question } from './question';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import Bottom from '../Bottom';
import url from '../../context/url';
import { AuthContext } from '../../context/authContext';

const { width, height } = Dimensions.get('window');

const WeeklyTest = () => {

    //global
    const [state] = useContext(AuthContext)
    const {token} = state
    const {user} = state
    const [selectedOptions, setSelectedOptions] = useState(Array(question.length).fill(null));
    // const [result, setResult] = useState();
    const [level, setLevel] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0); 
    const scrollViewRef = useRef(null);
    const [answers, setAnswers] = useState([])

    const date = new Date()

    const handleOptionSelect = (questionIndex, optionIndex) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[questionIndex] = optionIndex;
        setSelectedOptions(newSelectedOptions);
    };

    const sendData=async()=>{
        const data = {score: result, answers}
        await fetch(`${url}/api/v1/weeklyTest/send`,{
            method: "POST",
            headers:{
                Accept: 'application/json',
                    'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            else{
                updateDate()
            }
            return response.json();
        })
    }
    const updateDate=async()=>{
        data = {lastTestDate: date}
        await fetch(`${url}/api/v1/auth/update/${user._id}`,{
            method: "PUT",
            headers:{
                Accept: 'application/json',
                    'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })
    }
    const getUserDetails=async()=>{
        await fetch(`${url}/`)
    }

    let result = 0;
    let newArr = [];
    const calculateScore = () => {
        for (let i = 0; i < 21; i++) {
            if (selectedOptions[i] != null) {
                newArr.push(selectedOptions[i]);
            }
        }
        if (newArr.length === 21) {
            setAnswers(newArr)
            for (let i = 0; i < 21; i++) {
                result += newArr[i];
            }
            // setResult(result);
            if (result >= 0 && result <= 10) {
                setLevel('These Ups and downs considered normal');
            } else if (result >= 11 && result <= 16) {
                setLevel('Mild mood disturbance');
            } else if (result >= 17 && result <= 20) {
                setLevel('Borderline clinical depression');
            } else if (result >= 21 && result <= 30) {
                setLevel('Moderate depression');
            } else if (result >= 31 && result <= 40) {
                setLevel('Severe depression');
            } else if (result > 40) {
                setLevel('Extreme depression');
            }
            sendData()
        } else {
            Alert.alert('Attempt all questions');
        }
    };

    const goToNextQuestion = () => {
        if (currentSlide < question.length - 1) {
            scrollViewRef.current.scrollTo({ x: width * (currentSlide + 1), animated: true });
            setCurrentSlide(currentSlide + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentSlide > 0) {
            scrollViewRef.current.scrollTo({ x: width * (currentSlide - 1), animated: true });
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <GestureScrollView>
            <View style={styles.container}>
                <View style={{marginHorizontal:15}}>
                <Text style={[styles.color_black, { fontSize: 17, fontWeight: '600', width: '50%', fontFamily:'Poppins-SemiBold' }]}>Weekly Test</Text>
                <Text style={[styles.color_black, { fontSize: 15, fontWeight: '400', width: '50%', marginHorizontal:10 }]}>Test is Live</Text>
                </View>
                <ScrollView 
                    horizontal 
                    pagingEnabled 
                    scrollEnabled={true} 
                    ref={scrollViewRef}
                    onScroll={(event) => {
                        const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                        setCurrentSlide(slideIndex);
                    }}
                    showsHorizontalScrollIndicator={false}
                >
                    {question.map((item, questionIndex) => {
                        return (
                            <View style={styles.questionBox} key={questionIndex}>
                                <View style={styles.question} key={questionIndex}>
                                <TouchableOpacity onPress={() => handleOptionSelect(questionIndex, 0)}>
                                        <View style={{ flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                                            <View style={styles.selectContainer}>
                                                <View style={[styles.option, selectedOptions[questionIndex] === 0 && styles.selectedOption]} />
                                            </View>
                                            <Text style={styles.optionText}>{item.o1}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleOptionSelect(questionIndex, 1)}>
                                        <View style={{ flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                                            <View style={[styles.option, selectedOptions[questionIndex] === 1 && styles.selectedOption]} />
                                            <Text style={styles.optionText}>{item.o2}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleOptionSelect(questionIndex, 2)}>
                                        <View style={{ flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                                            <View style={[styles.option, selectedOptions[questionIndex] === 2 && styles.selectedOption]} />
                                            <Text style={styles.optionText}>{item.o3}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleOptionSelect(questionIndex, 3)}>
                                        <View style={{ flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                                            <View style={[styles.option, selectedOptions[questionIndex] === 3 && styles.selectedOption]} />
                                            <Text style={styles.optionText}>{item.o4}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </ScrollView>
                <Text style={[styles.color_black, { fontSize: 17, textAlign:'center' }]}>{currentSlide + 1} / {question.length}</Text>
                {/* <Text style={[styles.color_black, { fontSize: 17, textAlign:'center' }]}>slide...</Text> */}

                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
                    <TouchableOpacity onPress={goToPreviousQuestion}>
                        <View style={styles.button}><Text style={{ fontSize: 16 }}>Previous</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={goToNextQuestion}>
                        <View style={styles.button}><Text style={{ fontSize: 16 }}>Next</Text></View>
                    </TouchableOpacity>
                </View> */}
                <View style={{alignItems:'center', margin: 8}}>
                <TouchableOpacity onPress={calculateScore}>
                    <View style={styles.button}><Text style={{ fontSize: 16 }}>Submit</Text></View>
                </TouchableOpacity>
                </View>
                <View style={{marginHorizontal: 15}}>
                {/* <Text style={[styles.color_black, { fontSize: 16, color: '#444444' }]}>Your Score: <Text style={{ fontWeight: '600' }}>{result}</Text></Text> */}
                <Text style={[styles.color_black, { fontSize: 16, color: '#444444' }]}>Your level: <Text style={{ fontWeight: '600' }}>{level}</Text></Text>
                <Text style={[styles.color_black, { fontSize: 16, color: '#444444' }]}>{"{Score is avalable in weekly reports section.}"}</Text>
                </View>
            </View>
            <Bottom />
        </GestureScrollView>
    );
};

export default WeeklyTest;

const styles = StyleSheet.create({
    white_text: {
        color: 'white'
    },
    color_black: {
        color: '#444444',
        fontFamily:'Poppins-Regular'
    },
    heading: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '400'
    },
    container: {
        marginTop: 15,
    },
    question: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
        justifyContent:'space-around',
        width: '95%',
        height: '95%',
    },
    questionBox: {
        width: width,
        // backgroundColor:'orange',
        paddingHorizontal: 10,
        // margin: 2,
        height: 280,
        alignItems:'center'
    },
    questionText: {
        color: 'black',
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    option: {
        height: 20,
        width: 20,
        borderColor: '#333333',
        borderRadius: 150,
        borderWidth: 1,
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#444444',
        // backgroundColor: 'yellow',
        width: '90%',
        fontFamily:'Poppins-Regular'
    },
    selectedOption: {
        backgroundColor: 'rgba(111,145,103,0.9)',
        borderColor: 'rgba(111,145,103,0.9)'
    },
    selectContainer: {
        // backgroundColor:'orange',
        width: '10%'
    },
    button: {
        backgroundColor: 'rgba(111,145,103,0.9)',
        paddingHorizontal: 50,
        paddingVertical: 7,
        alignItems: 'center',
        borderRadius: 17,
    },
});
