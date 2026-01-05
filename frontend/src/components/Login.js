import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Login = ({ onLogin, selectedRole }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(credentials);
      
      // Check if user role matches selected role
      if (response.data.user.role !== selectedRole) {
        setError(`This account is not registered as ${selectedRole}. Please select the correct role.`);
        setLoading(false);
        return;
      }
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userRole', response.data.user.role);
      onLogin(response.data.user);
    } catch (error) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login as {selectedRole === 'admin' ? 'Admin' : 'Pharmacist'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
