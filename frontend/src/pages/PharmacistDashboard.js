import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryAPI, medicinesAPI } from '../services/api';

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [lowStock, setLowStock] = useState([]);
  const [expiredMeds, setExpiredMeds] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, lowStockRes, expiredRes, medicinesRes] = await Promise.all([
        inventoryAPI.getStats(),
        inventoryAPI.getLowStock(),
        medicinesAPI.getExpired(),
        medicinesAPI.getAll()
      ]);
      
      setStats({
        ...statsRes.data,
        total_medicines: medicinesRes.data.length
      });
      setLowStock(lowStockRes.data.items || lowStockRes.data);
      setExpiredMeds(expiredRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard pharmacist-dashboard">
      <div className="dashboard-header">
        <h2>Pharmacist Dashboard</h2>
        <span className="role-badge pharmacist">Pharmacist</span>
      </div>
      
      <div className="pharmacist-welcome">
        <h3>Welcome, Pharmacist!</h3>
        <p>Manage medicines, inventory, sales operations, and generate reports efficiently.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Available Medicines</h3>
          <p>{stats.total_medicines || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Inventory Items</h3>
          <p>{stats.total_items || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Alert</h3>
          <p className="alert-number">{stats.low_stock_count || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Expired Items</h3>
          <p className="alert-number">{expiredMeds.length}</p>
        </div>
      </div>

      <div className="pharmacist-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/invoice')}
          >
            Create Invoice
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/medicines/add')}
          >
            Add Medicine
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/inventory')}
          >
            Check Inventory
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/sales')}
          >
            View Sales
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/reports/stock')}
          >
            Stock Reports
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/medicines')}
          >
            Manage Medicines
          </button>
        </div>
      </div>

      <div className="alerts">
        {lowStock.length > 0 && (
          <div className="alert alert-warning">
            <h4>⚠️ Low Stock Alert</h4>
            <p>The following items need restocking:</p>
            <ul>
              {lowStock.map((item, index) => (
                <li key={item.id || index}>
                  {item.medicine?.name || item.medicine} - Only {item.current_stock} left
                </li>
              ))}
            </ul>
          </div>
        )}

        {expiredMeds.length > 0 && (
          <div className="alert alert-danger">
            <h4>🚨 Expired Medicines</h4>
            <p>Remove these expired items immediately:</p>
            <ul>
              {expiredMeds.map(med => (
                <li key={med.id}>
                  {med.name} - Expired: {med.expiration_date}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacistDashboard;