import React, { useState, useEffect } from 'react';
import { medicinesAPI } from '../services/api';
import MedicineForm from '../components/MedicineForm';
import BackButton from '../components/BackButton';
import { FaPills, FaPlus, FaEdit, FaTrash, FaTag, FaBoxes, FaBarcode, FaCalendarAlt, FaCheckCircle, FaBan } from 'react-icons/fa';

const MedicinesList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await medicinesAPI.getAll();
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMedicine(null);
    setShowForm(true);
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await medicinesAPI.delete(id);
        fetchMedicines();
      } catch (error) {
        console.error('Error deleting medicine:', error);
      }
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingMedicine(null);
    fetchMedicines();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMedicine(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="medicines-list">
      <div className="page-header">
        <BackButton />
        <div>
          <h2><FaPills /> Medicines</h2>
          <p>Manage medicine inventory</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary">
          <FaPlus /> Add Medicine
        </button>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Batch Number</th>
              <th>Expiration Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map(medicine => (
              <tr key={medicine.id}>
                <td><strong>{medicine.name}</strong></td>
                <td><span className="category-badge">{medicine.category}</span></td>
                <td className="price-cell">{medicine.price} Fbu</td>
                <td>{medicine.quantity}</td>
                <td>{medicine.batch_number || 'N/A'}</td>
                <td>{medicine.expiration_date}</td>
                <td>
                  <span className={`status ${medicine.is_expired ? 'expired' : 'active'}`}>
                    {medicine.is_expired ? <><FaBan /> Expired</> : <><FaCheckCircle /> Active</>}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(medicine)}
                      className="btn btn-sm btn-secondary"
                      title="Edit"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(medicine.id)}
                      className="btn btn-sm btn-danger"
                      title="Delete"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <MedicineForm
          medicine={editingMedicine}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default MedicinesList;