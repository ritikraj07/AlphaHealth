const axios = require("axios");

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";



async function sendNotification({
    pushToken,
    title,
    body,
    data = {},
    channelId = "default",
    priority = "high",
    sound = "default",
}) {
    try {
        const message = {
            to: pushToken,
            title,
            body,
            data,
            sound,
            channelId,
            priority,
        };

        

        const { data: response } = await axios.post(
            EXPO_PUSH_URL,
            message,
            {
                headers: {
                    Accept: "application/json",
                    "Accept-Encoding": "gzip, deflate",
                    "Content-Type": "application/json",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Notification Error:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = {
    sendNotification,
};