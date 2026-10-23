import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaChartPie, FaBoxOpen, FaTags, FaUsers, FaStore, FaSignOutAlt, FaSearch, FaBell, FaEnvelope } from 'react-icons/fa';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="admin-wrapper">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <span style={{ color: '#3699ff' }}>⚡</span> PTC Admin
        </div>
        <div className="admin-menu">
          <Link to="/admin" className={`admin-menu-item ${isActive('/admin')}`}>
            <FaChartPie /> Dashboard
          </Link>
          <Link to="/admin/products" className={`admin-menu-item ${isActive('/admin/products')}`}>
            <FaBoxOpen /> Products
          </Link>
          <Link to="/admin/categories" className={`admin-menu-item ${isActive('/admin/categories')}`}>
            <FaTags /> Categories
          </Link>
          <Link to="/admin/users" className={`admin-menu-item ${isActive('/admin/users')}`}>
            <FaUsers /> Users
          </Link>
          <Link to="/" className="admin-menu-item">
            <FaStore /> Back to Store
          </Link>
          <div onClick={handleLogout} className="admin-menu-item" style={{ cursor: 'pointer', marginTop: 'auto' }}>
            <FaSignOutAlt /> Logout
          </div>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-search">
            <FaSearch color="#6c7293" />
            <input type="text" placeholder="Search..." />
          </div>
          <div className="admin-topbar-icons">
            <FaBell size={20} />
            <FaEnvelope size={20} />
            <div className="admin-user-profile">
              <div className="admin-avatar">A</div>
              <span>Admin</span>
            </div>
          </div>
        </div>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}