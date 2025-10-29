const fs = require('fs');
const path = require('path');

class EmailTemplates {
    constructor() {
        this.templatesDir = path.join(__dirname, '../views/emails');
    }

    // Base template with common styling
    getBaseTemplate(content, title = '') {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f6f9fc; 
            color: #333; 
            line-height: 1.6; 
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .email-header { 
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white; 
            padding: 30px; 
            text-align: center; 
        }
        .email-header h1 { 
            font-size: 28px; 
            margin-bottom: 10px; 
            font-weight: 600;
        }
        .email-body { 
            padding: 40px; 
        }
        .email-footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
        }
        .btn { 
            display: inline-block; 
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0; 
            font-weight: 500;
        }
        .info-card {
            background: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .credentials {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
        .warning {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #721c24;
        }
        @media (max-width: 600px) {
            .email-body { padding: 20px; }
            .email-header { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>AlphaHealth</h1>
            <p>Employee Management System</p>
        </div>
        <div class="email-body">
            ${content}
        </div>
        <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} AlphaHealth. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>`;
    }

    // Admin Account Creation Template
    getAdminCreationTemplate(adminData) {
        const content = `
            <h2>Welcome to AlphaHealth! 🎉</h2>
            <p>Dear <strong>${adminData.name}</strong>,</p>
            
            <p>Your administrator account has been successfully created for the <strong>Employee Management System</strong>.</p>
            
            <div class="credentials">
                <h3>Your Login Credentials:</h3>
                <p><strong>Email:</strong> ${adminData.email}</p>
                <p><strong>Role:</strong> ${adminData.role}</p>
                <p><strong>Account Type:</strong> Super Administrator</p>
            </div>

            <div class="info-card">
                <h4>What you can do:</h4>
                <ul>
                    <li>Manage employee accounts</li>
                    <li>Approve/reject leave requests</li>
                    <li>Manage headquarters and POBs</li>
                    <li>Generate reports and analytics</li>
                    <li>Manage system settings</li>
                </ul>
            </div>

            <div class="warning">
                <strong>Important Security Notice:</strong>
                <p>Please keep your credentials secure and change your password after first login.</p>
            </div>

            <p>You can access the system immediately using the provided credentials.</p>
            
            <div style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}" class="btn">
                    Access Admin Dashboard
                </a>
            </div>

            <p>Best regards,<br><strong>AlphaHealth Team</strong></p>
        `;

        return this.getBaseTemplate(content, 'Admin Account Created - AlphaHealth');
    }

    // Leave Request Approval Template
    getLeaveApprovalTemplate(leaveData) {
        const content = `
            <h2>Leave Request Approved ✅</h2>
            <p>Dear <strong>${leaveData.employeeName}</strong>,</p>
            
            <p>Your leave request has been <strong>approved</strong> by the administrator.</p>
            
            <div class="info-card">
                <h3>Leave Details:</h3>
                <p><strong>Type:</strong> ${leaveData.leaveType}</p>
                <p><strong>From:</strong> ${new Date(leaveData.startDate).toLocaleDateString()}</p>
                <p><strong>To:</strong> ${new Date(leaveData.endDate).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> ${leaveData.duration} days</p>
                <p><strong>Reason:</strong> ${leaveData.reason}</p>
            </div>

            ${leaveData.adminNotes ? `
            <div class="info-card">
                <h4>Admin Notes:</h4>
                <p>${leaveData.adminNotes}</p>
            </div>
            ` : ''}

            <p>Please ensure a proper handover before proceeding on leave.</p>

            <div style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}/leaves" class="btn">
                    View Leave Details
                </a>
            </div>

            <p>Best regards,<br><strong>AlphaHealth Admin Team</strong></p>
        `;

        return this.getBaseTemplate(content, 'Leave Request Approved - AlphaHealth');
    }

    // Leave Request Rejection Template
    getLeaveRejectionTemplate(leaveData) {
        const content = `
            <h2>Leave Request Update</h2>
            <p>Dear <strong>${leaveData.employeeName}</strong>,</p>
            
            <p>Your leave request has been <strong>rejected</strong>.</p>
            
            <div class="info-card">
                <h3>Leave Details:</h3>
                <p><strong>Type:</strong> ${leaveData.leaveType}</p>
                <p><strong>From:</strong> ${new Date(leaveData.startDate).toLocaleDateString()}</p>
                <p><strong>To:</strong> ${new Date(leaveData.endDate).toLocaleDateString()}</p>
                <p><strong>Reason:</strong> ${leaveData.reason}</p>
            </div>

            <div class="warning">
                <h4>Rejection Reason:</h4>
                <p>${leaveData.rejectionReason}</p>
            </div>

            <p>You can submit a new leave request with adjustments based on the feedback above.</p>

            <div style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}/leaves" class="btn">
                    Submit New Leave Request
                </a>
            </div>

            <p>Best regards,<br><strong>AlphaHealth Admin Team</strong></p>
        `;

        return this.getBaseTemplate(content, 'Leave Request Update - AlphaHealth');
    }

    // Employee Account Creation Template
    getEmployeeCreationTemplate(employeeData, tempPassword = null) {
        const content = `
            <h2>Welcome to AlphaHealth! 👋</h2>
            <p>Dear <strong>${employeeData.name}</strong>,</p>
            
            <p>Your employee account has been created for the <strong>AlphaHealth Employee Management System</strong>.</p>
            
            <div class="credentials">
                <h3>Your Login Details:</h3>
                <p><strong>Email:</strong> ${employeeData.email}</p>
                ${tempPassword ? `<p><strong>Temporary Password:</strong> ${tempPassword}</p>` : ''}
                <p><strong>Employee ID:</strong> ${employeeData.employeeId}</p>
                <p><strong>Department:</strong> ${employeeData.department}</p>
                <p><strong>Position:</strong> ${employeeData.position}</p>
            </div>

            <div class="warning">
                <strong>Security Notice:</strong>
                <p>Please change your temporary password after first login for security purposes.</p>
            </div>

            <div style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}/login" class="btn">
                    Login to Your Account
                </a>
            </div>

            <p>Best regards,<br><strong>AlphaHealth HR Team</strong></p>
        `;

        return this.getBaseTemplate(content, 'Employee Account Created - AlphaHealth');
    }

    // Password Reset Template
    getPasswordResetTemplate(userData, resetLink) {
        const content = `
            <h2>Password Reset Request</h2>
            <p>Dear <strong>${userData.name}</strong>,</p>
            
            <p>We received a request to reset your password for your AlphaHealth account.</p>
            
            <div class="info-card">
                <p>Click the button below to reset your password:</p>
            </div>

            <div style="text-align: center;">
                <a href="${resetLink}" class="btn">
                    Reset Your Password
                </a>
            </div>

            <div class="warning">
                <strong>Important:</strong>
                <p>This password reset link will expire in 1 hour.</p>
                <p>If you didn't request this reset, please ignore this email.</p>
            </div>

            <p>Best regards,<br><strong>AlphaHealth Security Team</strong></p>
        `;

        return this.getBaseTemplate(content, 'Password Reset - AlphaHealth');
    }
}

module.exports = new EmailTemplates();