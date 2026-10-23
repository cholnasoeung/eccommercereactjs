import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  const [searchParams] = useSearchParams();
  const currentUrlSearch = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(currentUrlSearch);

  useEffect(() => {
    if (location.pathname === '/') {
      setSearchTerm(currentUrlSearch);
    } else {
      setSearchTerm('');
    }
  }, [currentUrlSearch, location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        navigate(`/?search=${searchTerm}`, { replace: true });
      } else if (currentUrlSearch !== '') {
        navigate('/', { replace: true });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentUrlSearch, location.pathname, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-left">
          <span>📞 012 220 152</span>
          <span>📞 093 456 747</span>
          <span>🚚 Delivery within 1 hour / Delivery 25 Provinces</span>
        </div>
        <div className="top-bar-right">
          <span>f</span> <span>📸</span> <span>✈️</span>
        </div>
      </div>

      <div className="main-header">
        <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
          PTC COMPUTER
        </div>
        
        <div className="search-container">
          <select className="search-dropdown">
            <option>AI Search</option>
            <option>Products</option>
          </select>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search for..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="header-icons">
          <div className="icon-group"><span>🔄</span><span>Compare</span></div>
          <div className="icon-group"><span>❤️</span><span>Wishlist</span></div>
          
          <Link to="/cart" className="icon-group" style={{ textDecoration: 'none' }}>
            <span>🛒</span><span>Cart</span>
          </Link>
          
          <div className="icon-group">
            <span>👤</span>
            {token ? (
              <span onClick={handleLogout} style={{color: '#ef4444', cursor: 'pointer'}}>Logout</span>
            ) : (
              <span onClick={() => navigate('/login')} style={{cursor: 'pointer'}}>Sign in</span>
            )}
          </div>
        </div>
      </div>

      <div className="nav-menu">
        <Link to="/" className="nav-item">☰ Home</Link>
        <Link to="/orders" className="nav-item">📦 My Orders</Link>
        <div className="nav-item special-offer">Special Offer ▾</div>
        <div className="nav-item">Shop ▾</div>
        <div className="nav-item">Laptop / Desktop</div>
        <div className="nav-item">Gaming</div>
        <div className="nav-item">Brands</div>
        <div className="nav-item">Customer Care ▾</div>
      </div>
    </>
  );
}