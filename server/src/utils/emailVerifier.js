const dns = require('dns');

class SimpleEmailVerifier {
    async verifyEmail(email) {
        try {
            // Basic format validation
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(email)) {
                return { valid: false, reason: 'Invalid email format' };
            }

            // Extract domain
            const domain = email.split('@')[1];
            
            // Check MX records
            const mxRecords = await this.checkMXRecords(domain);
            if (!mxRecords) {
                return { valid: false, reason: 'Domain does not accept emails (no MX records)' };
            }

            return { 
                valid: true, 
                reason: 'Email domain is valid',
                domain: domain,
                hasMX: true
            };

        } catch (error) {
            return { valid: false, reason: 'Verification failed: ' + error.message };
        }
    }

    checkMXRecords(domain) {
        return new Promise((resolve) => {
            dns.resolveMx(domain, (err, addresses) => {
                if (err || !addresses || addresses.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
            
            // Timeout after 2 seconds
            setTimeout(() => resolve(false), 2000);
        });
    }
}

module.exports = new SimpleEmailVerifier();