import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const TypingDots = ({ dotSize = 10, dotColor = '#888', spacing = 5, animationDuration = 1000 }) => {
    // Create animated values for each dot
    const dot1Opacity = useRef(new Animated.Value(0.3)).current;
    const dot2Opacity = useRef(new Animated.Value(0.3)).current;
    const dot3Opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        // Create the animation sequence
        const animateDots = () => {
            // Reset all dots to low opacity
            dot1Opacity.setValue(0.3);
            dot2Opacity.setValue(0.3);
            dot3Opacity.setValue(0.3);

            // Animate dot 1
            Animated.sequence([
                Animated.timing(dot1Opacity, {
                    toValue: 1,
                    duration: animationDuration / 3,
                    useNativeDriver: true,
                }),
                Animated.timing(dot1Opacity, {
                    toValue: 0.3,
                    duration: animationDuration / 6,
                    useNativeDriver: true,
                }),
            ]).start();

            // Animate dot 2 with a delay
            Animated.sequence([
                Animated.delay(animationDuration / 3),
                Animated.timing(dot2Opacity, {
                    toValue: 1,
                    duration: animationDuration / 3,
                    useNativeDriver: true,
                }),
                Animated.timing(dot2Opacity, {
                    toValue: 0.3,
                    duration: animationDuration / 6,
                    useNativeDriver: true,
                }),
            ]).start();

            // Animate dot 3 with a longer delay
            Animated.sequence([
                Animated.delay((animationDuration / 3) * 2),
                Animated.timing(dot3Opacity, {
                    toValue: 1,
                    duration: animationDuration / 3,
                    useNativeDriver: true,
                }),
                Animated.timing(dot3Opacity, {
                    toValue: 0.3,
                    duration: animationDuration / 6,
                    useNativeDriver: true,
                }),
            ]).start();
        };

        // Create loop for continuous animation
        const animationLoop = Animated.loop(
            Animated.timing(dot1Opacity, {
                toValue: 1,
                duration: 0, // This timing is not used, just to create the loop
                useNativeDriver: true,
            })
        );

        // Start the loop
        animationLoop.start(({ finished }) => {
            if (finished) {
                animateDots();
            }
        });

        // Start the initial animation
        animateDots();

        // Clean up animations when component unmounts
        return () => {
            animationLoop.stop();
            dot1Opacity.stopAnimation();
            dot2Opacity.stopAnimation();
            dot3Opacity.stopAnimation();
        };
    }, [dot1Opacity, dot2Opacity, dot3Opacity, animationDuration]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: dotColor,
                        marginRight: spacing,
                        opacity: dot1Opacity,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: dotColor,
                        marginRight: spacing,
                        opacity: dot2Opacity,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    {
                        width: dotSize,
                        height: dotSize,
                        borderRadius: dotSize / 2,
                        backgroundColor: dotColor,
                        opacity: dot3Opacity,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    dot: {
        // Base styles for dots are defined inline through props
    },
});

export default TypingDots;