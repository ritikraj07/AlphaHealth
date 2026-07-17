const { scheduleNotification } = require("./src/services/scheduler.service");

const testDate = new Date(Date.now() + 2 * 60 * 1000);

console.log("Notification will fire at:", testDate);

scheduleNotification({
    jobId: "1",
    date: testDate,
    pushToken: "ExponentPushToken[aYffA4CF5nUDQCoJfCDQ5B]",
    title: "Test Notification",
    body: "This is a test notification.",
});