import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useAppSelector } from '../store/hooks';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCredentials } from '../store/slices/authSlice';
import { apiSlice } from '../store/api/apiSlice';
import { performLogout } from '../utils/logout';

/**
 * Navbar component that displays the company logo and employee information on the left side
 * and a logout button with an icon on the right side.
 * When the logout button is pressed, it navigates to the SignIn page and resets the navigation stack.
 */
export default function Navbar() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { name, role } = useAppSelector((state) => state.auth);

  const handleBtm = async () => {
    if (role === "admin") {
      await performLogout(dispatch, navigation);
      return;
    } else {
      return navigation.dispatch(DrawerActions.openDrawer());
      
    }
  };

  return (
    <View style={styles.container}>
      {/* Left side - Logo and Employee info */}
      <View style={styles.leftContainer}>
        {/* Logo */}
        <View>
          {/* <Image source={require("../images/logo.png")} style={styles.logo} /> */}
          <Image source={require("../images/icon.png")} style={styles.icon} />
          {/* <Text style={styles.companyName} >PharmaPrime</Text> */}
        </View>

        {/* Employee info */}
        <View style={styles.employeeInfo}>
          <View style={styles.nameLocation}>
            <Text style={styles.employeeName}>{name}</Text>
            <Text style={styles.employeeLocation}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Right side - Logout button with icon */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleBtm}>
        {role === "admin" && (
          <Ionicons name="log-out-outline" size={20} color="black" />
        )}
        {role !== "admin" && (
          <Ionicons name="settings-outline" size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 70,
    backgroundColor: "#fcfcfcff",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  companyName: {
    color: "#e91e62",
    fontSize: 30,
    fontWeight: "bold",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  icon: {
    width: 80,
    height: 80,
    // resizeMode: "contain",
  },
  
  logo: {
    width: 90,
    height: 40,
    resizeMode: "contain",
  },
  employeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nameLocation: {
    flexDirection: "column",
  },
  employeeName: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  employeeLocation: {
    color: "#a0a0a0",
    fontSize: 12,
    fontWeight: "400",
  },
  employeeBadge: {
    backgroundColor: "#4a4a4a",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  employeeBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  logoutButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
  },
});