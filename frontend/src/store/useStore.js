import { create } from 'zustand';
import api from '../services/api';

const useStore = create((set, get) => ({
  // State
  user: null,
  telegramUser: null,
  products: [],
  categories: [],
  currentProduct: null,
  favorites: [],
  viewedProducts: [],
  cart: [],
  orders: [],
  loading: false,
  error: null,
  
  // Initialize
  initTelegram: () => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    const user = tg.initDataUnsafe?.user;
    set({ telegramUser: user });
    
    tg.setHeaderColor('#1c1c1e');
    tg.setBackgroundColor('#1c1c1e');
    
    return user;
  },
  
  // Fetch categories
  fetchCategories: async () => {
    try {
      const response = await api.get('/categories');
      set({ categories: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
  
  // Fetch products
  fetchProducts: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/products');
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Fetch product by ID
  fetchProduct: async (id) => {
    try {
      set({ loading: true });
      const response = await api.get(`/products/${id}`);
      set({ currentProduct: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Cart actions
  addToCart: (product, quantity = 1) => {
    const { cart } = get();
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      set({
        cart: cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      });
    } else {
      set({ cart: [...cart, { ...product, quantity }] });
    }
    
    get().updateMainButton();
  },
  
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(item => item._id !== productId) });
    get().updateMainButton();
  },
  
  updateCartItemQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    set({
      cart: get().cart.map(item =>
        item._id === productId ? { ...item, quantity } : item
      )
    });
    get().updateMainButton();
  },
  
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  getCartItemsCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },
  
  updateMainButton: () => {
    const tg = window.Telegram.WebApp;
    const { cart } = get();
    
    if (cart.length > 0) {
      const total = get().getCartTotal();
      const count = get().getCartItemsCount();
      tg.MainButton.setText(`КОРЗИНА (${count}) - ${total} ₽`);
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  },
  
  // Create order
  createOrder: async (customerInfo) => {
    try {
      const { cart, telegramUser } = get();
      const items = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));
      
      const response = await api.post('/orders', {
        items,
        customerInfo,
        telegramId: telegramUser?.id.toString()
      });
      
      set({ cart: [] });
      window.Telegram.WebApp.MainButton.hide();
      
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
  
  // Favorites
  toggleFavorite: async (productId) => {
    try {
      const response = await api.post('/favorites/toggle', { productId });
      set({ favorites: response.data.favorites });
    } catch (error) {
      set({ error: error.message });
    }
  },
  
  fetchFavorites: async () => {
    try {
      const response = await api.get('/favorites');
      set({ favorites: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
  
  // Orders
  fetchOrders: async () => {
    try {
      const response = await api.get('/orders');
      set({ orders: response.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
  
  // Clear error
  clearError: () => set({ error: null })
}));

export default useStore;