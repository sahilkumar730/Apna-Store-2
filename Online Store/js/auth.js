// User data storage (replace with actual backend storage in production)
const users = JSON.parse(localStorage.getItem('users')) || [];

// Form elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toast = document.querySelector('.mdl-js-snackbar');

// Utility functions
function showToast(message) {
    toast.MaterialSnackbar.showSnackbar({
        message: message,
        timeout: 3000
    });
}

function validatePassword(password) {
    // At least 8 characters, 1 letter, and 1 number
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Authentication functions
function login(email, password, rememberMe) {
    const user = users.find(u => u.email === email);
    
    if (!user || user.password !== password) {
        showToast('Invalid email or password');
        return false;
    }

    // Store user session
    const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isLoggedIn: true
    };

    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
    }

    // Redirect to home page
    window.location.href = 'index.html';
    return true;
}

function register(userData) {
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
        showToast('Email already registered');
        return false;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString()
    };

    // Add to users array and save to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    login(userData.email, userData.password, false);
    return true;
}

function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Social login functions (placeholders)
function googleLogin() {
    showToast('Google login not implemented yet');
}

function facebookLogin() {
    showToast('Facebook login not implemented yet');
}

// Event Listeners
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        if (!validateEmail(email)) {
            showToast('Please enter a valid email');
            return;
        }

        login(email, password, rememberMe);
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: document.getElementById('password').value
        };

        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;

        // Validation
        if (!validateEmail(formData.email)) {
            showToast('Please enter a valid email');
            return;
        }

        if (!validatePassword(formData.password)) {
            showToast('Password must be at least 8 characters with letters and numbers');
            return;
        }

        if (formData.password !== confirmPassword) {
            showToast('Passwords do not match');
            return;
        }

        if (!terms) {
            showToast('Please accept the terms and conditions');
            return;
        }

        register(formData);
    });
}

// Social login buttons
document.querySelectorAll('.google-btn').forEach(btn => {
    btn.addEventListener('click', googleLogin);
});

document.querySelectorAll('.facebook-btn').forEach(btn => {
    btn.addEventListener('click', facebookLogin);
});

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser && currentUser.isLoggedIn) {
        // If on login/register page, redirect to home
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('register.html')) {
            window.location.href = 'index.html';
        }
    } else {
        // If not logged in and trying to access protected pages
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('register.html') &&
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
    }
});
