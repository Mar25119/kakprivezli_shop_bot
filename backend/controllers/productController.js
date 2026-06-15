const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId })
      .populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Increment views
    product.views += 1;
    await product.save();
    
    // Add to viewed history
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { 
          viewedProducts: { 
            product: product._id, 
            viewedAt: new Date() 
          } 
        }
      });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'viewedProducts.product',
        populate: { path: 'category' }
      });
    
    const recommendations = user.viewedProducts
      .slice(0, 10)
      .map(item => item.product);
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Toggle favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    
    const index = user.favorites.indexOf(productId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(productId);
    }
    
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        populate: { path: 'category' }
      });
    
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};