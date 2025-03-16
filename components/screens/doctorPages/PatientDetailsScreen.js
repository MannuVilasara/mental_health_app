import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import url from '../../../context/url';
import { Colors } from '../../../ui/Colors';
import BecksTestResult from '../../ProfileComponents/AnalysisComponents/BecksTestResult';
import SleepAnalysis from '../../ProfileComponents/AnalysisComponents/SleepAnalysis';
import FaceDetectResult from '../../ProfileComponents/AnalysisComponents/FaceDetectResult';
import MoodAnalysis from '../../ProfileComponents/AnalysisComponents/MoodAnalysis';
import FinalResult from '../../ProfileComponents/AnalysisComponents/FinalResult';
import { AuthContext } from '../../../context/authContext';
import { Image } from 'react-native';
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"


const PatientDetailsScreen = ({ route }) => {
    const { patient } = route?.params;
    const [weeklyTestReports, setWeeklyTestReports] = useState([]);
    const [patientData, setPatientData] = useState(null);

    const [state, setState] = useContext(AuthContext)
    const { user } = state

    const getPatientData = async () => {
        try {
            let details = await fetch(`${url}/api/v1/auth/doctor/getDetails/${user._id}`, {
                method: "GET",
            });
            details = await details.json();
            console.log("Patient details :- " + JSON.stringify(details, null, 2));

            setPatientData(details);
        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    const getUserTestReports = async () => {
        try {
            let testReports = await fetch(`${url}/api/v1/auth/doctor/getTestReport/${patient._id}`, {
                method: "GET"
            });
            testReports = await testReports.json();
            setWeeklyTestReports(testReports);
        } catch (error) {
            console.log(`error: ${error}`);
        }
    };

    useEffect(() => {
        getPatientData();
        getUserTestReports();
        return () => {
            setWeeklyTestReports([]);
            setPatientData(null);
        };
    }, [patient]);

    const getScoreColor = (score) => {
        if (score < 10) return Colors.status.success;
        if (score < 20) return Colors.status.info;
        if (score < 30) return Colors.status.warning;
        return Colors.status.error;
    };

    const getSeverityText = (score) => {
        if (score < 10) return "Minimal";
        if (score < 20) return "Mild";
        if (score < 30) return "Moderate";
        return "Severe";
    };

    const calculateAverageScore = () => {
        if (!weeklyTestReports.length) return 0;
        const total = weeklyTestReports.reduce((sum, report) => sum + report.score, 0);
        return (total / weeklyTestReports.length).toFixed(1);
    };

    const renderTestReportItem = ({ item }) => (
        <View style={styles.reportItem}>
            <Text style={styles.reportDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            <View style={styles.scoreContainer}>
                <View style={[styles.scoreDot, { backgroundColor: getScoreColor(item.score) }]} />
                <Text style={styles.scoreText}>{item.score} - {getSeverityText(item.score)}</Text>
            </View>
        </View>
    );

    useEffect(() => {
        console.log('Patient Data :-', JSON.stringify(patientData, null, 2));

    }, [patientData])
    return (
        <LinearGradient colors={[Colors.background.secondary, Colors.background.primary]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Header with Gradient Background */}
                <View style={styles.headerGradient} >
                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: `https://avatar.iran.liara.run/username?username=${patient.name}` }}
                                style={styles.avatar}
                            />
                            <View style={styles.statusDot} />
                        </View>

                        <Text style={styles.name}>{patient.name}</Text>
                        <Text style={styles.subTitle}>Student • {patient.age} years</Text>

                        {/* Info Grid */}
                        <View style={styles.infoGrid}>
                            <View style={styles.infoItem}>
                                <Ionicons name="mail-outline" size={20} color="#fff" />
                                <Text style={styles.infoText}>{patient.email}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="call-outline" size={20} color="#fff" />
                                <Text style={styles.infoText}>{patient.mobile}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="location-outline" size={20} color="#fff" />
                                <Text style={styles.infoText}>{patient.address}</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <Ionicons name="calendar-outline" size={20} color="#fff" />
                                <Text style={styles.infoText}>
                                    DOB: {new Date(patient.DOB).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>

                        {/* Last Test Badge */}
                        <View style={styles.testBadge}>
                            <Text style={styles.testBadgeText}>
                                Last Test: {new Date(patient.lastTestDate).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>

                <BecksTestResult patientId={patient._id} />
                <SleepAnalysis patientId={patient._id} />
                <FaceDetectResult patientId={patient._id} />
                <MoodAnalysis patientId={patient._id} />
                {/* <FinalResult patientId={patientId} /> */}
                {/* <Bottom /> */}
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerGradient: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 10,
    },
    profileCard: {
        marginHorizontal: 20,
        // backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
    },
    statusDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#00cc00',
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    subTitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 20,
    },
    infoGrid: {
        width: '100%',
        gap: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#fff',
        flex: 1,
    },
    testBadge: {
        marginTop: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    testBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    patientAvatar: {
        width: 100,
        aspectRatio: 1,
        borderRadius: 50,
        shadowColor: Colors.text.dark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    headerGradient: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 40,
        backgroundColor: Colors.background.accent,
        paddingBottom: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        // elevation: 10,
    },
    profileHeader: {
        alignItems: "center",
        gap: 20,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        height: 110,
        width: 110,
        borderRadius: 55,
        borderColor: "white",
        borderWidth: 4,
    },
    avatarRing: {
        position: "absolute",
        height: 126,
        width: 126,
        borderRadius: 63,
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderWidth: 2,
        top: -8,
        left: -8,
    },
    userName: {
        fontSize: 24,
        fontWeight: "700",
        color: "white",
        marginBottom: 6,
    },
    occupationContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    occupation: {
        fontSize: 14,
        color: "white",
        fontWeight: "500",
    },
    detailsCard: {
        backgroundColor: "white",
        borderRadius: 20,
        margin: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    contentContainer: {
        // padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.dark,
    },
    patientId: {
        fontSize: 16,
        color: Colors.text.secondary,
    },
    summaryCard: {
        backgroundColor: Colors.background.tertiary,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text.dark,
        marginBottom: 15,
    },
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text.primary,
        marginVertical: 5,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.text.dark,
        marginBottom: 15,
    },
    reportItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.background.primary,
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        elevation: 1,
    },
    reportDate: {
        fontSize: 16,
        color: Colors.text.primary,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    scoreText: {
        fontSize: 16,
        color: Colors.text.primary,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    analyticsButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 25,
        marginTop: 20,
    },
    analyticsText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.light,
        marginRight: 10,
    },
});

export default PatientDetailsScreen;