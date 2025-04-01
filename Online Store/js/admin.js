// Admin Authentication
const ADMIN_EMAIL = 'admin@apna.com';
const ADMIN_PASSWORD = 'admin234';

// DOM Elements
const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const productDialog = document.getElementById('product-dialog');
const productForm = document.getElementById('product-form');
const addProductBtn = document.getElementById('add-product-btn');
const saveProductBtn = document.getElementById('save-product');
const cancelProductBtn = document.getElementById('cancel-product');

// Navigation
const navLinks = document.querySelectorAll('.mdl-navigation__link');
const sections = document.querySelectorAll('.admin-section');

// Authentication Functions
function login(email, password) {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';
        sessionStorage.setItem('adminLoggedIn', 'true');
        showToast('Welcome, Admin!');
        loadDashboardData();
    } else {
        showToast('Invalid credentials!');
    }
}

function logout() {
    loginContainer.style.display = 'flex';
    adminContainer.style.display = 'none';
    sessionStorage.removeItem('adminLoggedIn');
    showToast('Logged out successfully');
}

// Product Management
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCell = document.createElement('div');
        productCell.className = 'mdl-cell mdl-cell--3-col';
        productCell.innerHTML = `
            <div class="mdl-card mdl-shadow--2dp product-card">
                <div class="mdl-card__title" style="background-image: url('${product.image}')">
                    <h2 class="mdl-card__title-text">${product.name}</h2>
                </div>
                <div class="mdl-card__supporting-text">
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p>${product.description}</p>
                </div>
                <div class="mdl-card__menu">
                    <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" 
                            onclick="editProduct(${product.id})">
                        <i class="material-icons">edit</i>
                    </button>
                    <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" 
                            onclick="deleteProduct(${product.id})">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCell);
    });
}

function addProduct(productData) {
    const newProduct = {
        id: products.length + 1,
        ...productData
    };
    products.push(newProduct);
    loadProducts();
    showToast('Product added successfully');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-image').value = product.image;
        
        saveProductBtn.dataset.productId = productId;
        productDialog.showModal();
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products.splice(index, 1);
            loadProducts();
            showToast('Product deleted successfully');
        }
    }
}

// Analytics Data
function loadAnalytics() {
    // Sales Chart
    const salesCtx = document.getElementById('sales-chart').getContext('2d');
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#3f51b5',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Products Chart
    const productsCtx = document.getElementById('products-chart').getContext('2d');
    new Chart(productsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Fashion', 'Home & Living', 'Books'],
            datasets: [{
                data: [30, 25, 20, 15],
                backgroundColor: [
                    '#3f51b5',
                    '#ff4081',
                    '#4caf50',
                    '#ffc107'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Utility Functions
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Event Listeners
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

logoutBtn.addEventListener('click', logout);

addProductBtn.addEventListener('click', () => {
    productForm.reset();
    saveProductBtn.dataset.productId = '';
    productDialog.showModal();
});

saveProductBtn.addEventListener('click', () => {
    const productData = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value
    };

    const productId = saveProductBtn.dataset.productId;
    if (productId) {
        // Edit existing product
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            showToast('Product updated successfully');
        }
    } else {
        // Add new product
        addProduct(productData);
    }

    productDialog.close();
    loadProducts();
});

cancelProductBtn.addEventListener('click', () => {
    productDialog.close();
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        sections.forEach(section => {
            section.style.display = section.id === `${targetId}-section` ? 'block' : 'none';
        });
    });
});

// Check if admin is logged in
window.addEventListener('load', () => {
    if (sessionStorage.getItem('adminLoggedIn')) {
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';
        loadDashboardData();
    }
});

// Initialize dashboard data
function loadDashboardData() {
    loadProducts();
    loadAnalytics();
}
