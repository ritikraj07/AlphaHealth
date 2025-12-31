// utils/calculateWorkingTime.js
const calculateWorkingTime = (startTime, endTime = null) => {
    if (!startTime) return "0 sec";

    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();

    let diffInSeconds = Math.floor((end - start) / 1000);
    if (diffInSeconds <= 0) return "0 sec";

    const hours = Math.floor(diffInSeconds / 3600);
    diffInSeconds %= 3600;

    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;

    const parts = [];

    if (hours > 0) parts.push(`${hours} hr`);
    if (minutes > 0) parts.push(`${minutes} min`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds} sec`);

    return parts.join(" ");
};


module.exports = calculateWorkingTime;