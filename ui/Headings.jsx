import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

const Heading = ({ title, onPress, buttonTitle }) => {
    return <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onPress} >
            <Text style={[styles.resetText]}>
                {buttonTitle}
            </Text>
        </TouchableOpacity>
    </View>
};

export default Heading;

const styles = StyleSheet.create({
    // Header Styles
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333333',
        fontFamily: 'Poppins-Bold',
    },
    resetText: {
        fontSize: 15,
        color: '#035553',
        fontFamily: 'Poppins-Medium',
        opacity: 0.9,
    },
    disabledText: {
        color: '#999999',
        opacity: 0.6,
    },
});
