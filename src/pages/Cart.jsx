import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/cart')
      .then(response => setCart(response.data))
      .catch(err => {
        console.error(err);
        if (err.response) {
          if (err.response.status === 403 || err.response.status === 401) {
            setError('Error 403: Forbidden. Your token might be expired. Please login again.');
          } else {
            setError(`Error ${err.response.status}: Failed to load cart.`);
          }
        } else {
          setError('Network Error. Is your Spring Boot backend running?');
        }
      });
  }, []);

  const checkout = async () => {
    try {
      await api.post('/orders/checkout');
      alert('✅ Checkout Successful! Thank you for your order.');
      navigate('/');
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Checkout failed. Please try again.";
      alert(`❌ Checkout failed: ${errorMsg}`);
    }
  };

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

  if (!cart) return <div className="cart-page"><h2>Loading cart...</h2></div>;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <h2 className="cart-title">Shopping Cart</h2>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <h3 style={{ color: '#666' }}>Your cart is empty 🛒</h3>
          <button onClick={() => navigate('/')} className="checkout-btn" style={{ marginTop: '20px', maxWidth: '300px', margin: '20px auto 0' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Shopping Cart</h2>
      
      <div className="cart-container">
        {cart.items.map(item => (
          <div key={item.productId} className="cart-item-row">
            <div className="cart-item-info">
              <h3>{item.productName}</h3>
              <p>Quantity: {item.quantity}</p>
            </div>
            <div className="cart-item-price">
              ${item.subTotal.toFixed(2)}
            </div>
          </div>
        ))}
        
        <div className="cart-summary">
          <h3>Total:</h3>
          <span className="total-price">${cart.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <button onClick={checkout} className="checkout-btn">
        Proceed to Checkout
      </button>
    </div>
  );
}