import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error("LOGIN ERROR:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || error.response?.data || "Invalid email or password";
      alert(`❌ Login failed: ${errorMsg}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="admin@test.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-warning w-100 fw-bold text-white py-2">
            Sign In
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#f59e0b' }}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}