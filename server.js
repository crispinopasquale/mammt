const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'skateboard_secret_key_2024';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// In-memory database (in production, use MongoDB, PostgreSQL, etc.)
let users = [
  {
    id: '1',
    email: 'admin@skateshop.com',
    password: bcrypt.hashSync('admin123', 10),
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date()
  },
  {
    id: '2',
    email: 'user@example.com',
    password: bcrypt.hashSync('user123', 10),
    name: 'John Skater',
    role: 'user',
    createdAt: new Date()
  }
];

let products = [
  {
    id: '1',
    name: 'Santa Cruz Classic Dot',
    brand: 'Santa Cruz',
    price: 89.99,
    originalPrice: 109.99,
    category: 'Complete Boards',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    ],
    description: 'Classic Santa Cruz skateboard with iconic dot design. Perfect for street skating and tricks.',
    features: ['7-ply maple construction', 'High-quality trucks', 'ABEC-7 bearings', '52mm wheels'],
    inStock: true,
    stock: 15,
    rating: 4.8,
    reviews: 124,
    featured: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'Powell Peralta Dragon',
    brand: 'Powell Peralta',
    price: 129.99,
    originalPrice: 149.99,
    category: 'Deck Only',
    image: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    ],
    description: 'Legendary Powell Peralta deck with classic dragon graphics. A piece of skateboarding history.',
    features: ['Premium 7-ply maple', 'Classic concave', 'Vintage graphics', 'Professional grade'],
    inStock: true,
    stock: 8,
    rating: 4.9,
    reviews: 89,
    featured: true,
    createdAt: new Date()
  },
  {
    id: '3',
    name: 'Independent Trucks Stage 11',
    brand: 'Independent',
    price: 59.99,
    originalPrice: 69.99,
    category: 'Trucks',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    ],
    description: 'Industry standard Independent trucks. Reliable performance for all skating styles.',
    features: ['Forged baseplate', 'Grade 8 kingpin', '356 T6 aluminum hanger', 'Lifetime warranty'],
    inStock: true,
    stock: 25,
    rating: 4.7,
    reviews: 156,
    featured: false,
    createdAt: new Date()
  },
  {
    id: '4',
    name: 'Spitfire Formula Four Wheels',
    brand: 'Spitfire',
    price: 49.99,
    originalPrice: 59.99,
    category: 'Wheels',
    image: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=400&h=400&fit=crop'
    ],
    description: 'High-performance Formula Four wheels for maximum speed and durability.',
    features: ['Formula Four urethane', '99a durometer', '52mm diameter', 'Anti-flatspot'],
    inStock: true,
    stock: 30,
    rating: 4.6,
    reviews: 203,
    featured: false,
    createdAt: new Date()
  },
  {
    id: '5',
    name: 'Bones Red Bearings',
    brand: 'Bones',
    price: 19.99,
    originalPrice: 24.99,
    category: 'Bearings',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop'
    ],
    description: 'Classic Bones Red bearings. The standard for skateboard bearings worldwide.',
    features: ['Single non-contact rubber shield', 'Pre-lubricated', 'Skate rated', 'Set of 8'],
    inStock: true,
    stock: 50,
    rating: 4.5,
    reviews: 89,
    featured: false,
    createdAt: new Date()
  },
  {
    id: '6',
    name: 'Thrasher Magazine Deck',
    brand: 'Thrasher',
    price: 79.99,
    originalPrice: 89.99,
    category: 'Deck Only',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
    ],
    description: 'Official Thrasher Magazine skateboard deck. Represent the core of skateboarding culture.',
    features: ['7-ply North American maple', 'Medium concave', 'Classic logo', '8.25" width'],
    inStock: true,
    stock: 12,
    rating: 4.4,
    reviews: 67,
    featured: true,
    createdAt: new Date()
  }
];

let orders = [];
let cartItems = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      name,
      role: 'user',
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PRODUCT ROUTES
app.get('/api/products', (req, res) => {
  try {
    const { category, brand, featured, search, sort, limit } = req.query;
    let filteredProducts = [...products];

    // Apply filters
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand) {
      filteredProducts = filteredProducts.filter(p => 
        p.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }
    }

    // Apply limit
    if (limit) {
      filteredProducts = filteredProducts.slice(0, parseInt(limit));
    }

    res.json({
      products: filteredProducts,
      total: filteredProducts.length,
      categories: [...new Set(products.map(p => p.category))],
      brands: [...new Set(products.map(p => p.brand))]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CART ROUTES
app.get('/api/cart', authenticateToken, (req, res) => {
  try {
    const userCart = cartItems.filter(item => item.userId === req.user.id);
    const cartWithProducts = userCart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product
      };
    });
    
    const total = cartWithProducts.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );

    res.json({
      items: cartWithProducts,
      total: total.toFixed(2),
      itemCount: cartWithProducts.reduce((sum, item) => sum + item.quantity, 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/cart/add', authenticateToken, (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.inStock || product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const existingItem = cartItems.find(item => 
      item.userId === req.user.id && item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({
        id: uuidv4(),
        userId: req.user.id,
        productId,
        quantity,
        addedAt: new Date()
      });
    }

    res.json({ message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/cart/update/:itemId', authenticateToken, (req, res) => {
  try {
    const { quantity } = req.body;
    const itemIndex = cartItems.findIndex(item => 
      item.id === req.params.itemId && item.userId === req.user.id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (quantity <= 0) {
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = quantity;
    }

    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/cart/remove/:itemId', authenticateToken, (req, res) => {
  try {
    const itemIndex = cartItems.findIndex(item => 
      item.id === req.params.itemId && item.userId === req.user.id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItems.splice(itemIndex, 1);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ORDER ROUTES
app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    const userCart = cartItems.filter(item => item.userId === req.user.id);
    if (userCart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = userCart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

    const newOrder = {
      id: uuidv4(),
      userId: req.user.id,
      items: orderItems,
      total: total.toFixed(2),
      shippingAddress,
      paymentMethod,
      status: 'pending',
      createdAt: new Date()
    };

    orders.push(newOrder);

    // Clear user's cart
    cartItems = cartItems.filter(item => item.userId !== req.user.id);

    // Update product stock
    orderItems.forEach(orderItem => {
      const product = products.find(p => p.id === orderItem.productId);
      if (product) {
        product.stock -= orderItem.quantity;
        if (product.stock <= 0) {
          product.inStock = false;
        }
      }
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/orders', authenticateToken, (req, res) => {
  try {
    const userOrders = orders.filter(order => order.userId === req.user.id);
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id && o.userId === req.user.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ADMIN ROUTES
app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
  try {
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();

    res.json({ message: 'Order status updated', order: orders[orderIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/admin/products', authenticateToken, requireAdmin, (req, res) => {
  try {
    const newProduct = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date()
    };
    
    products.push(newProduct);
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/admin/products/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products[productIndex] = {
      ...products[productIndex],
      ...req.body,
      updatedAt: new Date()
    };

    res.json({ message: 'Product updated', product: products[productIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(productIndex, 1);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🛹 Skateboard E-commerce Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
  console.log(`👤 Demo Admin: admin@skateshop.com / admin123`);
  console.log(`👤 Demo User: user@example.com / user123`);
});