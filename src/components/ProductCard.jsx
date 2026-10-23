import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import api from '../api/axios';

export default function ProductCard({ product }) {
  const addToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to details page when clicking Add
    try {
      await api.post('/cart/add', { productId: product.id, quantity: 1 });
      alert('🛒 Added to cart!');
    } catch (error) {
      alert('⚠️ Please login first!');
    }
  };

  return (
    <div className="product-card">
      {product.stockQuantity > 0 && product.stockQuantity < 10 && (
        <div className="hot-badge pulse-anim">HOT</div>
      )}

      <div className="brand-badge">ASUS / LENOVO</div>
      
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="image-container">
          {product.imageUrl ? (
            <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} className="product-image" />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
        <h3 className="product-title">{product.name}</h3>
      </Link>
      
      <div className="stars" style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '8px' }}>
        <FaStar color="#f59e0b" size={12} /> 
        <FaStar color="#f59e0b" size={12} /> 
        <FaStar color="#f59e0b" size={12} /> 
        <FaStar color="#f59e0b" size={12} /> 
        <FaStar color="#f59e0b" size={12} />
      </div>
      
      <div className="stock-status">
        <FaCheckCircle color="#10b981" /> In Stock ({product.stockQuantity})
      </div>
      
      <div className="price-row">
        <span className="price">${product.price.toFixed(2)}</span>
      </div>

      {/* Slide up button */}
      <div className="product-actions">
        <button className="btn-quick-add" onClick={addToCart}>
          <FaShoppingCart size={16} /> Quick Add
        </button>
      </div>
    </div>
  );
}