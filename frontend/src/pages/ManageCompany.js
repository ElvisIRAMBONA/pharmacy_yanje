import React, { useState, useEffect } from 'react';
import { suppliersAPI } from '../services/api';
import BackButton from '../components/BackButton';

const ManageCompany = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier({...supplier});
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier company?')) {
      try {
        await suppliersAPI.delete(id);
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Error deleting supplier. Please try again.');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await suppliersAPI.update(editingSupplier.id, editingSupplier);
      setShowEditForm(false);
      setEditingSupplier(null);
      fetchSuppliers();
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert('Error updating supplier. Please try again.');
    }
  };

  const handleEditChange = (e) => {
    setEditingSupplier({
      ...editingSupplier,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-company">
      <div className="page-header">
        <BackButton />
        <h2>Manage Supplier Companies</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Contact Info</th>
              <th>Email</th>
              <th>Address</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.contact_info}</td>
                <td>{supplier.email || 'N/A'}</td>
                <td>{supplier.address || 'N/A'}</td>
                <td>{new Date(supplier.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(supplier)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(supplier.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Supplier Company</h3>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editingSupplier.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Contact Information *</label>
                <input
                  type="text"
                  name="contact_info"
                  value={editingSupplier.contact_info}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingSupplier.email || ''}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={editingSupplier.address || ''}
                  onChange={handleEditChange}
                  rows="3"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Update Company
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingSupplier(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCompany;