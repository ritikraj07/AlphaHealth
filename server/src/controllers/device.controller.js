const Device = require("../models/device.model");

/**
 * Register a device.
 *
 * If the device already exists for this user,
 * update its push token and other information.
 * Otherwise create a new device.
 */
const registerDevice = async (req, res) => {
    const userId = req.userId;
    try {
        const {
            
            model,
            deviceId,
            platform,
            expoPushToken,
            appVersion,
            notificationsEnabled,
        } = req.body;

        const device = await Device.findOneAndUpdate(
            {
                user: userId,
                model,
                deviceId,
            },
            {
                platform,
                expoPushToken,
                appVersion,
                notificationsEnabled,
                lastSeen: new Date(),
                isActive: true,
            },
            {
                new: true,
                upsert: true,
            }
        );

        res.status(200).json({
            success: true,
            message: "Device registered successfully.",
            data: device,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to register device.",
        });
    }
};

/**
 * Get every registered device of a user.
 */
const getUserDevices = async (req, res) => {
    try {
        const { userId } = req.params;
        const { model } = req.query;

        const devices = await Device.find({
            user: userId,
            model,
        });

        res.json({
            success: true,
            data: devices,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch devices.",
        });
    }
};

/**
 * Get one device.
 */
const getDevice = async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found.",
            });
        }

        res.json({
            success: true,
            data: device,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch device.",
        });
    }
};

/**
 * Update any device information.
 */
const updateDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found.",
            });
        }

        res.json({
            success: true,
            message: "Device updated successfully.",
            data: device,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update device.",
        });
    }
};

/**
 * Soft delete a device.
 * Useful when user logs out from a device.
 */
const deactivateDevice = async (req, res) => {
    try {
        const device = await Device.findByIdAndUpdate(
            req.params.id,
            {
                isActive: false,
            },
            {
                new: true,
            }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Device not found.",
            });
        }

        res.json({
            success: true,
            message: "Device deactivated successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to deactivate device.",
        });
    }
};

/**
 * Return active Expo Push Tokens.
 * This function will be used by the notification service.
 */
const getUserPushTokens = async (user, model) => {
    const devices = await Device.find({
        user,
        model,
        isActive: true,
        notificationsEnabled: true,
    }).select("expoPushToken");

    return devices.map((device) => device.expoPushToken);
};


module.exports = {
    registerDevice,
    getUserDevices,
    getDevice,
    updateDevice,
    deactivateDevice,
    getUserPushTokens,
};