import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AttendanceEmpty = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="calendar-remove-outline"
          size={70}
          color="#3B82F6"
        />
      </View>

      <Text style={styles.title}>No Attendance Found</Text>

      <Text style={styles.description}>
        We couldn't find any attendance records matching your current filters.
        Try changing the date range or status and try again.
      </Text>
    </View>
  );
};

export default AttendanceEmpty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 350,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E8F1FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
    textAlign: "center",
  },

  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    textAlign: "center",
  },
});
