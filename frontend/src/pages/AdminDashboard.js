import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryAPI, medicinesAPI } from '../services/api';

const AdminDashboard = () => {
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
    <div className="dashboard admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <span className="role-badge admin">Administrator</span>
      </div>
      
      <div className="admin-welcome">
        <h3>Welcome, Administrator!</h3>
        <p>You have full system access including user management, suppliers, and all pharmacy operations.</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Inventory Items</h3>
          <p>{stats.total_items || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Medicines</h3>
          <p>{stats.total_medicines || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <p>{stats.low_stock_count || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Expired Medicines</h3>
          <p>{expiredMeds.length}</p>
        </div>
      </div>

      <div className="admin-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/pharmacist/manage')}
          >
            Manage Users
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/company/manage')}
          >
            View Suppliers
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/reports/sales')}
          >
            System Reports
          </button>
        </div>
      </div>

      <div className="alerts">
        {lowStock.length > 0 && (
          <div className="alert alert-warning">
            <h4>Low Stock Alert</h4>
            <ul>
              {lowStock.map((item, index) => (
                <li key={item.id || index}>
                  {item.medicine?.name || item.medicine} - Stock: {item.current_stock}
                </li>
              ))}
            </ul>
          </div>
        )}

        {expiredMeds.length > 0 && (
          <div className="alert alert-danger">
            <h4>Expired Medicines</h4>
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

export default AdminDashboard;