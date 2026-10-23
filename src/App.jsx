import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminLayout from './layouts/AdminLayout';
import Navbar from './components/Navbar';
import './styles/App.css';
import './styles/Admin.css'; // Import Admin CSS
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';
// Component to conditionally show Customer Navbar
function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <Routes>
        {/* CUSTOMER ROUTES */}
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />

        {/* ADMIN ROUTES (Wrapped in AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route index element={<AdminDashboard />} />
<Route path="products" element={<AdminProducts />} />
<Route path="categories" element={<AdminCategories />} />
<Route path="users" element={<AdminUsers />} />
        </Route>
        
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;