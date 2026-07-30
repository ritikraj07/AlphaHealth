import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  ActivityIndicator,
  Dimensions,
  View,
  Text,
  Button,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

import BottomTabs from "./BottomTab";
import EmployeeDrawer from "../shared/componets/EmployeeDrawer";
import AdminDrawer from "../shared/componets/AdminDrawer";

import { useAppSelector } from "../shared/store/hooks";
import { getDeviceInfo } from "../shared/services/notification";
import { API_BASE_URL } from "../config/constants";

export type DrawerParamList = {
  Home: undefined;
};

const Drawer = createDrawerNavigator();

// Helper to request notification permission (prompts the user)
async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// Helper to request location permission (prompts the user)
async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
}

export default function DrawerNavigator() {
  const screenWidth = Dimensions.get("window").width;
  const { role, userId, token } = useAppSelector((state) => state.auth);

  const [permissions, setPermissions] = useState({
    notification: false,
    location: false,
  });
  const [loading, setLoading] = useState(true);
  const [showPermissionScreen, setShowPermissionScreen] = useState(false);

  // ── Check & request permissions ──
  async function checkPermissions() {
    setLoading(true);

    // Check current statuses (without prompting)
    const { status: notifStatus } = await Notifications.getPermissionsAsync();
    const { status: locStatus } =
      await Location.getForegroundPermissionsAsync();

    const notifGranted = notifStatus === "granted";
    const locGranted = locStatus === "granted";

    setPermissions({ notification: notifGranted, location: locGranted });
    setLoading(false);

    // If any permission is missing, show the permission screen
    if (!notifGranted || !locGranted) {
      setShowPermissionScreen(true);
    } else {
      setShowPermissionScreen(false);
    }
  }

  // ── Called when user clicks "Grant" on the permission screen ──
  async function requestAllPermissions() {
    setLoading(true);
    const notifGranted = await requestNotificationPermission();
    const locGranted = await requestLocationPermission();

    setPermissions({ notification: notifGranted, location: locGranted });
    setLoading(false);

    if (notifGranted && locGranted) {
      setShowPermissionScreen(false);
    } else {
      // Still not granted – keep showing the screen
      setShowPermissionScreen(true);
    }
  }

  // ── Register device (only when both permissions are granted) ──
  async function registerDevice() {
    try {
      const deviceInfo = await getDeviceInfo();
      await fetch(`${API_BASE_URL}/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: userId,
          model: role, // Might want to use device model instead of role
          ...deviceInfo,
        }),
      });
      // console.log("✅ Device Registered");
    } catch (error) {
      console.log("❌ Device Registration Failed:", error);
    }
  }

  // ── Effects ──
  useEffect(() => {
    checkPermissions();
  }, []);

  // Register when permissions are granted and user is logged in
  useEffect(() => {
    if (!token) return;
    if (permissions.notification && permissions.location) {
      registerDevice();
    }
  }, [token, permissions]);

  // ── Loading state ──
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // ── Permission screen (shown when at least one permission is missing) ──
  if (showPermissionScreen) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Permissions Required</Text>
        <Text style={styles.permissionText}>
          We need your location to mark attendance and notification permission
          to send you alerts.
        </Text>
        <View style={styles.permissionStatus}>
          <Text>
            🔔 Notification:{" "}
            {permissions.notification ? "✅ Granted" : "❌ Denied"}
          </Text>
          <Text>
            📍 Location: {permissions.location ? "✅ Granted" : "❌ Denied"}
          </Text>
        </View>
        <Button title="Grant Permissions" onPress={requestAllPermissions} />
        {!permissions.notification && (
          <Text style={styles.hint}>
            You can also enable them manually in Settings.
          </Text>
        )}
      </View>
    );
  }

  // ── Drawer (permissions granted) ──
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        swipeEdgeWidth: 100,
        drawerStyle: {
          width: screenWidth > 600 ? 400 : 280,
          backgroundColor: "#fff",
        },
      }}
      drawerContent={(props) =>
        role === "admin" ? (
          <AdminDrawer {...props} />
        ) : (
          <EmployeeDrawer {...props} />
        )
      }
    >
      <Drawer.Screen name="Home" component={BottomTabs} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#fff",
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  permissionStatus: {
    marginBottom: 20,
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 20,
  },
  hint: {
    marginTop: 12,
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});
