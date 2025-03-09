import React, { useState, useRef, useContext } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import { question } from './question';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import Bottom from '../Bottom';
import url from '../../context/url';
import { AuthContext } from '../../context/authContext';
import { Colors } from '../../ui/Colors';
import Heading from '../../ui/Headings';

const { width, height } = Dimensions.get('window');

const WeeklyTest = () => {
    const [state] = useContext(AuthContext);
    const { token, user } = state;
    const [selectedOptions, setSelectedOptions] = useState(
        Array(question.length).fill(null)
    );
    const [level, setLevel] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const scrollViewRef = useRef(null);
    const [answers, setAnswers] = useState([]);

    const date = new Date();

    const handleOptionSelect = (questionIndex, optionIndex) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[questionIndex] = optionIndex;
        setSelectedOptions(newSelectedOptions);
    };

    const sendData = async () => {
        const data = { score: result, answers };
        await fetch(`${url}/api/v1/weeklyTest/send`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } else {
                updateDate();
            }
            return response.json();
        });
    };

    const updateDate = async () => {
        const data = { lastTestDate: date };
        await fetch(`${url}/api/v1/auth/update/${user._id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
    };

    let result = 0;
    let newArr = [];
    const calculateScore = () => {
        for (let i = 0; i < 21; i++) {
            if (selectedOptions[i] != null) {
                newArr.push(selectedOptions[i]);
            }
        }
        if (newArr.length === 21) {
            setAnswers(newArr);
            for (let i = 0; i < 21; i++) {
                result += newArr[i];
            }
            if (result >= 0 && result <= 10) {
                setLevel('These ups and downs are considered normal');
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
            sendData();
        } else {
            Alert.alert('Attempt all questions');
        }
    };

    const goToNextQuestion = () => {
        if (currentSlide < question.length - 1) {
            scrollViewRef.current.scrollTo({
                x: width * (currentSlide + 1),
                animated: true,
            });
            setCurrentSlide(currentSlide + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentSlide > 0) {
            scrollViewRef.current.scrollTo({
                x: width * (currentSlide - 1),
                animated: true,
            });
            setCurrentSlide(currentSlide - 1);
        }
    };

    return (
        <GestureScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                {/* <View style={styles.header}>
                    <Text style={styles.headerTitle}>Weekly Test</Text>
                    <Text style={styles.headerSubtitle}>Test is Live</Text>
                </View> */}
                <Text style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: '#333333',
                    marginLeft: 20,
                    marginBottom: 15,
                    fontFamily: 'Poppins-Bold',
                }}>Initial Test</Text>

                {/* <Text style={{
                    width: '80%',
                    fontSize: 16,
                    fontWeight: '400',
                    color: '#333333',
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                    marginBottom: 15,
                    alignSelf: 'center',
                }}>Complete this test to assess your mood level</Text> */}

                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Question {currentSlide + 1} of {question.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${((currentSlide + 1) / question.length) * 100}%` },
                            ]}
                        />
                    </View>
                </View>


                <ScrollView
                    horizontal
                    pagingEnabled
                    scrollEnabled={true}
                    ref={scrollViewRef}
                    onScroll={(event) => {
                        const slideIndex = Math.round(
                            event.nativeEvent.contentOffset.x / width
                        );
                        setCurrentSlide(slideIndex);
                    }}
                    showsHorizontalScrollIndicator={false}
                >
                    {question.map((item, questionIndex) => (
                        <View style={styles.questionBox} key={questionIndex}>
                            <View style={styles.question}>
                                <TouchableOpacity
                                    onPress={() => handleOptionSelect(questionIndex, 0)}
                                >
                                    <View style={styles.optionContainer}>
                                        <View
                                            style={[
                                                styles.option,
                                                selectedOptions[questionIndex] === 0 &&
                                                styles.selectedOption,
                                            ]}
                                        />
                                        <Text style={styles.optionText}>{item.o1}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleOptionSelect(questionIndex, 1)}
                                >
                                    <View style={styles.optionContainer}>
                                        <View
                                            style={[
                                                styles.option,
                                                selectedOptions[questionIndex] === 1 &&
                                                styles.selectedOption,
                                            ]}
                                        />
                                        <Text style={styles.optionText}>{item.o2}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleOptionSelect(questionIndex, 2)}
                                >
                                    <View style={styles.optionContainer}>
                                        <View
                                            style={[
                                                styles.option,
                                                selectedOptions[questionIndex] === 2 &&
                                                styles.selectedOption,
                                            ]}
                                        />
                                        <Text style={styles.optionText}>{item.o3}</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleOptionSelect(questionIndex, 3)}
                                >
                                    <View style={styles.optionContainer}>
                                        <View
                                            style={[
                                                styles.option,
                                                selectedOptions[questionIndex] === 3 &&
                                                styles.selectedOption,
                                            ]}
                                        />
                                        <Text style={styles.optionText}>{item.o4}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Progress Bar */}

                {/* Navigation Buttons */}
                <View style={styles.navigation}>
                    <TouchableOpacity
                        onPress={goToPreviousQuestion}
                        style={[styles.button, currentSlide === 0 && styles.disabledButton]}
                        disabled={currentSlide === 0}
                    >
                        <Text style={styles.buttonText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={
                            currentSlide === question.length - 1
                                ? calculateScore
                                : goToNextQuestion
                        }
                        style={[
                            styles.button,
                            currentSlide === question.length - 1 &&
                            selectedOptions.every((opt) => opt !== null) &&
                            styles.submitButton,
                        ]}
                    >
                        <Text style={styles.buttonText}>
                            {currentSlide === question.length - 1 ? 'Submit' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Redesigned Results View */}
                {level &&
                    <View style={styles.resultCard}>
                        <Text style={styles.resultTitle}>Your Mood Level</Text>
                        <Text style={styles.resultLevel}>{level}</Text>
                        <Text style={styles.resultInfo}>Score available in Weekly Reports</Text>
                    </View>
                }
            </View>
            <Bottom />
        </GestureScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: Colors.background.primary, // Light background for modern feel
    },
    container: {
        // marginTop: 20,
        paddingBottom: 20,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        color: '#2c3e50',
    },
    headerSubtitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#7f8c8d',
    },
    questionBox: {
        width: width,
        paddingHorizontal: 15,
        height: 370, // Slightly increased height
        alignItems: 'center',
    },
    question: {
        padding: 15,
        backgroundColor: Colors.background.tertiary,
        borderRadius: 12,
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Modern shadow effect
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    option: {
        height: 22,
        width: 22,
        borderColor: '#34495e',
        borderRadius: 11,
        borderWidth: 2,
        marginRight: 12,
    },
    selectedOption: {
        backgroundColor: '#3498db', // Modern blue instead of green
        borderColor: '#3498db',
    },
    optionText: {
        fontSize: 15,
        color: '#2c3e50',
        fontFamily: 'Poppins-Regular',
        flex: 1,
    },
    progressContainer: {
        alignItems: 'center',
        // marginVertical: 15,
        marginBottom: 15,
    },
    progressText: {
        fontSize: 14,
        color: '#7f8c8d',
        fontFamily: 'Poppins-Regular',
    },
    progressBar: {
        width: '85%',
        height: 6,
        backgroundColor: Colors.background.tertiary,
        borderRadius: 3,
        marginTop: 8,
    },
    progressFill: {
        height: 6,
        backgroundColor: Colors.background.accent,
        borderRadius: 3,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.background.accent,
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#ffffff',
        fontFamily: 'Poppins-Medium',
    },
    disabledButton: {
        backgroundColor: '#bdc3c7',
    },
    submitButton: {
        backgroundColor: '#2980b9', // Darker shade for submit
    },
    resultCard: {
        marginHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#2c3e50',
        marginBottom: 5,
    },
    resultLevel: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#3498db',
        textAlign: 'center',
        marginVertical: 5,
    },
    resultInfo: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#7f8c8d',
        fontStyle: 'italic',
    },
    guideText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#7f8c8d',
        textAlign: 'center',
        marginVertical: 10,
    },
    guideButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 10,
    },
    guideButtonText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#ffffff',
    },
});

export default WeeklyTest;