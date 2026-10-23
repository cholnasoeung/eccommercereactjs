import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaLock } from 'react-icons/fa';
import api from '../api/axios';

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    shippingAddress: '',
    paymentMethod: 'Cash on Delivery'
  });

  useEffect(() => {
    api.get('/cart')
      .then(res => {
        if (res.data.items.length === 0) {
          navigate('/cart'); 
        } else {
          setCart(res.data);
          setLoading(false);
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    setError('');

    try {
      await api.post('/orders/checkout', formData);
      alert('✅ Order placed successfully!');
      // Use replace: true so the user can't hit "Back" and see the old cart
      navigate('/orders', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order.");
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="text-center py-5"><h3>Loading Checkout...</h3></div>;

  return (
    <div className="checkout-page container py-5">
      <h2 className="fw-bold mb-4">Secure Checkout</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="mb-3 fw-bold text-secondary">1. Shipping Details</h4>
              <form onSubmit={handlePlaceOrder}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input type="text" name="fullName" className="form-control" required onChange={handleChange} value={formData.fullName} placeholder="John Doe" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input type="text" name="phoneNumber" className="form-control" required onChange={handleChange} value={formData.phoneNumber} placeholder="+855 12 345 678" />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Full Address</label>
                  <textarea name="shippingAddress" className="form-control" required rows="3" onChange={handleChange} value={formData.shippingAddress} placeholder="Street, City, Province, Zip Code"></textarea>
                </div>

                <h4 className="mb-3 fw-bold text-secondary mt-4">2. Payment Method</h4>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="paymentMethod" value="Cash on Delivery" checked={formData.paymentMethod === 'Cash on Delivery'} onChange={handleChange} />
                  <label className="form-check-label fw-semibold">Cash on Delivery</label>
                </div>
                <div className="form-check mb-4">
                  <input className="form-check-input" type="radio" name="paymentMethod" value="Credit Card" checked={formData.paymentMethod === 'Credit Card'} onChange={handleChange} />
                  <label className="form-check-label fw-semibold">Credit Card (Mock)</label>
                </div>

                <button type="submit" className="btn btn-warning w-100 fw-bold text-white py-3 fs-5 d-flex justify-content-center align-items-center gap-2" disabled={placingOrder}>
                  {placingOrder ? <><FaSpinner className="spinner" /> Processing...</> : <><FaLock /> Place Order (${cart.totalPrice.toFixed(2)})</>}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm border-0" style={{ backgroundColor: '#f9fafb' }}>
            <div className="card-body p-4">
              <h4 className="mb-4 fw-bold text-secondary">Order Summary</h4>
              <ul className="list-group list-group-flush mb-4 bg-transparent">
                {cart.items.map(item => (
                  <li key={item.productId} className="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0">
                    <div>
                      <h6 className="mb-0 fw-bold">{item.productName}</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <span className="fw-bold">${item.subTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="d-flex justify-content-between border-top pt-3">
                <h5 className="fw-bold">Total</h5>
                <h5 className="fw-bold text-warning">${cart.totalPrice.toFixed(2)}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}