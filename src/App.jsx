import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Import Register
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* <-- Add Route */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;