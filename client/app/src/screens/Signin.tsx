import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";

import {
  useAdminLoginMutation,
  useLoginMutation,
} from "../shared/store/api/authApi";
import { useDispatch } from "react-redux";
import { setAdmin } from "../shared/store/slices/adminSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setCredentials } from "../shared/store/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { useServerStatus } from "../shared/componets/hooks/useServerStatus.ts";
import ServerConnectingOverlay from "../shared/componets/ServerConnectingOverlay";





export default function SignIn() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [adminLogin, isAdminLoginLoading] = useAdminLoginMutation();
  const [login, isLoginLoading] = useLoginMutation();
  

const serverStatus = useServerStatus();
const isServerOnline = serverStatus === "online";





  const handleEmployeeLogin = async () => {
    
    if (serverStatus === "offline") {
      
      Alert.alert(
        "Server Offline",
        "Cannot connect to the server. Please make sure:\n\n• Server is running on port 3000\n• Correct URL is being used\n• Devices are on same network"
      );
      return;
    }

    if (!email || !password) {
      ToastAndroid.show("Please enter both email and password", ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);
    try {
      console.log("📤 Attempting employee login...");
      const result = await login({ email, password }).unwrap();
      
     

      if (result.success) {
        const { token, role, _id, name } = result.data;

        // Persist
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("role", role);
        await AsyncStorage.setItem("userId", _id);
        await AsyncStorage.setItem("name", name);

        // 🔍 VERIFY
        const savedToken = await AsyncStorage.getItem("token");
        const savedRole = await AsyncStorage.getItem("role");
        const savedUserId = await AsyncStorage.getItem("userId");
        const savedName = await AsyncStorage.getItem("name");


        //  console.log("🔐 AsyncStorage check:", {
        //    savedToken,
        //    savedRole,
        //    savedUserId,
        //    savedName,
        //  });
        
        dispatch(setCredentials({ token, role, _id, name }));
        // Alert.alert("Success", "Login successful!");
        ToastAndroid.show("Login successful!", ToastAndroid.SHORT);
        //  navigation.reset({
        //    index: 0,
        //    routes: [{ name: "Main" as never }],
        //  });
      } else {
        ToastAndroid.show(result.message || "Invalid credentials", ToastAndroid.SHORT);
        // Alert.alert("Login Failed", result.message || "Invalid credentials");
      }
    } catch (error: any) {
      console.log("❌ Login error:", error);

      if (error.status === "FETCH_ERROR") {
        Alert.alert(
          "Connection Failed",
          `Cannot connect to server.\n\nPlease check:\n• Server is running\n• Using correct URL\n• Network connectivity`
        );
      } else {
        Alert.alert(
          "Login Failed",
          error.data?.message || "Invalid credentials"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (serverStatus === "offline") {
      Alert.alert("Server Offline", "Cannot connect to admin server.");
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    if (!password.endsWith("@admin")) {
      Alert.alert(
        "Access Denied",
        "Admin access requires password ending with @admin"
      );
      return;
    }

    setIsLoading(true);
    try {
      const adminPassword = password.replace("@admin", "");
      console.log("📤 Attempting admin login...");

      const result = await adminLogin({
        email,
        password: adminPassword,
      }).unwrap();

      console.log("Admin login result:", result);

      if (result.success) {
        // Alert.alert("Success", "Admin login successful!");
        ToastAndroid.show("Login successful!", ToastAndroid.SHORT);
        const { token, role, _id, name } = result.data;

        // Persist
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("role", role);
        await AsyncStorage.setItem("userId", _id);

        // 🔍 VERIFY
        // const savedToken = await AsyncStorage.getItem("token");
        // const savedRole = await AsyncStorage.getItem("role");
        // const savedUserId = await AsyncStorage.getItem("userId");

        // console.log("🔐 AsyncStorage check:", {
        //   savedToken,
        //   savedRole,
        //   savedUserId,
        // });

        dispatch(setAdmin(result.data));
        dispatch(setCredentials({ token, role, _id, name }));
        //   navigation.reset({
        //   index: 0,
        //   routes: [{ name: "Main" as never }],
        // });
      } else {
        ToastAndroid.show(result.message || "Invalid admin credentials", ToastAndroid.SHORT);
        // Alert.alert("Admin Login Failed", result.message || "Invalid admin credentials");

      }
    } catch (error: any) {
      console.log("❌ Admin login error:", error);

      if (error.status === "FETCH_ERROR") {
        Alert.alert("Connection Failed", "Cannot connect to admin server.");
      } else {
        Alert.alert(
          "Admin Login Failed",
          error.data?.message || "Invalid admin credentials"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

 




  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <ActivityIndicator
        size="large"
        style={{}}
        color="hotpink"
        animating={isLoading}
      />
  
      <ServerConnectingOverlay visible={!isServerOnline} />

      {/* Header */}
      <View style={{ alignItems: "center" }}>
        <Image
          style={styles.logo}
          source={require("../shared/images/icon.png")}
        />
        <Text style={styles.title}>Employee Management System</Text>
        <Text style={styles.subtile}>Sign in to your account to continue</Text>
      </View>

      {/* Sign in form */}
      <View style={styles.inputCard}>
        <Text style={styles.lable}>Sign In</Text>
        <Text style={[styles.subtile, { fontSize: 12 }]}>
          Enter your credentials to access the system
        </Text>

        <Text style={styles.lable}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@company.com"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.lable}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btm, !isServerOnline && styles.disabled]}
          onPress={handleEmployeeLogin}
          onLongPress={handleAdminLogin}
          disabled={!isServerOnline || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btmText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}

      <View style={styles.footer}>
        <Text style={{ color: "grey" }}>Employee Management System v1.0 </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(252,244,249)",
    alignContent: "center",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtile: {
    fontSize: 14,
    marginBottom: 20,
    marginTop: 0,
    color: "grey",
  },
  inputCard: {
    margin: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#685a5aff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabled: {
  opacity: 0.6,
},
  lable: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  // input: {
  //   height: 40,
  //   borderColor: "gray",
  //   borderWidth: 0.5,
  //   marginBottom: 10,
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  //   backgroundColor: "white",
  // },

  btm: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgb(233,31,98)",
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1,
  },
  btmText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  inputWrapper: {
    position: "relative",
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 40, // space for icon
    height: 48,
  },

  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
});
