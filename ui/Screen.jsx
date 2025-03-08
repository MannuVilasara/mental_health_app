import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from './Colors';

export default function Screen({ children }) {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.normalBg,
        height: '100%',
        width: '100%',
        padding: 16,
    },
});
