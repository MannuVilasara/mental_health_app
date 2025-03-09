import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { useUsageStats } from '../../Hooks/useUsagePermission';
import SocialMediaUsage from './SocialMediaUsage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../ui/Colors';
import Icon from 'react-native-vector-icons/Feather';

export default function HomeSlide() {
    const {
        hasPermission,
        requestPermission,
        totalScreenTime,
        topUsedApps,
        error,
        fetchUsageStats,
        fetchTotalScreenTime,
        fetchTopUsedApps,
        refreshAllData,
        formatTime,
    } = useUsageStats();

    const [user, setUser] = useState('');

    async function getUserData() {
        try {
            const user = await AsyncStorage.getItem('@auth');
            const userData = JSON.parse(user);
            setUser(userData.user);
        } catch (error) {
            console.log('error: ', error);
        }
    }

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

    const handleRefresh = () => {
        if (hasPermission) {
            const now = new Date();
            const dayStart = new Date(now);
            dayStart.setHours(0, 0, 0, 0);
            refreshAllData(dayStart.getTime(), now.getTime(), 5);
        }
    };

    return (
        <View
            // colors={[Colors.background.secondary, Colors.background.tertiary]}
            style={styles.container}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Screen Time</Text>
                {hasPermission && (
                    <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
                        <Icon name="refresh-ccw" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Content */}
            {error && (
                <Text style={styles.errorText}>
                    {error.message}
                </Text>
            )}

            {hasPermission ? (
                <View style={styles.content}>
                    {/* Total Screen Time Card */}
                    <View style={styles.screenTimeCard}>
                        <Icon name="clock" size={24} color={Colors.primary} />
                        <View style={styles.screenTimeText}>
                            <Text style={styles.screenTimeValue}>
                                {formatTime(totalScreenTime)}
                            </Text>
                            <Text style={styles.screenTimeLabel}>
                                Today's Screen Time
                            </Text>
                        </View>
                    </View>

                    {/* Social Media Usage */}
                    <SocialMediaUsage
                        usageStats={topUsedApps}
                        formatTime={formatTime}
                        style={styles.socialMediaSection}
                    />
                </View>
            ) : (
                <View style={styles.permissionContainer}>
                    <Text style={styles.permissionText}>
                        Grant permission to track your screen time and app usage
                    </Text>
                    <TouchableOpacity
                        onPress={requestPermission}
                        style={styles.permissionButton}
                    >
                        <Text style={styles.permissionButtonText}>
                            Enable Tracking
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // borderRadius: 20,
        padding: 20,
        marginVertical: 10,
        backgroundColor: Colors.background.tertiary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    title: {
        fontSize: 26,
        fontFamily: 'Poppins-Bold',
        color: Colors.text.dark,
    },
    refreshButton: {
        padding: 8,
        backgroundColor: Colors.background.primary,
        borderRadius: 12,
        elevation: 2,
    },
    errorText: {
        color: Colors.status.error,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
        marginBottom: 15,
    },
    content: {
        flex: 1,
        width: '100%',
    },
    screenTimeCard: {
        backgroundColor: Colors.background.primary,
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
    },
    screenTimeText: {
        marginLeft: 15,
    },
    screenTimeValue: {
        fontSize: 24,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.primary,
    },
    screenTimeLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: Colors.text.secondary,
    },
    socialMediaSection: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionText: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    permissionButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 2,
    },
    permissionButtonText: {
        color: Colors.text.light,
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
    },
});