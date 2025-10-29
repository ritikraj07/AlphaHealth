class AdminSetup {
    constructor() {
        this.form = document.getElementById('setupForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.messageDiv = document.getElementById('message');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPasswordStrength();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        document.getElementById('password').addEventListener('input', (e) => {
            this.validatePasswordStrength(e.target.value);
            this.validateConfirmPassword();
        });

        document.getElementById('confirmPassword').addEventListener('input', () => {
            this.validateConfirmPassword();
        });

        document.getElementById('name').addEventListener('input', (e) => {
            this.validateField('name', e.target.value);
        });

        document.getElementById('email').addEventListener('input', (e) => {
            this.validateField('email', e.target.value);
        });
    }

    setupPasswordStrength() {
        this.passwordInput = document.getElementById('password');
        this.strengthBar = document.querySelector('.strength-bar');
    }

    validateField(fieldName, value) {
        const errorElement = document.getElementById(fieldName + 'Error');
        
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    this.showError(fieldName, 'Name must be at least 2 characters long');
                    return false;
                }
                break;
            case 'email':
                const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                if (!emailRegex.test(value)) {
                    this.showError(fieldName, 'Please enter a valid email address');
                    return false;
                }
                break;
        }

        this.clearError(fieldName);
        return true;
    }

    validatePasswordStrength(password) {
        let strength = 0;
        const bar = this.strengthBar;

        // Reset
        bar.className = 'strength-bar';
        bar.style.width = '0%';

        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (password.length > 0) {
            const width = Math.min((strength / 5) * 100, 100);
            bar.style.width = width + '%';
            
            if (strength <= 2) {
                bar.classList.add('strength-weak');
            } else if (strength <= 4) {
                bar.classList.add('strength-medium');
            } else {
                bar.classList.add('strength-strong');
            }
        }
    }

    validateConfirmPassword() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorElement = document.getElementById('confirmPasswordError');

        if (confirmPassword && password !== confirmPassword) {
            this.showError('confirmPassword', 'Passwords do not match');
            return false;
        } else {
            this.clearError('confirmPassword');
            return true;
        }
    }

    showError(field, message) {
        const errorElement = document.getElementById(field + 'Error');
        const inputElement = document.getElementById(field);
        
        errorElement.textContent = message;
        inputElement.classList.add('error');
    }

    clearError(field) {
        const errorElement = document.getElementById(field + 'Error');
        const inputElement = document.getElementById(field);
        
        errorElement.textContent = '';
        inputElement.classList.remove('error');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Validate all fields
        const isNameValid = this.validateField('name', data.name);
        const isEmailValid = this.validateField('email', data.email);
        const isPasswordValid = data.password.length >= 6;
        const isConfirmValid = this.validateConfirmPassword();

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }

        if (data.password !== data.confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        await this.createAdmin(data);
    }

    async createAdmin(data) {
        this.setLoading(true);

        try {
            // Get token from URL or use header
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            const response = await fetch('/api/setup/create-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Setup-Token': token || ''
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess(result);
            } else {
                this.showMessage(result.message || 'Setup failed', 'error');
                
                // Show specific field errors if available
                if (result.errors) {
                    result.errors.forEach(error => {
                        if (error.includes('email')) {
                            this.showError('email', 'Email already exists or invalid');
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Setup error:', error);
            this.showMessage('Network error. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const btnLoader = this.submitBtn.querySelector('.btn-loader');
        
        if (loading) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'flex';
            this.submitBtn.disabled = true;
        } else {
            btnText.style.display = 'block';
            btnLoader.style.display = 'none';
            this.submitBtn.disabled = false;
        }
    }

    showMessage(message, type) {
        this.messageDiv.textContent = message;
        this.messageDiv.className = `message-container message-${type}`;
        this.messageDiv.style.display = 'block';
        
        // Auto-hide success messages after 60 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.messageDiv.style.display = 'none';
            }, 60000);
        }
    }

    showSuccess(result) {
        this.showMessage('✅ ' + result.message, 'success');
        this.form.style.display = 'none';
        
        // Display token and credentials securely
        const successHTML = `
            <div class="message-success">
                <h3>Admin Account Created Successfully!</h3>
                <p><strong>Name:</strong> ${result.data.name}</p>
                <p><strong>Email:</strong> ${result.data.email}</p>
                <p><strong>Role:</strong> ${result.data.role}</p>
                <div class="token-info">
                    <p><strong>Your authentication token:</strong></p>
                    <code style="background: #e9ecef; padding: 8px; border-radius: 4px; display: block; margin: 8px 0; word-break: break-all;">
                        ${result.data.token}
                    </code>
                    <p style="font-size: 12px; color: #666;">Save this token securely for API authentication.</p>
                </div>
            </div>
        `;
        
        this.messageDiv.innerHTML = successHTML;
    }
    async validateEmailRealTime(email) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        const response = await fetch('/api/setup/verify-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Setup-Token': token || ''
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Email validation error:', error);
        return { valid: false, reason: 'Validation service unavailable' };
    }
}
}

console.log('🚀 Starting Admin Setup...');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminSetup();
});

