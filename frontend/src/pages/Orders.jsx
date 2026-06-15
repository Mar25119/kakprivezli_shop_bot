import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const Orders = () => {
  const navigate = useNavigate();
  const { orders, fetchOrders, loading } = useStore();
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  if (loading) {
    return <div className="loader"></div>;
  }
  
  return (
    <div className="orders-page">
      <h2>Мои заказы</h2>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8e8e93' }}>
          У вас пока нет заказов
        </div>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <span>Заказ #{order._id.toString().slice(-6)}</span>
              <span className={`order-status ${order.status}`}>
                {order.status === 'pending' && 'Ожидает'}
                {order.status === 'confirmed' && 'Подтверждён'}
                {order.status === 'processing' && 'В обработке'}
                {order.status === 'delivered' && 'Доставлен'}
                {order.status === 'cancelled' && 'Отменён'}
              </span>
            </div>
            
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString()} ₽</span>
                </div>
              ))}
            </div>
            
            <div className="order-total">
              <span>Итого:</span>
              <span>{order.totalAmount.toLocaleString()} ₽</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;