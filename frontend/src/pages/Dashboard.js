import React, { useState, useEffect } from 'react';
import { inventoryAPI, medicinesAPI } from '../services/api';

const Dashboard = ({ userRole }) => {
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

  const isAdmin = userRole === 'admin';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <span className="role-badge">{isAdmin ? 'Admin' : 'Pharmacist'}</span>
      </div>
      
      {isAdmin && (
        <div className="admin-notice">
          <p>You have full access to the system.</p>
        </div>
      )}
      
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

export default Dashboard;
