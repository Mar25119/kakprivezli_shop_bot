import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const { categories, products, loading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category?._id === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.ru.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  if (loading) {
    return <div className="loader"></div>;
  }
  
  return (
    <div className="catalog-page">
      <input
        type="text"
        className="search-bar"
        placeholder="Искать по магазину"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div className="categories-header">
        <button 
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          Все
        </button>
        {categories.map(cat => (
          <button
            key={cat._id}
            className={`category-btn ${selectedCategory === cat._id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat._id)}
          >
            {cat.name.ru}
          </button>
        ))}
      </div>
      
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8e8e93' }}>
          Товары не найдены
        </div>
      )}
    </div>
  );
};

export default Catalog;