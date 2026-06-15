import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProduct, fetchProduct, addToCart, favorites, toggleFavorite, loading } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    fetchProduct(id);
  }, [id]);
  
  if (loading || !currentProduct) {
    return <div className="loader"></div>;
  }
  
  const isFavorite = favorites.some(fav => fav._id === currentProduct._id);
  
  const handleAddToCart = () => {
    addToCart(currentProduct, quantity);
    navigate('/cart');
  };
  
  const handleFavoriteClick = () => {
    toggleFavorite(currentProduct._id);
  };
  
  return (
    <div className="product-detail-page">
      <div className="product-image-container">
        <img 
          src={currentProduct.mainImage || 'https://via.placeholder.com/500'} 
          alt={currentProduct.name.ru}
        />
      </div>
      
      <div className="product-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h1 className="product-title">{currentProduct.name.ru}</h1>
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            style={{ position: 'static' }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
        
        <p className="product-price-detail">{currentProduct.price.toLocaleString()} ₽</p>
        
        <div className="product-description">
          <h3>О товаре</h3>
          <p>{currentProduct.description.ru}</p>
        </div>
        
        {currentProduct.variants && currentProduct.variants.length > 0 && (
          <div className="product-variants">
            <h3>В ассортименте:</h3>
            {currentProduct.variants.map((variant, idx) => (
              <div key={idx} className="variant-item">
                <span>{variant.name.ru}</span>
                <span>{variant.price.toLocaleString()} ₽</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="quantity-selector">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity} шт.</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Добавить в корзину
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;