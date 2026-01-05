import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/api';

const InventoryList = () => {
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
        <h2>Inventory</h2>
        <div className="empty-state">
          <p>No inventory items found. Add some medicines first to see inventory data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-list">
      <h2>Inventory</h2>
      
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
                      {item.current_stock <= item.reorder_level ? 'Low Stock' : 'Normal'}
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