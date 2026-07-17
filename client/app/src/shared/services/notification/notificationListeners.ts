import * as Notifications from "expo-notifications";
import { navigate } from "../../../navigators/navigationRef";


export function initializeNotificationListeners() {
  // Foreground notification
  /**
   * Listens for notifications received while the app is OPEN.
   *
   * NOTE:
   * This fires as soon as the notification arrives.
   * It does NOT mean the user tapped it.
   */
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log("📩 Notification received");
      console.log(notification.request.content.data);
      // Example:
      // Update Redux
      // Refresh RTK Query
      // Show custom in-app banner
    },
  );

  // User tapped notification

  /**
   * Listens for when the USER TAPS a notification.
   *
   * Works when:
   * ✔ App is open
   * ✔ App is in background
   */
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const data: any = response.notification.request.content.data;

      console.log("👆 User tapped notification");

      navigate(data.screen || "Home");
    });

  // App opened from killed state
  /**
   * Called ONLY once when the app was COMPLETELY CLOSED
   * and opened by tapping a notification.
   */
  Notifications.getLastNotificationResponseAsync().then((response) => {
    if (!response) return;

    const data: any = response.notification.request.content.data;

    console.log("🚀 App opened from notification");

    navigate(data.screen || "Home");
  });

  // Cleanup function
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}