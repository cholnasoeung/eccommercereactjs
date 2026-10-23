import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.get('/orders')
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("ORDER ERROR:", err);
        if (err.response) {
          if (err.response.status === 403 || err.response.status === 401) {
            setError('Error 403: Forbidden. Your token might be expired. Please login again.');
          } else {
            setError(`Error ${err.response.status}: Could not load orders.`);
          }
        } else {
          setError('Network Error. Is your Spring Boot backend running?');
        }
        setLoading(false);
      });
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return '#f59e0b';
      case 'SHIPPED': return '#3b82f6';
      case 'DELIVERED': return '#10b981';
      case 'CANCELLED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) return <div className="cart-page"><h2>Loading your orders...</h2></div>;

  if (error) {
    return (
      <div className="cart-page">
        <h2 style={{ color: '#ef4444' }}>{error}</h2>
        <button onClick={() => navigate('/login')} className="checkout-btn" style={{ marginTop: '20px' }}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">My Orders</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3 style={{ color: '#666', marginBottom: '20px' }}>You haven't placed any orders yet.</h3>
          <Link to="/">
            <button className="checkout-btn" style={{ maxWidth: '300px', margin: '0 auto' }}>
              Start Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order.orderId}</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>Placed on {formatDate(order.orderDate)}</p>
                </div>
                <div 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                >
                  {order.status}
                </div>
              </div>

              <div className="order-footer">
                <span>Total Amount:</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}