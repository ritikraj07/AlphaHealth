import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useResetPasswordMutation } from "../../shared/store/api/employeeApi";
import { useNavigation } from "@react-navigation/native";

export default function ChangePasswordScreen() {
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const navigation = useNavigation();

  async function handleResetPassword() {
    try { 
      let res = await resetPassword({})
      ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
    } catch (error: any) {
      ToastAndroid.show(error?.data?.message || "Something went wrong", ToastAndroid.SHORT);
      console.log(error);

    }

  }
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.subtitle}>Secure your PharmaPrime account</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="lock-reset" size={52} color="#e91e62" />
          </View>
        </View>

        <Text style={styles.heading}>Forgot your password?</Text>

        <Text style={styles.description}>
          For your security, password changes are completed through your
          registered email address.
        </Text>

        <Text style={styles.description}>
          We'll send you a secure password reset link. Simply open the email and
          create a new password.
        </Text>

        {/* Security Points */}

        <View style={styles.securityBox}>
          <View style={styles.point}>
            <MaterialIcons name="verified-user" size={20} color="#22c55e" />

            <Text style={styles.pointText}>Secure email verification</Text>
          </View>

          <View style={styles.point}>
            <MaterialIcons name="schedule" size={20} color="#22c55e" />

            <Text style={styles.pointText}>
              Reset link expires automatically
            </Text>
          </View>

          <View style={styles.point}>
            <MaterialIcons name="shield" size={20} color="#22c55e" />

            <Text style={styles.pointText}>
              Your password is never stored in the app
            </Text>
          </View>
        </View>

        {/* Button */}

        <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
          <MaterialIcons name="mail-outline" color="#fff" size={22} />

          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} >
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PRIMARY = "#e91e62";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },

  header: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 22,
    paddingVertical: 28,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    color: "rgba(255,255,255,.85)",
    marginTop: 6,
    fontSize: 15,
  },

  card: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 22,
    padding: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  iconContainer: {
    alignItems: "center",
    marginBottom: 18,
  },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff2f7",
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 15,
  },

  description: {
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },

  securityBox: {
    marginTop: 18,
    backgroundColor: "#fafafa",
    borderRadius: 18,
    padding: 18,
  },

  point: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  pointText: {
    marginLeft: 12,
    fontSize: 15,
    color: "#444",
    flex: 1,
  },

  button: {
    marginTop: 28,
    backgroundColor: PRIMARY,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },

  cancel: {
    marginTop: 18,
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
  },
});
