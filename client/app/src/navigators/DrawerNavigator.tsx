import { createDrawerNavigator } from "@react-navigation/drawer";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";


import BottomTabs from "./BottomTab";
import EmployeeDrawer from "../shared/componets/EmployeeDrawer";
import AdminDrawer from "../shared/componets/AdminDrawer";
import NotificationPermission from "../screens/NotificationPermission";

import { useAppSelector } from "../shared/store/hooks";
import { getDeviceInfo } from "../shared/services/notification";
import { API_BASE_URL } from "../config/constants";

export type DrawerParamList = {
  Home: undefined;
};

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const screenWidth = Dimensions.get("window").width;

  const { role, userId, token } = useAppSelector((state) => state.auth);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  /**
   * Check current notification permission
   */
  async function checkPermission() {
    const { status } = await Notifications.getPermissionsAsync();
    setHasPermission(status === "granted");
  }

  /**
   * Register this device on backend.
   *
   * This will:
   * 1. Collect device information.
   * 2. Get Expo Push Token.
   * 3. Send everything to backend.
   */

  async function registerDevice() {
    try {
      console.log()
      const deviceInfo = await getDeviceInfo();
      // console.log("📡 Device Info:", deviceInfo, userId);
      const response = await fetch(`${API_BASE_URL}/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: userId,
          model: role,
          ...deviceInfo,
        }),
      });

      const result = await response.json();

      // console.log("✅ Device Registered:", result);
    } catch (error) {
      console.log("❌ Device Registration Failed:", error);
    }
  }

  /**
   * Check notification permission
   * when Drawer loads.
   */
  useEffect(() => {
    checkPermission();
  }, []);

  /**
   * Register device only when:
   * - User is logged in
   * - Notification permission granted
   */
  useEffect(() => {
    if (!token) return;
    if (!hasPermission) return;

    registerDevice();
  }, [token, hasPermission]);

  /**
   * Still checking permission...
   */
  if (hasPermission === null) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /**
   * User denied notification permission.
   */
  if (!hasPermission) {
    return <NotificationPermission onPermissionGranted={checkPermission} />;
  }

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
