import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import api from '../api/axios';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // THIS IS WHERE THE USEEFFECT GOES
  useEffect(() => {
    // Fetch the cart data fresh every time the page loads
    api.get('/cart')
      .then(response => setCart(response.data))
      .catch(err => {
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
          setError('Please login to view your cart.');
        } else {
          setError('Failed to load cart.');
        }
      });
  }, []); 

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (error) {
    return (
      <div className="cart-page text-center py-5">
        <h2 style={{ color: '#ef4444' }}>{error}</h2>
        <button onClick={() => navigate('/login')} className="checkout-btn" style={{ marginTop: '20px', maxWidth: '300px' }}>
          Go to Login
        </button>
      </div>
    );
  }

  if (!cart) return <div className="cart-page text-center py-5"><h2>Loading cart...</h2></div>;

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <h2 className="cart-title">Shopping Cart</h2>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <FaShoppingCart size={60} color="#e5e7eb" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: '#666' }}>Your cart is empty</h3>
          <button onClick={() => navigate('/')} className="checkout-btn" style={{ marginTop: '20px', maxWidth: '300px' }}>
            Start Shopping
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

      <button onClick={proceedToCheckout} className="checkout-btn">
        Proceed to Checkout
      </button>
    </div>
  );
}