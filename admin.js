// Admin Panel JavaScript for SkateShop Pro

// Global variables
let currentUser = null;
let products = [];
let orders = [];
let users = [];
let currentEditingProduct = null;

// API Configuration
const API_BASE = window.location.origin;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    loadDashboardData();
    setupEventListeners();
});

// Check if user is authenticated and is admin
function checkAdminAuth() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
        redirectToLogin();
        return;
    }
    
    try {
        currentUser = JSON.parse(userData);
        if (currentUser.role !== 'admin') {
            alert('Accesso negato. Solo gli amministratori possono accedere a questa pagina.');
            redirectToLogin();
            return;
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
        redirectToLogin();
    }
}

function redirectToLogin() {
    window.location.href = '/index.html';
}

function setupEventListeners() {
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// Dashboard functions
async function loadDashboardData() {
    showLoading(true);
    
    try {
        await Promise.all([
            loadProducts(),
            loadOrders(),
            loadUsers()
        ]);
        
        updateDashboardStats();
        loadRecentOrders();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Errore nel caricamento dei dati', 'error');
    } finally {
        showLoading(false);
    }
}

function updateDashboardStats() {
    const statsGrid = document.getElementById('statsGrid');
    
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalUsers = users.filter(u => u.role === 'user').length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const lowStockProducts = products.filter(product => product.stock < 5).length;
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${totalProducts}</div>
            <div class="stat-label">Prodotti</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${totalOrders}</div>
            <div class="stat-label">Ordini Totali</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${totalUsers}</div>
            <div class="stat-label">Utenti</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">€${totalRevenue.toFixed(2)}</div>
            <div class="stat-label">Fatturato</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${pendingOrders}</div>
            <div class="stat-label">Ordini in Attesa</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${lowStockProducts}</div>
            <div class="stat-label">Stock Basso</div>
        </div>
    `;
}

function loadRecentOrders() {
    const recentOrdersContainer = document.getElementById('recentOrders');
    const recentOrders = orders.slice(0, 5);
    
    if (recentOrders.length === 0) {
        recentOrdersContainer.innerHTML = '<p>Nessun ordine recente</p>';
        return;
    }
    
    recentOrdersContainer.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID Ordine</th>
                    <th>Data</th>
                    <th>Totale</th>
                    <th>Stato</th>
                </tr>
            </thead>
            <tbody>
                ${recentOrders.map(order => `
                    <tr>
                        <td>#${order.id.substring(0, 8)}</td>
                        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>€${order.total}</td>
                        <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Products functions
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/api/products`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            products = data.products;
            displayProducts();
            updateCategoryFilter();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Errore nel caricamento dei prodotti', 'error');
    }
}

function displayProducts() {
    const tbody = document.getElementById('productsTableBody');
    
    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-image-small"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>€${product.price.toFixed(2)}</td>
            <td>
                <span style="color: ${product.stock < 5 ? '#ff0066' : '#00ffff'}">
                    ${product.stock}
                </span>
            </td>
            <td>${product.category}</td>
            <td>
                <button class="action-btn secondary" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function updateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilterAdmin');
    const categories = [...new Set(products.map(p => p.category))];
    
    categoryFilter.innerHTML = '<option value="">Tutte le categorie</option>' +
        categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilterAdmin').value;
    
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.brand.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    displayFilteredProducts(filteredProducts);
}

function displayFilteredProducts(filteredProducts) {
    const tbody = document.getElementById('productsTableBody');
    
    tbody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}" class="product-image-small"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>€${product.price.toFixed(2)}</td>
            <td>
                <span style="color: ${product.stock < 5 ? '#ff0066' : '#00ffff'}">
                    ${product.stock}
                </span>
            </td>
            <td>${product.category}</td>
            <td>
                <button class="action-btn secondary" onclick="editProduct('${product.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteProduct('${product.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showAddProductForm() {
    currentEditingProduct = null;
    document.getElementById('productModalTitle').textContent = 'Aggiungi Prodotto';
    document.getElementById('productForm').reset();
    document.getElementById('productModal').classList.add('active');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentEditingProduct = product;
    document.getElementById('productModalTitle').textContent = 'Modifica Prodotto';
    
    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productBrand').value = product.brand;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOriginalPrice').value = product.originalPrice || '';
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productFeatures').value = product.features ? product.features.join('\n') : '';
    document.getElementById('productFeatured').checked = product.featured || false;
    
    document.getElementById('productModal').classList.add('active');
}

async function saveProduct(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = {
        name: formData.get('name'),
        brand: formData.get('brand'),
        price: parseFloat(formData.get('price')),
        originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null,
        category: formData.get('category'),
        stock: parseInt(formData.get('stock')),
        image: formData.get('image'),
        description: formData.get('description'),
        features: formData.get('features') ? formData.get('features').split('\n').filter(f => f.trim()) : [],
        featured: formData.has('featured'),
        inStock: parseInt(formData.get('stock')) > 0,
        rating: 4.5, // Default rating
        reviews: 0 // Default reviews
    };
    
    showLoading(true);
    
    try {
        let response;
        
        if (currentEditingProduct) {
            // Update existing product
            response = await fetch(`${API_BASE}/api/admin/products/${currentEditingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(productData)
            });
        } else {
            // Create new product
            response = await fetch(`${API_BASE}/api/admin/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(productData)
            });
        }
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification(
                currentEditingProduct ? 'Prodotto aggiornato con successo!' : 'Prodotto creato con successo!',
                'success'
            );
            closeProductModal();
            loadProducts();
            updateDashboardStats();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('Errore nel salvataggio del prodotto', 'error');
    } finally {
        showLoading(false);
    }
}

async function deleteProduct(productId) {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Prodotto eliminato con successo!', 'success');
            loadProducts();
            updateDashboardStats();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Errore nell\'eliminazione del prodotto', 'error');
    } finally {
        showLoading(false);
    }
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    currentEditingProduct = null;
}

// Orders functions
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE}/api/admin/orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            orders = data;
            displayOrders();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Errore nel caricamento degli ordini', 'error');
    }
}

function displayOrders() {
    const tbody = document.getElementById('ordersTableBody');
    
    tbody.innerHTML = orders.map(order => {
        const user = users.find(u => u.id === order.userId);
        return `
            <tr>
                <td>#${order.id.substring(0, 8)}</td>
                <td>${user ? user.name : 'Utente non trovato'}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>€${order.total}</td>
                <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
                <td>
                    <select onchange="updateOrderStatus('${order.id}', this.value)" style="background: #2a2a2a; color: #fff; border: 1px solid #333; padding: 5px;">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>In Attesa</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>In Elaborazione</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Spedito</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Consegnato</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Annullato</option>
                    </select>
                    <button class="action-btn secondary" onclick="viewOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function updateOrderStatus(orderId, newStatus) {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Stato ordine aggiornato con successo!', 'success');
            loadOrders();
            updateDashboardStats();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('Errore nell\'aggiornamento dello stato', 'error');
    } finally {
        showLoading(false);
    }
}

function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const user = users.find(u => u.id === order.userId);
    
    const details = `
        Ordine: #${order.id}
        Cliente: ${user ? user.name : 'Utente non trovato'}
        Email: ${user ? user.email : 'N/A'}
        Data: ${new Date(order.createdAt).toLocaleString()}
        Stato: ${getStatusLabel(order.status)}
        Totale: €${order.total}
        
        Indirizzo di spedizione:
        ${order.shippingAddress.name}
        ${order.shippingAddress.address}
        ${order.shippingAddress.city}, ${order.shippingAddress.zip}
        Tel: ${order.shippingAddress.phone}
        
        Metodo di pagamento: ${order.paymentMethod}
        
        Prodotti:
        ${order.items.map(item => `- ${item.productName} x${item.quantity} = €${item.subtotal}`).join('\n')}
    `;
    
    alert(details);
}

function filterOrders() {
    const searchTerm = document.getElementById('orderSearch').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredOrders = orders.filter(order => {
        const user = users.find(u => u.id === order.userId);
        const matchesSearch = order.id.toLowerCase().includes(searchTerm) ||
                            (user && user.name.toLowerCase().includes(searchTerm));
        const matchesStatus = !statusFilter || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    displayFilteredOrders(filteredOrders);
}

function displayFilteredOrders(filteredOrders) {
    const tbody = document.getElementById('ordersTableBody');
    
    tbody.innerHTML = filteredOrders.map(order => {
        const user = users.find(u => u.id === order.userId);
        return `
            <tr>
                <td>#${order.id.substring(0, 8)}</td>
                <td>${user ? user.name : 'Utente non trovato'}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>€${order.total}</td>
                <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
                <td>
                    <select onchange="updateOrderStatus('${order.id}', this.value)" style="background: #2a2a2a; color: #fff; border: 1px solid #333; padding: 5px;">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>In Attesa</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>In Elaborazione</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Spedito</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Consegnato</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Annullato</option>
                    </select>
                    <button class="action-btn secondary" onclick="viewOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Users functions
async function loadUsers() {
    // Since we don't have a users endpoint in the backend, we'll simulate it
    // In a real application, you would fetch users from the API
    users = [
        {
            id: '1',
            email: 'admin@skateshop.com',
            name: 'Admin User',
            role: 'admin',
            createdAt: new Date('2024-01-01')
        },
        {
            id: '2',
            email: 'user@example.com',
            name: 'John Skater',
            role: 'user',
            createdAt: new Date('2024-01-15')
        }
    ];
    
    displayUsers();
}

function displayUsers() {
    const tbody = document.getElementById('usersTableBody');
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="status-badge ${user.role === 'admin' ? 'status-completed' : 'status-pending'}">
                    ${user.role === 'admin' ? 'Admin' : 'Utente'}
                </span>
            </td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                ${user.role !== 'admin' ? `
                    <button class="action-btn secondary" onclick="viewUserDetails('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function viewUserDetails(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const userOrders = orders.filter(o => o.userId === userId);
    const totalSpent = userOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    
    const details = `
        Nome: ${user.name}
        Email: ${user.email}
        Ruolo: ${user.role}
        Data registrazione: ${new Date(user.createdAt).toLocaleDateString()}
        
        Statistiche:
        - Ordini totali: ${userOrders.length}
        - Spesa totale: €${totalSpent.toFixed(2)}
    `;
    
    alert(details);
}

function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    
    const filteredUsers = users.filter(user => {
        return user.name.toLowerCase().includes(searchTerm) ||
               user.email.toLowerCase().includes(searchTerm);
    });
    
    displayFilteredUsers(filteredUsers);
}

function displayFilteredUsers(filteredUsers) {
    const tbody = document.getElementById('usersTableBody');
    
    tbody.innerHTML = filteredUsers.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="status-badge ${user.role === 'admin' ? 'status-completed' : 'status-pending'}">
                    ${user.role === 'admin' ? 'Admin' : 'Utente'}
                </span>
            </td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                ${user.role !== 'admin' ? `
                    <button class="action-btn secondary" onclick="viewUserDetails('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Navigation functions
function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            updateDashboardStats();
            loadRecentOrders();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// Utility functions
function getStatusLabel(status) {
    const statusLabels = {
        'pending': 'In Attesa',
        'processing': 'In Elaborazione',
        'shipped': 'Spedito',
        'delivered': 'Consegnato',
        'cancelled': 'Annullato'
    };
    return statusLabels[status] || status;
}

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

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function logout() {
    if (confirm('Sei sicuro di voler effettuare il logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = '/index.html';
    }
}

console.log('🛹 Admin Panel initialized successfully!');
console.log('👤 Current admin:', currentUser?.name);