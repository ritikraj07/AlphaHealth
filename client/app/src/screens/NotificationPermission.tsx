import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

const NotificationPermission = ({ onPermissionGranted }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔔</Text>

      <Text style={styles.title}>Enable Notifications</Text>

      <Text style={styles.description}>
        PharmaPrime uses notifications to remind you about doctor visits,
        chemist calls, day plans, leave approvals and important
        updates.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openSettings()}
      >
        <Text style={styles.buttonText}>Open Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPermissionGranted}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryText}>I've Enabled Notifications</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationPermission;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  icon: {
    fontSize: 70,
    textAlign: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },

  description: {
    marginTop: 18,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },

  button: {
    backgroundColor: "#e91e63",
    marginTop: 40,
    borderRadius: 10,
    paddingVertical: 15,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 17,
  },

  secondaryButton: {
    marginTop: 18,
  },

  secondaryText: {
    color: "#e91e63",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
