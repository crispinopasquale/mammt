// SkateShop Pro - E-commerce JavaScript

// Global variables
let currentUser = null;
let products = [];
let cart = [];
let currentPage = 'home';
let isLoggedIn = false;

// API Configuration
const API_BASE = window.location.origin;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
    loadProducts();
});

// Initialize application
function initializeApp() {
    showPage('home');
    updateCartUI();
    loadFeaturedProducts();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            closeUserMenu();
        }
    });
}

// Authentication functions
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            currentUser = JSON.parse(userData);
            isLoggedIn = true;
            updateAuthUI();
            loadCart();
        } catch (error) {
            console.error('Error parsing user data:', error);
            logout();
        }
    }
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userActions = document.getElementById('userActions');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');

    if (isLoggedIn && currentUser) {
        authButtons.style.display = 'none';
        userActions.style.display = 'block';
        userInfo.style.display = 'block';
        userName.textContent = currentUser.name;
        userEmail.textContent = currentUser.email;
    } else {
        authButtons.style.display = 'block';
        userActions.style.display = 'none';
        userInfo.style.display = 'none';
    }
}

async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            currentUser = data.user;
            isLoggedIn = true;
            updateAuthUI();
            closeAuthModals();
            showNotification('Login effettuato con successo!', 'success');
            loadCart();
        } else {
            showNotification(data.message || 'Errore durante il login', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Errore di connessione', 'error');
    } finally {
        showLoading(false);
    }
}

async function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            currentUser = data.user;
            isLoggedIn = true;
            updateAuthUI();
            closeAuthModals();
            showNotification('Registrazione completata con successo!', 'success');
            loadCart();
        } else {
            showNotification(data.message || 'Errore durante la registrazione', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showNotification('Errore di connessione', 'error');
    } finally {
        showLoading(false);
    }
}

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    currentUser = null;
    isLoggedIn = false;
    cart = [];
    updateAuthUI();
    updateCartUI();
    showNotification('Logout effettuato con successo!', 'success');
    showPage('home');
}

// Product functions
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products`);
        const data = await response.json();
        
        if (response.ok) {
            products = data.products;
            updateFilters(data.categories, data.brands);
            displayProducts(products);
        } else {
            console.error('Error loading products:', data.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products?featured=true&limit=6`);
        const data = await response.json();
        
        if (response.ok) {
            displayFeaturedProducts(data.products);
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

function displayProducts(productsToShow) {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function displayFeaturedProducts(productsToShow) {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    
    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
            ${!product.inStock ? '<div class="out-of-stock-badge">Esaurito</div>' : ''}
        </div>
        <div class="product-info">
            <div class="product-brand">${product.brand}</div>
            <h3>${product.name}</h3>
            <div class="product-price">
                <span class="current-price">€${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">€${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="rating-text">(${product.reviews})</span>
            </div>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${!product.inStock ? 'Esaurito' : 'Aggiungi al Carrello'}
                </button>
                <button class="quick-view-btn" onclick="showProductModal('${product.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

function updateFilters(categories, brands) {
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    
    if (categoryFilter) {
        categoryFilter.innerHTML = '<option value="all">Tutte le Categorie</option>';
        categories.forEach(category => {
            categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
        });
    }
    
    if (brandFilter) {
        brandFilter.innerHTML = '<option value="all">Tutti i Brand</option>';
        brands.forEach(brand => {
            brandFilter.innerHTML += `<option value="${brand}">${brand}</option>`;
        });
    }
}

async function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const brand = document.getElementById('brandFilter').value;
    const sort = document.getElementById('sortFilter').value;
    
    let url = `${API_BASE}/api/products?`;
    
    if (category !== 'all') url += `category=${encodeURIComponent(category)}&`;
    if (brand !== 'all') url += `brand=${encodeURIComponent(brand)}&`;
    if (sort) url += `sort=${sort}&`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok) {
            displayProducts(data.products);
        }
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

function filterByCategory(category) {
    showPage('products');
    setTimeout(() => {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = category;
            applyFilters();
        }
    }, 100);
}

async function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!searchTerm) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/products?search=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (response.ok) {
            showPage('products');
            setTimeout(() => {
                displayProducts(data.products);
            }, 100);
        }
    } catch (error) {
        console.error('Error searching products:', error);
    }
}

// Product Modal
async function showProductModal(productId) {
    try {
        const response = await fetch(`${API_BASE}/api/products/${productId}`);
        const product = await response.json();
        
        if (response.ok) {
            displayProductModal(product);
        }
    } catch (error) {
        console.error('Error loading product details:', error);
    }
}

function displayProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('productModalBody');
    
    const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    
    modalBody.innerHTML = `
        <div class="product-modal-images">
            <img src="${product.image}" alt="${product.name}" class="main-product-image" id="mainProductImage">
            ${product.images && product.images.length > 1 ? `
                <div class="product-thumbnails">
                    ${product.images.map((img, index) => `
                        <img src="${img}" alt="${product.name}" class="thumbnail ${index === 0 ? 'active' : ''}" 
                             onclick="changeMainImage('${img}', this)">
                    `).join('')}
                </div>
            ` : ''}
        </div>
        <div class="product-modal-info">
            <div class="product-modal-brand">${product.brand}</div>
            <h2>${product.name}</h2>
            <div class="product-modal-price">
                <span class="current-price">€${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">€${product.originalPrice.toFixed(2)}</span>` : ''}
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
            </div>
            <div class="product-modal-rating">
                <div class="stars">${generateStars(product.rating)}</div>
                <span class="reviews">(${product.reviews} recensioni)</span>
            </div>
            <div class="product-description">
                <p>${product.description}</p>
            </div>
            ${product.features ? `
                <div class="product-features">
                    <h4>Caratteristiche:</h4>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div class="stock-info">
                ${product.inStock ? 
                    `<span class="in-stock"><i class="fas fa-check"></i> Disponibile (${product.stock} pezzi)</span>` :
                    `<span class="out-of-stock"><i class="fas fa-times"></i> Esaurito</span>`
                }
            </div>
            <div class="product-modal-actions">
                <button class="btn-primary" onclick="addToCart('${product.id}')" ${!product.inStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${!product.inStock ? 'Esaurito' : 'Aggiungi al Carrello'}
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function changeMainImage(imageSrc, thumbnail) {
    document.getElementById('mainProductImage').src = imageSrc;
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Cart functions
async function addToCart(productId) {
    if (!isLoggedIn) {
        showLoginModal();
        showNotification('Effettua il login per aggiungere prodotti al carrello', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Prodotto aggiunto al carrello!', 'success');
            loadCart();
        } else {
            showNotification(data.message || 'Errore durante l\'aggiunta al carrello', 'error');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotification('Errore di connessione', 'error');
    }
}

async function loadCart() {
    if (!isLoggedIn) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/cart`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            cart = data.items;
            updateCartUI();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartContent = document.getElementById('cartContent');
    const cartFooter = document.getElementById('cartFooter');
    const emptyCart = document.getElementById('emptyCart');
    const cartTotal = document.getElementById('cartTotal');
    
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    cartCount.textContent = itemCount;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartFooter.style.display = 'none';
        cartContent.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Il tuo carrello è vuoto</p></div>';
    } else {
        emptyCart.style.display = 'none';
        cartFooter.style.display = 'block';
        cartTotal.textContent = total.toFixed(2);
        
        cartContent.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.product.name}</h4>
                    <p>${item.product.brand}</p>
                    <div class="cart-item-price">€${item.product.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
}

async function updateCartItemQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/cart/update/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ quantity: newQuantity })
        });
        
        if (response.ok) {
            loadCart();
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
    }
}

async function removeFromCart(itemId) {
    try {
        const response = await fetch(`${API_BASE}/api/cart/remove/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            showNotification('Prodotto rimosso dal carrello', 'success');
            loadCart();
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

// Checkout functions
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Il carrello è vuoto', 'warning');
        return;
    }
    
    showCheckoutModal();
}

function showCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.product.name} x ${item.quantity}</span>
            <span>€${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    checkoutTotal.textContent = total.toFixed(2);
    modal.classList.add('active');
}

async function placeOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const shippingAddress = {
        name: formData.get('shippingName') || document.getElementById('shippingName').value,
        phone: formData.get('shippingPhone') || document.getElementById('shippingPhone').value,
        address: formData.get('shippingAddress') || document.getElementById('shippingAddress').value,
        city: formData.get('shippingCity') || document.getElementById('shippingCity').value,
        zip: formData.get('shippingZip') || document.getElementById('shippingZip').value
    };
    
    const paymentMethod = formData.get('paymentMethod') || document.querySelector('input[name="paymentMethod"]:checked').value;
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                shippingAddress,
                paymentMethod
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Ordine effettuato con successo!', 'success');
            closeCheckoutModal();
            toggleCart();
            cart = [];
            updateCartUI();
            
            // Show order confirmation
            setTimeout(() => {
                alert(`Ordine #${data.order.id} confermato!\nTotale: €${data.order.total}\nRiceverai una email di conferma.`);
            }, 500);
        } else {
            showNotification(data.message || 'Errore durante l\'ordine', 'error');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Errore di connessione', 'error');
    } finally {
        showLoading(false);
    }
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Navigation functions
function showPage(pageName) {
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('fade-in');
    }
    
    currentPage = pageName;
    
    // Load page-specific content
    if (pageName === 'products') {
        loadProducts();
    }
}

function scrollToFeatured() {
    document.getElementById('featuredSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Modal functions
function showLoginModal() {
    closeAllModals();
    document.getElementById('loginModal').classList.add('active');
}

function showRegisterModal() {
    closeAllModals();
    document.getElementById('registerModal').classList.add('active');
}

function closeAuthModals() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('registerModal').classList.remove('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// User menu functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

function closeUserMenu() {
    document.getElementById('userDropdown').classList.remove('active');
}

function showProfile() {
    closeUserMenu();
    showNotification('Funzionalità profilo in sviluppo', 'info');
}

function showOrders() {
    closeUserMenu();
    showNotification('Funzionalità ordini in sviluppo', 'info');
}

// Mobile menu
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Utility functions
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    spinner.style.display = show ? 'flex' : 'none';
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.className = `notification show ${type}`;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 5000);
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

// Add some CSS for additional styling
const additionalStyles = `
    .discount-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #ff0066, #cc0052);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 700;
        z-index: 1;
    }
    
    .out-of-stock-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(102, 102, 102, 0.9);
        color: white;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 700;
        z-index: 1;
    }
    
    .product-image-container {
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        margin-bottom: 15px;
    }
    
    .stock-info {
        margin: 15px 0;
        padding: 10px;
        border-radius: 8px;
        background: rgba(42, 42, 42, 0.5);
    }
    
    .in-stock {
        color: #00ffff;
        font-weight: 600;
    }
    
    .out-of-stock {
        color: #ff0066;
        font-weight: 600;
    }
    
    .rating-text {
        color: #666;
        font-size: 0.9rem;
        margin-left: 5px;
    }
    
    .notification.success {
        border-color: #00ffff;
    }
    
    .notification.error {
        border-color: #ff0066;
    }
    
    .notification.warning {
        border-color: #ffa500;
    }
    
    .notification.info {
        border-color: #666;
    }
    
    .add-to-cart-btn:disabled {
        background: #666;
        cursor: not-allowed;
        opacity: 0.6;
    }
    
    .add-to-cart-btn:disabled:hover {
        transform: none;
        box-shadow: none;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            background: rgba(15, 15, 15, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 20px;
            border-bottom: 2px solid #ff0066;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize cart animation
function animateCartAdd() {
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.1)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
}

// Add scroll effects
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 15, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 15, 15, 0.95)';
    }
});

console.log('🛹 SkateShop Pro initialized successfully!');
console.log('🔧 Backend API:', API_BASE);
console.log('👤 Demo accounts:');
console.log('   Admin: admin@skateshop.com / admin123');
console.log('   User: user@example.com / user123');