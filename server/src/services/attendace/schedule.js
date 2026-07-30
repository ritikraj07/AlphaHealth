const cron = require("node-cron");
const Employee = require("../../models/employee.model");
const Attendance = require("../../models/attendance.model");

/**
 * Mark attendance for all employees who don't have a record for today.
 * @param {string} status - "absent" or "holiday"
 */
async function markMissingAttendance(status) {
    try {
        const today = new Date();
        const start = new Date(today);
        start.setHours(0, 0, 0, 0);
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);

        // Employees who already have attendance today
        const existing = await Attendance.find({
            date: { $gte: start, $lte: end }
        }).select("employee");
        const presentEmployeeIds = existing.map(a => a.employee);

        // Employees without attendance today
        const absentEmployees = await Employee.find({
            _id: { $nin: presentEmployeeIds }
        }).select("_id");

        if (absentEmployees.length === 0) {
            console.log(`No ${status} employees to mark.`);
            return;
        }

        const attendanceDocs = absentEmployees.map(emp => ({
            employee: emp._id,
            date: start,
            status
        }));

        await Attendance.insertMany(attendanceDocs);
        console.log(`Marked ${attendanceDocs.length} employees as ${status}.`);
    } catch (error) {
        console.error(`Error marking ${status}:`, error);
    }
}

// ── 1 AM: if weekend → mark holiday ──
cron.schedule("0 1 * * *", async () => {
    const day = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) {
        console.log("Weekend – marking holiday...");
        await markMissingAttendance("holiday");
    } else {
        console.log("Weekday – skipping holiday job.");
    }
});

// ── 6 PM: if weekday → mark absent ──
cron.schedule("41 20 * * *", async () => {
    const day = new Date().getDay();
    if (day === 0 || day === 6) {
        console.log("Weekend – skipping absent job (holiday already marked).");
    } else {
        console.log("Weekday – marking absent...");
        await markMissingAttendance("absent");
    }
});

// Export for manual testing
module.exports = { markMissingAttendance };