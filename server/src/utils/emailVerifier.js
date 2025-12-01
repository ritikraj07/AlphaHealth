// ================================================================
// 📧 Simple Email Verifier (Using DNS MX Records)
// ================================================================
// This class helps check whether an email is *likely* valid.
// We do 2 levels of verification:
//
// 1️⃣ Basic format check (regex) → Is email written correctly?
// 2️⃣ DNS MX lookup → Does the email domain actually receive emails?
//
// Example: gmail.com, outlook.com have MX records
//          randomdomain123.xyz likely will NOT
//
// Note: This does NOT guarantee email exists, but checks domain legitimacy.
// ================================================================

const dns = require('dns'); // Built-in Node.js module for DNS queries

class SimpleEmailVerifier {

    // ------------------------------------------------------------
    // 🔍 verifyEmail(email)
    // ------------------------------------------------------------
    // ✔ Validates email format using regex
    // ✔ Extracts domain (part after '@')
    // ✔ Checks if domain has MX records (mail servers)
    // ------------------------------------------------------------
    // Returns example:
    // { valid: true, reason: "Email domain is valid", domain: "gmail.com", hasMX: true }
    // ------------------------------------------------------------
    async verifyEmail(email) {
        try {

            // 1️⃣ Check email structure using regex
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(email)) {
                return { valid: false, reason: 'Invalid email format' };
            }

            // 2️⃣ Extract the domain part (everything after @)
            const domain = email.split('@')[1];

            // 3️⃣ Check if domain has MX records via DNS lookup
            const mxRecords = await this.checkMXRecords(domain);

            if (!mxRecords) {
                return { valid: false, reason: 'Domain does not accept emails (no MX records)' };
            }

            // If all checks passed → Email domain is valid
            return {
                valid: true,
                reason: 'Email domain is valid',
                domain: domain,
                hasMX: true
            };

        } catch (error) {
            // Any runtime failure
            return { valid: false, reason: 'Verification failed: ' + error.message };
        }
    }

    // ------------------------------------------------------------
    // 📨 checkMXRecords(domain)
    // ------------------------------------------------------------
    // MX = Mail Exchange Records
    // If a domain has MX → It can receive emails
    //
    // Uses dns.resolveMx() wrapped in Promise for async support.
    // Timeout 2 sec for slow DNS response → Prevents API hanging.
    // ------------------------------------------------------------
    checkMXRecords(domain) {
        return new Promise((resolve) => {

            dns.resolveMx(domain, (err, addresses) => {
                // If error OR no MX servers found → domain cannot receive mail
                if (err || !addresses || addresses.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });

            // If no response after 2 seconds → fail automatically
            setTimeout(() => resolve(false), 2000);
        });
    }
}


// =============================================================
// 📤 Export instance of class (ready to use anywhere)
// -------------------------------------------------------------
// Usage:
// const emailVerify = require("./emailVerifier");
// emailVerify.verifyEmail("test@gmail.com").then(console.log);
// =============================================================
module.exports = new SimpleEmailVerifier();

