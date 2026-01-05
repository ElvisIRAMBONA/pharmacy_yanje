import React, { useState, useEffect } from 'react';
import { medicinesAPI, suppliersAPI } from '../services/api';
import BackButton from '../components/BackButton';

const AddMedicine = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    batch_number: '',
    expiration_date: '',
    supplier: ''
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      console.log('Fetching suppliers...');
      const response = await suppliersAPI.getAll();
      console.log('Suppliers fetched:', response.data);
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      console.error('Suppliers API error:', error.response?.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Submitting medicine data:', formData);
      const response = await medicinesAPI.create(formData);
      console.log('Medicine created successfully:', response.data);
      setSuccess('Medicine added successfully!');
      setFormData({
        name: '',
        category: '',
        price: '',
        quantity: '',
        batch_number: '',
        expiration_date: '',
        supplier: ''
      });
    } catch (error) {
      console.error('Error adding medicine:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error adding medicine: ';
        
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
        // Clear expired session
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError('Error adding medicine. Please check your connection and try again.');
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
    <div className="add-medicine">
      <div className="page-header">
        <BackButton to="/medicines" label="Back to Medicines" />
        <h2>Add New Medicine</h2>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="medicine-form">
          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Medicine Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter medicine name"
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Painkiller, Antibiotic"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Batch Number</label>
              <input
                type="text"
                name="batch_number"
                value={formData.batch_number}
                onChange={handleChange}
                placeholder="Enter batch number"
              />
            </div>

            <div className="form-group">
              <label>Expiration Date *</label>
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Supplier</label>
              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
              >
                <option value="">Select Supplier (Optional)</option>
                {suppliers.length > 0 ? (
                  suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No suppliers available</option>
                )}
              </select>
              {suppliers.length === 0 && (
                <small style={{color: '#666', marginTop: '0.5rem'}}>
                  No suppliers found. You can add medicines without a supplier.
                </small>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary"
            >
              {loading ? 'Adding Medicine...' : 'Add Medicine'}
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({
                name: '',
                category: '',
                price: '',
                quantity: '',
                batch_number: '',
                expiration_date: '',
                supplier: ''
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

export default AddMedicine;