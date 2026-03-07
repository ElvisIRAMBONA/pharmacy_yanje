import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryAPI } from '../services/api';
import BackButton from '../components/BackButton';
import { FaBox, FaPlus, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const InventoryList = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await inventoryAPI.getAll();
      console.log('Inventory data:', response.data);
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (inventory.length === 0) {
    return (
      <div className="inventory-list">
        <div className="page-header">
          <BackButton />
          <div>
            <h2><FaBox /> Inventory</h2>
            <p>Manage medicine inventory</p>
          </div>
        </div>
        <div className="empty-state">
          <p>No inventory items found. Add some medicines first to see inventory data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-list">
      <div className="page-header">
        <BackButton />
        <div>
          <h2><FaBox /> Inventory</h2>
          <p>Manage medicine inventory</p>
        </div>
      </div>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => {
              console.log('Inventory item:', item);
              return (
                <tr key={item.id}>
                  <td>{item.medicine?.name || item.medicine_name || 'Unknown Medicine'}</td>
                  <td>{item.current_stock}</td>
                  <td>{item.reorder_level}</td>
                  <td>
                    <span className={`status ${item.current_stock <= item.reorder_level ? 'low-stock' : 'normal'}`}>
                      {item.current_stock <= item.reorder_level ? <><FaExclamationTriangle /> Low Stock</> : <><FaCheckCircle /> Normal</>}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;