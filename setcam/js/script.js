// User Management System
let users = JSON.parse(localStorage.getItem('setcam_users')) || [];
let currentUser = JSON.parse(localStorage.getItem('setcam_currentUser')) || null;
let appointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
let pendingVerifications = JSON.parse(localStorage.getItem('setcam_pending_verifications')) || [];

// Enhanced User-Specific Notification System
let userNotifications = JSON.parse(localStorage.getItem('setcam_user_notifications')) || {};
let notificationSettings = JSON.parse(localStorage.getItem('setcam_notification_settings')) || {
    sound: true,
    desktop: true,
    email: true,
    appointmentReminders: true,
    paymentUpdates: true,
    systemAlerts: true,
    adminNotifications: true
};

// System Settings
let systemSettings = JSON.parse(localStorage.getItem('setcam_system_settings')) || {
    businessHours: {
        opening: "08:00",
        closing: "17:00"
    },
    pricing: {
        motorcycles: 500,
        fourWheels: 600,
        sixWheels: 600
    },
    notifications: {
        email: true,
    }
};

// Email Verification System
let verificationTimer = null;
let verificationTimeLeft = 300;
let isSendingVerification = false;

// Initialize with default admin user if none exists
function initializeDefaultAdmin() {
    if (users.length === 0) {
        const defaultAdmin = {
            id: 1,
            fullname: 'Admin User',
            email: 'admin@setcam.com',
            password: 'admin123',
            role: 'admin',
            emailVerified: true,
            createdAt: new Date().toISOString(),
            active: true
        };
        users.push(defaultAdmin);
        localStorage.setItem('setcam_users', JSON.stringify(users));
        console.log('Default admin user created');
    } else {
        // Ensure existing admin users have active property
        const adminUser = users.find(u => u.role === 'admin');
        if (adminUser && adminUser.active === undefined) {
            adminUser.active = true;
            localStorage.setItem('setcam_users', JSON.stringify(users));
            console.log('Updated existing admin with active property');
        }
    }
}

// Check if user has active appointment
function hasActiveAppointment(userId) {
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    return currentAppointments.some(apt => 
        apt.userId === userId && 
        apt.status !== 'completed' && 
        apt.status !== 'rejected' &&
        apt.status !== 'cancelled'
    );
}

// Get user's active appointment
function getActiveAppointment(userId) {
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    return currentAppointments.find(apt => 
        apt.userId === userId && 
        apt.status !== 'completed' && 
        apt.status !== 'rejected' &&
        apt.status !== 'cancelled'
    );
}

// Check for time slot conflicts - FIXED VERSION
function hasTimeConflict(date, time) {
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    return currentAppointments.some(apt => {
        // Check if same date and time
        if (apt.date === date && apt.time === time) {
            // Only consider appointments that are active
            const isActiveAppointment = !['completed', 'rejected', 'cancelled'].includes(apt.status);
            return isActiveAppointment;
        }
        return false;
    });
}

// Check appointment cooldown for rejected appointments - FIXED VERSION
function hasAppointmentCooldown(userId) {
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const userAppointments = currentAppointments.filter(apt => apt.userId === userId);
    
    // Find the most recent rejected appointment
    const rejectedAppointments = userAppointments
        .filter(apt => apt.status === 'rejected')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (rejectedAppointments.length > 0) {
        const lastRejected = rejectedAppointments[0];
        const rejectedDate = new Date(lastRejected.createdAt);
        const now = new Date();
        const hoursDiff = (now - rejectedDate) / (1000 * 60 * 60);
        
        // If less than 24 hours since last rejection
        if (hoursDiff < 24) {
            const hoursLeft = Math.ceil(24 - hoursDiff);
            return {
                hasCooldown: true,
                hoursLeft: hoursLeft,
                lastRejected: lastRejected
            };
        }
    }
    
    return { hasCooldown: false };
}

// Validate password strength
function isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
}

// Password strength indicator
function setupPasswordStrength() {
    const passwordInput = document.getElementById('signup-password');
    if (!passwordInput) return;

    // Create strength indicator if it doesn't exist
    if (!document.getElementById('password-strength')) {
        const indicator = document.createElement('div');
        indicator.id = 'password-strength';
        indicator.className = 'password-strength';
        passwordInput.parentNode.appendChild(indicator);
    }

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strengthIndicator = document.getElementById('password-strength');
        const strength = calculatePasswordStrength(password);
        
        strengthIndicator.textContent = strength.text;
        strengthIndicator.className = `password-strength strength-${strength.level}`;
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    switch(score) {
        case 0:
        case 1:
        case 2:
            return { level: 'weak', text: 'Weak password' };
        case 3:
        case 4:
            return { level: 'medium', text: 'Medium strength' };
        case 5:
            return { level: 'strong', text: 'Strong password' };
        default:
            return { level: 'weak', text: 'Weak password' };
    }
}

// Password hide/unhide functionality
function setupPasswordToggle() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        // Check if already has toggle button
        if (input.parentNode.querySelector('.password-toggle')) {
            return;
        }
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.right = '10px';
        toggleBtn.style.top = '50%';
        toggleBtn.style.transform = 'translateY(-50%)';
        toggleBtn.style.background = 'none';
        toggleBtn.style.border = 'none';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.color = '#666';
        toggleBtn.className = 'password-toggle';
        
        wrapper.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', function() {
            if (input.type === 'password') {
                input.type = 'text';
                toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            } else {
                input.type = 'password';
                toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
            }
        });
        
        // Add padding to input for the toggle button
        input.style.paddingRight = '40px';
    });
}

// Time conflict detection
function setupTimeValidation() {
    const dateInput = document.getElementById('preferred-date');
    const timeInput = document.getElementById('preferred-time');
    
    if (!dateInput || !timeInput) return;
    
    // Create conflict warning element
    const warningElement = document.createElement('div');
    warningElement.className = 'time-conflict-warning';
    warningElement.style.display = 'none';
    warningElement.style.color = '#dc3545';
    warningElement.style.fontSize = '0.9rem';
    warningElement.style.marginTop = '0.5rem';
    timeInput.parentNode.appendChild(warningElement);
    
    function checkTimeConflict() {
        const date = dateInput.value;
        const time = timeInput.value;
        
        if (!date || !time) return;
        
        if (hasTimeConflict(date, time)) {
            warningElement.textContent = 'This time slot is already booked. Please choose a different time.';
            warningElement.style.display = 'block';
        } else {
            warningElement.style.display = 'none';
        }
    }
    
    dateInput.addEventListener('change', checkTimeConflict);
    timeInput.addEventListener('change', checkTimeConflict);
}

// Enhanced appointment validation
function validateAppointmentForm() {
    const requiredFields = [
        'owner-name', 'contact-number', 'plate-number', 
        'vehicle-make', 'vehicle-model', 'year', 'preferred-date', 'preferred-time'
    ];
    
    let emptyFields = [];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            emptyFields.push(fieldId.replace(/-/g, ' '));
        }
    });
    
    if (emptyFields.length > 0) {
        return { valid: false, message: `Please fill in the following fields: ${emptyFields.join(', ')}` };
    }
    
    const date = document.getElementById('preferred-date').value;
    const time = document.getElementById('preferred-time').value;
    
    // Check if date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        return { valid: false, message: 'Please select a future date.' };
    }
    
    // Check time conflict
    if (hasTimeConflict(date, time)) {
        return { valid: false, message: 'This time slot is already booked. Please choose a different time.' };
    }
    
    return { valid: true };
}

// Validate appointment before proceeding to payment
function validateAppointment(date, time) {
    // Reload the latest appointments data
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    
    // Check for time conflict
    if (hasTimeConflict(date, time)) {
        return {
            valid: false,
            message: 'This time slot is already booked. Please choose a different time.'
        };
    }
    
    // Check if user already has active appointment
    if (hasActiveAppointment(currentUser.id)) {
        const activeAppointment = getActiveAppointment(currentUser.id);
        return {
            valid: false,
            message: `You already have an active appointment (Reference: ${activeAppointment.reference}). Please wait for it to be completed.`
        };
    }
    
    // Check for appointment cooldown - FIXED: Properly check cooldown
    const cooldownCheck = hasAppointmentCooldown(currentUser.id);
    if (cooldownCheck.hasCooldown) {
        return {
            valid: false,
            message: `You cannot book a new appointment yet. Please wait ${cooldownCheck.hoursLeft} more hours since your last appointment was rejected.`
        };
    }
    
    return { valid: true };
}

// Generate random verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email via SMTP
async function sendVerificationEmail(email, verificationCode, name = 'User') {
    if (isSendingVerification) {
        return false;
    }
    
    isSendingVerification = true;
    console.log(`Sending verification email to: ${email}`);
    
    try {
        const response = await fetch('send_verification.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                code: verificationCode,
                name: name
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Store the verification code
            const pendingVerification = {
                email: email,
                code: verificationCode,
                expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                createdAt: new Date().toISOString()
            };
            
            pendingVerifications = pendingVerifications.filter(v => v.email !== email);
            pendingVerifications.push(pendingVerification);
            localStorage.setItem('setcam_pending_verifications', JSON.stringify(pendingVerifications));
            
            // If in local mode, show the code on screen
            if (result.local_mode) {
                showVerificationCodeOnScreen(email, verificationCode, result.message);
            } else {
                showEmailSentConfirmation(email);
            }
            
            isSendingVerification = false;
            return true;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Email sending failed:', error);
        // Fallback to local simulation
        const result = sendVerificationEmailLocal(email, verificationCode, name);
        isSendingVerification = false;
        return result;
    }
}

// Local fallback for email verification
function sendVerificationEmailLocal(email, verificationCode, name = 'User') {
    console.log('Using local email simulation for:', email);
    
    const pendingVerification = {
        email: email,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        createdAt: new Date().toISOString()
    };
    
    pendingVerifications = pendingVerifications.filter(v => v.email !== email);
    pendingVerifications.push(pendingVerification);
    localStorage.setItem('setcam_pending_verifications', JSON.stringify(pendingVerifications));
    
    showVerificationCodeOnScreen(email, verificationCode, 'SMTP not configured - using local simulation');
    return true;
}

// Show verification code on screen for testing/local development
function showVerificationCodeOnScreen(email, verificationCode, message = '') {
    // Remove existing test helper
    const existingHelper = document.getElementById('email-test-helper');
    if (existingHelper) {
        existingHelper.remove();
    }
    
    const testHelper = document.createElement('div');
    testHelper.id = 'email-test-helper';
    testHelper.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        border-left: 5px solid #ff5252;
    `;
    
    testHelper.innerHTML = `
        <h4 style="margin: 0 0 10px 0; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-envelope"></i> Email Verification (Local Mode)
        </h4>
        <p style="margin: 0 0 10px 0; font-size: 0.9rem;">${message}</p>
        <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 5px; text-align: center;">
            <strong style="font-size: 1.2rem; letter-spacing: 2px;">${verificationCode}</strong>
        </div>
        <p style="margin: 10px 0 0 0; font-size: 0.8rem; opacity: 0.9;">
            Sent to: ${email}<br>
            This appears because you're running in localhost mode.
        </p>
    `;
    
    document.body.appendChild(testHelper);
}

// Show email sent confirmation
function showEmailSentConfirmation(email) {
    // Remove existing test helper
    const existingHelper = document.getElementById('email-test-helper');
    if (existingHelper) {
        existingHelper.remove();
    }
    
    const testHelper = document.createElement('div');
    testHelper.id = 'email-test-helper';
    testHelper.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        border-left: 5px solid #218838;
    `;
    
    testHelper.innerHTML = `
        <h4 style="margin: 0 0 10px 0; display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle"></i> Email Sent Successfully!
        </h4>
        <p style="margin: 0 0 10px 0; font-size: 0.9rem;">
            Verification code has been sent to your email address.
        </p>
        <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 5px;">
            <strong>${email}</strong>
        </div>
        <p style="margin: 10px 0 0 0; font-size: 0.8rem; opacity: 0.9;">
            Please check your inbox and spam folder.
        </p>
    `;
    
    document.body.appendChild(testHelper);
}

// Start verification countdown timer
function startVerificationTimer() {
    verificationTimeLeft = 300;
    updateTimerDisplay();
    
    if (verificationTimer) {
        clearInterval(verificationTimer);
    }
    
    verificationTimer = setInterval(() => {
        verificationTimeLeft--;
        updateTimerDisplay();
        
        if (verificationTimeLeft <= 0) {
            clearInterval(verificationTimer);
            const verifyBtn = document.getElementById('verify-code-btn');
            const resendBtn = document.getElementById('resend-code-btn');
            if (verifyBtn) verifyBtn.disabled = true;
            if (resendBtn) resendBtn.disabled = false;
            
            // Show expiration message
            const timerElement = document.getElementById('countdown-timer');
            if (timerElement) {
                timerElement.style.color = '#dc3545';
                timerElement.textContent = 'EXPIRED';
            }
            
            alert('Verification code has expired. Please request a new one.');
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(verificationTimeLeft / 60);
    const seconds = verificationTimeLeft % 60;
    const timerElement = document.getElementById('countdown-timer');
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (verificationTimeLeft <= 60) {
            timerElement.style.color = '#dc3545';
        } else if (verificationTimeLeft <= 120) {
            timerElement.style.color = '#ffc107';
        } else {
            timerElement.style.color = '#28a745';
        }
    }
}

// Show email verification modal
async function showEmailVerification(email, name = 'User') {
    const modal = document.getElementById('email-verification-modal');
    const emailElement = document.getElementById('verification-email');
    
    if (emailElement) {
        emailElement.textContent = email;
    }
    
    const verificationCode = generateVerificationCode();
    
    // Show loading state
    const verifyBtn = document.getElementById('verify-code-btn');
    const resendBtn = document.getElementById('resend-code-btn');
    if (verifyBtn) verifyBtn.disabled = true;
    if (resendBtn) resendBtn.disabled = true;
    
    // Send verification email
    await sendVerificationEmail(email, verificationCode, name);
    
    startVerificationTimer();
    
    modal.style.display = 'flex';
    
    if (verifyBtn) verifyBtn.disabled = false;
    if (resendBtn) resendBtn.disabled = false;
}

// Close email verification modal
function closeEmailVerification() {
    const modal = document.getElementById('email-verification-modal');
    modal.style.display = 'none';
    
    if (verificationTimer) {
        clearInterval(verificationTimer);
    }
    
    document.getElementById('verification-code').value = '';
    
    // Remove test helper if exists
    const testHelper = document.getElementById('email-test-helper');
    if (testHelper) {
        testHelper.remove();
    }
}

// Verify email code
function verifyEmailCode() {
    const code = document.getElementById('verification-code').value.trim();
    const email = document.getElementById('verification-email').textContent;
    
    if (!code) {
        alert('Please enter the verification code.');
        return;
    }
    
    if (code.length !== 6) {
        alert('Please enter a valid 6-digit code.');
        return;
    }
    
    const verification = pendingVerifications.find(v => v.email === email);
    
    if (!verification) {
        alert('No verification request found. Please try signing up again.');
        return;
    }
    
    if (new Date() > new Date(verification.expiresAt)) {
        alert('Verification code has expired. Please request a new one.');
        return;
    }
    
    if (verification.code !== code) {
        alert('Invalid verification code. Please try again.');
        return;
    }
    
    completeUserRegistration(email);
}

// Complete user registration after email verification
function completeUserRegistration(email) {
    const pendingUserData = localStorage.getItem('setcam_pending_user');
    if (!pendingUserData) {
        alert('Registration data not found. Please try signing up again.');
        return;
    }
    
    const userData = JSON.parse(pendingUserData);
    
    const newUser = {
        id: users.length + 1,
        fullname: userData.fullname,
        email: userData.email,
        password: userData.password,
        role: 'user',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        appointments: 0,
        active: true
    };
    
    users.push(newUser);
    localStorage.setItem('setcam_users', JSON.stringify(users));
    
    localStorage.removeItem('setcam_pending_user');
    pendingVerifications = pendingVerifications.filter(v => v.email !== email);
    localStorage.setItem('setcam_pending_verifications', JSON.stringify(pendingVerifications));
    
    if (verificationTimer) {
        clearInterval(verificationTimer);
    }
    
    closeEmailVerification();
    
    alert('Email verified successfully! Your account has been created.');
    switchAuthTab('login');
    document.getElementById('login-email').value = email;
    
    // Clear signup form
    document.getElementById('signup-fullname').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm').value = '';
    
    // Remove test helper
    const testHelper = document.getElementById('email-test-helper');
    if (testHelper) {
        testHelper.remove();
    }
    
    // Show welcome notification to the new user
    showNotification(
        '🎉 Welcome to SETCAM!',
        'Your account has been successfully created and verified.',
        'success',
        5000,
        false,
        newUser.id // Target the specific new user
    );
}

// Resend verification code
async function resendVerificationCode() {
    if (isSendingVerification) {
        alert('Please wait while we send the previous verification code.');
        return;
    }

    const email = document.getElementById('verification-email').textContent;
    const pendingUserData = localStorage.getItem('setcam_pending_user');
    const userData = pendingUserData ? JSON.parse(pendingUserData) : { fullname: 'User' };
    
    if (!email) {
        alert('No email found. Please try signing up again.');
        return;
    }
    
    const verificationCode = generateVerificationCode();
    
    // Disable buttons during sending
    const verifyBtn = document.getElementById('verify-code-btn');
    const resendBtn = document.getElementById('resend-code-btn');
    if (verifyBtn) verifyBtn.disabled = true;
    if (resendBtn) resendBtn.disabled = true;
    
    await sendVerificationEmail(email, verificationCode, userData.fullname);
    
    startVerificationTimer();
    
    if (verifyBtn) verifyBtn.disabled = false;
    if (resendBtn) resendBtn.disabled = false;
    
    alert('New verification code sent! Please check your email.');
}

// Payment method selection
function setupPaymentMethods() {
    const paymentCards = document.querySelectorAll('.payment-method-card');
    
    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            paymentCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
        });
    });
}

// Update payment amounts across all methods
function updatePaymentAmounts(amount) {
    const paymentAmount = document.getElementById('payment-amount');
    const gcashAmount = document.getElementById('gcash-amount');
    const bankAmount = document.getElementById('bank-amount');
    const otcAmount = document.getElementById('otc-amount');
    
    if (paymentAmount) paymentAmount.textContent = amount;
    if (gcashAmount) gcashAmount.textContent = amount;
    if (bankAmount) bankAmount.textContent = amount;
    if (otcAmount) otcAmount.textContent = amount;
}

// Load system settings
function loadSystemSettings() {
    const openingTime = document.getElementById('opening-time');
    const closingTime = document.getElementById('closing-time');
    if (openingTime) openingTime.value = systemSettings.businessHours.opening;
    if (closingTime) closingTime.value = systemSettings.businessHours.closing;
    
    const motorcyclesPrice = document.getElementById('motorcycles-price');
    const fourWheelsPrice = document.getElementById('four-wheels-price');
    const sixWheelsPrice = document.getElementById('six-wheels-price');
    if (motorcyclesPrice) motorcyclesPrice.value = systemSettings.pricing.motorcycles;
    if (fourWheelsPrice) fourWheelsPrice.value = systemSettings.pricing.fourWheels;
    if (sixWheelsPrice) sixWheelsPrice.value = systemSettings.pricing.sixWheels;
    
    const emailNotifications = document.getElementById('email-notifications');
    if (emailNotifications) emailNotifications.checked = systemSettings.notifications.email;
}

// Save system settings
function saveSystemSettings() {
    const openingTime = document.getElementById('opening-time');
    const closingTime = document.getElementById('closing-time');
    const motorcyclesPrice = document.getElementById('motorcycles-price');
    const fourWheelsPrice = document.getElementById('four-wheels-price');
    const sixWheelsPrice = document.getElementById('six-wheels-price');
    const emailNotifications = document.getElementById('email-notifications');
    
    if (openingTime) systemSettings.businessHours.opening = openingTime.value;
    if (closingTime) systemSettings.businessHours.closing = closingTime.value;
    
    if (motorcyclesPrice) systemSettings.pricing.motorcycles = parseInt(motorcyclesPrice.value) || 500;
    if (fourWheelsPrice) systemSettings.pricing.fourWheels = parseInt(fourWheelsPrice.value) || 600;
    if (sixWheelsPrice) systemSettings.pricing.sixWheels = parseInt(sixWheelsPrice.value) || 600;
    
    if (emailNotifications) systemSettings.notifications.email = emailNotifications.checked;
    
    localStorage.setItem('setcam_system_settings', JSON.stringify(systemSettings));
    alert('System settings saved successfully!');
}

// Reset system settings to default
function resetSystemSettings() {
    if (!confirm('Are you sure you want to reset all settings to default?')) return;
    
    systemSettings = {
        businessHours: {
            opening: "08:00",
            closing: "17:00"
        },
        pricing: {
            motorcycles: 500,
            fourWheels: 600,
            sixWheels: 600
        },
        notifications: {
            email: true,
        }
    };
    
    localStorage.setItem('setcam_system_settings', JSON.stringify(systemSettings));
    loadSystemSettings();
    alert('System settings reset to default!');
}

// ============================================================================
// FIXED IMAGE PREVIEW FUNCTIONALITY
// ============================================================================

// Enhanced Image Preview functionality - FIXED: Proper image preview for upload receipt
function setupImagePreview() {
    // Add click event delegation for all clickable images
    document.addEventListener('click', function(e) {
        // Check if clicked element is a clickable image or inside a preview container
        const target = e.target;
        
        if (target.classList.contains('clickable-image') || 
            target.closest('.preview-image-container') || 
            target.classList.contains('preview-overlay') ||
            target.closest('.preview-overlay')) {
            
            let imgElement;
            let container;
            
            if (target.classList.contains('clickable-image')) {
                imgElement = target;
            } else {
                container = target.closest('.preview-image-container');
                if (container) {
                    imgElement = container.querySelector('img.clickable-image');
                }
            }
            
            if (imgElement && imgElement.src) {
                openImagePreview(imgElement.src);
            }
        }
    });
}

// FIXED: Image preview modal that doesn't break scroll
function openImagePreview(src) {
    const modal = document.getElementById('image-preview-modal');
    const previewImg = document.getElementById('image-preview');
    
    if (modal && previewImg) {
        previewImg.src = src;
        modal.classList.add('active');
        // FIX: Only hide overflow on body, not html to preserve scrollbar
        document.body.style.overflow = 'hidden';
    }
}

function closeImagePreview() {
    const modal = document.getElementById('image-preview-modal');
    if (modal) {
        modal.classList.remove('active');
        // FIX: Restore overflow on body only
        document.body.style.overflow = '';
        
        // Clear the src to free memory
        const previewImg = document.getElementById('image-preview');
        if (previewImg) {
            previewImg.src = '';
        }
    }
}

// Add ESC key handler for image preview
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImagePreview();
    }
});

// ============================================================================
// FIXED UPLOAD RECEIPT STATUS RESET WITH PROPER IMAGE PREVIEW
// ============================================================================

// Enhanced file upload with better image preview and status reset
function setupFileUpload() {
    const receiptFile = document.getElementById('receipt-file');
    const selectFileBtn = document.getElementById('select-file-btn');
    const uploadArea = document.getElementById('upload-area');
    const filePreview = document.getElementById('file-preview');
    const previewImage = document.getElementById('preview-image');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const fileType = document.getElementById('file-type');
    const uploadReceiptBtn = document.getElementById('upload-receipt-btn');
    const changeFileBtn = document.getElementById('change-file-btn');
    const uploadStatus = document.getElementById('upload-status');
    const confirmationCheckbox = document.getElementById('confirmation-checkbox');
    const receiptConfirm = document.getElementById('receipt-confirm');

    if (!receiptFile) return;

    // FIXED: Reset upload status when initializing
    resetUploadStatus();

    // Set up select file button
    if (selectFileBtn) {
        selectFileBtn.addEventListener('click', () => receiptFile.click());
    }
    
    // Set up file input change
    receiptFile.addEventListener('change', handleFileSelect);
    
    // Set up drag and drop
    if (uploadArea) {
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('drop', handleFileDrop);
    }
    
    // Enable/disable upload button based on confirmation
    if (receiptConfirm) {
        receiptConfirm.addEventListener('change', function() {
            if (uploadReceiptBtn) {
                uploadReceiptBtn.disabled = !this.checked;
            }
        });
    }
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) processFile(file);
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        if (uploadArea) uploadArea.classList.add('dragover');
    }
    
    function handleFileDrop(e) {
        e.preventDefault();
        if (uploadArea) uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    }
    
    function processFile(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Please select an image (JPEG, PNG, GIF) or PDF file.');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            return;
        }
        
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';
        if (fileType) fileType.textContent = file.type.split('/')[1].toUpperCase();
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (previewImage) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    previewImage.classList.add('clickable-image');
                    
                    // FIXED: Ensure the preview image container has proper click handling
                    const previewContainer = previewImage.closest('.preview-image-container');
                    if (previewContainer) {
                        previewContainer.style.cursor = 'pointer';
                        
                        // Remove any existing click listeners to prevent duplicates
                        previewContainer.removeEventListener('click', handlePreviewClick);
                        previewContainer.addEventListener('click', handlePreviewClick);
                    }
                }
                // Show confirmation checkbox for images
                if (confirmationCheckbox) {
                    confirmationCheckbox.style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        } else {
            if (previewImage) {
                previewImage.src = '';
                previewImage.style.display = 'none';
                previewImage.classList.remove('clickable-image');
            }
            // Hide confirmation checkbox for PDFs since we can't preview them
            if (confirmationCheckbox) {
                confirmationCheckbox.style.display = 'none';
            }
        }
        
        if (uploadArea) uploadArea.style.display = 'none';
        if (filePreview) filePreview.style.display = 'block';
        
        // Reset confirmation
        if (receiptConfirm) {
            receiptConfirm.checked = false;
            if (uploadReceiptBtn) uploadReceiptBtn.disabled = true;
        }
        
        window.currentReceiptFile = file;
    }
    
    // FIXED: Handle preview image click specifically for upload receipt
    function handlePreviewClick() {
        const previewImg = document.getElementById('preview-image');
        if (previewImg && previewImg.src) {
            openImagePreview(previewImg.src);
        }
    }
    
    // In the setupFileUpload() function, after successful upload:
    if (uploadReceiptBtn) {
        uploadReceiptBtn.addEventListener('click', function() {
            const file = window.currentReceiptFile;
            if (!file) {
                alert('Please select a file first.');
                return;
            }

        // Check if this is a new appointment or existing one
        const tempAppointment = JSON.parse(localStorage.getItem('setcam_temp_appointment'));
        if (!tempAppointment) {
            alert('No appointment found. Please start a new appointment booking.');
            return;
        }

        // Show loading state
        uploadReceiptBtn.innerHTML = '<div class="loading-spinner"></div> Uploading...';
        uploadReceiptBtn.disabled = true;
        
        // Simulate upload process
        setTimeout(() => {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Get current appointments
                const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
                
                // Check if appointment already exists (for duplicate prevention)
                const existingAppointment = currentAppointments.find(apt => 
                    apt.reference === tempAppointment.reference
                );
                
                if (existingAppointment) {
                    // Update existing appointment
                    existingAppointment.receipt = e.target.result;
                    existingAppointment.receiptFileName = file.name;
                    existingAppointment.receiptUploadedAt = new Date().toISOString();
                    existingAppointment.status = 'pending_approval';
                } else {
                    // Create new appointment
                    const newAppointment = {
                        ...tempAppointment,
                        id: currentAppointments.length + 1,
                        status: 'pending_approval',
                        receipt: e.target.result,
                        receiptFileName: file.name,
                        receiptUploadedAt: new Date().toISOString()
                    };
                    currentAppointments.push(newAppointment);
                }
                
                localStorage.setItem('setcam_appointments', JSON.stringify(currentAppointments));
                
                // FIXED: Clear temp appointment after successful upload
                localStorage.removeItem('setcam_temp_appointment');
                
                console.log('Receipt uploaded for appointment:', tempAppointment.reference);
                
                // Hide file preview and show success message
                if (filePreview) filePreview.style.display = 'none';
                if (uploadStatus) uploadStatus.style.display = 'block';
                
                window.currentReceiptFile = null;
                if (receiptFile) receiptFile.value = '';
                
                // Reset button state
                uploadReceiptBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Receipt';
                uploadReceiptBtn.disabled = false;
                
                // Notify admins about receipt upload
                notifyAdminsAboutReceiptUpload();
            };
            reader.readAsDataURL(file);
        }, 2000);
    });
}
    
    if (changeFileBtn) {
        changeFileBtn.addEventListener('click', function() {
            if (receiptFile) receiptFile.value = '';
            window.currentReceiptFile = null;
            if (filePreview) filePreview.style.display = 'none';
            if (uploadArea) uploadArea.style.display = 'block';
            if (confirmationCheckbox) {
                confirmationCheckbox.style.display = 'none';
            }
            if (receiptConfirm) {
                receiptConfirm.checked = false;
            }
        });
    }
}

// FIXED: Reset upload status when navigating to upload page
function resetUploadStatus() {
    const uploadArea = document.getElementById('upload-area');
    const filePreview = document.getElementById('file-preview');
    const uploadStatus = document.getElementById('upload-status');
    const receiptFile = document.getElementById('receipt-file');
    
    if (uploadArea) uploadArea.style.display = 'block';
    if (filePreview) filePreview.style.display = 'none';
    if (uploadStatus) uploadStatus.style.display = 'none';
    if (receiptFile) receiptFile.value = '';
    
    window.currentReceiptFile = null;
}

/// ============================================================================
// ENHANCED LOCALHOST WARNING MODAL
// ============================================================================

// Show localhost warning modal - ENHANCED: Added beautiful modal design
function showLocalhostWarning() {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname === '';
    
    if (isLocalhost) {
        // Check if warning was already dismissed
        if (localStorage.getItem('localhost_warning_dismissed')) {
            return;
        }
        
        // Create and show localhost warning modal
        const warningModal = document.createElement('div');
        warningModal.id = 'localhost-warning-modal';
        warningModal.className = 'localhost-warning-modal';
        warningModal.innerHTML = `
            <div class="localhost-warning-content">
                <div class="localhost-warning-icon">
                    <i class="fas fa-laptop-code"></i>
                </div>
                <h2 class="localhost-warning-title">Development Mode Active</h2>
                <p class="localhost-warning-message">
                    You are currently running the SETCAM application in localhost mode. 
                    Some features like email sending and real payment processing are simulated for testing purposes.
                </p>
                
                <div class="localhost-features">
                    <h4><i class="fas fa-info-circle"></i> Local Mode Features:</h4>
                    <ul>
                        <li>Email verification codes displayed on screen</li>
                        <li>Payment processing is simulated (no real transactions)</li>
                        <li>All data stored in browser localStorage</li>
                        <li>Full functionality available for testing</li>
                        <li>Admin login: admin@setcam.com / admin123</li>
                    </ul>
                </div>
                
                <div class="localhost-warning-actions">
                    <button class="localhost-warning-btn primary" onclick="closeLocalhostWarning(true)">
                        <i class="fas fa-rocket"></i> Got It, Let's Go!
                    </button>
                    <button class="localhost-warning-btn secondary" onclick="showLocalhostHelp()">
                        <i class="fas fa-question-circle"></i> Need Help?
                    </button>
                </div>
                
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #eee;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #666; cursor: pointer;">
                        <input type="checkbox" id="dont-show-again">
                        Don't show this message again
                    </label>
                </div>
            </div>
        `;
        
        document.body.appendChild(warningModal);
        
        // Add ESC key listener to close modal
        document.addEventListener('keydown', function localhostKeyHandler(e) {
            if (e.key === 'Escape') {
                closeLocalhostWarning(false);
                document.removeEventListener('keydown', localhostKeyHandler);
            }
        });
    }
}

// Function to close the warning modal
function closeLocalhostWarning(permanent = false) {
    const warningModal = document.getElementById('localhost-warning-modal');
    
    // Check if user wants to permanently dismiss
    if (permanent) {
        const dontShowAgain = document.getElementById('dont-show-again');
        if (dontShowAgain && dontShowAgain.checked) {
            localStorage.setItem('localhost_warning_dismissed', 'true');
        }
    }
    
    if (warningModal) {
        // Add fade out animation
        warningModal.style.opacity = '0';
        warningModal.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            if (warningModal.parentNode) {
                warningModal.parentNode.removeChild(warningModal);
            }
        }, 300);
    }
}

// Show localhost help information
function showLocalhostHelp() {
    // Create a beautiful help modal
    const helpModal = document.createElement('div');
    helpModal.className = 'localhost-warning-modal';
    helpModal.innerHTML = `
        <div class="localhost-warning-content" style="max-width: 600px;">
            <div class="localhost-warning-icon">
                <i class="fas fa-life-ring"></i>
            </div>
            <h2 class="localhost-warning-title">SETCAM Localhost Help</h2>
            
            <div class="localhost-features">
                <h4><i class="fas fa-key"></i> Quick Access Credentials:</h4>
                <ul>
                    <li><strong>Admin Login:</strong> admin@setcam.com / admin123</li>
                    <li><strong>Keyboard Shortcut:</strong> Press Ctrl + A to auto-fill admin credentials</li>
                </ul>
            </div>
            
            <div class="localhost-features">
                <h4><i class="fas fa-flask"></i> Testing Features:</h4>
                <ul>
                    <li>Email verification codes appear on screen (no real emails sent)</li>
                    <li>All data is stored in your browser's localStorage</li>
                    <li>Payment processing is completely simulated</li>
                    <li>Appointment booking works with simulated payment verification</li>
                </ul>
            </div>
            
            <div class="localhost-features">
                <h4><i class="fas fa-server"></i> Production Deployment:</h4>
                <ul>
                    <li>Configure SMTP settings for real email sending</li>
                    <li>Set up real payment gateway integration</li>
                    <li>Use a proper database instead of localStorage</li>
                    <li>Configure proper server environment variables</li>
                </ul>
            </div>
            
            <div class="localhost-warning-actions">
                <button class="localhost-warning-btn primary" onclick="this.closest('.localhost-warning-modal').remove()">
                    <i class="fas fa-check"></i> Understood
                </button>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('localhost-warning-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.appendChild(helpModal);
}

// ============================================================================
// FIXED REVENUE OVERVIEW CHART
// ============================================================================

// Simplified revenue chart that just works
function loadRevenueChart(appointments) {
    const chartContainer = document.getElementById('revenue-chart-container');
    if (!chartContainer) return;
    
    // Get revenue data for last 7 days
    const revenueData = getLast7DaysRevenue(appointments);
    const maxRevenue = Math.max(...revenueData.map(d => d.revenue > 0 ? d.revenue : 1));
    
    chartContainer.innerHTML = `
        <div class="revenue-chart-container">
            <h4 style="margin-bottom: 1rem; color: #333; text-align: center;">Revenue Last 7 Days</h4>
            <div class="revenue-chart-bars">
                ${revenueData.map(day => `
                    <div class="revenue-chart-bar">
                        <div class="revenue-bar" style="height: ${(day.revenue / maxRevenue) * 150}px;">
                            <div class="revenue-bar-value">₱${day.revenue}</div>
                        </div>
                        <div class="revenue-bar-label">
                            <div style="font-weight: 600;">₱${day.revenue}</div>
                            <div style="font-size: 0.7rem; margin-top: 0.2rem;">${day.label}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Enhanced function to get last 7 days revenue data
function getLast7DaysRevenue(appointments) {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayRevenue = appointments
            .filter(apt => apt.date === dateString && apt.status === 'completed')
            .reduce((sum, apt) => sum + (apt.amount || 0), 0);
        
        const label = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        days.push({
            date: dateString,
            revenue: dayRevenue,
            label: label
        });
    }
    
    return days;
}

// Enhanced real-time analytics with proper revenue chart
function loadRealTimeAnalytics() {
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const users = JSON.parse(localStorage.getItem('setcam_users')) || [];
    
    // Calculate real-time metrics
    const totalRevenue = calculateTotalRevenue(currentAppointments);
    const completedTests = currentAppointments.filter(apt => apt.status === 'completed').length;
    const successRate = calculateSuccessRate(currentAppointments);
    const customerRating = calculateCustomerRating();
    
    // Calculate trends
    const revenueTrend = calculateRevenueTrend(currentAppointments);
    const testsTrend = calculateTestsTrend(currentAppointments);
    const successTrend = calculateSuccessTrend(currentAppointments);
    const ratingTrend = calculateRatingTrend();
    
    // Update the analytics cards
    updateAnalyticsCard('total-revenue', `₱${totalRevenue.toLocaleString()}`);
    updateAnalyticsCard('completed-tests', completedTests);
    updateAnalyticsCard('success-rate', `${successRate}%`);
    updateAnalyticsCard('customer-rating', customerRating);
    
    // Update trends
    updateTrend('revenue-trend', revenueTrend);
    updateTrend('tests-trend', testsTrend);
    updateTrend('success-trend', successTrend);
    updateTrend('rating-trend', ratingTrend);
    
    // Load revenue chart data - FIXED: Now properly displays chart
    loadRevenueChart(currentAppointments);
}

function calculateTotalRevenue(appointments) {
    return appointments
        .filter(apt => apt.status === 'completed')
        .reduce((sum, apt) => sum + (apt.amount || 0), 0);
}

function calculateSuccessRate(appointments) {
    const completedAppointments = appointments.filter(apt => apt.status === 'completed');
    if (completedAppointments.length === 0) return 0;
    
    const passedTests = completedAppointments.filter(apt => 
        apt.emissionTest && apt.emissionTest.testPassed
    ).length;
    
    return Math.round((passedTests / completedAppointments.length) * 100);
}

function calculateCustomerRating() {
    // Simulate customer rating based on completed appointments
    const appointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const completedCount = appointments.filter(apt => apt.status === 'completed').length;
    
    if (completedCount === 0) return '4.8/5';
    
    // Generate realistic rating between 4.5 and 5.0
    const baseRating = 4.5 + (Math.random() * 0.5);
    return `${baseRating.toFixed(1)}/5`;
}

function calculateRevenueTrend(appointments) {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const thisWeekRevenue = appointments
        .filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= lastWeek && apt.status === 'completed';
        })
        .reduce((sum, apt) => sum + (apt.amount || 0), 0);
    
    const previousWeekRevenue = appointments
        .filter(apt => {
            const aptDate = new Date(apt.date);
            const twoWeeksAgo = new Date(lastWeek);
            twoWeeksAgo.setDate(lastWeek.getDate() - 7);
            return aptDate >= twoWeeksAgo && aptDate < lastWeek && apt.status === 'completed';
        })
        .reduce((sum, apt) => sum + (apt.amount || 0), 0);
    
    if (previousWeekRevenue === 0) return '+0% this week';
    
    const change = ((thisWeekRevenue - previousWeekRevenue) / previousWeekRevenue) * 100;
    return `${change >= 0 ? '+' : ''}${Math.round(change)}% this week`;
}

function calculateTestsTrend(appointments) {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const thisWeekTests = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= lastWeek && apt.status === 'completed';
    }).length;
    
    const previousWeekTests = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const twoWeeksAgo = new Date(lastWeek);
        twoWeeksAgo.setDate(lastWeek.getDate() - 7);
        return aptDate >= twoWeeksAgo && aptDate < lastWeek && apt.status === 'completed';
    }).length;
    
    const change = thisWeekTests - previousWeekTests;
    return `${change >= 0 ? '+' : ''}${change} this week`;
}

function calculateSuccessTrend(appointments) {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const thisWeekAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= lastWeek && apt.status === 'completed';
    });
    
    const previousWeekAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const twoWeeksAgo = new Date(lastWeek);
        twoWeeksAgo.setDate(lastWeek.getDate() - 7);
        return aptDate >= twoWeeksAgo && aptDate < lastWeek && apt.status === 'completed';
    });
    
    const thisWeekRate = calculateSuccessRate(thisWeekAppointments);
    const previousWeekRate = calculateSuccessRate(previousWeekAppointments);
    
    const change = thisWeekRate - previousWeekRate;
    return `${change >= 0 ? '+' : ''}${Math.abs(change)}% this week`;
}

function calculateRatingTrend() {
    // Simulate rating trend
    const change = Math.random() > 0.5 ? 0.1 : -0.1;
    return `${change >= 0 ? '+' : ''}${Math.abs(change).toFixed(1)} this week`;
}

function updateAnalyticsCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

function updateTrend(elementId, trend) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = trend;
        element.className = `stat-trend ${trend.includes('+') ? 'trend-up' : 'trend-down'}`;
    }
}

// ============================================================================
// ENHANCED USER-SPECIFIC NOTIFICATION SYSTEM
// ============================================================================

// Initialize notification system for current user
function initializeNotificationSystem() {
    loadNotificationSettings();
    setupNotificationCenter();
    checkPendingNotifications();
    
    // Initialize user notifications if not exists
    if (currentUser && !userNotifications[currentUser.id]) {
        userNotifications[currentUser.id] = [];
        localStorage.setItem('setcam_user_notifications', JSON.stringify(userNotifications));
    }
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Get current user's notifications
function getCurrentUserNotifications() {
    if (!currentUser) return [];
    return userNotifications[currentUser.id] || [];
}

// Set current user's notifications
function setCurrentUserNotifications(notifications) {
    if (!currentUser) return;
    userNotifications[currentUser.id] = notifications;
    localStorage.setItem('setcam_user_notifications', JSON.stringify(userNotifications));
}

// Show notification to specific user or user type
function showNotification(title, message, type = 'info', duration = 5000, persistent = false, target = 'current') {
    console.log(`Creating notification for target: ${target}`, { title, message, currentUserId: currentUser?.id });
    
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notificationId = 'notification-' + Date.now();
    
    // Only show in UI if it's for current user
    if (shouldShowToCurrentUser(target)) {
        console.log('Showing notification to current user');
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `notification ${type}`;
        
        const icon = getNotificationIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="removeNotification('${notificationId}')">&times;</button>
        `;

        container.appendChild(notification);

        // Auto-remove if not persistent
        if (!persistent && duration > 0) {
            setTimeout(() => {
                removeNotification(notificationId);
            }, duration);
        }

        // Play sound if enabled
        if (notificationSettings.sound && shouldShowToCurrentUser(target)) {
            playNotificationSound();
        }

        // Send desktop notification
        if (notificationSettings.desktop && 'Notification' in window && Notification.permission === 'granted' && shouldShowToCurrentUser(target)) {
            try {
                new Notification(title, {
                    body: message,
                    icon: '/favicon.ico',
                    tag: 'setcam-notification'
                });
            } catch (error) {
                console.log('Desktop notification failed:', error);
            }
        }
    }

    // Store notification in user's notification list
    storeUserNotification(notificationId, title, message, type, persistent, target);

    return notificationId;
}

// Check if notification should be shown to current user
function shouldShowToCurrentUser(target) {
    if (!currentUser) return false;
    
    console.log(`Checking if should show to current user:`, { 
        target, 
        currentUserId: currentUser.id, 
        currentUserRole: currentUser.role 
    });
    
    if (target === 'current') return true;
    if (target === 'all') return true;
    if (target === 'admin' && currentUser.role === 'admin') return true;
    if (target === 'user' && currentUser.role === 'user') return true;
    if (target === currentUser.id) return true;
    
    return false;
}

// Store notification in user-specific storage
function storeUserNotification(id, title, message, type, persistent, target) {
    const notificationData = {
        id,
        title,
        message,
        type,
        timestamp: new Date().toISOString(),
        read: false,
        persistent,
        target
    };
    
    console.log(`Storing notification:`, { id, title, target, currentUserId: currentUser?.id });
    
    // Determine which users should receive this notification
    const targetUsers = getTargetUsers(target);
    
    console.log(`Target users for notification:`, targetUsers);
    
    targetUsers.forEach(userId => {
        if (!userNotifications[userId]) {
            userNotifications[userId] = [];
        }
        
        // Check if notification already exists for this user
        const existingIndex = userNotifications[userId].findIndex(n => n.id === id);
        if (existingIndex === -1) {
            userNotifications[userId].unshift(notificationData);
            
            // Limit notifications per user
            if (userNotifications[userId].length > 100) {
                userNotifications[userId] = userNotifications[userId].slice(0, 100);
            }
            
            console.log(`Added notification to user ${userId}`);
        }
    });
    
    localStorage.setItem('setcam_user_notifications', JSON.stringify(userNotifications));
    
    // Update UI for current user if applicable
    if (targetUsers.includes(currentUser?.id)) {
        console.log(`Updating UI for current user ${currentUser.id}`);
        updateNotificationBadge();
    }
}

// Get list of user IDs that should receive the notification
function getTargetUsers(target) {
    const users = JSON.parse(localStorage.getItem('setcam_users')) || [];
    
    console.log(`Getting target users for: ${target}`, { totalUsers: users.length });
    
    switch(target) {
        case 'current':
            return currentUser ? [currentUser.id] : [];
        case 'all':
            return users.filter(u => u.active !== false).map(u => u.id);
        case 'admin':
            const adminUsers = users.filter(u => u.role === 'admin' && u.active !== false).map(u => u.id);
            console.log(`Admin users:`, adminUsers);
            return adminUsers;
        case 'user':
            const regularUsers = users.filter(u => u.role === 'user' && u.active !== false).map(u => u.id);
            console.log(`Regular users:`, regularUsers);
            return regularUsers;
        default:
            // Assume target is a specific user ID
            console.log(`Specific user target: ${target}`);
            return [target];
    }
}

// Remove notification from UI and storage
function removeNotification(notificationId) {
    const notification = document.getElementById(notificationId);
    if (notification) {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Mark as read in storage for current user
    if (currentUser && userNotifications[currentUser.id]) {
        const notifIndex = userNotifications[currentUser.id].findIndex(n => n.id === notificationId);
        if (notifIndex !== -1) {
            userNotifications[currentUser.id][notifIndex].read = true;
            localStorage.setItem('setcam_user_notifications', JSON.stringify(userNotifications));
            updateNotificationBadge();
        }
    }
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '<i class="fas fa-check-circle"></i>';
        case 'warning':
            return '<i class="fas fa-exclamation-triangle"></i>';
        case 'error':
            return '<i class="fas fa-times-circle"></i>';
        case 'info':
        default:
            return '<i class="fas fa-info-circle"></i>';
    }
}

// Play notification sound
function playNotificationSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Enhanced notification center setup
function setupNotificationCenter() {
    const header = document.querySelector('header .container');
    if (!header) return;

    // Remove existing notification center if present
    const existingCenter = document.getElementById('notification-center');
    if (existingCenter) {
        existingCenter.remove();
    }

    // Only show notification center for logged-in users
    if (!currentUser) {
        console.log('No current user, skipping notification center setup');
        return;
    }

    console.log(`Setting up notification center for user ${currentUser.id}`);

    const notificationCenter = document.createElement('div');
    notificationCenter.id = 'notification-center';
    notificationCenter.className = 'notification-center';
    notificationCenter.innerHTML = `
        <button id="notification-toggle" class="notification-toggle-btn">
            <i class="fas fa-bell"></i>
            <span id="notification-badge" class="notification-badge" style="display: none;">0</span>
        </button>
        <div id="notification-dropdown" class="notification-dropdown">
            <div class="notification-header">
                <h3>My Notifications</h3>
                <div class="notification-header-actions">
                    <button id="mark-all-read" class="btn btn-sm btn-outline">Mark All Read</button>
                </div>
            </div>
            <div id="notification-list" class="notification-list">
                <!-- Notifications will be loaded here -->
            </div>
            <div class="notification-footer">
                <button id="clear-notifications" class="btn btn-sm btn-secondary">Clear All</button>
            </div>
        </div>
    `;
    
    // Find the auth menu item and insert notification center AFTER it for both user types
    const authMenuItem = document.getElementById('auth-menu-item');
    const nav = header.querySelector('nav ul');
    
    if (authMenuItem && nav) {
        // Insert notification center AFTER the auth menu item
        // This creates the order: [Navigation Items] [My Appointments/Settings] [Notification Bell]
        nav.insertBefore(notificationCenter, authMenuItem.nextSibling);
    } else if (nav) {
        nav.appendChild(notificationCenter);
    }

    // Add event listeners
    const notificationToggle = document.getElementById('notification-toggle');
    const markAllRead = document.getElementById('mark-all-read');
    const clearNotifications = document.getElementById('clear-notifications');

    if (notificationToggle) {
        notificationToggle.addEventListener('click', toggleNotificationDropdown);
    }
    if (markAllRead) {
        markAllRead.addEventListener('click', markAllNotificationsRead);
    }
    if (clearNotifications) {
        clearNotifications.addEventListener('click', clearAllNotifications);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#notification-center')) {
            closeNotificationDropdown();
        }
    });
    
    loadNotificationDropdown();
    updateNotificationBadge();
}

// Toggle notification dropdown
function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            loadNotificationDropdown();
        }
    }
}

// Close notification dropdown
function closeNotificationDropdown() {
    const dropdown = document.getElementById('notification-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

// Load current user's notifications in dropdown
function loadNotificationDropdown() {
    const notificationList = document.getElementById('notification-list');
    if (!notificationList) return;

    const userNotifs = getCurrentUserNotifications();

    console.log(`Loading notifications for user ${currentUser?.id}:`, userNotifs);

    if (userNotifs.length === 0) {
        notificationList.innerHTML = `
            <div class="no-notifications">
                <i class="fas fa-bell-slash"></i>
                <p>No notifications yet</p>
                <small>You're all caught up!</small>
            </div>
        `;
        return;
    }

    const recentNotifications = userNotifs.slice(0, 10);
    notificationList.innerHTML = recentNotifications.map(notif => `
        <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="markNotificationRead('${notif.id}')">
            <div class="notification-item-icon">
                ${getNotificationIcon(notif.type)}
            </div>
            <div class="notification-item-content">
                <div class="notification-item-title">${notif.title}</div>
                <div class="notification-item-message">${notif.message}</div>
                <div class="notification-item-time">${formatTimeAgo(new Date(notif.timestamp))}</div>
            </div>
            ${!notif.read ? '<div class="notification-item-dot"></div>' : ''}
        </div>
    `).join('');
}

// Update notification badge for current user
function updateNotificationBadge() {
    if (!currentUser) {
        console.log('No current user for badge update');
        return;
    }
    
    const userNotifs = getCurrentUserNotifications();
    const unreadCount = userNotifs.filter(notif => !notif.read).length;
    
    console.log(`Updating badge for user ${currentUser.id}: ${unreadCount} unread`);
    
    const badge = document.getElementById('notification-badge');
    
    if (badge) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        
        // Add pulse animation for new notifications
        if (unreadCount > 0) {
            badge.classList.add('notification-pulse');
        } else {
            badge.classList.remove('notification-pulse');
        }
    }
}

// Mark notification as read for current user
function markNotificationRead(notificationId) {
    const userNotifs = getCurrentUserNotifications();
    const notifIndex = userNotifs.findIndex(n => n.id === notificationId);
    
    if (notifIndex !== -1) {
        userNotifs[notifIndex].read = true;
        setCurrentUserNotifications(userNotifs);
        updateNotificationBadge();
        loadNotificationDropdown();
    }
}

// Mark all notifications as read for current user
function markAllNotificationsRead() {
    const userNotifs = getCurrentUserNotifications();
    userNotifs.forEach(notif => notif.read = true);
    setCurrentUserNotifications(userNotifs);
    updateNotificationBadge();
    loadNotificationDropdown();
    showNotification('All notifications marked as read', 'All notifications have been marked as read.', 'success', 3000, false, 'current');
}

// Clear all notifications for current user
function clearAllNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        setCurrentUserNotifications([]);
        updateNotificationBadge();
        loadNotificationDropdown();
        showNotification('Notifications cleared', 'All notifications have been cleared.', 'success', 3000, false, 'current');
    }
}

// Format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
}

// Enhanced notification triggers with proper user separation
function setupUserNotificationTriggers() {
    console.log('Setting up user-specific notification triggers');
    
    // User login
    const originalHandleLogin = handleLogin;
    window.handleLogin = function(event) {
        const result = originalHandleLogin.call(this, event);
        if (currentUser) {
            showNotification(
                `👋 Welcome, ${currentUser.fullname}!`,
                'You have successfully logged in.',
                'success',
                3000,
                false,
                'current' // Target current user only
            );
        }
        return result;
    };
}

// Admin-specific notification functions
function notifyAdminsAboutNewAppointment() {
    if (!notificationSettings.adminNotifications) return;
    
    const tempAppointment = JSON.parse(localStorage.getItem('setcam_temp_appointment'));
    if (!tempAppointment) return;
    
    const message = `New appointment request from ${tempAppointment.ownerName} for ${tempAppointment.vehicleType} on ${tempAppointment.date} at ${tempAppointment.time}. Reference: ${tempAppointment.reference}`;
    
    console.log('Notifying admins about new appointment');
    
    showNotification(
        '📋 New Appointment Request',
        message,
        'info',
        0,
        true,
        'admin' // Target admins only
    );
}

function notifyAdminsAboutReceiptUpload() {
    if (!notificationSettings.adminNotifications) return;
    
    const tempAppointment = JSON.parse(localStorage.getItem('setcam_temp_appointment'));
    if (!tempAppointment) return;
    
    const message = `Payment receipt uploaded for appointment ${tempAppointment.reference}. Please verify the payment.`;
    
    console.log('Notifying admins about receipt upload');
    
    showNotification(
        '💰 Receipt Uploaded - Verification Required',
        message,
        'warning',
        0,
        true,
        'admin' // Target admins only
    );
}

// Enhanced appointment status notifications
function notifyUserAboutAppointmentStatus(userId, status, reference) {
    const statusMessages = {
        'confirmed': {
            title: '✅ Appointment Confirmed',
            message: `Your appointment ${reference} has been confirmed and scheduled.`,
            type: 'success'
        },
        'rejected': {
            title: '❌ Appointment Rejected',
            message: `Your appointment ${reference} has been rejected. Please contact support.`,
            type: 'error'
        },
        'completed': {
            title: '🎉 Appointment Completed',
            message: `Your appointment ${reference} has been completed successfully.`,
            type: 'success'
        }
    };
    
    const notification = statusMessages[status];
    if (notification) {
        console.log(`Notifying user ${userId} about appointment status: ${status}`);
        showNotification(
            notification.title,
            notification.message,
            notification.type,
            0,
            true,
            userId // Target specific user
        );
    }
}

// Check for pending notifications (for appointment reminders, etc.)
function checkPendingNotifications() {
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const now = new Date();
    
    currentAppointments.forEach(apt => {
        if (apt.status === 'confirmed') {
            const appointmentDate = new Date(apt.date + 'T' + apt.time);
            const timeDiff = appointmentDate - now;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            // Remind 24 hours before appointment
            if (hoursDiff > 0 && hoursDiff <= 24 && !apt.reminderSent) {
                if (notificationSettings.appointmentReminders) {
                    showNotification(
                        'Appointment Reminder', 
                        `You have an appointment tomorrow at ${apt.time} for ${apt.vehicleType}.`,
                        'info',
                        10000,
                        false,
                        apt.userId // Target specific user
                    );
                    apt.reminderSent = true;
                }
            }
        }
    });
    
    localStorage.setItem('setcam_appointments', JSON.stringify(currentAppointments));
}

// Load notification settings
function loadNotificationSettings() {
    const settings = document.getElementById('notification-settings');
    if (!settings) return;

    settings.innerHTML = `
        <div class="notification-settings-group">
            <h4>Notification Preferences</h4>
            <div class="notification-setting-item">
                <div class="notification-setting-info">
                    <div class="notification-setting-title">Sound Notifications</div>
                    <div class="notification-setting-desc">Play sound when new notifications arrive</div>
                </div>
                <label class="notification-toggle">
                    <input type="checkbox" id="sound-notifications" ${notificationSettings.sound ? 'checked' : ''}>
                    <span class="notification-slider"></span>
                </label>
            </div>
            <div class="notification-setting-item">
                <div class="notification-setting-info">
                    <div class="notification-setting-title">Desktop Notifications</div>
                    <div class="notification-setting-desc">Show browser notifications</div>
                </div>
                <label class="notification-toggle">
                    <input type="checkbox" id="desktop-notifications" ${notificationSettings.desktop ? 'checked' : ''}>
                    <span class="notification-slider"></span>
                </label>
            </div>
            <div class="notification-setting-item">
                <div class="notification-setting-info">
                    <div class="notification-setting-title">Email Notifications</div>
                    <div class="notification-setting-desc">Send email notifications for important updates</div>
                </div>
                <label class="notification-toggle">
                    <input type="checkbox" id="email-notifications" ${notificationSettings.email ? 'checked' : ''}>
                    <span class="notification-slider"></span>
                </label>
            </div>
        </div>
        
        <div class="notification-settings-group">
            <h4>Notification Types</h4>
            <div class="notification-setting-item">
                <div class="notification-setting-info">
                    <div class="notification-setting-title">Appointment Reminders</div>
                    <div class="notification-setting-desc">Reminders for upcoming appointments</div>
                </div>
                <label class="notification-toggle">
                    <input type="checkbox" id="appointment-reminders" ${notificationSettings.appointmentReminders ? 'checked' : ''}>
                    <span class="notification-slider"></span>
                </label>
            </div>
            <div class="notification-setting-item">
                <div class="notification-setting-info">
                    <div class="notification-setting-title">Payment Updates</div>
                    <div class="notification-setting-desc">Notifications about payment status</div>
                </div>
                <label class="notification-toggle">
                    <input type="checkbox" id="payment-updates" ${notificationSettings.paymentUpdates ? 'checked' : ''}>
                    <span class="notification-slider"></span>
                </label>
            </div>
            <div class="notification-setting-item">
                <div class="notification-setting-info">
                    <div class="notification-setting-title">System Alerts</div>
                    <div class="notification-setting-desc">Important system updates and alerts</div>
                </div>
                <label class="notification-toggle">
                    <input type="checkbox" id="system-alerts" ${notificationSettings.systemAlerts ? 'checked' : ''}>
                    <span class="notification-slider"></span>
                </label>
            </div>
            <div class="notification-setting-item">
                <div class="notification-setting-info">
                    <div class="notification-setting-title">Admin Notifications</div>
                    <div class="notification-setting-desc">Notifications for administrative tasks</div>
                </div>
                <label class="notification-toggle">
                    <input type="checkbox" id="admin-notifications" ${notificationSettings.adminNotifications ? 'checked' : ''}>
                    <span class="notification-slider"></span>
                </label>
            </div>
        </div>
    `;

    // Add event listeners for toggles
    document.querySelectorAll('.notification-toggle input').forEach(toggle => {
        toggle.addEventListener('change', saveNotificationSettings);
    });
}

// Save notification settings
function saveNotificationSettings() {
    notificationSettings = {
        sound: document.getElementById('sound-notifications').checked,
        desktop: document.getElementById('desktop-notifications').checked,
        email: document.getElementById('email-notifications').checked,
        appointmentReminders: document.getElementById('appointment-reminders').checked,
        paymentUpdates: document.getElementById('payment-updates').checked,
        systemAlerts: document.getElementById('system-alerts').checked,
        adminNotifications: document.getElementById('admin-notifications').checked
    };

    localStorage.setItem('setcam_notification_settings', JSON.stringify(notificationSettings));
    
    // Request notification permission if desktop notifications are enabled
    if (notificationSettings.desktop && 'Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    showNotification('Settings saved', 'Notification preferences have been updated.', 'success', 3000, false, 'current');
}

// ============================================================================
// EXISTING APPLICATION CODE (Updated with all fixes)
// ============================================================================

// Update UI based on login state
function updateUI() {
    const authMenuItem = document.getElementById('auth-menu-item');
    const userMenuItems = document.querySelectorAll('.user-menu');
    const adminMenuItems = document.querySelectorAll('.admin-menu');
    const mainNavItems = document.querySelectorAll('nav ul li:not(.user-menu):not(.admin-menu):not(#auth-menu-item)');

    if (currentUser) {
        if (currentUser.role === 'admin') {
            // Admin navigation structure: Admin Dashboard / Settings / Notification Bell
            authMenuItem.innerHTML = `
                <div class="admin-nav-items">
                    <a href="#" class="nav-link" data-page="admin">Admin Dashboard</a>
                    <a href="#" class="nav-link" data-page="settings">Settings</a>
                </div>
            `;
            
            adminMenuItems.forEach(item => {
                item.style.display = 'block';
            });
            mainNavItems.forEach(item => item.style.display = 'none');
            userMenuItems.forEach(item => item.style.display = 'none');
        } else {
            // Regular user navigation: Home / Services / About Us / Contact / My Appointments / Settings / Notification Bell
            authMenuItem.innerHTML = `
                <div class="user-nav-items">
                    <a href="#" class="nav-link" data-page="appointments">My Appointments</a>
                    <a href="#" class="nav-link" data-page="settings">Settings</a>
                </div>
            `;
            
            // Show main navigation items for users
            mainNavItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                if (link) {
                    const page = link.getAttribute('data-page');
                    if (['home', 'services', 'about', 'contact'].includes(page)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
            userMenuItems.forEach(item => item.style.display = 'none'); // Hide the old user menu items
            adminMenuItems.forEach(item => item.style.display = 'none');
        }

        if (document.getElementById('user-name')) {
            document.getElementById('user-name').textContent = currentUser.fullname;
            document.getElementById('user-email').textContent = currentUser.email;
            document.getElementById('user-role').textContent = currentUser.role;
            document.getElementById('user-verified').textContent = currentUser.emailVerified ? 'Yes' : 'No';
        }

        // Setup notification center for logged-in user
        setupNotificationCenter();

    } else {
        // Guest navigation: Show only main navigation items
        authMenuItem.innerHTML = '<a href="#" id="login-btn">Login</a>';
        userMenuItems.forEach(item => item.style.display = 'none');
        adminMenuItems.forEach(item => item.style.display = 'none');
        mainNavItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link) {
                const page = link.getAttribute('data-page');
                if (['home', 'services', 'about', 'contact'].includes(page)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        });
        
        // Remove notification center when logging out
        const notificationCenter = document.getElementById('notification-center');
        if (notificationCenter) {
            notificationCenter.remove();
        }
        
        const newLoginBtn = document.getElementById('login-btn');
        if (newLoginBtn) {
            newLoginBtn.addEventListener('click', () => navigateToPage('auth'));
        }
    }
}

// Handle user registration with email verification
function handleSignup(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('signup-fullname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;

    if (!fullname || !email || !password || !confirmPassword) {
        alert('Please fill in all fields!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (!isPasswordStrong(password)) {
        alert('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters!');
        return;
    }

    const existingUser = users.find(user => user.email === email && (user.active === undefined || user.active));
    if (existingUser) {
        alert('User with this email already exists!');
        return;
    }

    const userData = {
        fullname: fullname,
        email: email,
        password: password
    };
    
    localStorage.setItem('setcam_pending_user', JSON.stringify(userData));
    
    showEmailVerification(email, fullname);
}

// Handle user login - FIXED VERSION
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please fill in all fields!');
        return;
    }

    // Find user - check for active property or assume true if undefined
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Check if user is active (if active property exists, otherwise assume true)
        if (user.active === false) {
            alert('This account has been deactivated. Please contact administrator.');
            return;
        }
        
        // Skip email verification check for admin users
        if (!user.emailVerified && user.role !== 'admin') {
            alert('Please verify your email before logging in. Check your inbox for the verification code.');
            showEmailVerification(email, user.fullname);
            return;
        }
        
        currentUser = user;
        localStorage.setItem('setcam_currentUser', JSON.stringify(currentUser));
        updateUI();
        
        if (user.role === 'admin') {
            navigateToPage('admin');
        } else {
            navigateToPage('home');
        }
        
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    } else {
        alert('Invalid email or password!');
    }
}

// Handle logout
function handleLogout(event) {
    if (event) event.preventDefault();
    currentUser = null;
    localStorage.removeItem('setcam_currentUser');
    updateUI();
    navigateToPage('home');
    alert('You have been logged out.');
}

// Switch between auth tabs
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
}

// Navigation function - FIXED: Properly clear temp data when confirmed
function navigateToPage(page) {
    // Clear temp data if leaving upload page without completing
    if (page !== 'upload-receipt' && localStorage.getItem('setcam_temp_appointment')) {
        if (!confirm('You have an unfinished appointment. Leave without uploading receipt?')) {
            return; // Don't navigate if user cancels
        }
        // FIXED: Actually clear the temp data when user confirms
        localStorage.removeItem('setcam_temp_appointment');
        console.log('Cleared temporary appointment data after user confirmation');
    }
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    const targetPage = document.getElementById(page);
    const targetNav = document.querySelector(`[data-page="${page}"]`);
    
    if (targetPage) {
        targetPage.classList.add('active');
    }
    if (targetNav) {
        targetNav.classList.add('active');
    }

    if (page === 'admin' && currentUser && currentUser.role === 'admin') {
        loadAdminStats();
        loadAdminAppointments();
        loadUsersTable();
        loadSystemSettings();
        loadRealTimeAnalytics();
    } else if (page === 'appointments' && currentUser) {
        loadUserAppointments();
    } else if (page === 'settings') {
        if (currentUser && currentUser.role === 'admin') {
            loadSystemSettings();
        }
    }
    
    // FIXED: Reset upload status when navigating to upload page
    if (page === 'upload-receipt') {
        resetUploadStatus();
    }
}

// Also add this function to properly clear temp data
function clearTempAppointmentData() {
    if (localStorage.getItem('setcam_temp_appointment')) {
        localStorage.removeItem('setcam_temp_appointment');
        console.log('Cleared temporary appointment data');
    }
}

// Load users table in admin panel
function loadUsersTable() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;

    usersTableBody.innerHTML = '';

    // Get search and filter values
    const searchTerm = document.getElementById('user-search')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('role-filter')?.value || '';
    const statusFilter = document.getElementById('user-status-filter')?.value || '';

    // Filter users
    let filteredUsers = users.filter(user => {
        const matchesSearch = user.fullname.toLowerCase().includes(searchTerm) || 
                             user.email.toLowerCase().includes(searchTerm) ||
                             user.id.toString().includes(searchTerm);
        
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || 
                            (statusFilter === 'active' && (user.active === undefined || user.active)) ||
                            (statusFilter === 'inactive' && user.active === false);

        return matchesSearch && matchesRole && matchesStatus;
    });

    if (filteredUsers.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No users found matching your criteria.</p>
                </td>
            </tr>
        `;
        return;
    }

    filteredUsers.forEach(user => {
        const userAppointments = appointments.filter(apt => apt.userId === user.id).length;
        const row = document.createElement('tr');
        
        // Handle users without active property (assume active)
        const isActive = user.active === undefined ? true : user.active;
        
        // Create user avatar with initials
        const initials = user.fullname.split(' ').map(n => n[0]).join('').toUpperCase();
        
        row.innerHTML = `
            <td>
                <div class="user-info-cell">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-details">
                        <div class="user-name">${user.fullname}</div>
                        <div class="user-email">${user.email}</div>
                        <div class="user-id">ID: ${user.id}</div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="status-badge ${user.role === 'admin' ? 'status-confirmed' : 'status-pending'}">
                    ${user.role}
                </span>
            </td>
            <td>${userAppointments}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <span class="status-badge ${user.emailVerified ? 'status-verified' : 'status-unverified'}">
                    ${user.emailVerified ? 'Verified' : 'Unverified'}
                </span>
            </td>
            <td>
                <span class="status-badge ${isActive ? 'status-completed' : 'status-cancelled'}">
                    <span class="user-status-indicator ${isActive ? 'status-online' : 'status-offline'}"></span>
                    ${isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="user-table-actions">
                    <button class="btn btn-sm btn-primary" onclick="openUpdateModal(${user.id})" title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm ${isActive ? 'btn-warning' : 'btn-success'}" onclick="toggleUserStatus(${user.id})" title="${isActive ? 'Deactivate' : 'Activate'} User">
                        <i class="fas ${isActive ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                </div>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });

    // Update user stats
    updateUserStats();
}

// Update user statistics
function updateUserStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.active === undefined || u.active).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const verifiedUsers = users.filter(u => u.emailVerified).length;

    // Update stats cards if they exist
    const stats = {
        'total-users-stat': totalUsers,
        'active-users-stat': activeUsers,
        'admin-users-stat': adminUsers,
        'verified-users-stat': verifiedUsers
    };

    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Toggle user active/inactive status
function toggleUserStatus(userId) {
    if (userId === currentUser.id) {
        alert('You cannot deactivate your own account!');
        return;
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    // Handle users without active property
    const currentStatus = user.active === undefined ? true : user.active;
    
    const action = currentStatus ? 'deactivate' : 'activate';
    const confirmMessage = currentStatus 
        ? 'Are you sure you want to deactivate this user? They will not be able to login.'
        : 'Are you sure you want to activate this user?';
    
    if (!confirm(confirmMessage)) return;
    
    user.active = !currentStatus;
    localStorage.setItem('setcam_users', JSON.stringify(users));
    loadUsersTable();
    
    alert(`User ${user.active ? 'activated' : 'deactivated'} successfully!`);
}

// Open update user modal - FIXED: Make email field read-only
function openUpdateModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('update-user-id').value = user.id;
    document.getElementById('update-fullname').value = user.fullname;
    document.getElementById('update-email').value = user.email;
    document.getElementById('update-role').value = user.role;
    document.getElementById('update-active').checked = user.active === undefined ? true : user.active;
    document.getElementById('update-password').value = '';

    // Make email field read-only
    const emailInput = document.getElementById('update-email');
    emailInput.readOnly = true;
    emailInput.style.backgroundColor = '#f5f5f5';
    emailInput.style.cursor = 'not-allowed';

    document.getElementById('update-user-modal').style.display = 'flex';
}

// Close update modal
function closeUpdateModal() {
    document.getElementById('update-user-modal').style.display = 'none';
    document.getElementById('update-user-form').reset();
    
    // Reset email field properties
    const emailInput = document.getElementById('update-email');
    if (emailInput) {
        emailInput.readOnly = false;
        emailInput.style.backgroundColor = '';
        emailInput.style.cursor = '';
    }
}

// Handle user update
function handleUserUpdate(event) {
    event.preventDefault();
    
    const userId = parseInt(document.getElementById('update-user-id').value);
    const fullname = document.getElementById('update-fullname').value;
    const email = document.getElementById('update-email').value;
    const role = document.getElementById('update-role').value;
    const active = document.getElementById('update-active').checked;
    const password = document.getElementById('update-password').value;

    if (!fullname || !email) {
        alert('Please fill in all required fields!');
        return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Don't check for email duplicates since email is read-only
    user.fullname = fullname;
    user.role = role;
    user.active = active;
    
    if (password) {
        if (!isPasswordStrong(password)) {
            alert('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters!');
            return;
        }
        user.password = password;
    }

    localStorage.setItem('setcam_users', JSON.stringify(users));
    
    if (currentUser && currentUser.id === userId) {
        currentUser.fullname = fullname;
        currentUser.role = role;
        localStorage.setItem('setcam_currentUser', JSON.stringify(currentUser));
        updateUI();
    }

    loadUsersTable();
    closeUpdateModal();
    alert('User updated successfully!');
}

// Load admin stats
function loadAdminStats() {
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const totalAppointments = currentAppointments.length;
    const pendingApprovals = currentAppointments.filter(apt => apt.status === 'pending_approval').length;
    const totalUsers = users.filter(u => u.active === undefined || u.active).length;
    const revenueToday = currentAppointments
        .filter(apt => new Date(apt.date).toDateString() === new Date().toDateString() && apt.status === 'completed')
        .reduce((sum, apt) => sum + apt.amount, 0);

    if (document.getElementById('total-appointments')) {
        document.getElementById('total-appointments').textContent = totalAppointments;
    }
    if (document.getElementById('pending-approvals')) {
        document.getElementById('pending-approvals').textContent = pendingApprovals;
    }
    if (document.getElementById('total-users')) {
        document.getElementById('total-users').textContent = totalUsers;
    }
    if (document.getElementById('revenue-today')) {
        document.getElementById('revenue-today').textContent = `₱${revenueToday}`;
    }
}

// Filter appointments based on status and date
function filterAppointments() {
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const searchTerm = document.getElementById('appointment-search').value.toLowerCase();
    
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    let filteredAppointments = [...currentAppointments];
    
    // Filter by status
    if (statusFilter) {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === statusFilter);
    }
    
    // Filter by date
    if (dateFilter) {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        filteredAppointments = filteredAppointments.filter(apt => {
            const aptDate = new Date(apt.date);
            
            switch (dateFilter) {
                case 'today':
                    return aptDate.toDateString() === today.toDateString();
                case 'week':
                    return aptDate >= startOfWeek && aptDate <= today;
                case 'month':
                    return aptDate >= startOfMonth && aptDate <= today;
                default:
                    return true;
            }
        });
    }
    
    // Filter by search term
    if (searchTerm) {
        filteredAppointments = filteredAppointments.filter(apt => 
            apt.reference.toLowerCase().includes(searchTerm) ||
            apt.ownerName.toLowerCase().includes(searchTerm) ||
            apt.plateNumber.toLowerCase().includes(searchTerm) ||
            apt.vehicleType.toLowerCase().includes(searchTerm)
        );
    }
    
    return filteredAppointments;
}

// Load admin appointments with receipt viewing
function loadAdminAppointments() {
    const appointmentsList = document.getElementById('admin-appointments-list');
    if (!appointmentsList) return;

    appointmentsList.innerHTML = '';

    const filteredAppointments = filterAppointments();

    if (filteredAppointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="no-appointments" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No appointments found matching your filters.</p>
            </div>
        `;
        return;
    }

    const sortedAppointments = filteredAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    sortedAppointments.forEach(apt => {
        const user = users.find(u => u.id === apt.userId);
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-card';
        
        const receiptInfo = apt.receipt ? `
            <div class="receipt-preview">
                <h4>Receipt Information</h4>
                <div class="receipt-info">
                    <div>
                        <strong>File:</strong> ${apt.receiptFileName || 'receipt'}
                    </div>
                    <div>
                        <strong>Uploaded:</strong> ${apt.receiptUploadedAt ? new Date(apt.receiptUploadedAt).toLocaleString() : 'N/A'}
                    </div>
                </div>
                <div class="receipt-actions">
                    <button class="btn btn-info btn-sm" onclick="viewReceipt(${apt.id})">
                        <i class="fas fa-receipt"></i> View Receipt
                    </button>
                </div>
            </div>
        ` : `
            <div class="receipt-preview">
                <p style="color: #666; font-style: italic;">
                    <i class="fas fa-exclamation-circle"></i> No receipt uploaded yet
                </p>
            </div>
        `;

        appointmentCard.innerHTML = `
            <div class="appointment-header">
                <div class="appointment-ref">Reference: ${apt.reference}</div>
                <div class="appointment-meta">
                    <div class="appointment-badges">
                        <span class="status-badge status-${apt.status}">${apt.status.replace('_', ' ')}</span>
                        <span class="status-badge payment-paid">Paid</span>
                        ${apt.receipt ? '<span class="status-badge status-verified">Receipt Uploaded</span>' : '<span class="status-badge status-pending">No Receipt</span>'}
                    </div>
                </div>
            </div>
            
            <div class="appointment-details-grid">
                <div class="detail-group">
                    <h4>Customer Information</h4>
                    <p><strong>Name:</strong> ${user ? user.fullname : 'Unknown User'}</p>
                    <p><strong>Contact:</strong> ${apt.contactNumber}</p>
                    <p><strong>Email:</strong> ${user ? user.email : 'N/A'}</p>
                </div>
                
                <div class="detail-group">
                    <h4>Vehicle Information</h4>
                    <p><strong>Type:</strong> ${apt.vehicleType}</p>
                    <p><strong>Plate:</strong> ${apt.plateNumber}</p>
                    <p><strong>Make/Model:</strong> ${apt.vehicleMake} ${apt.vehicleModel}</p>
                    <p><strong>Year:</strong> ${apt.year}</p>
                </div>
                
                <div class="detail-group">
                    <h4>Appointment Details</h4>
                    <p><strong>Date:</strong> ${apt.date}</p>
                    <p><strong>Time:</strong> ${apt.time}</p>
                    <p><strong>Amount:</strong> ₱${apt.amount}</p>
                    <p><strong>Booked:</strong> ${new Date(apt.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            
            ${receiptInfo}
            
            <div class="receipt-actions">
                ${apt.status === 'pending_approval' ? `
                    <button class="btn btn-success btn-sm" onclick="updateAppointmentStatus(${apt.id}, 'confirmed')">Approve</button>
                    <button class="btn btn-danger btn-sm" onclick="updateAppointmentStatus(${apt.id}, 'rejected')">Reject</button>
                ` : ''}
                ${apt.status === 'confirmed' ? `
                    <button class="btn btn-success btn-sm" onclick="updateAppointmentStatus(${apt.id}, 'completed')">Mark Complete</button>
                ` : ''}
                <button class="btn btn-secondary btn-sm" onclick="viewAppointmentDetails(${apt.id})">View Details</button>
            </div>
        `;
        
        appointmentsList.appendChild(appointmentCard);
    });
}

// Load user appointments
function loadUserAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    if (!appointmentsList) return;

    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const userAppointments = currentAppointments.filter(apt => apt.userId === currentUser.id);

    if (userAppointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="no-appointments" style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No appointments found. <a href="#" class="nav-link" data-page="services">Book your first appointment</a></p>
            </div>
        `;
        return;
    }

    appointmentsList.innerHTML = '';

    userAppointments.forEach(apt => {
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-card';
        
        appointmentCard.innerHTML = `
            <div class="appointment-header">
                <div class="appointment-ref">Reference: ${apt.reference}</div>
                <div class="appointment-meta">
                    <div class="appointment-badges">
                        <span class="status-badge status-${apt.status}">${apt.status.replace('_', ' ')}</span>
                        <span class="status-badge payment-paid">Paid</span>
                        ${apt.receipt ? '<span class="status-badge status-verified">Receipt Uploaded</span>' : '<span class="status-badge status-pending">No Receipt</span>'}
                    </div>
                </div>
            </div>
            
            <div class="appointment-details-grid">
                <div class="detail-group">
                    <h4>Vehicle Information</h4>
                    <p><strong>Type:</strong> ${apt.vehicleType}</p>
                    <p><strong>Plate:</strong> ${apt.plateNumber}</p>
                    <p><strong>Make/Model:</strong> ${apt.vehicleMake} ${apt.vehicleModel}</p>
                </div>
                
                <div class="detail-group">
                    <h4>Appointment Details</h4>
                    <p><strong>Date:</strong> ${apt.date}</p>
                    <p><strong>Time:</strong> ${apt.time}</p>
                    <p><strong>Amount:</strong> ₱${apt.amount}</p>
                </div>
                
                <div class="detail-group">
                    <h4>Status</h4>
                    <p><strong>Current:</strong> ${apt.status.replace('_', ' ')}</p>
                    <p><strong>Booked:</strong> ${new Date(apt.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        
        appointmentsList.appendChild(appointmentCard);
    });
}

// Enhanced update appointment status with user notifications
function updateAppointmentStatus(appointmentId, status) {
    if (status === 'completed') {
        openEmissionTestModal(appointmentId);
        return;
    }
    
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const appointment = currentAppointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
        const oldStatus = appointment.status;
        appointment.status = status;
        localStorage.setItem('setcam_appointments', JSON.stringify(currentAppointments));
        
        // Notify user about status change
        if (oldStatus !== status && status !== 'pending_approval') {
            notifyUserAboutAppointmentStatus(appointment.userId, status, appointment.reference);
        }
        
        loadAdminAppointments();
        loadAdminStats();
        
        // Show confirmation to admin
        if (currentUser && currentUser.role === 'admin') {
            showNotification(
                'Status Updated',
                `Appointment ${appointment.reference} has been ${status}.`,
                'success',
                3000,
                false,
                'current' // Target current admin only
            );
        }
    }
}

// View appointment details
function viewAppointmentDetails(appointmentId) {
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const appointment = currentAppointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        alert(`Appointment Details:\nReference: ${appointment.reference}\nVehicle: ${appointment.vehicleType}\nDate: ${appointment.date}\nTime: ${appointment.time}\nStatus: ${appointment.status}`);
    }
}

// View receipt modal
function viewReceipt(appointmentId) {
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const appointment = currentAppointments.find(apt => apt.id === appointmentId);
    if (!appointment) {
        alert('Appointment not found.');
        return;
    }

    if (!appointment.receipt) {
        alert('No receipt has been uploaded for this appointment.');
        return;
    }

    document.getElementById('receipt-reference').textContent = appointment.reference;
    document.getElementById('receipt-vehicle-type').textContent = appointment.vehicleType;
    document.getElementById('receipt-amount').textContent = appointment.amount;
    document.getElementById('receipt-date').textContent = appointment.date;
    document.getElementById('receipt-image').src = appointment.receipt;

    document.getElementById('receipt-modal').style.display = 'flex';
}

// Close receipt modal
function closeReceiptModal() {
    document.getElementById('receipt-modal').style.display = 'none';
    document.getElementById('receipt-image').src = '';
}

// Switch admin tabs
function navigateToTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
    
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}-tab`);
    
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    if (tabName === 'settings') {
        loadSystemSettings();
    } else if (tabName === 'analytics') {
        loadRealTimeAnalytics();
    } else if (tabName === 'users') {
        initializeUserManagement();
    }
}

// Clean up user data when user is deleted
function cleanupUserData(userId) {
    // Remove user notifications
    if (userNotifications[userId]) {
        delete userNotifications[userId];
        localStorage.setItem('setcam_user_notifications', JSON.stringify(userNotifications));
        console.log(`Cleaned up notifications for user ${userId}`);
    }
    
    // Remove user appointments
    const currentAppointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const updatedAppointments = currentAppointments.filter(apt => apt.userId !== userId);
    localStorage.setItem('setcam_appointments', JSON.stringify(updatedAppointments));
    console.log(`Cleaned up appointments for user ${userId}`);
}

// Debug function to check notification storage
function debugNotifications() {
    console.log('=== NOTIFICATION DEBUG INFO ===');
    console.log('Current user:', currentUser);
    console.log('All user notifications:', userNotifications);
    console.log('Current user notifications:', getCurrentUserNotifications());
    console.log('All users:', JSON.parse(localStorage.getItem('setcam_users')) || []);
    console.log('================================');
}

// ============================================================================
// EMISSION TEST FUNCTIONALITY
// ============================================================================

// Emission Test Modal Functions
function openEmissionTestModal(appointmentId) {
    const appointment = getAppointmentById(appointmentId);
    if (!appointment) {
        alert('Appointment not found!');
        return;
    }

    // Set appointment ID
    document.getElementById('emission-appointment-id').value = appointmentId;

    // Auto-fill form with appointment data
    document.getElementById('full-name').value = appointment.ownerName || '';
    document.getElementById('plate-number').value = appointment.plateNumber || '';
    document.getElementById('vehicle-type').value = appointment.vehicleType || '';
    document.getElementById('brand-model').value = (appointment.vehicleMake || '') + ' ' + (appointment.vehicleModel || '');
    document.getElementById('year-model').value = appointment.year || '';
    
    // Set current date and time
    const now = new Date();
    document.getElementById('test-datetime').value = now.toISOString().slice(0, 16);
    
    // Set validity expiration (1 year from now)
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    document.getElementById('validity-expiration').value = oneYearLater.toISOString().slice(0, 10);

    // Show modal
    document.getElementById('emission-test-modal').style.display = 'flex';
}

function closeEmissionTestModal() {
    document.getElementById('emission-test-modal').style.display = 'none';
    document.getElementById('emission-test-form').reset();
}

function getAppointmentById(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    return appointments.find(apt => apt.id === appointmentId);
}

function previewEmissionTest() {
    if (!validateEmissionForm()) {
        return;
    }
    
    const printContent = generatePrintContent();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Emission Test Certificate</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px;
                    line-height: 1.4;
                }
                .certificate-header { 
                    text-align: center; 
                    border-bottom: 3px solid #800000;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .certificate-header h2 { 
                    color: #800000; 
                    margin: 0; 
                    font-size: 18px;
                }
                .form-grid { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 15px; 
                    margin-bottom: 20px;
                }
                .field-group { margin-bottom: 8px; }
                .field-label { font-weight: bold; color: #333; }
                .field-value { 
                    border-bottom: 1px solid #000;
                    padding: 2px 5px;
                    min-height: 20px;
                }
                .test-results { 
                    background: #f0f0f0; 
                    padding: 15px; 
                    margin: 15px 0;
                    border-radius: 5px;
                }
                .signatures { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 30px;
                    margin-top: 30px;
                }
                .signature-line { 
                    border-top: 1px solid #000; 
                    margin-top: 40px;
                    text-align: center;
                    padding-top: 5px;
                }
                .result-section { 
                    display: flex; 
                    justify-content: space-between;
                    margin-top: 20px;
                    font-weight: bold;
                }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            ${printContent}
            <div class="no-print" style="text-align: center; margin-top: 20px;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #800000; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Certificate</button>
                <button onclick="window.close()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

function saveAndPrintEmissionTest() {
    if (!validateEmissionForm()) {
        return;
    }

    const formData = getEmissionFormData();
    const appointmentId = document.getElementById('emission-appointment-id').value;
    
    // Update appointment with emission test results
    const appointments = JSON.parse(localStorage.getItem('setcam_appointments')) || [];
    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(appointmentId));
    
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex].emissionTest = formData;
        appointments[appointmentIndex].status = 'completed';
        appointments[appointmentIndex].completedAt = new Date().toISOString();
        
        localStorage.setItem('setcam_appointments', JSON.stringify(appointments));
        
        // Show success message
        showNotification(
            'Emission Test Completed',
            'Emission test results have been saved and the appointment is marked as completed.',
            'success',
            5000,
            false,
            'current'
        );
        
        // Generate and print
        const printContent = generatePrintContent();
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Emission Test Certificate - ${formData.plateNumber}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px;
                        line-height: 1.4;
                    }
                    .certificate-header { 
                        text-align: center; 
                        border-bottom: 3px solid #800000;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .certificate-header h2 { 
                        color: #800000; 
                        margin: 0; 
                        font-size: 18px;
                    }
                    .form-grid { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 15px; 
                        margin-bottom: 20px;
                    }
                    .field-group { margin-bottom: 8px; }
                    .field-label { font-weight: bold; color: #333; }
                    .field-value { 
                        border-bottom: 1px solid #000;
                        padding: 2px 5px;
                        min-height: 20px;
                    }
                    .test-results { 
                        background: #f0f0f0; 
                        padding: 15px; 
                        margin: 15px 0;
                        border-radius: 5px;
                    }
                    .signatures { 
                        display: grid; 
                        grid-template-columns: 1fr 1fr; 
                        gap: 30px;
                        margin-top: 30px;
                    }
                    .signature-line { 
                        border-top: 1px solid #000; 
                        margin-top: 40px;
                        text-align: center;
                        padding-top: 5px;
                    }
                    .result-section { 
                        display: flex; 
                        justify-content: space-between;
                        margin-top: 20px;
                        font-weight: bold;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body onload="window.print();">
                ${printContent}
            </body>
            </html>
        `);
        printWindow.document.close();
        
        // Close modal and refresh admin view
        closeEmissionTestModal();
        loadAdminAppointments();
        loadAdminStats();
    }
}

function validateEmissionForm() {
    const requiredFields = [
        'test-datetime', 'full-name', 'address', 'plate-number', 'file-number',
        'engine-number', 'chassis-number', 'fuel-type', 'year-model', 'brand-model',
        'vehicle-type', 'color', 'vehicle-classification', 'validity-expiration',
        'co-reading', 'hc-reading', 'inspector-name', 'owner-name-signature'
    ];

    for (let fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            const label = field.previousElementSibling ? field.previousElementSibling.textContent : fieldId.replace(/-/g, ' ');
            alert(`Please fill in the ${label} field.`);
            if (field) field.focus();
            return false;
        }
    }

    // Validate pass/fail selection
    const testPassed = document.getElementById('test-passed').checked;
    const testFailed = document.getElementById('test-failed').checked;
    
    if (!testPassed && !testFailed) {
        alert('Please select either PASSED or FAILED for the test result.');
        return false;
    }

    return true;
}

function getEmissionFormData() {
    return {
        testDatetime: document.getElementById('test-datetime').value,
        fullName: document.getElementById('full-name').value,
        address: document.getElementById('address').value,
        plateNumber: document.getElementById('plate-number').value,
        fileNumber: document.getElementById('file-number').value,
        engineNumber: document.getElementById('engine-number').value,
        chassisNumber: document.getElementById('chassis-number').value,
        fuelType: document.getElementById('fuel-type').value,
        yearModel: document.getElementById('year-model').value,
        brandModel: document.getElementById('brand-model').value,
        vehicleType: document.getElementById('vehicle-type').value,
        color: document.getElementById('color').value,
        vehicleClassification: document.getElementById('vehicle-classification').value,
        validityExpiration: document.getElementById('validity-expiration').value,
        coReading: document.getElementById('co-reading').value,
        hcReading: document.getElementById('hc-reading').value,
        inspectorName: document.getElementById('inspector-name').value,
        ownerName: document.getElementById('owner-name-signature').value,
        testPassed: document.getElementById('test-passed').checked
    };
}

function generatePrintContent() {
    const formData = getEmissionFormData();
    
    return `
        <div class="certificate-header">
            <h2>SMOKE EMISSION TEST CENTER APPOINTMENT IN MINTAL</h2>
            <p style="margin: 5px 0; font-weight: bold;">Gumannela St., Bigy, Mintal, Davao City</p>
            <p style="margin: 0; color: #666;">R11-2015-04-1512</p>
            <p style="margin: 5px 0; font-weight: bold;">${formatDateTime(formData.testDatetime)}</p>
        </div>

        <div class="form-grid">
            <div class="form-column">
                <div class="field-group">
                    <div class="field-label">FULL NAME</div>
                    <div class="field-value">${formData.fullName}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">ADDRESS</div>
                    <div class="field-value">${formData.address}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">PLATE NUMBER</div>
                    <div class="field-value">${formData.plateNumber}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">FILE NUMBER</div>
                    <div class="field-value">${formData.fileNumber}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">ENGINE NUMBER</div>
                    <div class="field-value">${formData.engineNumber}</div>
                </div>
            </div>
            <div class="form-column">
                <div class="field-group">
                    <div class="field-label">CHASSIS NUMBER</div>
                    <div class="field-value">${formData.chassisNumber}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">FUEL TYPE</div>
                    <div class="field-value">${formData.fuelType}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">YEAR MODEL</div>
                    <div class="field-value">${formData.yearModel}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">BRAND/MODEL</div>
                    <div class="field-value">${formData.brandModel}</div>
                </div>
            </div>
        </div>

        <div class="form-grid">
            <div class="form-column">
                <div class="field-group">
                    <div class="field-label">VEHICLE TYPE</div>
                    <div class="field-value">${formData.vehicleType}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">COLOR</div>
                    <div class="field-value">${formData.color}</div>
                </div>
            </div>
            <div class="form-column">
                <div class="field-group">
                    <div class="field-label">VEHICLE CLASSIFICATION</div>
                    <div class="field-value">${formData.vehicleClassification}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">VALIDITY EMISSION DATE EXPIRATION</div>
                    <div class="field-value">${formatDate(formData.validityExpiration)}</div>
                </div>
            </div>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <strong>ATTACH PHOTO</strong>
        </div>

        <div class="test-results">
            <h4 style="text-align: center; margin-bottom: 15px; color: #800000;">EMISSION TEST RESULTS</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="field-group">
                    <div class="field-label">CO READING</div>
                    <div class="field-value">${formData.coReading}</div>
                </div>
                <div class="field-group">
                    <div class="field-label">HC READING</div>
                    <div class="field-value">${formData.hcReading}</div>
                </div>
            </div>
        </div>

        <div class="signatures">
            <div class="signature-group">
                <div class="field-group">
                    <div class="field-label">INSPECTOR NAME</div>
                    <div class="field-value">${formData.inspectorName}</div>
                </div>
                <div class="signature-line">Inspector Signature</div>
            </div>
            <div class="signature-group">
                <div class="field-group">
                    <div class="field-label">OWNER NAME</div>
                    <div class="field-value">${formData.ownerName}</div>
                </div>
                <div class="signature-line">Owner Signature</div>
            </div>
        </div>

        <div class="result-section">
            <div>
                ${formData.testPassed ? '✅ PASSED' : '❌ FAILED'}
            </div>
            <div>
                FOR REGISTRATION
            </div>
        </div>
    `;
}

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ============================================================================
// INITIALIZATION WITH ALL FIXES
// ============================================================================

// Initialize the application with all fixes
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultAdmin();
    updateUI();
    initializeNotificationSystem();
    setupUserNotificationTriggers();
    setupImagePreview(); // Initialize image preview functionality
    showLocalhostWarning(); // Show localhost warning if applicable
    
    // Event listeners for auth forms
    const signupButton = document.getElementById('signup-button');
    const loginButton = document.getElementById('login-button');
    
    if (signupButton) {
        signupButton.addEventListener('click', handleSignup);
    }
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }
    
    // Auth tab switching
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });
    
    // Email verification event listeners
    const verifyCodeBtn = document.getElementById('verify-code-btn');
    const resendCodeBtn = document.getElementById('resend-code-btn');
    
    if (verifyCodeBtn) {
        verifyCodeBtn.addEventListener('click', verifyEmailCode);
    }
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', resendVerificationCode);
    }
    
    // Close verification modal when clicking outside
    const verificationModal = document.getElementById('email-verification-modal');
    if (verificationModal) {
        verificationModal.addEventListener('click', function(e) {
            if (e.target === verificationModal) {
                closeEmailVerification();
            }
        });
    }
    
    // Close receipt modal when clicking outside
    const receiptModal = document.getElementById('receipt-modal');
    if (receiptModal) {
        receiptModal.addEventListener('click', function(e) {
            if (e.target === receiptModal) {
                closeReceiptModal();
            }
        });
    }
    
    // Add these new initializations
    setupPasswordStrength();
    setupPasswordToggle();
    setupTimeValidation();
    setupFileUpload();
    setupPaymentMethods(); // Initialize payment method selection
    
    // Back button from payment to appointment form
const backToAppointmentForm = document.getElementById('back-to-appointment-form');
if (backToAppointmentForm) {
    backToAppointmentForm.addEventListener('click', function() {
        // Clear temp data when going back to appointment form
        clearTempAppointmentData();
        navigateToPage('appointment-form');
    });
}

// Back button from upload receipt to payment
const backToPayment = document.getElementById('back-to-payment');
if (backToPayment) {
    backToPayment.addEventListener('click', function() {
        navigateToPage('gcash-payment');
    });
}

// Back to services
const backToServices = document.getElementById('back-to-services');
if (backToServices) {
    backToServices.addEventListener('click', function() {
        clearTempAppointmentData();
        navigateToPage('services');
    });
}
    
    // Fix preferred time to 20-minute intervals
    const preferredTime = document.getElementById('preferred-time');
    if (preferredTime) {
        let timeOptions = '';
        const startHour = 8; // 8:00 AM
        const endHour = 17;  // 5:00 PM
        
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 20) {
                const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                const displayHour = hour > 12 ? hour - 12 : hour;
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const displayMinute = minute.toString().padStart(2, '0');
                const time12 = `${displayHour}:${displayMinute} ${ampm}`;
                
                timeOptions += `<option value="${time24}">${time12}</option>`;
            }
        }
        preferredTime.innerHTML = timeOptions;
    }
    
    // Close image preview when clicking outside or ESC key
    document.addEventListener('DOMContentLoaded', function() {
        const imagePreviewModal = document.getElementById('image-preview-modal');
        if (imagePreviewModal) {
            imagePreviewModal.addEventListener('click', function(e) {
                if (e.target === imagePreviewModal) {
                    closeImagePreview();
                }
            });
        }

        // Close with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeImagePreview();
            }
        });
    });
    
    // Navigation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link') || e.target.closest('.nav-link')) {
            e.preventDefault();
            const link = e.target.classList.contains('nav-link') ? e.target : e.target.closest('.nav-link');
            const page = link.getAttribute('data-page');
            navigateToPage(page);
        }
        
        if (e.target.closest('.quick-action-card')) {
            const card = e.target.closest('.quick-action-card');
            const tab = card.getAttribute('data-tab');
            navigateToTab(tab);
        }
        
        if (e.target.closest('.admin-tab')) {
            const tab = e.target.closest('.admin-tab');
            const tabName = tab.getAttribute('data-tab');
            navigateToTab(tabName);
        }
    });
    
    // Book Now buttons - UPDATED WITH APPOINTMENT RESTRICTION AND COOLDOWN
    document.querySelectorAll('.book-now-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!currentUser) {
                alert('Please login to book an appointment.');
                navigateToPage('auth');
                return;
            }
            
            // Check if user already has an active appointment
            if (hasActiveAppointment(currentUser.id)) {
                const activeAppointment = getActiveAppointment(currentUser.id);
                alert(`You already have an active appointment (Reference: ${activeAppointment.reference}). Please wait for your current appointment to be completed before booking a new one.`);
                navigateToPage('appointments');
                return;
            }
            
            // Check for appointment cooldown - FIXED: Proper cooldown check
            const cooldownCheck = hasAppointmentCooldown(currentUser.id);
            if (cooldownCheck.hasCooldown) {
                alert(`You cannot book a new appointment yet. Please wait ${cooldownCheck.hoursLeft} more hours since your last appointment was rejected.`);
                navigateToPage('appointments');
                return;
            }
            
            const card = btn.closest('.pricing-card');
            const vehicleType = card.getAttribute('data-vehicle');
            const price = card.getAttribute('data-price');
            
            document.getElementById('appointment-vehicle-type').textContent = `Appointment for ${vehicleType.toUpperCase()}`;
            document.getElementById('payment-vehicle-type').textContent = vehicleType;
            
            // Update all payment amounts
            updatePaymentAmounts(price);
            
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const formattedDate = tomorrow.toISOString().split('T')[0];
            document.getElementById('preferred-date').value = formattedDate;
            document.getElementById('payment-date').textContent = formattedDate;
            
            navigateToPage('appointment-form');
        });
    });
    
    // Appointment booking - UPDATED WITH REAL-TIME VALIDATION
    const proceedToPayment = document.getElementById('proceed-to-payment');
    if (proceedToPayment) {
        proceedToPayment.addEventListener('click', function() {
            // Validate all fields are filled
            const requiredFields = [
                'owner-name', 'contact-number', 'plate-number', 
                'vehicle-make', 'vehicle-model', 'year', 'preferred-date', 'preferred-time'
            ];
            
            let isValid = true;
            let emptyFields = [];
            
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field || !field.value.trim()) {
                    isValid = false;
                    emptyFields.push(fieldId.replace(/-/g, ' '));
                }
            });
            
            if (!isValid) {
                alert(`Please fill in the following fields: ${emptyFields.join(', ')}`);
                return;
            }
            
            const date = document.getElementById('preferred-date').value;
            const time = document.getElementById('preferred-time').value;
            
            // Validate appointment with real-time data
            const validation = validateAppointment(date, time);
            if (!validation.valid) {
                alert(validation.message);
                return;
            }
            
            const reference = 'EMI-' + Date.now();
            document.getElementById('payment-reference').textContent = reference;
            
            const timeDisplay = parseInt(time) < 12 ? time + ' AM' : (parseInt(time) - 12) + ' PM';
            
            document.getElementById('payment-date').textContent = date;
            document.getElementById('payment-time').textContent = timeDisplay;
            
            navigateToPage('gcash-payment');
        });
    }
    
    // Payment completed - FIXED: Store temporarily until receipt uploaded
    const paymentCompleted = document.getElementById('payment-completed');
    if (paymentCompleted) {
        paymentCompleted.addEventListener('click', function() {
            const date = document.getElementById('payment-date').textContent;
            const timeElement = document.getElementById('payment-time').textContent;
            const time = timeElement.replace(' AM', '').replace(' PM', '');
            
            // Final validation before creating appointment
            const validation = validateAppointment(date, time);
            if (!validation.valid) {
                alert(validation.message + ' Please choose a different time slot.');
                navigateToPage('appointment-form');
                return;
            }
            
            // Store appointment data temporarily (don't save to appointments yet)
            const tempAppointment = {
                id: Date.now(), // Temporary ID
                userId: currentUser.id,
                reference: document.getElementById('payment-reference').textContent,
                vehicleType: document.getElementById('payment-vehicle-type').textContent,
                date: date,
                time: time,
                amount: parseInt(document.getElementById('payment-amount').textContent),
                status: 'pending_payment', // New status for unpaid appointments
                createdAt: new Date().toISOString(),
                ownerName: document.getElementById('owner-name').value,
                contactNumber: document.getElementById('contact-number').value,
                plateNumber: document.getElementById('plate-number').value,
                vehicleMake: document.getElementById('vehicle-make').value,
                vehicleModel: document.getElementById('vehicle-model').value,
                year: document.getElementById('year').value,
                receipt: null,
                receiptFileName: null,
                receiptUploadedAt: null
            };
            
            // Store temporarily, not in main appointments
            localStorage.setItem('setcam_temp_appointment', JSON.stringify(tempAppointment));
            
            // Notify admins about new appointment
            notifyAdminsAboutNewAppointment();
            
            navigateToPage('upload-receipt');
        });
    }
    
    // Back to home from upload success
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            navigateToPage('home');
        });
    }
    
    // Appointment button in hero
    const appointmentBtn = document.getElementById('appointment-btn');
    if (appointmentBtn) {
        appointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!currentUser) {
                alert('Please login to book an appointment.');
                navigateToPage('auth');
                return;
            }
            
            // Check if user already has an active appointment
            if (hasActiveAppointment(currentUser.id)) {
                const activeAppointment = getActiveAppointment(currentUser.id);
                alert(`You already have an active appointment (Reference: ${activeAppointment.reference}). Please wait for your current appointment to be completed before booking a new one.`);
                navigateToPage('appointments');
                return;
            }
            
            // Check for appointment cooldown - FIXED: Proper cooldown check
            const cooldownCheck = hasAppointmentCooldown(currentUser.id);
            if (cooldownCheck.hasCooldown) {
                alert(`You cannot book a new appointment yet. Please wait ${cooldownCheck.hoursLeft} more hours since your last appointment was rejected.`);
                navigateToPage('appointments');
                return;
            }
            
            navigateToPage('services');
        });
    }
    
    // Logout from settings
    const logoutSettingsBtn = document.getElementById('logout-settings-btn');
    if (logoutSettingsBtn) {
        logoutSettingsBtn.addEventListener('click', handleLogout);
    }
    
    // Admin refresh button
    const refreshAdminBtn = document.getElementById('refresh-admin-btn');
    if (refreshAdminBtn) {
        refreshAdminBtn.addEventListener('click', function() {
            loadAdminStats();
            loadAdminAppointments();
            loadUsersTable();
            loadRealTimeAnalytics();
            alert('Admin data refreshed!');
        });
    }
    
    // Update user form
    const updateUserForm = document.getElementById('update-user-form');
    if (updateUserForm) {
        updateUserForm.addEventListener('submit', handleUserUpdate);
    }
    
    // System Settings buttons
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSystemSettings);
    }
    
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', resetSystemSettings);
    }
    
    // Set minimum date for appointment to today
    const dateInput = document.getElementById('preferred-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // Close modal when clicking outside
    const updateUserModal = document.getElementById('update-user-modal');
    if (updateUserModal) {
        updateUserModal.addEventListener('click', function(e) {
            if (e.target === updateUserModal) {
                closeUpdateModal();
            }
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Admin filter event listeners
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const appointmentSearch = document.getElementById('appointment-search');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadAdminAppointments);
    }
    if (dateFilter) {
        dateFilter.addEventListener('change', loadAdminAppointments);
    }
    if (appointmentSearch) {
        appointmentSearch.addEventListener('input', loadAdminAppointments);
    }
    
    // Keyboard shortcut for admin login
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            if (!currentUser) {
                document.getElementById('login-email').value = 'admin@setcam.com';
                document.getElementById('login-password').value = 'admin123';
                alert('Admin credentials auto-filled! Click Login to continue.');
            }
        }
    });
    
    // Add this navigation event listener code to your existing JavaScript
document.addEventListener('click', function(e) {
    // Handle nav links
    if (e.target.matches('.nav-link') || e.target.closest('.nav-link')) {
        e.preventDefault();
        const link = e.target.matches('.nav-link') ? e.target : e.target.closest('.nav-link');
        const page = link.getAttribute('data-page');
        if (page) {
            navigateToPage(page);
        }
    }
    
    // Handle admin tabs
    if (e.target.matches('.admin-tab') || e.target.closest('.admin-tab')) {
        const tab = e.target.matches('.admin-tab') ? e.target : e.target.closest('.admin-tab');
        const tabName = tab.getAttribute('data-tab');
        if (tabName) {
            navigateToTab(tabName);
        }
    }
    
    // Handle quick action cards
    if (e.target.closest('.quick-action-card')) {
        const card = e.target.closest('.quick-action-card');
        const tab = card.getAttribute('data-tab');
        if (tab) {
            navigateToTab(tab);
        }
    }
});


    // Check for pending notifications every 30 seconds
    setInterval(checkPendingNotifications, 30000);
    
    console.log('SETCAM Application initialized successfully with all fixes!');
});

// Enhanced User Management Functions

// Load users table with search and filter functionality
function loadUsersTable() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;

    // Get search and filter values
    const searchTerm = document.getElementById('user-search')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('role-filter')?.value || '';
    const statusFilter = document.getElementById('user-status-filter')?.value || '';

    // Filter users
    let filteredUsers = users.filter(user => {
        const matchesSearch = user.fullname.toLowerCase().includes(searchTerm) || 
                             user.email.toLowerCase().includes(searchTerm) ||
                             user.id.toString().includes(searchTerm);
        
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || 
                            (statusFilter === 'active' && (user.active === undefined || user.active)) ||
                            (statusFilter === 'inactive' && user.active === false);

        return matchesSearch && matchesRole && matchesStatus;
    });

    usersTableBody.innerHTML = '';

    if (filteredUsers.length === 0) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #666;">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No users found matching your criteria.</p>
                </td>
            </tr>
        `;
        return;
    }

    filteredUsers.forEach(user => {
        const userAppointments = appointments.filter(apt => apt.userId === user.id).length;
        const row = document.createElement('tr');
        
        // Handle users without active property (assume active)
        const isActive = user.active === undefined ? true : user.active;
        
        // Create user avatar with initials
        const initials = user.fullname.split(' ').map(n => n[0]).join('').toUpperCase();
        
        row.innerHTML = `
            <td>
                <div class="user-info-cell">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-details">
                        <div class="user-name">${user.fullname}</div>
                        <div class="user-email">${user.email}</div>
                        <div class="user-id">ID: ${user.id}</div>
                    </div>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="status-badge ${user.role === 'admin' ? 'status-confirmed' : 'status-pending'}">
                    ${user.role}
                </span>
            </td>
            <td>${userAppointments}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <span class="status-badge ${user.emailVerified ? 'status-verified' : 'status-unverified'}">
                    ${user.emailVerified ? 'Verified' : 'Unverified'}
                </span>
            </td>
            <td>
                <span class="status-badge ${isActive ? 'status-completed' : 'status-cancelled'}">
                    <span class="user-status-indicator ${isActive ? 'status-online' : 'status-offline'}"></span>
                    ${isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="user-table-actions">
                    <button class="btn btn-sm btn-primary" onclick="openUpdateModal(${user.id})" title="Edit User">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm ${isActive ? 'btn-warning' : 'btn-success'}" onclick="toggleUserStatus(${user.id})" title="${isActive ? 'Deactivate' : 'Activate'} User">
                        <i class="fas ${isActive ? 'fa-user-slash' : 'fa-user-check'}"></i>
                    </button>
                </div>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });

    // Update user stats
    updateUserStats();
}

// Update user statistics
function updateUserStats() {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.active === undefined || u.active).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const verifiedUsers = users.filter(u => u.emailVerified).length;

    // Update stats cards if they exist
    const stats = {
        'total-users-stat': totalUsers,
        'active-users-stat': activeUsers,
        'admin-users-stat': adminUsers,
        'verified-users-stat': verifiedUsers
    };

    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Add new user
function openAddUserModal() {
    document.getElementById('add-user-modal').style.display = 'flex';
    document.getElementById('add-user-form').reset();
    
    // Setup password strength indicator for add user form
    const addPasswordInput = document.getElementById('add-password');
    if (addPasswordInput) {
        // Remove existing strength indicator if any
        const existingIndicator = addPasswordInput.parentNode.querySelector('.password-strength');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create new strength indicator
        const indicator = document.createElement('div');
        indicator.className = 'password-strength';
        addPasswordInput.parentNode.appendChild(indicator);
        
        // Add event listener
        addPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthIndicator = addPasswordInput.parentNode.querySelector('.password-strength');
            const strength = calculatePasswordStrength(password);
            
            strengthIndicator.textContent = strength.text;
            strengthIndicator.className = `password-strength strength-${strength.level}`;
        });
    }
}

function closeAddUserModal() {
    document.getElementById('add-user-modal').style.display = 'none';
}

function handleAddUser(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('add-fullname').value;
    const email = document.getElementById('add-email').value;
    const password = document.getElementById('add-password').value;
    const role = document.getElementById('add-role').value;
    const active = document.getElementById('add-active').checked;

    if (!fullname || !email || !password) {
        alert('Please fill in all required fields!');
        return;
    }

    if (!isPasswordStrong(password)) {
        alert('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters!');
        return;
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        alert('User with this email already exists!');
        return;
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        fullname: fullname,
        email: email,
        password: password,
        role: role,
        emailVerified: true, // Admin created users are automatically verified
        createdAt: new Date().toISOString(),
        active: active,
        createdBy: currentUser?.id || 'system'
    };

    users.push(newUser);
    localStorage.setItem('setcam_users', JSON.stringify(users));
    
    loadUsersTable();
    closeAddUserModal();
    
    showNotification(
        'User Added Successfully',
        `User ${fullname} has been created with ${role} role.`,
        'success',
        5000,
        false,
        'current'
    );
}

// Enhanced update user functionality
function openUpdateModal(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('update-user-id').value = user.id;
    document.getElementById('update-fullname').value = user.fullname;
    document.getElementById('update-email').value = user.email;
    document.getElementById('update-role').value = user.role;
    document.getElementById('update-active').checked = user.active === undefined ? true : user.active;
    document.getElementById('update-password').value = '';

    // Make email field read-only
    const emailInput = document.getElementById('update-email');
    emailInput.readOnly = true;
    emailInput.style.backgroundColor = '#f5f5f5';
    emailInput.style.cursor = 'not-allowed';

    document.getElementById('update-user-modal').style.display = 'flex';
}

function closeUpdateModal() {
    document.getElementById('update-user-modal').style.display = 'none';
    document.getElementById('update-user-form').reset();
    
    // Reset email field properties
    const emailInput = document.getElementById('update-email');
    if (emailInput) {
        emailInput.readOnly = false;
        emailInput.style.backgroundColor = '';
        emailInput.style.cursor = '';
    }
}

function handleUserUpdate(event) {
    event.preventDefault();
    
    const userId = parseInt(document.getElementById('update-user-id').value);
    const fullname = document.getElementById('update-fullname').value;
    const email = document.getElementById('update-email').value;
    const role = document.getElementById('update-role').value;
    const active = document.getElementById('update-active').checked;
    const password = document.getElementById('update-password').value;

    if (!fullname || !email) {
        alert('Please fill in all required fields!');
        return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Don't check for email duplicates since email is read-only
    user.fullname = fullname;
    user.role = role;
    user.active = active;
    
    if (password) {
        if (!isPasswordStrong(password)) {
            alert('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters!');
            return;
        }
        user.password = password;
    }

    localStorage.setItem('setcam_users', JSON.stringify(users));
    
    // Update current user data if they updated their own profile
    if (currentUser && currentUser.id === userId) {
        currentUser.fullname = fullname;
        currentUser.email = email;
        currentUser.role = role;
        localStorage.setItem('setcam_currentUser', JSON.stringify(currentUser));
        updateUI();
    }

    loadUsersTable();
    closeUpdateModal();
    
    showNotification(
        'User Updated Successfully',
        `User ${fullname} has been updated.`,
        'success',
        5000,
        false,
        'current'
    );
}

// Enhanced user status toggle
function toggleUserStatus(userId) {
    if (userId === currentUser?.id) {
        alert('You cannot deactivate your own account!');
        return;
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Handle users without active property
    const currentStatus = user.active === undefined ? true : user.active;
    
    const action = currentStatus ? 'deactivate' : 'activate';
    const confirmMessage = currentStatus 
        ? `Are you sure you want to deactivate ${user.fullname}? They will not be able to login.`
        : `Are you sure you want to activate ${user.fullname}?`;

    if (!confirm(confirmMessage)) return;
    
    user.active = !currentStatus;
    localStorage.setItem('setcam_users', JSON.stringify(users));
    loadUsersTable();
    
    showNotification(
        `User ${action === 'deactivate' ? 'Deactivated' : 'Activated'}`,
        `${user.fullname} has been ${action === 'deactivate' ? 'deactivated' : 'activated'}.`,
        'success',
        5000,
        false,
        'current'
    );
}

// Delete user with confirmation
function deleteUser(userId) {
    if (userId === currentUser?.id) {
        alert('You cannot delete your own account!');
        return;
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (!confirm(`Are you sure you want to permanently delete ${user.fullname}? This action cannot be undone and will remove all their data.`)) {
        return;
    }

    // Remove user from users array
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('setcam_users', JSON.stringify(users));
    
    // Clean up user data
    cleanupUserData(userId);
    
    loadUsersTable();
    
    showNotification(
        'User Deleted',
        `${user.fullname} has been permanently deleted.`,
        'success',
        5000,
        false,
        'current'
    );
}

// Enhanced user search and filter functionality
function setupUserSearchAndFilter() {
    const userSearch = document.getElementById('user-search');
    const roleFilter = document.getElementById('role-filter');
    const statusFilter = document.getElementById('user-status-filter');

    if (userSearch) {
        userSearch.addEventListener('input', debounce(loadUsersTable, 300));
    }
    
    if (roleFilter) {
        roleFilter.addEventListener('change', loadUsersTable);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadUsersTable);
    }
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced user management initialization
function initializeUserManagement() {
    setupUserSearchAndFilter();
    loadUsersTable();
    
    // Add event listeners for user management buttons
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', openAddUserModal);
    }
    
    const addUserForm = document.getElementById('add-user-form');
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleAddUser);
    }
    
    const updateUserForm = document.getElementById('update-user-form');
    if (updateUserForm) {
        updateUserForm.addEventListener('submit', handleUserUpdate);
    }
}

// Update the existing navigateToTab function to initialize user management
function navigateToTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
    
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}-tab`);
    
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
    
    if (tabName === 'settings') {
        loadSystemSettings();
    } else if (tabName === 'analytics') {
        loadRealTimeAnalytics();
    } else if (tabName === 'users') {
        initializeUserManagement();
    }
}

// Add this to your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing initialization code ...
    
    // Initialize user management when admin page loads
    if (document.getElementById('users-tab')) {
        initializeUserManagement();
    }
});

// ========== FIXED IMAGE PREVIEW FUNCTIONALITY ==========
function setupImagePreview() {
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.classList.contains('clickable-image') || 
            target.closest('.preview-image-container') || 
            target.classList.contains('preview-overlay') ||
            target.closest('.preview-overlay')) {
            
            let imgElement;
            
            if (target.classList.contains('clickable-image')) {
                imgElement = target;
            } else {
                const container = target.closest('.preview-image-container');
                if (container) {
                    imgElement = container.querySelector('img.clickable-image');
                }
            }
            
            if (imgElement && imgElement.src) {
                openImagePreview(imgElement.src);
            }
        }
    });
}

function openImagePreview(src) {
    const modal = document.getElementById('image-preview-modal');
    const previewImg = document.getElementById('image-preview');
    
    if (modal && previewImg) {
        previewImg.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImagePreview() {
    const modal = document.getElementById('image-preview-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        const previewImg = document.getElementById('image-preview');
        if (previewImg) {
            previewImg.src = '';
        }
    }
}

// ========== ENHANCED LOCALHOST WARNING DESIGN ==========
function showLocalhostWarning() {
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.hostname === '';
    
    if (isLocalhost) {
        if (localStorage.getItem('localhost_warning_dismissed')) {
            return;
        }
        
        const warningModal = document.createElement('div');
        warningModal.id = 'localhost-warning-modal';
        warningModal.className = 'localhost-warning-modal';
        warningModal.innerHTML = `
            <div class="localhost-warning-content">
                <div class="localhost-warning-icon">
                    <i class="fas fa-laptop-code"></i>
                </div>
                <h2 class="localhost-warning-title">Development Mode Active</h2>
                <p class="localhost-warning-message">
                    You are currently running the SETCAM application in localhost mode. 
                    Some features like email sending and real payment processing are simulated for testing purposes.
                </p>
                
                <div class="localhost-features">
                    <h4><i class="fas fa-info-circle"></i> Local Mode Features:</h4>
                    <ul>
                        <li>Email verification codes displayed on screen</li>
                        <li>Payment processing is simulated (no real transactions)</li>
                        <li>All data stored in browser localStorage</li>
                        <li>Full functionality available for testing</li>
                        <li>Admin login: admin@setcam.com / admin123</li>
                    </ul>
                </div>
                
                <div class="localhost-warning-actions">
                    <button class="localhost-warning-btn primary" onclick="closeLocalhostWarning(true)">
                        <i class="fas fa-rocket"></i> Got It, Let's Go!
                    </button>
                    <button class="localhost-warning-btn secondary" onclick="showLocalhostHelp()">
                        <i class="fas fa-question-circle"></i> Need Help?
                    </button>
                </div>
                
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #eee;">
                    <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #666; cursor: pointer;">
                        <input type="checkbox" id="dont-show-again">
                        Don't show this message again
                    </label>
                </div>
            </div>
        `;
        
        document.body.appendChild(warningModal);
        
        document.addEventListener('keydown', function localhostKeyHandler(e) {
            if (e.key === 'Escape') {
                closeLocalhostWarning(false);
                document.removeEventListener('keydown', localhostKeyHandler);
            }
        });
    }
}

function closeLocalhostWarning(permanent = false) {
    const warningModal = document.getElementById('localhost-warning-modal');
    
    if (permanent) {
        const dontShowAgain = document.getElementById('dont-show-again');
        if (dontShowAgain && dontShowAgain.checked) {
            localStorage.setItem('localhost_warning_dismissed', 'true');
        }
    }
    
    if (warningModal) {
        warningModal.remove();
    }
}

function showLocalhostHelp() {
    const helpModal = document.createElement('div');
    helpModal.className = 'localhost-warning-modal';
    helpModal.innerHTML = `
        <div class="localhost-warning-content" style="max-width: 600px;">
            <div class="localhost-warning-icon">
                <i class="fas fa-life-ring"></i>
            </div>
            <h2 class="localhost-warning-title">SETCAM Localhost Help</h2>
            
            <div class="localhost-features">
                <h4><i class="fas fa-key"></i> Quick Access Credentials:</h4>
                <ul>
                    <li><strong>Admin Login:</strong> admin@setcam.com / admin123</li>
                    <li><strong>Keyboard Shortcut:</strong> Press Ctrl + A to auto-fill admin credentials</li>
                </ul>
            </div>
            
            <div class="localhost-features">
                <h4><i class="fas fa-flask"></i> Testing Features:</h4>
                <ul>
                    <li>Email verification codes appear on screen (no real emails sent)</li>
                    <li>All data is stored in your browser's localStorage</li>
                    <li>Payment processing is completely simulated</li>
                    <li>Appointment booking works with simulated payment verification</li>
                </ul>
            </div>
            
            <div class="localhost-warning-actions">
                <button class="localhost-warning-btn primary" onclick="this.closest('.localhost-warning-modal').remove()">
                    <i class="fas fa-check"></i> Understood
                </button>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('localhost-warning-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.appendChild(helpModal);
}

// ========== INITIALIZE THE FIXES ==========
// Add this to your existing DOMContentLoaded event listener:
document.addEventListener('DOMContentLoaded', function() {
    // Your existing code...
    
    // Add these two lines:
    setupImagePreview();
    showLocalhostWarning();
});