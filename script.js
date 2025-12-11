// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.previousElementSibling.tagName === 'INPUT' ? this.previousElementSibling : this.parentElement.querySelector('input');
        if (input.type === 'password') {
            input.type = 'text';
            this.textContent = '👁️‍🗨️';
        } else {
            input.type = 'password';
            this.textContent = '👁️';
        }
    });
});

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
}

// Show error message
function showError(input, message) {
    const errorMsg = input.parentElement.querySelector('.error-msg');
    if (errorMsg) {
        errorMsg.textContent = message;
        input.style.borderColor = '#e74c3c';
    }
}

// Clear error message
function clearError(input) {
    const errorMsg = input.parentElement.querySelector('.error-msg');
    if (errorMsg) {
        errorMsg.textContent = '';
        input.style.borderColor = '#ddd';
    }
}

// Show success message
function showSuccess(form, message) {
    const successMsg = form.querySelector('.success-msg');
    if (successMsg) {
        successMsg.textContent = message;
        setTimeout(() => successMsg.textContent = '', 3000);
    }
}

// Login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');
    
    // Load saved username
    const savedUsername = localStorage.getItem('savedUsername');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate username
        if (usernameInput.value.trim() === '') {
            showError(usernameInput, 'Username or email is required');
            isValid = false;
        } else {
            clearError(usernameInput);
        }
        
        // Validate password
        if (passwordInput.value === '') {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            clearError(passwordInput);
        }
        
        if (isValid) {
            const btn = this.querySelector('.btn');
            btn.classList.add('loading');
            
            // Save username if remember me is checked
            if (rememberCheckbox.checked) {
                localStorage.setItem('savedUsername', usernameInput.value);
            } else {
                localStorage.removeItem('savedUsername');
            }
            
            setTimeout(() => {
                btn.classList.remove('loading');
                showSuccess(this, 'Login successful!');
                
                // Store user session
                const userData = {
                    username: usernameInput.value,
                    userId: 'user_' + Date.now(),
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                
                setTimeout(() => window.location.href = 'index.html', 1000);
            }, 1500);
        }
    });
}

// Register form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    
    // Password strength indicator
    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        const colors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60'];
        const texts = ['Weak', 'Fair', 'Good', 'Strong'];
        const widths = ['25%', '50%', '75%', '100%'];
        
        if (this.value === '') {
            strengthFill.style.width = '0';
            strengthText.textContent = '';
        } else {
            strengthFill.style.width = widths[strength - 1] || '25%';
            strengthFill.style.background = colors[strength - 1] || colors[0];
            strengthText.textContent = texts[strength - 1] || texts[0];
            strengthText.style.color = colors[strength - 1] || colors[0];
        }
    });
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate full name
        if (fullnameInput.value.trim() === '') {
            showError(fullnameInput, 'Full name is required');
            isValid = false;
        } else if (fullnameInput.value.trim().length < 3) {
            showError(fullnameInput, 'Name must be at least 3 characters');
            isValid = false;
        } else {
            clearError(fullnameInput);
        }
        
        // Validate email
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(emailInput);
        }
        
        // Validate username
        if (usernameInput.value.trim() === '') {
            showError(usernameInput, 'Username is required');
            isValid = false;
        } else if (usernameInput.value.length < 4) {
            showError(usernameInput, 'Username must be at least 4 characters');
            isValid = false;
        } else {
            clearError(usernameInput);
        }
        
        // Validate password
        if (passwordInput.value === '') {
            showError(passwordInput, 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters');
            isValid = false;
        } else {
            clearError(passwordInput);
        }
        
        // Validate confirm password
        if (confirmPasswordInput.value === '') {
            showError(confirmPasswordInput, 'Please confirm your password');
            isValid = false;
        } else if (confirmPasswordInput.value !== passwordInput.value) {
            showError(confirmPasswordInput, 'Passwords do not match');
            isValid = false;
        } else {
            clearError(confirmPasswordInput);
        }
        
        // Validate terms
        if (!termsCheckbox.checked) {
            alert('Please agree to the Terms & Conditions');
            isValid = false;
        }
        
        if (isValid) {
            const btn = this.querySelector('.btn');
            btn.classList.add('loading');
            
            setTimeout(() => {
                btn.classList.remove('loading');
                showSuccess(this, 'Registration successful!');
                
                // Store user session
                const userData = {
                    username: usernameInput.value,
                    fullname: fullnameInput.value,
                    email: emailInput.value,
                    userId: 'user_' + Date.now(),
                    loginTime: new Date().toISOString()
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                
                setTimeout(() => window.location.href = 'index.html', 1500);
            }, 1500);
        }
    });
}
