import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

/**
 * Navbar component that displays the company logo and employee information on the left side
 * and a logout button with an icon on the right side.
 * When the logout button is pressed, it navigates to the SignIn page and resets the navigation stack.
 */
export default function Navbar() {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Navigate to SignIn page and reset the navigation stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' as never }],
    });
  };

  return (
    <View style={styles.container}>
      {/* Left side - Logo and Employee info */}
      <View style={styles.leftContainer}>
        {/* Logo */}
        <View>
          <Image 
            source={require("../images/logo.png")} 
            style={styles.logo} 
          />
        </View>

        {/* Employee info */}
        <View style={styles.employeeInfo}>
          <View style={styles.nameLocation}>
            <Text style={styles.employeeName}>John Doe</Text>
            <Text style={styles.employeeLocation}>North HQ</Text>
          </View>
        </View>
      </View>

      {/* Right side - Logout button with icon */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="black" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    backgroundColor: '#fcfcfcff',
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    width: 90,
    height: 40,
    resizeMode: 'contain',
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameLocation: {
    flexDirection: 'column',
  },
  employeeName: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  employeeLocation: {
    color: '#a0a0a0',
    fontSize: 12,
    fontWeight: '400',
  },
  employeeBadge: {
    backgroundColor: '#4a4a4a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  employeeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
})