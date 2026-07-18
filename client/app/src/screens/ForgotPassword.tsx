import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useForgotPassordMutation } from "../shared/store/api/employeeApi";



const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPassordMutation();
  

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = async () => {
    if (!email.trim()) {
      return ToastAndroid.show(
        "Please enter your email",
        ToastAndroid.SHORT
      );
    }

    if (!validateEmail(email)) {
      return ToastAndroid.show(
        "Enter a valid email address",
        ToastAndroid.SHORT
      );
    }

    try {
      const response = await forgotPassword({ email }).unwrap();

      ToastAndroid.show(
        "Reset link sent successfully!",
        ToastAndroid.LONG
      );

      navigation.goBack();
    } catch (error: any) {
      ToastAndroid.show(
        error?.data?.message || "Something went wrong",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#222"
          />
        </TouchableOpacity>

        {/* Icon */}

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="lock-closed-outline"
              size={38}
              color="#e91e62"
            />
          </View>
        </View>

        {/* Title */}

        <Text style={styles.title}>Forgot Password?</Text>

        <Text style={styles.subtitle}>
          Don't worry! Enter your registered email address and we'll send you a
          password reset link.
        </Text>

        {/* Email */}

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={22}
            color="#999"
          />

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        {/* Button */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSend}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Send Reset Link
            </Text>
          )}
        </TouchableOpacity>

        {/* Footer */}

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 25 }}
        >
          <Text style={styles.footerText}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },

  backButton: {
    marginTop: 10,
    width: 40,
  },

  iconContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fde7ef",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginTop: 30,
  },

  subtitle: {
    marginTop: 15,
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  inputContainer: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 58,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#111",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#e91e62",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  footerText: {
    textAlign: "center",
    color: "#e91e62",
    fontWeight: "600",
    fontSize: 15,
  },
});