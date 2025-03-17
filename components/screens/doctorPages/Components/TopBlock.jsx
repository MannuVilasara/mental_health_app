import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Alert, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Colors } from '../../../../ui/Colors';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const TopBlock = ({ user, textData, setTextData, searchUser }) => {



    useEffect(() => {
        console.log(textData);

    }, [textData])

    return (
        <View>
            <StatusBar backgroundColor={Colors.background.accent} />
            <View style={styles.moodContainer}>
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Text style={styles.greeting}>
                            Welcome, <Text>Dr. {user.name}</Text>
                        </Text>
                        <Image style={styles.profileImage} source={require('../../../../img/icons/assets/LoginSignup/userProfile.png')} />
                    </View>

                    <View style={{
                        marginTop: 40,
                        flexDirection: 'row',
                        width: '100%'
                    }}>
                        <TextInput
                            placeholder='Search for a patient...'
                            onChangeText={(text) => setTextData(text)}
                            value={textData}
                            style={styles.chatButton}
                            keyboardType="default"
                            autoCapitalize="none"
                            returnKeyType="search"
                            onSubmitEditing={searchUser}
                        />
                        <TouchableOpacity onPress={searchUser} style={styles.shareButton}>
                            <FontAwesome5Icon name='search' size={18} />
                            <Text style={styles.shareButtonText}>Search</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View >
    );
};

export default TopBlock;

const styles = StyleSheet.create({
    moodContainer: {
        backgroundColor: Colors.background.accent,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        padding: 20,
    },
    header: {
        gap: 20,
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 20,
        color: Colors.text.light,
        fontFamily: 'Poppins-bold',
    },
    userName: {
        fontFamily: 'Poppins-SemiBold',
    },
    profileImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: Colors.background.primary,
    },
    chatButton: {
        backgroundColor: Colors.background.tertiary,
        padding: 12,
        borderRadius: 25,
        width: '100%'
    },
    chatButtonText: {
        flex: 1,
        color: Colors.text.dark,
        fontFamily: 'Poppins-Regular',
    },
    shareButton: {
        position: 'absolute',
        right: 9,
        top: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: Colors.background.accent,
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
    },
    shareButtonText: {
        fontSize: 14,
        color: Colors.text.dark,
        fontFamily: 'Poppins-SemiBold',
    },
    moodSection: {
        marginTop: 20,
    },
    moodTitle: {
        fontSize: 18,
        color: Colors.text.light,
        fontFamily: 'Poppins-SemiBold',
        marginBottom: 15,
    },
    emojiContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    emojiButton: {
        alignItems: 'center',
        gap: 8,
    },
    emojiBox: {
        height: 60,
        width: 60,
        backgroundColor: Colors.background.primary,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    selectedEmojiBox: {
        borderWidth: 2,
        borderColor: Colors.background.accent,
    },
    emoji: {
        height: 35,
        width: 35,
    },
    emojiText: {
        color: Colors.text.light,
        fontFamily: 'Poppins-SemiBold',
        textTransform: 'capitalize',
    },
});
