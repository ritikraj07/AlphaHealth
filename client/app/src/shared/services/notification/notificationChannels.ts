import * as Notifications from "expo-notifications";

const channels = [
  {
    id: "doctor",
    name: "Doctor Reminder",
    sound: "doctor.wav",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 300],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
  {
    id: "chemist",
    name: "Chemist Reminder",
    sound: "chemist.wav",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 300],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
  {
    id: "leave",
    name: "Leave",
    sound: "leave.wav",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
  },
  {
    id: "test",
    name: "Test",
    sound: "test.wav",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 300, 300, 300],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  },
];

export async function setupNotificationChannels() {
  for (const channel of channels) {
    await Notifications.setNotificationChannelAsync(channel.id, channel);
  }
}