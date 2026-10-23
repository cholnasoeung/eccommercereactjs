import { Link } from 'react-router-dom';
import { FaStar, FaCheckCircle, FaShoppingCart } from 'react-icons/fa';
import api from '../api/axios';

export default function ProductCard({ product }) {
  const addToCart = async () => {
    try {
      await api.post('/cart/add', { productId: product.id, quantity: 1 });
      alert('🛒 Added to cart!');
    } catch (error) {
      alert('⚠️ Please login first!');
    }
  };

  return (
    <div className="product-card">
      <div className="brand-badge">ASUS / LENOVO</div>
      
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {product.imageUrl ? (
          <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} className="product-image" />
        ) : (
          <div className="no-image">No Image</div>
        )}
        
        <h3 className="product-title">{product.name}</h3>
      </Link>
      
      <div className="stars" style={{ display: 'flex', justifyContent: 'center', gap: '3px' }}>
        <FaStar color="#f59e0b" /> <FaStar color="#f59e0b" /> <FaStar color="#f59e0b" /> <FaStar color="#f59e0b" /> <FaStar color="#f59e0b" />
      </div>
      
      <div className="stock-status">
        <FaCheckCircle color="#10b981" />
        In Stock ({product.stockQuantity})
      </div>
      
      <div className="price-row">
        <span className="price">${product.price.toFixed(2)}</span>
        <button className="btn-add" onClick={addToCart}>
          <FaShoppingCart style={{ marginRight: '5px' }} /> Add
        </button>
      </div>
    </div>
  );
}