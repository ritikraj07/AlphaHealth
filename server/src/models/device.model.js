const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
    {
        // Reference to the owner of this device (Employee/Admin)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "model",
        },

        // Determines which collection 'user' belongs to
        model: {
            type: String,
            required: true,
            enum: ["Employee", "Admin"],
        },

        // Platform on which the app is installed
        platform: {
            type: String,
            required: true,
            enum: ["android", "ios"],
        },

        // Stable device identifier sent by the client
        deviceId: {
            type: String,
            required: true,
        },

        // Current Expo Push Token used to send notifications
        expoPushToken: {
            type: String,
            required: true,
        },

        // Installed application version
        appVersion: {
            type: String,
            default: null,
        },

        // Whether the user has enabled notifications
        notificationsEnabled: {
            type: Boolean,
            default: true,
        },

        // Last time this device contacted the server
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },

    },
    {
        timestamps: true,
    }
);

// A user can register multiple devices,
// but the same device should exist only once per user.
deviceSchema.index(
    { user: 1, model: 1, deviceId: 1 },
    { unique: true }
);

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;