// Sample product data
const products = [
    {
        id: 1,
        name: "Smartphone X",
        price: 29999,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: 4,
        description: "Latest smartphone with advanced features"
    },
    {
        id: 2,
        name: "Wireless Headphones",
        price: 3499,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: 5,
        description: "Premium sound quality with noise cancellation"
    },
    {
        id: 3,
        name: "Men's Casual Shirt",
        price: 1299,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: 4,
        description: "Comfortable and stylish casual shirt"
    },
    {
        id: 4,
        name: "Women's Summer Dress",
        price: 1999,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: 5,
        description: "Light and breezy summer dress"
    },
    {
        id: 5,
        name: "Non-Stick Cookware Set",
        price: 4999,
        category: "home",
        image: "https://images.unsplash.com/photo-1583778176476-4a8b02a64c01?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: 4,
        description: "Complete set of non-stick cookware"
    },
    {
        id: 6,
        name: "Blender",
        price: 2499,
        category: "home",
        image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: 3,
        description: "Powerful blender for all your kitchen needs"
    },
    {
        id: 7,
        name: "Smart Watch",
        price: 8999,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: 4,
        description: "Track your fitness and stay connected"
    },
    {
        id: 8,
        name: "Cotton Bed Sheets",
        price: 1799,
        category: "home",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        rating: 5,
        description: "Soft and comfortable cotton bed sheets"
    }
];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const cartCount = document.querySelector('.cart-count');
const cartOverlay = document.getElementById('cart');
const cartItemsContainer = document.querySelector('.cart-items');
const totalAmount = document.querySelector('.total-amount');
const closeCartBtn = document.querySelector('.close-cart');
const checkoutBtn = document.querySelector('.checkout-btn');
const contactForm = document.getElementById('contact-form');

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
function init() {
    renderProducts(products);
    updateCartCount();
    setupEventListeners();
}

// Render products to the page
function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p class="no-products">No products found</p>';
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Generate star rating
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= product.rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="product-rating">${stars}</div>
                <p class="product-price">₹${product.price.toLocaleString()}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to all add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCart();
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show cart overlay
function showCart() {
    cartOverlay.classList.add('active');
    renderCartItems();
}

// Hide cart overlay
function hideCart() {
    cartOverlay.classList.remove('active');
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalAmount.textContent = '₹0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">₹${item.price.toLocaleString()}</p>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `₹${total.toLocaleString()}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Decrease item quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

// Increase item quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

// Remove item from cart
function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update cart in localStorage and UI
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Filter products by category
function filterProducts() {
    const category = categoryFilter.value;
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    // Sort products
    sortProducts(filteredProducts);
}

// Sort products
function sortProducts(productsToSort) {
    const sortValue = sortBy.value;
    let sortedProducts = [...productsToSort];
    
    switch (sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Default sorting (no change)
            break;
    }
    
    renderProducts(sortedProducts);
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    categoryFilter.addEventListener('change', filterProducts);
    
    // Sort by
    sortBy.addEventListener('change', filterProducts);
    
    // Cart toggle
    document.querySelector('.cart-icon a').addEventListener('click', (e) => {
        e.preventDefault();
        showCart();
    });
    
    // Close cart
    closeCartBtn.addEventListener('click', hideCart);
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        alert('Thank you for your purchase!');
        cart = [];
        updateCart();
        hideCart();
    });
    
    // Contact form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send this data to a server
        alert(`Thank you, ${name}! Your message has been received. We'll contact you at ${email} soon.`);
        contactForm.reset();
    });
    
    // Close cart when clicking outside
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            hideCart();
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);