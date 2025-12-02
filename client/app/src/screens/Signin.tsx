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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  useAdminLoginMutation,
  useLoginMutation,
} from "../shared/store/api/authApi";
import { useDispatch } from "react-redux";
import { setAdmin } from "../shared/store/slices/adminSlice";




export default function SignIn() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  const dispatch = useDispatch();
  const [adminLogin, isAdminLoginLoading] = useAdminLoginMutation();
  const [login] = useLoginMutation();

  // Test network connection
  useEffect(() => {
    const testServerConnection = async () => {
      console.log("🧪 Testing server connection...");

      const testUrls = [
        "https://alphahealth.onrender.com/",
        "http://10.0.2.2:3000", // Android emulator
        "http://127.0.0.1:3000",
      ];

      for (const url of testUrls) {
        try {
          console.log(`🔄 Testing: ${url}`);
          const response = await fetch(url);
          const data = await response.text();
          console.log(`✅ Server is running at: ${url}`);
          console.log(`📄 Response:`, data.substring(0, 100)); // First 100 chars
          setServerStatus("online");
          return; // Stop testing if one works
        } catch (error) {
          console.log(`❌ Cannot reach: ${url}`, error);
        } finally {
          
        }
      }

      setServerStatus("offline");
      console.log("💡 Server connection tips:");
      console.log("   - Make sure your Node.js server is running");
      console.log("   - For physical device: use computer IP address");
      console.log("   - For Android emulator: use 10.0.2.2");
      console.log("   - For iOS simulator: use localhost");
    };

    testServerConnection();
  }, []); // Empty dependency array - runs once on mount

  const handleEmployeeLogin = async () => {
    setIsLoading(true);
    if (serverStatus === "offline") {
      Alert.alert(
        "Server Offline",
        "Cannot connect to the server. Please make sure:\n\n• Server is running on port 3000\n• Correct URL is being used\n• Devices are on same network"
      );
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    
    try {
      console.log("📤 Attempting employee login...");
      const result = await login({ email, password }).unwrap();

      if (result.success) {
        Alert.alert("Success", "Login successful!");
        navigation.navigate("Main" as never);
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
        Alert.alert("Success", "Admin login successful!");
        dispatch(setAdmin(result.data));
        navigation.navigate("Main" as never);
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
      <ActivityIndicator size="large" style={styles.loader} color="hotpink" animating={isLoading} />
      {/* Header */}
      <View style={{ alignItems: "center" }}>
        <Image
          style={styles.logo}
          source={require("../shared/images/logo.png")}
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
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.btm}
          onPress={handleEmployeeLogin}
          // onPress={()=>navigation.navigate("Main" as never)}
          onLongPress={handleAdminLogin}
        >
          <Text style={styles.btmText}>Sign In</Text>
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
    paddingVertical: 70,
  },
  logo: {
    width: 150,
    height: 70,
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
  lable: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 0.5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },

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
  loader: {
    
  },
});
