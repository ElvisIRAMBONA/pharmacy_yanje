import React, { useState, useEffect } from 'react';
import { inventoryAPI, medicinesAPI } from '../services/api';
import BackButton from '../components/BackButton';

const StockReports = () => {
  const [inventory, setInventory] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, low-stock, expired

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const [inventoryRes, medicinesRes, statsRes] = await Promise.all([
        inventoryAPI.getAll(),
        medicinesAPI.getAll(),
        inventoryAPI.getStats()
      ]);

      setInventory(inventoryRes.data);
      setMedicines(medicinesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    if (filter === 'low-stock') {
      return inventory.filter(item => item.current_stock <= item.reorder_level);
    } else if (filter === 'expired') {
      return inventory.filter(item => {
        const medicine = medicines.find(med => med.id === item.medicine.id);
        return medicine && medicine.is_expired;
      });
    }
    return inventory;
  };

  const filteredData = getFilteredData();
  const lowStockCount = inventory.filter(item => item.current_stock <= item.reorder_level).length;
  const expiredCount = medicines.filter(med => med.is_expired).length;
  const totalValue = inventory.reduce((sum, item) => {
    const medicine = medicines.find(med => med.id === item.medicine.id);
    return sum + (medicine ? parseFloat(medicine.price) * item.current_stock : 0);
  }, 0);

  if (loading) return <div>Loading stock reports...</div>;

  return (
    <div className="stock-reports">
      <div className="page-header">
        <BackButton />
        <h2>Stock Reports</h2>
        <p>View inventory and stock reports</p>
      </div>

      {/* Stock Overview Cards */}
      <div className="stock-overview">
        <div className="stock-card total">
          <div className="stock-icon">📦</div>
          <div className="stock-info">
            <h3>Total Items</h3>
            <p className="stock-value">{inventory.length}</p>
            <p className="stock-label">inventory items</p>
          </div>
        </div>

        <div className="stock-card low-stock">
          <div className="stock-icon">⚠️</div>
          <div className="stock-info">
            <h3>Low Stock</h3>
            <p className="stock-value">{lowStockCount}</p>
            <p className="stock-label">need reorder</p>
          </div>
        </div>

        <div className="stock-card expired">
          <div className="stock-icon">🚫</div>
          <div className="stock-info">
            <h3>Expired</h3>
            <p className="stock-value">{expiredCount}</p>
            <p className="stock-label">medicines expired</p>
          </div>
        </div>

        <div className="stock-card value">
          <div className="stock-icon">💰</div>
          <div className="stock-info">
            <h3>Total Value</h3>
            <p className="stock-value">${totalValue.toFixed(2)}</p>
            <p className="stock-label">inventory worth</p>
          </div>
        </div>
      </div>

      {/* Stock Level Visualization */}
      <div className="stock-visualization">
        <h3>Stock Level Distribution</h3>
        <div className="stock-bars">
          {inventory.slice(0, 10).map(item => {
            const percentage = item.reorder_level > 0 ? (item.current_stock / (item.reorder_level * 2)) * 100 : 50;
            const isLowStock = item.current_stock <= item.reorder_level;
            
            return (
              <div key={item.id} className="stock-bar-item">
                <div className="stock-bar-label">{item.medicine.name}</div>
                <div className="stock-bar-container">
                  <div 
                    className={`stock-bar ${isLowStock ? 'low' : 'normal'}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="stock-bar-values">
                  <span>Current: {item.current_stock}</span>
                  <span>Reorder: {item.reorder_level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="stock-filters">
        <h3>Stock Analysis</h3>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Items ({inventory.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'low-stock' ? 'active' : ''}`}
            onClick={() => setFilter('low-stock')}
          >
            Low Stock ({lowStockCount})
          </button>
          <button 
            className={`filter-btn ${filter === 'expired' ? 'active' : ''}`}
            onClick={() => setFilter('expired')}
          >
            Expired ({expiredCount})
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="stock-table-section">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => {
                const medicine = medicines.find(med => med.id === item.medicine.id);
                const isLowStock = item.current_stock <= item.reorder_level;
                const totalValue = medicine ? parseFloat(medicine.price) * item.current_stock : 0;
                
                return (
                  <tr key={item.id} className={isLowStock ? 'low-stock-row' : ''}>
                    <td>{item.medicine.name}</td>
                    <td>{medicine?.category || 'N/A'}</td>
                    <td>{item.current_stock}</td>
                    <td>{item.reorder_level}</td>
                    <td>${medicine?.price || '0.00'}</td>
                    <td>${totalValue.toFixed(2)}</td>
                    <td>
                      <span className={`status ${isLowStock ? 'low-stock' : 'normal'}`}>
                        {isLowStock ? 'Low Stock' : 'Normal'}
                      </span>
                      {medicine?.is_expired && (
                        <span className="status expired">Expired</span>
                      )}
                    </td>
                    <td>{medicine?.expiration_date || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Alerts */}
      {lowStockCount > 0 && (
        <div className="stock-alerts">
          <div className="alert alert-warning">
            <h4>⚠️ Low Stock Alert</h4>
            <p>{lowStockCount} items are running low and need to be reordered soon.</p>
          </div>
        </div>
      )}

      {expiredCount > 0 && (
        <div className="stock-alerts">
          <div className="alert alert-danger">
            <h4>🚫 Expired Items Alert</h4>
            <p>{expiredCount} medicines have expired and should be removed from inventory.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockReports;