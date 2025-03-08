import { Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUsageStats } from '../../Hooks/useUsagePermission';
import SocialMediaUsage from './SocialMediaUsage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../ui/Colors';
import Heading from '../../ui/Headings';

export default function HomeSlide() {
    const {
        hasPermission,
        requestPermission,
        usageStats,
        totalScreenTime,
        installedApps,
        topUsedApps,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
        closeApp,
        error,
        fetchUsageStats,
        fetchTotalScreenTime,
        fetchTopUsedApps,
        fetchInstalledApps,
        refreshAllData,
        formatTime,
    } = useUsageStats();

    const [user, setUser] = useState('');

    async function getUserData() {
        try {

            const user = await AsyncStorage.getItem('@auth')
            const userData = JSON.parse(user)
            setUser(userData.user)
            // console.log('user:  ', userData.user)
        } catch (error) {
            console.log('error:  ', error)
        }
    }

    // Fetch data when permission is granted
    useEffect(() => {
        if (hasPermission) {
            const now = new Date();
            const dayStart = new Date(now);
            dayStart.setHours(0, 0, 0, 0);

            getUserData()
            // Use the hook's fetch functions
            Promise.all([
                fetchUsageStats(dayStart.getTime(), now.getTime()),
                fetchTotalScreenTime(dayStart.getTime(), now.getTime()),
                fetchTopUsedApps(dayStart.getTime(), now.getTime(), 5)
            ])
                .then(([stats, screenTime, topApps]) => {
                    // console.log('Top 5 used apps:', JSON.stringify(topApps, null, 2));
                    // console.log('Total screen time (ms):', screenTime);
                    // console.log('All usage stats:', JSON.stringify(stats, null, 2));
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [hasPermission]);

    // Handle refresh button press
    const handleRefresh = () => {
        if (hasPermission) {
            const now = Date.now();
            const dayStart = now - (now % (24 * 60 * 60 * 1000)); // Start of current day
            refreshAllData(dayStart, now, 5);
        }
    };

    return (
        <View style={styles.container}>
            {/* <View style={styles.socialMediaMonitoringTitle}>
                <Text
                    style={[
                        styles.color_black,
                        { fontSize: 17, fontWeight: 600, width: 'min-content', fontFamily: 'Poppins-SemiBold' },
                    ]}>
                    Social Media Monitoring
                </Text>
                <TouchableOpacity style={{ width: 'min-content' }} onPress={handleRefresh}>
                    <Text
                        style={[
                            styles.color_black,
                            { fontSize: 17, width: '100%', textAlign: 'right', fontFamily: 'Poppins-Regular' },
                        ]}>
                        Refresh
                    </Text>
                </TouchableOpacity>
            </View> */}
            <View style={{ width: '100%', padding: 15 }}>
                <Heading title="Social Media Monitoring" onPress={handleRefresh} buttonTitle="Refresh" />
            </View>
            {error && <Text style={[styles.color_black, { textAlign: 'center', marginTop: 10 }]}>{error.message}</Text>}

            {hasPermission ? (
                <View style={{ width: '100%', alignItems: 'center', gap: 10, height: 'min-content' }}>
                    <View style={{ width: '100%', alignItems: 'center', gap: 10, height: 'min-content', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                        <Text style={[styles.color_black, { fontSize: 17, fontFamily: 'Poppins-Regular', textAlign: 'center' }]}>
                            Total Screen time
                        </Text>
                        <Text style={{ color: Colors.text.dark, fontSize: 17, fontFamily: 'Poppins-Regular', textAlign: 'center' }}>
                            {formatTime(totalScreenTime)}
                        </Text>
                    </View>
                    <SocialMediaUsage usageStats={topUsedApps} formatTime={formatTime} />
                </View>
            ) : (
                <View style={{ width: '100%', alignItems: 'center', gap: 10, marginTop: 40 }}>
                    <Text
                        style={[
                            styles.color_black,
                            {
                                fontSize: 17,
                                marginBottom: 5,
                                marginLeft: 5,
                                fontFamily: 'Poppins-Regular',
                                textAlign: 'center',
                                width: '70%',
                            },
                        ]}>
                        You have to grant permission to use this feature
                    </Text>
                    <TouchableOpacity onPress={requestPermission} style={styles.grantPermissionButton}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', color: 'white', width: 'min-content' }}>
                            Grant Permission
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    color_black: {
        color: '#444444',
    },
    socialMediaMonitoringTitle: {
        width: '100%',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    container: {
        width: '100%',
        backgroundColor: Colors.background.primary,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // paddingVertical: 20,
    },
    grantPermissionButton: {
        backgroundColor: '#6f9167',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
        width: '50%',
        alignSelf: 'center',
    },
    appContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: 'rgba(111,145,103,0.9)',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    appName: {
        fontSize: 17,
    },
    appContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'space-between',
        flex: 1,
        width: '100%',
    },
    appIcon: {
        height: '100%',
        aspectRatio: 1,
        borderRadius: 10,
    },
});