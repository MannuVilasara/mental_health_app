"use client"

import { StyleSheet, Text, View, ScrollView } from "react-native"
import { useContext } from "react"
import { Image } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome6"
import Icon1 from "react-native-vector-icons/Ionicons"
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import Icon3 from "react-native-vector-icons/Fontisto"
import { AuthContext } from "../../context/authContext"
import { Colors } from "../../ui/Colors"

const ProfileData = () => {
  // global state
  const [state] = useContext(AuthContext)

  const profileItems = [
    {
      icon: "user",
      iconLib: Icon,
      label: "Name",
      value: state?.user.name,
      color: "#4F46E5",
    },
    {
      icon: "email",
      iconLib: Icon2,
      label: "Email",
      value: state?.user.email,
      color: "#0EA5E9",
    },
    {
      icon: state?.user.gender === "Male" ? "male" : "female",
      iconLib: Icon3,
      label: "Gender",
      value: state?.user.gender,
      color: "#EC4899",
    },
    {
      icon: "hourglass-half",
      iconLib: Icon,
      label: "Age",
      value: state?.user.age,
      color: "#F59E0B",
    },
    {
      icon: "call",
      iconLib: Icon1,
      label: "Mobile no.",
      value: state?.user.mobile,
      color: "#10B981",
    },
    {
      icon: "location-sharp",
      iconLib: Icon1,
      label: "Address",
      value: state?.user.address,
      color: "#6366F1",
    },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={require("../../img/icons/assets/LoginSignup/userProfile.png")} style={styles.avatar} />
            <View style={styles.avatarRing} />
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
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}15` }]}>
              <item.iconLib name={item.icon} size={18} color={item.color} />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value || "Not provided"}</Text>
            </View>
          </View>
        ))}


      </View>
      <View style={{
        height: 200,
      }}></View>
    </ScrollView>
  )
}

export default ProfileData

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
    elevation: 10,
  },
  profileHeader: {
    alignItems: "center",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  lastItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
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
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
})

