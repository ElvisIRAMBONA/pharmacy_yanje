import React, { useState } from 'react';
import { authAPI } from '../services/api';

const Register = ({ onRegister, selectedRole }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: selectedRole || 'pharmacist'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.register(formData);
      onRegister();
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      setError(error.response?.data?.username?.[0] || error.response?.data?.email?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create {selectedRole === 'admin' ? 'Admin' : 'Pharmacist'} Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="First Name"
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="text"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            required
            className="role-select"
          >
            <option value="pharmacist">Pharmacist</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Register;