import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

const BottomNav = () => {
  const location = useLocation();
  const { getCartItemsCount } = useStore();
  const cartCount = getCartItemsCount();
  
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/catalog';
    }
    return location.pathname === path;
  };
  
  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
        <span className="nav-icon">🏠</span>
        <span>Каталог</span>
      </Link>
      <Link to="/cart" className={`nav-item ${isActive('/cart') ? 'active' : ''}`}>
        <span className="nav-icon">🛒</span>
        <span>Корзина{cartCount > 0 ? ` (${cartCount})` : ''}</span>
      </Link>
      <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <span className="nav-icon">👤</span>
        <span>Профиль</span>
      </Link>
    </nav>
  );
};

export default BottomNav;