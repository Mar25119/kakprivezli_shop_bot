import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.some(fav => fav._id === product._id);
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    
    const tg = window.Telegram.WebApp;
    tg.HapticFeedback?.notificationOccurred('success');
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(product._id);
  };
  
  return (
    <div 
      className="product-card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="product-image-wrapper">
        <img 
          src={product.mainImage || 'https://via.placeholder.com/300'} 
          alt={product.name.ru}
          className="product-image"
        />
        <button 
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name.ru}</h3>
        <p className="product-price">{product.price.toLocaleString()} ₽</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Добавить
        </button>
      </div>
    </div>
  );
};

export default ProductCard;