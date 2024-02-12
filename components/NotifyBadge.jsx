import { StyleSheet, Text, View, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';

const NotifyBadge = (props) => {
    const [alert, setAlert] = useState(props.alert);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setAlert(props.alert);

        // Animate the opacity from 0 to 1 over 1 second
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            // After appearing animation completes, start disappearing animation
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }).start(() => {
                    // After disappearing animation completes, reset the alert message
                    setAlert("");
                });
            }, 2000); // 2000 milliseconds = 2 seconds
        });
    }, [props.alert]);

    return (
        <Animated.View style={{ ...styles.badgeStyle, opacity: fadeAnim }}>
            <Text style={styles.textStyle}>{alert}</Text>
        </Animated.View>
    );
};

export default NotifyBadge;

const styles = StyleSheet.create({
    badgeStyle: {
        position: 'absolute',
        bottom: 50,
        width: "100%",
        margin: 10,
        justifyContent: 'center',
        alignItems: "center"
    },
    textStyle: {
        margin: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: 5,
        borderRadius: 20,
        paddingHorizontal: 10
    }
});
