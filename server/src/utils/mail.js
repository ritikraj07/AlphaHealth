// ======================================================================
// 📬 Mail Utility (Nodemailer + Custom Class)
// ======================================================================
// This file handles sending emails such as:
//   ✔ New Admin creation
//   ✔ Leave approval / rejection
//   ✔ New Employee credentials
//   ✔ Password reset emails
//
// Instead of writing nodemailer code again & again,
// we built a reusable Mail class following builder pattern,
// which allows chaining methods like:
//
// new Mail()
//    .setReceiver("abc@gmail.com")
//    .setSubject("Hello")
//    .setHTML("<h1>Welcome</h1>")
//    .send();
//
// ======================================================================

const nodemailer = require('nodemailer');


// ======================================================================
// 📡 SMTP Transporter Configuration
// ======================================================================
// Gmail SMTP settings:
//  🔹 host: smtp.gmail.com
//  🔹 port 587 → TLS/STARTTLS
//  🔹 secure: false because we use TLS upgrade
// NOTE: EMAIL & PASSWORD must be set inside .env for security
// ======================================================================
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user: process.env.EMAIL,       // Sender email
        pass: process.env.PASSWORD     // App password (not actual login password)
    }
});



// ======================================================================
// ✉ Mail Class (Re-usable Email Builder)
// ======================================================================
class Mail {

    constructor() {
        // Default Email Structure
        this.mailOptions = {
            from: {
                address: process.env.EMAIL,   // Default sender
                name: "AlphaHealth"           // Default from-name
            },
            to: [],       // Receiver list
            cc: [],       // Carbon copy
            bcc: [],      // Blind carbon copy
            attachments: []
        };
    }

    // ------------------------------------------------------------
    // 🏢 Change Email Sender Name (Company Name)
    // ------------------------------------------------------------
    setCompanyName(name) {
        this.mailOptions.from.name = name;
        return this;
    }

    // ------------------------------------------------------------
    // 📧 Change Sender Email
    // ------------------------------------------------------------
    setSenderEmail(email) {
        this.mailOptions.from.address = email;
        return this;
    }

    // ------------------------------------------------------------
    // ➤ Add Receiver(s)
    // ------------------------------------------------------------
    setReceiver(receiver) {
        Array.isArray(receiver)
            ? this.mailOptions.to.push(...receiver)
            : this.mailOptions.to.push(receiver);

        return this;
    }

    // ------------------------------------------------------------
    // 📝 CC Support
    // ------------------------------------------------------------
    setCC(cc) {
        Array.isArray(cc)
            ? this.mailOptions.cc.push(...cc)
            : this.mailOptions.cc.push(cc);

        return this;
    }

    // ------------------------------------------------------------
    // 🔐 BCC Support
    // ------------------------------------------------------------
    setBCC(bcc) {
        Array.isArray(bcc)
            ? this.mailOptions.bcc.push(...bcc)
            : this.mailOptions.bcc.push(bcc);

        return this;
    }

    // ------------------------------------------------------------
    // 📰 Email Subject
    // ------------------------------------------------------------
    setSubject(subject) {
        this.mailOptions.subject = subject;
        return this;
    }

    // ------------------------------------------------------------
    // ✍ Plain Text Body
    // ------------------------------------------------------------
    setText(text) {
        this.mailOptions.text = text;
        return this;
    }

    // ------------------------------------------------------------
    // 🎨 HTML Body Content (Preferred for Design Templates)
    // ------------------------------------------------------------
    setHTML(html) {
        this.mailOptions.html = html;
        return this;
    }

    // ------------------------------------------------------------
    // 📎 File Attachments
    // ------------------------------------------------------------
    setAttachment(attachment) {
        Array.isArray(attachment)
            ? this.mailOptions.attachments.push(...attachment)
            : this.mailOptions.attachments.push(attachment);

        return this;
    }



    // ======================================================================
    // 📩 Ready-made Abstraction Emails (Uses Email Templates)
    // ======================================================================

    async sendAdminCreationEmail(adminData) {
        const emailTemplates = require('../static/emailTemplates');

        this.setReceiver(adminData.email)
            .setSubject(`Admin Account Created - AlphaHealth`)
            .setHTML(emailTemplates.getAdminCreationTemplate(adminData));

        return await this.send();
    }

    async sendLeaveApprovalEmail(leaveData) {
        const emailTemplates = require('../static/emailTemplates');

        this.setReceiver(leaveData.employeeEmail)
            .setSubject(`Leave Request Approved - AlphaHealth`)
            .setHTML(emailTemplates.getLeaveApprovalTemplate(leaveData));

        return await this.send();
    }

    async sendLeaveRejectionEmail(leaveData) {
        const emailTemplates = require('../static/emailTemplates');

        this.setReceiver(leaveData.employeeEmail)
            .setSubject(`Leave Request Update - AlphaHealth`)
            .setHTML(emailTemplates.getLeaveRejectionTemplate(leaveData));

        return await this.send();
    }

    async sendEmployeeCreationEmail(employeeData, tempPassword = null) {
        const emailTemplates = require('../static/emailTemplates');

        this.setReceiver(employeeData.email)
            .setSubject(`Employee Account Created - AlphaHealth`)
            .setHTML(emailTemplates.getEmployeeCreationTemplate(employeeData, tempPassword));

        return await this.send();
    }

    async sendPasswordResetEmail(userData, resetLink) {
        const emailTemplates = require('../static/emailTemplates');

        this.setReceiver(userData.email)
            .setSubject(`Password Reset Request - AlphaHealth`)
            .setHTML(emailTemplates.getPasswordResetTemplate(userData, resetLink));

        return await this.send();
    }



    // ======================================================================
    // 🔥 Final Send Mail Function
    // ======================================================================
    send() {
        return new Promise((resolve, reject) => {
            transporter.sendMail(this.mailOptions, (error, info) => {
                if (error) {
                    console.error('Email sending error:', error);
                    reject(error);
                } else {
                    console.log('Email sent successfully:', info.response);
                    resolve(info);
                }
            });
        });
    }


    // ======================================================================
    // 🔄 Reset Email Options to Send New Mail Freshly
    // ======================================================================
    reset() {
        this.mailOptions = {
            from: {
                address: process.env.EMAIL,
                name: "AlphaHealth"
            },
            to: [],
            cc: [],
            bcc: [],
            attachments: []
        };
        return this;
    }
}



// ======================================================================
// 📤 Export Mail Class
// ======================================================================
module.exports = Mail;
