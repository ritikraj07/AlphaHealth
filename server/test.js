const Mail = require("./src/utils/mail");
const { scheduleNotification } = require("./src/services/scheduler.service");
const logger = require("./src/utils/logger");

// const testDate = new Date(Date.now() + 2 * 60 * 1000);

// console.log("Notification will fire at:", testDate);

// scheduleNotification({
//     jobId: "1",
//     date: testDate,
//     pushToken: "ExponentPushToken[aYffA4CF5nUDQCoJfCDQ5B]",
//     title: "Test Notification",
//     body: "This is a test notification.",
// });

//test.js test file
// let emp = {
//     name: 'Mike',
//     email: 'ritikra3rrr@gmail.com',
//     password: '$2b$12$jv7MwDF/.PZcdq24zqIeOOC1qHeiFN9hjB5C3ZJsz2ZUVoU7jsxC2',
//     role: 'employee',
//     // hq: new ObjectId('6a5a509dbba7f3c792c77575'),
//     leavesTaken: { sick: 0, casual: 0, earned: 0, public: 0 },
//     // manager: new ObjectId('69c22c42aabd8dde28447359'),
//     managerModel: 'Employee',
//     phone: '1144667733',
//     designation: 'employee',
//     employmentStatus: 'active',
//     // _id: new ObjectId('6a5b13fb77c792329ab7bf59'),
   
//     __v: 0,
//     totalLeavesTaken: 0,
//     isManager: false,
//     isManagedByAdmin: false,
//     id: '6a5b13fb77c792329ab7bf59'
// }
// const mailer = new Mail()
// async function checkmail() {
//     let res = await mailer.sendEmployeeCreationEmail(emp, "asfwessd");
//     console.log(res);
//     return res;
// }

// checkmail()

// logger.logInfo('Admin creation email sent', {
//           " requestId": "req.requestId",
//           adminId: "savedAdmin._id",
//     email: " savedAdmin.email",
//           file: __filename,
//         });

console.log(error.stack.split('\n')[0]);