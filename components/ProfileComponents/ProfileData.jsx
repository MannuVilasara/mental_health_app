"use client";

import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6";
import Icon1 from "react-native-vector-icons/Ionicons";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import Icon3 from "react-native-vector-icons/Fontisto";
import { AuthContext } from "../../context/authContext";
import { Colors } from "../../ui/Colors";
import Clipboard from "@react-native-clipboard/clipboard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from "../../context/url";
import LinearGradient from 'react-native-linear-gradient';

const ProfileData = () => {
  const [state, setState] = useContext(AuthContext);
  const [doctorId, setDoctorId] = useState('');

  useEffect(() => {
    console.log(JSON.stringify(state?.user, null, 2));
  }, [state]);

  const handleAssignDoctor = async () => {
    try {
      if (!doctorId) {
        Alert.alert('Error', 'Please enter a Doctor ID');
        return;
      }

      const response = await fetch(`${url}/updateDoctor/${state?.user._id}`, {
        method: 'POST', // Changed from PUT to POST
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify({ doctorID: doctorId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      Alert.alert('Success', 'Doctor assigned successfully');
      setState(prev => ({
        ...prev,
        user: {
          ...prev.user,
          doctorID: data.user.doctorID,
        },
      }));
    } catch (error) {
      console.error('Error assigning doctor:', error);
      Alert.alert('Error', error.message || 'An error occurred while assigning doctor');
    }
  };

  const handleLogout = async () => {
    setState({ token: "", user: "" });
    await AsyncStorage.removeItem("@auth");
    Alert.alert("See you soon!", "Logged out successfully");
  };

  const profileItems = [
    ...(state?.user.role === 'doctor' ? [{
      icon: "id-card",
      iconLib: Icon,
      label: "My User Id",
      value: state?.user._id,
      color: "#3F8433",
      copyable: true,
    }] : []),
    ...(state?.user.role !== 'doctor' ? [{
      icon: "id-card",
      iconLib: Icon,
      label: "Doctor Id",
      value: state?.user.doctorID,
      color: "#3F8433",
      copyable: true,
    }] : []),
    { icon: "user", iconLib: Icon, label: "Name", value: state?.user.name, color: "#4F46E5" },
    { icon: "email", iconLib: Icon2, label: "Email", value: state?.user.email, color: "#0EA5E9" },
    { icon: state?.user.gender === "Male" ? "male" : "female", iconLib: Icon3, label: "Gender", value: state?.user.gender, color: "#EC4899" },
    { icon: "hourglass-half", iconLib: Icon, label: "Age", value: state?.user.age, color: "#F59E0B" },
    { icon: "call", iconLib: Icon1, label: "Mobile no.", value: state?.user.mobile, color: "#10B981" },
    { icon: "location-sharp", iconLib: Icon1, label: "Address", value: state?.user.address, color: "#6366F1" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View
        // colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../img/icons/assets/LoginSignup/userProfile.png")}
              style={styles.avatar}
            />
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.userName}>{state?.user.name}</Text>
          <View style={styles.occupationContainer}>
            <Icon2 name="briefcase-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.occupation}>{state?.user.occupation || "Not specified"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {profileItems.map((item, index) => (
          <View key={index} style={[styles.infoItem, index === profileItems.length - 1 && styles.lastItem]}>
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
              <item.iconLib name={item.icon} size={20} color={item.color} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">{item.value || "Not provided"}</Text>
            </View>
            {item.copyable && (
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  Clipboard.setString(item.value);
                  Alert.alert('Success', "Your ID was copied successfully");
                }}
              >
                <Icon name="copy" size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        {state?.user.role !== 'doctor' && (
          <View style={styles.assignDoctorContainer}>
            <TextInput
              style={styles.doctorInput}
              placeholder="Enter Doctor ID"
              value={doctorId}
              onChangeText={setDoctorId}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.assignButton} onPress={handleAssignDoctor}>
              <Text style={styles.assignButtonText}>Assign</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
        <Icon2 name="logout" size={24} color="white" />
      </TouchableOpacity>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  headerGradient: {
    backgroundColor: Colors.background.accent,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 50,
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#00cc00",
    position: "absolute",
    bottom: 5,
    right: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
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
    color: "#fff",
    fontWeight: "500",
  },
  detailsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  copyButton: {
    padding: 15,
    borderRadius: 50,
    backgroundColor: Colors.background.secondary
  },
  assignDoctorContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  doctorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
    marginRight: 10,
  },
  assignButton: {
    backgroundColor: Colors.background.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  assignButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
});

export default ProfileData;