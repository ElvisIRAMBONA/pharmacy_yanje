import React, { useState } from 'react';
import { authAPI } from '../services/api';
import BackButton from '../components/BackButton';

const AddPharmacist = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'pharmacist'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Creating pharmacist user:', formData);
      const response = await authAPI.register(formData);
      console.log('Pharmacist created successfully:', response.data);
      setSuccess('Pharmacist account created successfully!');
      setFormData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'pharmacist'
      });
    } catch (error) {
      console.error('Error creating pharmacist:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error creating pharmacist: ';
        
        if (typeof errorData === 'object') {
          const errorMessages = [];
          for (const [field, messages] of Object.entries(errorData)) {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`);
            } else {
              errorMessages.push(`${field}: ${messages}`);
            }
          }
          errorMessage += errorMessages.join('; ');
        } else {
          errorMessage += errorData;
        }
        
        setError(errorMessage);
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError('Error creating pharmacist. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="add-pharmacist">
      <div className="page-header">
        <BackButton to="/pharmacist/manage" label="Back to Pharmacists" />
        <h2>Add New Pharmacist</h2>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="pharmacist-form">
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="pharmacist@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter secure password"
                minLength="8"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled
              >
                <option value="pharmacist">Pharmacist</option>
              </select>
              <small style={{color: '#666', marginTop: '0.5rem'}}>
                Role is automatically set to Pharmacist
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary"
            >
              {loading ? 'Creating Pharmacist...' : 'Create Pharmacist Account'}
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({
                username: '',
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                role: 'pharmacist'
              })}
              className="btn btn-secondary"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPharmacist;