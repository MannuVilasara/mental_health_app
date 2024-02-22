import React, { useState, useRef } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { question } from './question';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';
import Bottom from '../Bottom';

const { width, height } = Dimensions.get('window');

const WeeklyTest = () => {
    const [selectedOptions, setSelectedOptions] = useState(Array(question.length).fill(null));
    const [result, setResult] = useState();
    const [level, setLevel] = useState('');
    const scrollViewRef = useRef(null);

    const handleOptionSelect = (questionIndex, optionIndex) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[questionIndex] = optionIndex;
        setSelectedOptions(newSelectedOptions);
    };

    const calculateScore = () => {
        let result = 0;
        let newArr = [];
        for (let i = 0; i < 21; i++) {
            if (selectedOptions[i] != null) {
                newArr.push(selectedOptions[i]);
            }
        }
        if (newArr.length === 21) {
            for (let i = 0; i < 21; i++) {
                result += newArr[i];
            }
            setResult(result);
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
        } else {
            Alert.alert('All fields are compulsory');
        }
    };

    const scrollToNextPage = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: width-3, animated: true });
        }
    };

    return (
        <GestureScrollView>
            <View style={styles.container}>
                <Text style={[styles.color_black, { fontSize: 17, fontWeight: '600', width: '50%' }]}>Weekly Test</Text>
                <ScrollView horizontal pagingEnabled scrollEnabled={true} ref={scrollViewRef}>
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
                <TouchableOpacity onPress={scrollToNextPage}>
                    <View style={styles.button}><Text style={{ fontSize: 16 }}>Next</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={calculateScore}>
                    <View style={styles.button}><Text style={{ fontSize: 16 }}>Submit</Text></View>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, color: 'black' }}>Your Score: <Text style={{ fontWeight: '600' }}>{result}</Text></Text>
                <Text style={{ fontSize: 16, color: 'black' }}>Your level: <Text style={{ fontWeight: '600' }}>{level}</Text></Text>
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
        color: 'black'
    },
    heading: {
        color: 'black',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '400'
    },
    container: {
        // margin: 10,
    },
    question: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
        justifyContent: 'center',
        width: 300,
        height: '95%'
    },
    questionBox: {
        width: width - 34,
        // backgroundColor:'orange',
        padding: 10,
        margin: 2,
        height: 300
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
        color: '#333333',
        // backgroundColor: 'yellow',
        width: '90%'
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
        margin: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignItems: 'center',
        width: 80,
        borderRadius: 11
    },
});
