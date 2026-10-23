import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar, FaCheckCircle, FaShoppingCart } from 'react-icons/fa';
import api from '../api/axios';

export default function ProductDetails() {
  const { id } = useParams(); // Get the ID from the URL
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post('/cart/add', { productId: product.id, quantity: parseInt(quantity) });
      alert('🛒 Added to cart!');
    } catch (error) {
      alert('⚠️ Please login first!');
      navigate('/login');
    }
  };

  if (loading) return <div className="container" style={{ padding: '50px' }}><h2>Loading...</h2></div>;
  if (!product) return <div className="container" style={{ padding: '50px' }}><h2>Product not found!</h2></div>;

  return (
    <div className="product-details-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Products
      </button>

      <div className="product-details-container">
        {/* Left Side: Image */}
        <div className="product-details-image-box">
          {product.imageUrl ? (
            <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} />
          ) : (
            <div className="no-image-large">No Image Available</div>
          )}
        </div>

        {/* Right Side: Info */}
        <div className="product-details-info">
          <div className="brand-badge">ASUS / LENOVO</div>
          <h1 className="details-title">{product.name}</h1>
          
          {/* Stars with Icons */}
          <div className="stars" style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
            <FaStar color="#f59e0b" size={20}/> <FaStar color="#f59e0b" size={20}/> 
            <FaStar color="#f59e0b" size={20}/> <FaStar color="#f59e0b" size={20}/> 
            <FaStar color="#f59e0b" size={20}/>
          </div>
          
          <div className="details-price">${product.price.toFixed(2)}</div>
          
          {/* Stock with Icon */}
          <p className="details-stock" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaCheckCircle color="#10b981" /> In Stock: {product.stockQuantity} units
          </p>
          
          <div className="details-description">
            <h3>Description</h3>
            <p>{product.description || "No description available for this product."}</p>
          </div>

          <div className="details-actions">
            <input 
              type="number" 
              min="1" 
              max={product.stockQuantity} 
              value={quantity} 
              onChange={(e) => setQuantity(e.target.value)}
              className="quantity-input"
            />
            <button 
              onClick={addToCart} 
              className="btn-add-large"
              disabled={product.stockQuantity === 0}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {product.stockQuantity === 0 ? 'Out of Stock' : (
                <>
                  <FaShoppingCart style={{marginRight: '10px'}}/> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}