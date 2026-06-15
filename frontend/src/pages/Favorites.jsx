import React, { useEffect } from 'react';
import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const { favorites, fetchFavorites } = useStore();
  
  useEffect(() => {
    fetchFavorites();
  }, []);
  
  return (
    <div className="favorites-page">
      <h2>Избранные товары</h2>
      
      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <p>У вас пока нет избранных товаров</p>
        </div>
      ) : (
        <div className="products-grid">
          {favorites.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;