const cron = require("node-cron");
const { sendNotification } = require("./Notification.js");

// Stores all scheduled jobs
const scheduledJobs = new Map();

/**
 * Schedule a notification.
 */
function scheduleNotification({
    jobId,
    date,
    pushToken,
    title,
    body,
    data = {},
}) {
    cancelNotification(jobId);

    const notificationDate = new Date(date);

    if (notificationDate <= new Date()) {
        console.log(`Skipping ${jobId}. Time already passed.`);
        return;
    }

    const second = notificationDate.getSeconds();
    const minute = notificationDate.getMinutes();
    const hour = notificationDate.getHours();
    const day = notificationDate.getDate();
    const month = notificationDate.getMonth() + 1;

    const expression = `${second} ${minute} ${hour} ${day} ${month} *`;

    const task = cron.schedule(expression, async () => {
        try {
            console.log(`Sending notification for ${jobId}`);

            await sendNotification({
                pushToken,
                title,
                body,
                data,
            });
        } catch (err) {
            console.error(err);
        }

        task.stop();
        scheduledJobs.delete(jobId);
    });

    scheduledJobs.set(jobId, {
        task,
        date: notificationDate,
        pushToken,
        title,
    });

    console.log(`Scheduled ${jobId}`);
}

function cancelNotification(jobId) {
    const job = scheduledJobs.get(jobId);

    if (!job) return;

    job.task.stop();

    scheduledJobs.delete(jobId);

    console.log(`Cancelled ${jobId}`);
}

function updateNotification(options) {
    cancelNotification(options.jobId);

    scheduleNotification(options);
}

function getRunningJobs() {
    return [...scheduledJobs.keys()];
}

module.exports = {
    scheduleNotification,
    cancelNotification,
    updateNotification,
    getRunningJobs,
};