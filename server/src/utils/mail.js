const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

class Mail {
    constructor() {
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
    }

    setCompanyName(name) {
        this.mailOptions.from.name = name;
        return this; // Return this for method chaining
    }

    setSenderEmail(email) {
        this.mailOptions.from.address = email;
        return this;
    }

    setReceiver(receiver) {
        if (Array.isArray(receiver)) {
            this.mailOptions.to.push(...receiver);
        } else {
            this.mailOptions.to.push(receiver);
        }
        return this;
    }

    setCC(cc) {
        if (Array.isArray(cc)) {
            this.mailOptions.cc.push(...cc);
        } else {
            this.mailOptions.cc.push(cc);
        }
        return this;
    }

    setBCC(bcc) {
        if (Array.isArray(bcc)) {
            this.mailOptions.bcc.push(...bcc);
        } else {
            this.mailOptions.bcc.push(bcc);
        }
        return this;
    }

    setSubject(subject) {
        this.mailOptions.subject = subject;
        return this;
    }

    setText(text) {
        this.mailOptions.text = text;
        return this;
    }

    setHTML(html) {
        this.mailOptions.html = html;
        return this;
    }

    setAttachment(attachment) {
        if (Array.isArray(attachment)) {
            this.mailOptions.attachments.push(...attachment);
        } else {
            this.mailOptions.attachments.push(attachment);
        }
        return this;
    }

    // New method to send admin creation email
    async sendAdminCreationEmail(adminData) {
        const emailTemplates = require('../static/emailTemplates');
        
        this.setReceiver(adminData.email)
            .setSubject(`Admin Account Created - AlphaHealth`)
            .setHTML(emailTemplates.getAdminCreationTemplate(adminData));
        
        return await this.send();
    }

    // New method to send leave approval email
    async sendLeaveApprovalEmail(leaveData) {
        const emailTemplates = require('../static/emailTemplates');
        
        this.setReceiver(leaveData.employeeEmail)
            .setSubject(`Leave Request Approved - AlphaHealth`)
            .setHTML(emailTemplates.getLeaveApprovalTemplate(leaveData));
        
        return await this.send();
    }

    // New method to send leave rejection email
    async sendLeaveRejectionEmail(leaveData) {
        const emailTemplates = require('../static/emailTemplates');
        
        this.setReceiver(leaveData.employeeEmail)
            .setSubject(`Leave Request Update - AlphaHealth`)
            .setHTML(emailTemplates.getLeaveRejectionTemplate(leaveData));
        
        return await this.send();
    }

    // New method to send employee creation email
    async sendEmployeeCreationEmail(employeeData, tempPassword = null) {
        const emailTemplates = require('../static/emailTemplates');
        
        this.setReceiver(employeeData.email)
            .setSubject(`Employee Account Created - AlphaHealth`)
            .setHTML(emailTemplates.getEmployeeCreationTemplate(employeeData, tempPassword));
        
        return await this.send();
    }

    // New method to send password reset email
    async sendPasswordResetEmail(userData, resetLink) {
        const emailTemplates = require('../static/emailTemplates');
        
        this.setReceiver(userData.email)
            .setSubject(`Password Reset Request - AlphaHealth`)
            .setHTML(emailTemplates.getPasswordResetTemplate(userData, resetLink));
        
        return await this.send();
    }

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

    // Reset the mail options for reuse
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

module.exports = Mail;