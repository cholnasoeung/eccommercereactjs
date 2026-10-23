import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      await api.post('/auth/register', { email, password });
      alert('✅ Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Email might already exist.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4 fw-bold">Create an Account</h2>
        
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="you@example.com"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Create a password"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              minLength="6"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Confirm your password"
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-warning w-100 fw-bold text-white py-2">
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#f59e0b' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}