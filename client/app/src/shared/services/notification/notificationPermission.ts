import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests notification permission if it hasn't been granted already.
 *
 * Returns:
 * - true  -> Permission is granted
 * - false -> Permission denied
 */
export async function ensureNotificationPermission() {
  // Check current permission status
  const { status } = await Notifications.getPermissionsAsync();

  // Already granted
  if (status === "granted") {
    return true;
  }

  // Ask the user for permission
  const permission = await Notifications.requestPermissionsAsync();

  return permission.status === "granted";
}



export async function scheduleNotification(second: any) {
  const token = await Notifications.getExpoPushTokenAsync();
  console.log("Token: ", token);
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Alarm",
      body: "Wake up! Time to start your day.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });

  console.log("Notification ID:", id);

  return id;
}

export async function cancelNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}
