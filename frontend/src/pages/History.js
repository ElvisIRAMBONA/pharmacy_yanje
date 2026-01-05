import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BackButton from '../components/BackButton';

const History = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySummary, setDailySummary] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDailyData();
  }, [selectedDate]);

  const fetchDailyData = async () => {
    setLoading(true);
    try {
      const [summaryRes, activitiesRes] = await Promise.all([
        api.get(`/auth/daily-summary/?date=${selectedDate}`),
        api.get(`/auth/activity-logs/?date=${selectedDate}&limit=100`)
      ]);
      
      setDailySummary(summaryRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching daily data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredActivities = () => {
    if (filter === 'all') return activities;
    return activities.filter(activity => activity.action_type === filter);
  };

  const getActivityIcon = (actionType) => {
    const icons = {
      'create': '➕',
      'update': '✏️',
      'delete': '🗑️',
      'sale': '💰',
      'login': '🔐',
      'logout': '🚪',
      'stock_update': '📦',
      'invoice_generated': '📄'
    };
    return icons[actionType] || '📝';
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <BackButton />
        <h2>Daily Activity History</h2>
        <p>Track daily operations and system activities</p>
      </div>

      <div className="history-controls">
        <div className="date-selector">
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading daily summary...</div>
      ) : (
        <>
          <div className="daily-summary">
            <h3>Daily Summary - {selectedDate}</h3>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-icon">📊</div>
                <div className="card-info">
                  <h4>Total Activities</h4>
                  <p>{dailySummary.total_activities || 0}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="card-icon">👥</div>
                <div className="card-info">
                  <h4>Active Users</h4>
                  <p>{dailySummary.unique_users || 0}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="card-icon">💰</div>
                <div className="card-info">
                  <h4>Sales Made</h4>
                  <p>{dailySummary.activity_breakdown?.['Sale Made'] || 0}</p>
                </div>
              </div>
              <div className="summary-card">
                <div className="card-icon">📄</div>
                <div className="card-info">
                  <h4>Invoices Generated</h4>
                  <p>{dailySummary.activity_breakdown?.['Invoice Generated'] || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-breakdown">
            <h3>Activity Breakdown</h3>
            <div className="breakdown-grid">
              {Object.entries(dailySummary.activity_breakdown || {}).map(([action, count]) => (
                <div key={action} className="breakdown-item">
                  <span className="breakdown-label">{action}</span>
                  <span className="breakdown-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="user-activities">
            <h3>User Activity</h3>
            <div className="user-grid">
              {Object.entries(dailySummary.user_activities || {}).map(([user, count]) => (
                <div key={user} className="user-item">
                  <span className="user-name">{user}</span>
                  <span className="user-count">{count} activities</span>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-filter">
            <h3>Activity Log</h3>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({activities.length})
              </button>
              <button 
                className={`filter-btn ${filter === 'sale' ? 'active' : ''}`}
                onClick={() => setFilter('sale')}
              >
                Sales
              </button>
              <button 
                className={`filter-btn ${filter === 'create' ? 'active' : ''}`}
                onClick={() => setFilter('create')}
              >
                Created
              </button>
              <button 
                className={`filter-btn ${filter === 'login' ? 'active' : ''}`}
                onClick={() => setFilter('login')}
              >
                Logins
              </button>
            </div>
          </div>

          <div className="activities-list">
            {getFilteredActivities().length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Description</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredActivities().map(activity => (
                      <tr key={activity.id}>
                        <td>{new Date(activity.timestamp).toLocaleTimeString()}</td>
                        <td>{activity.user_name}</td>
                        <td>
                          <span className="activity-badge">
                            {getActivityIcon(activity.action_type)} {activity.action_display}
                          </span>
                        </td>
                        <td>{activity.description}</td>
                        <td>{activity.ip_address || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No activities found for the selected date and filter.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default History;