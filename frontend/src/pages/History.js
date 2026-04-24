import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BackButton from '../components/BackButton';
import { FaHistory, FaChartBar, FaUsers, FaMoneyBillWave, FaFileInvoice, FaPlus, FaEdit, FaTrash, FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaBox, FaFile, FaCalendarAlt, FaFilter } from 'react-icons/fa';

const History = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailySummary, setDailySummary] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDailyData();
  }, [selectedDate]);

  const fetchDailyData = async () => {
    setLoading(true);
    setError('');
    try {
      const [summaryRes, activitiesRes] = await Promise.all([
        api.get(`/auth/daily-summary/?date=${selectedDate}`),
        api.get(`/auth/activity-logs/?date=${selectedDate}&limit=100`)
      ]);
      
      setDailySummary(summaryRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching daily data:', error);
      setError('Failed to load daily data. Please try again.');
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
      'create': <FaPlus />,
      'update': <FaEdit />,
      'delete': <FaTrash />,
      'sale': <FaShoppingCart />,
      'login': <FaSignInAlt />,
      'logout': <FaSignOutAlt />,
      'stock_update': <FaBox />,
      'invoice_generated': <FaFileInvoice />
    };
    return icons[actionType] || <FaFile />;
  };

  return (
    <div className="history-page">
      {/* Hero Header */}
      <div className="page-header hero-header">
        <BackButton />
        <div className="header-content">
          <div>
            <h1><FaHistory /> Activity History</h1>
            <p className="header-subtitle">Comprehensive view of daily system operations and user activities</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary btn-sm" onClick={fetchDailyData} disabled={loading}>
              <FaSyncAlt /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="history-controls card-section">
        <div className="date-selector">
          <label className="control-label">
            <FaCalendarAlt /> Select Date:
          </label>
          <div className="input-group">
            <input
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

{error ? (
        <div className="alert alert-danger">
          <FaExclamationTriangle /> {error}
          <button className="btn btn-primary btn-sm" onClick={fetchDailyData} style={{marginLeft: '1rem'}}>
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading daily history...</p>
        </div>
      ) : (
        <>
          <div className="daily-summary card-section">
            <h3 className="section-title"><FaChartBar /> Daily Summary • {selectedDate}</h3>
            <div className="summary-cards">
              <div className="summary-card summary-card-blue">
                <div className="card-icon"><FaChartBar /></div>
                <div className="card-info">
                  <h4>Total Activities</h4>
                  <p>{dailySummary.total_activities || 0}</p>
                </div>
              </div>
              <div className="summary-card summary-card-green">
                <div className="card-icon"><FaUsers /></div>
                <div className="card-info">
                  <h4>Active Users</h4>
                  <p>{dailySummary.unique_users || 0}</p>
                </div>
              </div>
              <div className="summary-card summary-card-teal">
                <div className="card-icon"><FaMoneyBillWave /></div>
                <div className="card-info">
                  <h4>Sales Made</h4>
                  <p>{dailySummary.activity_breakdown?.['Sale Made'] || 0}</p>
                </div>
              </div>
              <div className="summary-card summary-card-purple">
                <div className="card-icon"><FaFileInvoice /></div>
                <div className="card-info">
                  <h4>Invoices Generated</h4>
                  <p>{dailySummary.activity_breakdown?.['Invoice Generated'] || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-breakdown card-section">
            <h3 className="section-title"><FaChartPie /> Activity Breakdown</h3>
            <div className="breakdown-grid">
              {Object.entries(dailySummary.activity_breakdown || {}).map(([action, count]) => {
                const total = dailySummary.total_activities || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={action} className="breakdown-item">
                    <div className="breakdown-label">{action}</div>
                    <div className="breakdown-metric">
                      <span className="breakdown-count">{count}</span>
                      <span className="percentage">({percentage}%)</span>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{width: `${percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="user-activities card-section">
            <h3 className="section-title"><FaUsers /> User Activity</h3>
            <div className="user-grid">
              {Object.entries(dailySummary.user_activities || {}).map(([user, count]) => {
                const total = dailySummary.total_activities || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={user} className="user-item">
                    <span className="user-avatar">{user.charAt(0).toUpperCase()}</span>
                    <div className="user-details">
                      <span className="user-name">{user}</span>
                      <span className="user-count">{count} activities ({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="activity-filter card-section">
            <div className="section-header">
              <h3 className="section-title"><FaFilter /> Activity Log ({getFilteredActivities().length})</h3>
              <div className="export-actions">
                <button className="btn btn-secondary btn-sm">
                  <FaDownload /> Export CSV
                </button>
              </div>
            </div>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <FaCircle /> All ({activities.length})
              </button>
              <button 
                className={`filter-btn ${filter === 'sale' ? 'active' : ''}`}
                onClick={() => setFilter('sale')}
              >
                <FaShoppingCart /> Sales
              </button>
              <button 
                className={`filter-btn ${filter === 'create' ? 'active' : ''}`}
                onClick={() => setFilter('create')}
              >
                <FaPlus /> Created
              </button>
              <button 
                className={`filter-btn ${filter === 'login' ? 'active' : ''}`}
                onClick={() => setFilter('login')}
              >
                <FaSignInAlt /> Logins
              </button>
            </div>
          </div>

          <div className="activities-list">
            {getFilteredActivities().length > 0 ? (
              <div className="table-container">
                <table>
                  <thead className="sticky-header">
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Description</th>
                      <th>IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredActivities().map((activity, index) => (
                      <tr key={activity.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td><span className="time-badge">{new Date(activity.timestamp).toLocaleTimeString()}</span></td>
                        <td><span className="user-name-highlight">{activity.user_name}</span></td>
                        <td>
                          <span className="activity-badge">
                            <span className="badge-icon">{getActivityIcon(activity.action_type)}</span>
                            {activity.action_display}
                          </span>
                        </td>
                        <td className="description-cell">{activity.description}</td>
                        <td>{activity.ip_address || <span className="na-label">N/A</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <FaHistory className="empty-icon" />
                <h4>No activities found</h4>
                <p>Try adjusting the date or filter to see activity logs.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default History;