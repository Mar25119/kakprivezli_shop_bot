import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import useStore from './store/useStore';

// Pages
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';

// Components
import BottomNav from './components/BottomNav';

function AppContent() {
  const location = useLocation();
  const { initTelegram, fetchCategories, fetchProducts } = useStore();
  
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    tg.setHeaderColor('#1c1c1e');
    tg.setBackgroundColor('#1c1c1e');
    
    const user = tg.initDataUnsafe?.user;
    if (user) {
      fetchCategories();
      fetchProducts();
    }
  }, []);
  
  // Hide bottom nav on product detail page
  const showBottomNav = location.pathname !== '/product/:id' && 
                        !location.pathname.startsWith('/product/');
  
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;