import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const ManagePharmacist = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPharmacist, setEditingPharmacist] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchPharmacists();
  }, []);

  const fetchPharmacists = async () => {
    try {
      const response = await authAPI.getUsers();
      // Filter only pharmacist users
      const pharmacistUsers = response.data.filter(user => user.role === 'pharmacist');
      setPharmacists(pharmacistUsers);
    } catch (error) {
      console.error('Error fetching pharmacists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pharmacist) => {
    setEditingPharmacist({
      ...pharmacist,
      password: '' // Don't show existing password
    });
    setShowEditForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pharmacist account?')) {
      try {
        await authAPI.deleteUser(id);
        fetchPharmacists();
      } catch (error) {
        console.error('Error deleting pharmacist:', error);
        alert('Error deleting pharmacist. Please try again.');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove password from update if it's empty
      const updateData = { ...editingPharmacist };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await authAPI.updateUser(editingPharmacist.id, updateData);
      setShowEditForm(false);
      setEditingPharmacist(null);
      fetchPharmacists();
    } catch (error) {
      console.error('Error updating pharmacist:', error);
      alert('Error updating pharmacist. Please try again.');
    }
  };

  const handleEditChange = (e) => {
    setEditingPharmacist({
      ...editingPharmacist,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-pharmacist">
      <div className="page-header">
        <h2>Manage Pharmacists</h2>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pharmacists.map(pharmacist => (
              <tr key={pharmacist.id}>
                <td>{pharmacist.username}</td>
                <td>{`${pharmacist.first_name} ${pharmacist.last_name}`}</td>
                <td>{pharmacist.email}</td>
                <td>
                  <span className="role-badge pharmacist">
                    👨⚕️ {pharmacist.role}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(pharmacist)}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(pharmacist.id)}
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

        {pharmacists.length === 0 && (
          <div className="empty-state">
            <p>No pharmacist accounts found. Create one using "Add Pharmacist".</p>
          </div>
        )}
      </div>

      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Pharmacist Account</h3>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  value={editingPharmacist.username}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={editingPharmacist.email}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={editingPharmacist.first_name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={editingPharmacist.last_name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>New Password (leave empty to keep current)</label>
                <input
                  type="password"
                  name="password"
                  value={editingPharmacist.password}
                  onChange={handleEditChange}
                  placeholder="Enter new password or leave empty"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Update Pharmacist
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditForm(false);
                    setEditingPharmacist(null);
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

export default ManagePharmacist;