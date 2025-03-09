import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const TypingDots = ({ dotSize = 10, dotColor = '#888', spacing = 5, animationDuration = 1000 }) => {
    const dot1Opacity = useRef(new Animated.Value(0.3)).current;
    const dot2Opacity = useRef(new Animated.Value(0.3)).current;
    const dot3Opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animateDots = () => {
            const createDotAnimation = (opacity) => Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: animationDuration / 3,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: animationDuration / 6,
                    useNativeDriver: true,
                })
            ]);

            Animated.loop(
                Animated.sequence([
                    createDotAnimation(dot1Opacity),
                    Animated.delay(animationDuration / 6),
                    createDotAnimation(dot2Opacity),
                    Animated.delay(animationDuration / 6),
                    createDotAnimation(dot3Opacity),
                    Animated.delay(animationDuration / 6),
                ])
            ).start();
        };

        animateDots();

        return () => {
            dot1Opacity.stopAnimation();
            dot2Opacity.stopAnimation();
            dot3Opacity.stopAnimation();
        };
    }, [animationDuration]);

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
    dot: {},
});

export default TypingDots;