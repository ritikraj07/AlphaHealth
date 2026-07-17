import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Application from "expo-application";
import { Platform } from "react-native";

/**
 * Requests notification permission from the user.
 *
 * Returns:
 * true  -> Permission granted
 * false -> Permission denied
 */
export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();

  return status === "granted";
}

/**
 * Returns the current notification permission status.
 */
export async function getNotificationPermissionStatus() {
  const settings = await Notifications.getPermissionsAsync();

  return settings.granted;
}

/**
 * Gets the Expo Push Token for this device.
 */
export async function getExpoPushToken() {
  const token = await Notifications.getExpoPushTokenAsync();
    console.log("Token: ", token.data);
  return token.data;
}

/**
 * Collects all device information required by the backend.
 */
export async function getDeviceInfo() {
  return {
    platform: Platform.OS,

    deviceId:
      Application.getAndroidId() ?? Application.applicationId ?? "unknown",

    appVersion: Application.nativeApplicationVersion,

    notificationsEnabled: await getNotificationPermissionStatus(),

    expoPushToken: await getExpoPushToken(),
  };
}
