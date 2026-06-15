import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItemQuantity, removeFromCart, getCartTotal, createOrder } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  const total = getCartTotal();
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Некорректное имя';
    if (!formData.phone.trim()) newErrors.phone = 'Некорректный номер телефона';
    if (!formData.address.trim()) newErrors.address = 'Некорректный адрес';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSubmitting(true);
    try {
      await createOrder(formData);
      window.Telegram.WebApp.showAlert('✅ Заказ успешно оформлен!');
      navigate('/');
    } catch (error) {
      window.Telegram.WebApp.showAlert('❌ Ошибка при оформлении заказа');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <p style={{ fontSize: '18px', color: '#8e8e93' }}>Корзина пуста</p>
        <button onClick={() => navigate('/catalog')}>Перейти к каталогу</button>
      </div>
    );
  }
  
  return (
    <div className="cart-page">
      <h2 style={{ marginBottom: '16px' }}>Корзина</h2>
      
      <div className="cart-items">
        {cart.map(item => (
          <div key={item._id} className="cart-item">
            <img src={item.mainImage || 'https://via.placeholder.com/80'} alt={item.name.ru} />
            <div className="cart-item-info">
              <h4>{item.name.ru}</h4>
              <p>{item.price.toLocaleString()} ₽</p>
              <div className="quantity-controls">
                <button onClick={() => updateCartItemQuantity(item._id, item.quantity - 1)}>-</button>
                <span>{item.quantity} шт.</span>
                <button onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}>+</button>
                <button onClick={() => removeFromCart(item._id)} className="delete-btn">️</button>
              </div>
            </div>
            <div className="cart-item-total">
              {(item.price * item.quantity).toLocaleString()} ₽
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-form">
        <h3>Покупатель</h3>
        
        <label style={{ fontSize: '12px', color: '#8e8e93' }}>Напишите ваше Имя</label>
        <input
          type="text"
          placeholder="Напишите ваше Имя"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
        
        <label style={{ fontSize: '12px', color: '#8e8e93' }}>Напишите ваш телефон</label>
        <input
          type="tel"
          placeholder="+7"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && <span className="error-text">{errors.phone}</span>}
        
        <label style={{ fontSize: '12px', color: '#8e8e93' }}>Напишите адрес</label>
        <textarea
          placeholder="Напишите адрес"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          rows="3"
          className={errors.address ? 'error' : ''}
        />
        {errors.address && <span className="error-text">{errors.address}</span>}
        
        <label style={{ fontSize: '12px', color: '#8e8e93' }}>Напишите комментарий</label>
        <textarea
          placeholder="Напишите комментарий"
          value={formData.comment}
          onChange={(e) => setFormData({...formData, comment: e.target.value})}
          rows="2"
        />
        
        <div className="cart-summary">
          <div className="summary-row">
            <span>Стоимость товаров:</span>
            <span>{total.toLocaleString()} ₽</span>
          </div>
          <div className="summary-row total">
            <span>Итого:</span>
            <span>{total.toLocaleString()} ₽</span>
          </div>
        </div>
        
        <button 
          className="checkout-button" 
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </div>
    </div>
  );
};

export default Cart;