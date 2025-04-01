// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 149999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        category: "Electronics",
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 19999,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
        category: "Electronics",
        description: "Feature-rich smartwatch with health tracking"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 7999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        category: "Fashion",
        description: "Comfortable running shoes for athletes"
    },
    {
        id: 4,
        name: "Laptop Backpack",
        price: 4999,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
        category: "Fashion",
        description: "Spacious backpack with laptop compartment"
    },
    {
        id: 5,
        name: "Smartphone",
        price: 69999,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80",
        category: "Electronics",
        description: "Latest smartphone with advanced features"
    },
    {
        id: 6,
        name: "Coffee Maker",
        price: 12999,
        image: "https://images.unsplash.com/photo-1520970014086-2208d157c9e2?w=500&q=80",
        category: "Home & Living",
        description: "Premium coffee maker for perfect brews"
    },
    {
        id: 7,
        name: "Designer Sunglasses",
        price: 15999,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
        category: "Fashion",
        description: "Stylish sunglasses with UV protection"
    },
    {
        id: 8,
        name: "Gaming Console",
        price: 49999,
        image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500&q=80",
        category: "Electronics",
        description: "Next-gen gaming console for immersive gameplay"
    },
    {
        id: 9,
        name: "Yoga Mat",
        price: 2999,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80",
        category: "Home & Living",
        description: "Non-slip yoga mat for comfortable workouts"
    },
    {
        id: 10,
        name: "Desk Lamp",
        price: 3999,
        image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=500&q=80",
        category: "Home & Living",
        description: "LED desk lamp with adjustable brightness"
    },
    {
        id: 11,
        name: "Leather Wallet",
        price: 4599,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
        category: "Fashion",
        description: "Genuine leather wallet with RFID protection"
    },
    {
        id: 12,
        name: "Wireless Speaker",
        price: 8999,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
        category: "Electronics",
        description: "Portable bluetooth speaker with rich sound"
    },
    {
        id: 13,
        name: "Plant Pot Set",
        price: 3499,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80",
        category: "Home & Living",
        description: "Set of 3 ceramic plant pots with drainage"
    },
    {
        id: 14,
        name: "Denim Jacket",
        price: 6999,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
        category: "Fashion",
        description: "Classic denim jacket with modern fit"
    },
    {
        id: 15,
        name: "Smart Doorbell",
        price: 14999,
        image: "https://images.unsplash.com/photo-1558389186-438424b00a6b?w=500&q=80",
        category: "Electronics",
        description: "WiFi doorbell with camera and two-way audio"
    }
];

// Shopping cart
let cart = [];

// DOM Elements
const productContainer = document.getElementById('product-container');
const cartCount = document.getElementById('cart-count');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

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

// Search functionality
function searchProducts(query) {
    query = query.toLowerCase().trim();
    
    // If search is empty, show all products
    if (!query) {
        loadProducts(1);
        return;
    }
    
    const filteredProducts = products.filter(product => {
        const searchFields = [
            product.name.toLowerCase(),
            product.category.toLowerCase(),
            product.description.toLowerCase(),
            product.price.toString()
        ];
        
        // Split query into words for better matching
        const searchWords = query.split(' ');
        
        // Check if all words in query match any field
        return searchWords.every(word =>
            searchFields.some(field => field.includes(word))
        );
    });
    
    productContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try different keywords or browse our categories</p>
            </div>
        `;
        return;
    }
    
    // Sort results by relevance (exact matches first)
    filteredProducts.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().includes(query);
        const bNameMatch = b.name.toLowerCase().includes(query);
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
    });
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Highlight matching text
        const highlightText = (text, query) => {
            const words = query.split(' ');
            let highlighted = text;
            words.forEach(word => {
                if (word) {
                    const regex = new RegExp(`(${word})`, 'gi');
                    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
                }
            });
            return highlighted;
        };
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${highlightText(product.name, query)}</h3>
                <p class="product-category">${highlightText(product.category, query)}</p>
                <p class="product-description">${highlightText(product.description, query)}</p>
                <p class="product-price">Rs. ${product.price.toLocaleString('en-PK')}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        productContainer.appendChild(productCard);
    });
}

// Debounced search function for real-time updates
const debouncedSearch = debounce((query) => {
    searchProducts(query);
}, 300);

// Event listeners for search
searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

searchButton.addEventListener('click', () => {
    searchProducts(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts(searchInput.value);
    }
});

// Load products with pagination
let currentPage = 1;
const productsPerPage = 8;

function loadProducts(page = 1) {
    const start = (page - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = products.slice(start, end);
    
    if (page === 1) {
        productContainer.innerHTML = '';
    }

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">Rs. ${product.price.toLocaleString('en-PK')}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
        productContainer.appendChild(productCard);
    });

    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn && end < products.length) {
        const button = document.createElement('button');
        button.id = 'load-more';
        button.className = 'load-more';
        button.innerHTML = 'Load More <i class="fas fa-chevron-down"></i>';
        button.onclick = () => {
            currentPage++;
            loadProducts(currentPage);
        };
        productContainer.parentElement.appendChild(button);
    } else if (loadMoreBtn && end >= products.length) {
        loadMoreBtn.remove();
    }
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showNotification(`Added ${product.name} to cart!`);
    }
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
    cartCount.style.display = cart.length > 0 ? 'block' : 'none';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Add CSS animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    @keyframes slideOut {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

function formatPrice(price) {
    return `Rs. ${price.toLocaleString('en-PK')}`;
}

// Update cart UI
function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    cartCount.textContent = cart.length;

    // Update cart items
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)} x ${item.quantity}</p>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });

    // Update total
    cartTotal.textContent = formatPrice(total);
}

// Initialize search functionality
function initializeSearch() {
    // Main search
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchProducts(query);
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const header = document.querySelector('header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            header.classList.toggle('mobile-menu-open');
        });
    }
}

// Cart functionality
function initializeCart() {
    const cartButton = document.getElementById('cart-button');
    const cartDropdown = document.getElementById('cart-dropdown');
    const closeCart = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Toggle cart dropdown
    cartButton.addEventListener('click', (e) => {
        e.preventDefault();
        cartDropdown.classList.toggle('active');
    });

    closeCart.addEventListener('click', () => {
        cartDropdown.classList.remove('active');
    });

    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (!cartButton.contains(e.target) && 
            !cartDropdown.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });

    // Update cart UI
    updateCartUI();

    // Add remove item functionality
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = button.dataset.id;
            removeFromCart(itemId);
            updateCartUI();
        });
    });

    // Initialize checkout
    checkoutBtn.addEventListener('click', () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.isLoggedIn) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'checkout.html';
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initializeSearch();
    initializeCart();
    toggleMobileMenu();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
