"use client"

import { Alert, Image, ScrollView, StyleSheet, Text, View, Animated } from "react-native"
import { useContext, useEffect, useRef } from "react"
import Bottom from "../Bottom"
import Icon from "react-native-vector-icons/FontAwesome6"
import Icon1 from "react-native-vector-icons/Ionicons"
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons"
import Icon3 from "react-native-vector-icons/MaterialIcons"
import { TouchableOpacity } from "react-native"
import { AuthContext } from "../../context/authContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Colors } from "../../ui/Colors"

export default function Profile({ navigation }) {
  const [state, setState] = useContext(AuthContext)
  const { user } = state
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.95)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleLogout = async () => {
    setState({ token: "", user: "" })
    await AsyncStorage.removeItem("@auth")
    Alert.alert("See you soon!", "Logged out successfully")
  }

  const menuItems = [
    { icon: "user", name: "Profile", nav: "Profile", lib: Icon },
    ...(user.role !== "doctor"
      ? [
        { icon: "ondemand-video", name: "D-CBT", nav: "D-CBT", lib: Icon3 },
        { icon: "analytics", name: "Weekly Reports", nav: "Weekly Reports", lib: Icon1 },
      ]
      : []),
    { icon: "circle-info", name: "About", nav: "About", lib: Icon },
    { icon: "logout", name: "Log Out", action: handleLogout, lib: Icon2 },
  ]

  const getRandomGradient = (index) => {
    const gradients = [
      ["#F8FAFF", "#E2EAFC"],
      ["#F0FFF4", "#DCFCE7"],
      ["#FFF7ED", "#FFEDD5"],
      ["#F5F3FF", "#E9D5FF"],
    ]
    return gradients[index % gradients.length]
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerGradient}>
          <Animated.View
            style={[
              styles.header,
              // {
              //   opacity: fadeAnim,
              //   transform: [{ translateY: slideAnim }],
              // },
            ]}
          >
            <View style={styles.avatarContainer}>
              <View
                style={styles.avatarGradient}
              >
                <Image source={require("../../img/icons/assets/LoginSignup/userProfile.png")} style={styles.avatar} />
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.name}</Text>
              {user?.role &&

                <View style={styles.roleBadge}>
                  <Text style={styles.role}>{user.role}</Text>
                </View>
              }
            </View>
          </Animated.View>
        </View>

        <View style={styles.menuWrapper}>
          <Text style={styles.sectionTitle}>Menu</Text>

          <Animated.View
            style={[
              styles.menuContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {menuItems.map((item, index) => {
              const isLast = index === menuItems.length - 1
              const isLogout = item.name === "Log Out"

              return (
                <Animated.View
                  key={index}
                  style={[
                    {
                      transform: [
                        {
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 50],
                            outputRange: [0, 15 * (index + 1)],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.menuItem, isLogout && styles.logoutItem, isLast && styles.lastItem]}
                    onPress={() => (item.nav ? navigation.navigate(item.nav) : item.action())}
                  >
                    <View
                      style={styles.iconGradient}
                    >
                      <item.lib name={item.icon} size={20} color={isLogout ? "#EF4444" : Colors.primary} />
                    </View>

                    <View style={styles.menuTextContainer}>
                      <Text style={[styles.menuText, isLogout && styles.logoutText]}>{item.name}</Text>
                    </View>

                    <Icon
                      name={isLogout ? "arrow-right-from-bracket" : "chevron-right"}
                      size={16}
                      color={isLogout ? "#EF4444" : Colors.primary}
                      style={styles.arrow}
                    />
                  </TouchableOpacity>
                </Animated.View>
              )
            })}
          </Animated.View>
        </View>

        <Bottom />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: Colors.background.accent,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  avatarGradient: {
    padding: 4,
    borderRadius: 70,
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  userInfo: {
    alignItems: "center",
  },
  name: {
    color: "#1F2937",
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: "rgba(79, 70, 229, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  role: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  menuWrapper: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    marginLeft: 4,
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  lastItem: {
    marginBottom: 0,
  },
  logoutItem: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  iconGradient: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  menuText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "600",
  },
  arrow: {
    opacity: 0.7,
  },
})

