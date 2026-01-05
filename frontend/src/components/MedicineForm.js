import React, { useState, useEffect } from 'react';
import { medicinesAPI, suppliersAPI } from '../services/api';

const MedicineForm = ({ medicine, onSave, onCancel }) => {
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

  useEffect(() => {
    fetchSuppliers();
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        category: medicine.category || '',
        price: medicine.price || '',
        quantity: medicine.quantity || '',
        batch_number: medicine.batch_number || '',
        expiration_date: medicine.expiration_date || '',
        supplier: medicine.supplier?.id || ''
      });
    }
  }, [medicine]);

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (medicine) {
        await medicinesAPI.update(medicine.id, formData);
      } else {
        await medicinesAPI.create(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving medicine:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{medicine ? 'Edit Medicine' : 'Add New Medicine'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Medicine Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              placeholder="Batch Number"
              value={formData.batch_number}
              onChange={(e) => setFormData({...formData, batch_number: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <input
              type="date"
              placeholder="Expiration Date"
              value={formData.expiration_date}
              onChange={(e) => setFormData({...formData, expiration_date: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <select
              value={formData.supplier}
              onChange={(e) => setFormData({...formData, supplier: e.target.value})}
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineForm;