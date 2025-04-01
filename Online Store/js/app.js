// App Configuration
const config = {
    adminEmail: 'admin@apna.com',
    adminPassword: 'admin234',
    apiBaseUrl: 'https://api.apnastore.com', // Replace with your actual API endpoint
    currency: 'USD'
};

// Store State
let state = {
    isLoggedIn: false,
    isAdmin: false,
    cart: [],
    user: null,
    products: [],
    orders: []
};

// Authentication
function checkAdminAccess(email, password) {
    return email === config.adminEmail && password === config.adminPassword;
}

function login(email, password) {
    // Check for admin login
    if (checkAdminAccess(email, password)) {
        state.isLoggedIn = true;
        state.isAdmin = true;
        state.user = { email, role: 'admin' };
        window.location.href = '/admin.html';
        return;
    }

    // Regular user login logic here
    // ...
}

// Cart Management
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (product) {
        state.cart.push({
            ...product,
            quantity: 1
        });
        updateCartUI();
        showNotification('Product added to cart');
    }
}

function removeFromCart(productId) {
    const index = state.cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        state.cart.splice(index, 1);
        updateCartUI();
        showNotification('Product removed from cart');
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = state.cart.length;
    }
}

// Product Management
function loadProducts() {
    // Fetch products from API or use local data
    state.products = products; // Using products from data.js
    renderProducts();
}

function renderProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = '';
    state.products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    return div;
}

// Notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// DOM Elements
const loggedOutMenu = document.getElementById('logged-out-menu');
const loggedInMenu = document.getElementById('logged-in-menu');
const logoutButton = document.getElementById('logout-button');
const userMenuButton = document.getElementById('user-menu-button');

// Update UI based on authentication state
function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser && currentUser.isLoggedIn) {
        loggedOutMenu.style.display = 'none';
        loggedInMenu.style.display = 'flex';
        
        // Update user menu button with first letter of name
        const userInitial = currentUser.firstName ? currentUser.firstName[0].toUpperCase() : 'U';
        userMenuButton.innerHTML = `<i class="fas fa-user-circle"></i>`;
        
        // Add user badge to menu if not exists
        const menu = document.querySelector('.mdl-menu');
        if (menu && !menu.querySelector('.user-badge')) {
            const userBadge = document.createElement('div');
            userBadge.className = 'user-badge';
            userBadge.innerHTML = `
                <div class="user-avatar">${userInitial}</div>
                <div class="user-info">
                    <p class="user-name">${currentUser.firstName} ${currentUser.lastName}</p>
                    <p class="user-email">${currentUser.email}</p>
                </div>
            `;
            menu.insertBefore(userBadge, menu.firstChild);
        }
    } else {
        loggedOutMenu.style.display = 'flex';
        loggedInMenu.style.display = 'none';
    }
}

// Event Listeners
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        window.location.reload();
    });
}

// Profile Navigation
document.getElementById('profile-link')?.addEventListener('click', () => {
    window.location.href = 'profile.html';
});

document.getElementById('orders-link')?.addEventListener('click', () => {
    window.location.href = 'orders.html';
});

document.getElementById('wishlist-link')?.addEventListener('click', () => {
    window.location.href = 'wishlist.html';
});

document.getElementById('settings-link')?.addEventListener('click', () => {
    window.location.href = 'settings.html';
});

// Initialize UI on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadProducts();
    
    // Check for admin access
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.email === config.adminEmail) {
        const adminLink = document.createElement('li');
        adminLink.className = 'mdl-menu__item';
        adminLink.innerHTML = '<i class="fas fa-shield-alt"></i> Admin Panel';
        adminLink.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
        
        const menu = document.querySelector('.mdl-menu');
        if (menu) {
            menu.insertBefore(adminLink, document.getElementById('settings-link'));
        }
    }
    
    // Check for existing session
    const adminSession = sessionStorage.getItem('adminLoggedIn');
    if (adminSession && window.location.pathname.includes('admin.html')) {
        state.isLoggedIn = true;
        state.isAdmin = true;
    }
});

// Export state and functions for admin panel
window.appState = state;
window.appFunctions = {
    login,
    addToCart,
    removeFromCart,
    loadProducts,
    showNotification
};
