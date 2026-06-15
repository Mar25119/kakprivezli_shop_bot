const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/auth');

const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');

// Categories
router.get('/categories', productController.getCategories);

// Products
router.get('/products', productController.getAllProducts);
router.get('/products/category/:categoryId', productController.getProductsByCategory);
router.get('/products/:id', authenticateUser, productController.getProductById);

// Favorites
router.get('/favorites', authenticateUser, productController.getFavorites);
router.post('/favorites/toggle', authenticateUser, productController.toggleFavorite);

// Recommendations
router.get('/recommendations', authenticateUser, productController.getRecommendations);

// Orders
router.post('/orders', authenticateUser, orderController.createOrder);
router.get('/orders', authenticateUser, orderController.getUserOrders);
router.get('/orders/:id', authenticateUser, orderController.getOrderById);

module.exports = router;