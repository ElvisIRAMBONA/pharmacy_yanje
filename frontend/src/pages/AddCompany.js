import React, { useState } from 'react';
import { suppliersAPI } from '../services/api';
import BackButton from '../components/BackButton';

const AddCompany = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact_info: '',
    address: '',
    email: ''
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
      console.log('Submitting supplier data:', formData);
      const response = await suppliersAPI.create(formData);
      console.log('Supplier created successfully:', response.data);
      setSuccess('Supplier company added successfully!');
      setFormData({
        name: '',
        contact_info: '',
        address: '',
        email: ''
      });
    } catch (error) {
      console.error('Error adding supplier:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error adding supplier: ';
        
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
        setError('Error adding supplier. Please check your connection and try again.');
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
    <div className="add-company">
      <div className="page-header">
        <BackButton to="/company/manage" label="Back to Companies" />
        <h2>Add New Supplier Company</h2>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="company-form">
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="company@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact Information *</label>
              <input
                type="text"
                name="contact_info"
                value={formData.contact_info}
                onChange={handleChange}
                required
                placeholder="Phone number or contact details"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Company address"
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary"
            >
              {loading ? 'Adding Company...' : 'Add Company'}
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({
                name: '',
                contact_info: '',
                address: '',
                email: ''
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

export default AddCompany;