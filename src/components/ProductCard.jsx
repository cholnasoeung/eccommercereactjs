import { Link } from 'react-router-dom'; // <-- Import Link
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
      
      <div className="stars">★★★★★</div>
      
      <div className="stock-status">
        <span style={{ background: '#10b981', color: 'white', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</span>
        In Stock ({product.stockQuantity})
      </div>
      
      <div className="price-row">
        <span className="price">${product.price.toFixed(2)}</span>
        <button className="btn-add" onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}