import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const Profile = () => {
  const navigate = useNavigate();
  const { telegramUser, fetchOrders, fetchFavorites } = useStore();
  
  useEffect(() => {
    fetchOrders();
    fetchFavorites();
  }, []);
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>{telegramUser?.first_name || 'Пользователь'}</h2>
      </div>
      
      <div className="profile-menu">
        <div className="menu-item" onClick={() => navigate('/orders')}>
          <span className="menu-icon">📦</span>
          <span>Мои заказы</span>
          <span className="menu-arrow">›</span>
        </div>
        
        <div className="menu-item" onClick={() => navigate('/favorites')}>
          <span className="menu-icon">❤️</span>
          <span>Мои избранные товары</span>
          <span className="menu-arrow">›</span>
        </div>
        
        <div className="menu-item">
          <span className="menu-icon">📢</span>
          <span>Акции и новости</span>
          <span className="menu-arrow">›</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;