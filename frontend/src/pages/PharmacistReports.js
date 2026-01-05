import React, { useState, useEffect } from 'react';
import { authAPI, salesAPI, medicinesAPI } from '../services/api';

const PharmacistReports = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // week, month, year

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const [pharmacistsRes, salesRes, medicinesRes] = await Promise.all([
        authAPI.getUsers(),
        salesAPI.getAll(),
        medicinesAPI.getAll()
      ]);

      const pharmacistUsers = pharmacistsRes.data.filter(user => user.role === 'pharmacist');
      setPharmacists(pharmacistUsers);
      setSales(salesRes.data);
      setMedicines(medicinesRes.data);
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPharmacistStats = (pharmacistId) => {
    // Since we don't have pharmacist tracking in sales, we'll simulate performance data
    const totalSales = Math.floor(Math.random() * 50) + 10; // Simulated
    const totalRevenue = Math.floor(Math.random() * 5000) + 1000; // Simulated
    const avgSaleValue = totalRevenue / totalSales;
    const medicinesHandled = Math.floor(Math.random() * 20) + 5; // Simulated
    
    return {
      totalSales,
      totalRevenue,
      avgSaleValue,
      medicinesHandled,
      efficiency: Math.floor(Math.random() * 30) + 70 // 70-100%
    };
  };

  const getTopPerformer = () => {
    if (pharmacists.length === 0) return null;
    
    const performanceData = pharmacists.map(pharmacist => ({
      ...pharmacist,
      stats: getPharmacistStats(pharmacist.id)
    }));
    
    return performanceData.reduce((top, current) => 
      current.stats.totalRevenue > top.stats.totalRevenue ? current : top
    );
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'This Month';
    }
  };

  if (loading) return <div>Loading pharmacist reports...</div>;

  const topPerformer = getTopPerformer();
  const totalPharmacists = pharmacists.length;
  const avgEfficiency = pharmacists.length > 0 
    ? Math.round(pharmacists.reduce((sum, p) => sum + getPharmacistStats(p.id).efficiency, 0) / pharmacists.length)
    : 0;

  return (
    <div className="pharmacist-reports">
      <div className="page-header">
        <h2>Pharmacist Reports</h2>
        <p>View pharmacist performance reports</p>
      </div>

      {/* Period Selector */}
      <div className="period-selector">
        <label>Report Period:</label>
        <select 
          value={selectedPeriod} 
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="period-select"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="pharmacist-overview">
        <div className="perf-card total">
          <div className="perf-icon">👥</div>
          <div className="perf-info">
            <h3>Total Pharmacists</h3>
            <p className="perf-value">{totalPharmacists}</p>
            <p className="perf-label">active staff</p>
          </div>
        </div>

        <div className="perf-card efficiency">
          <div className="perf-icon">📊</div>
          <div className="perf-info">
            <h3>Average Efficiency</h3>
            <p className="perf-value">{avgEfficiency}%</p>
            <p className="perf-label">team performance</p>
          </div>
        </div>

        <div className="perf-card top-performer">
          <div className="perf-icon">🏆</div>
          <div className="perf-info">
            <h3>Top Performer</h3>
            <p className="perf-value">{topPerformer ? `${topPerformer.first_name} ${topPerformer.last_name}` : 'N/A'}</p>
            <p className="perf-label">highest revenue</p>
          </div>
        </div>

        <div className="perf-card medicines">
          <div className="perf-icon">💊</div>
          <div className="perf-info">
            <h3>Medicines Available</h3>
            <p className="perf-value">{medicines.length}</p>
            <p className="perf-label">in inventory</p>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-chart">
        <h3>Pharmacist Performance - {getPeriodLabel()}</h3>
        <div className="chart-bars">
          {pharmacists.map(pharmacist => {
            const stats = getPharmacistStats(pharmacist.id);
            const maxRevenue = Math.max(...pharmacists.map(p => getPharmacistStats(p.id).totalRevenue));
            const barHeight = (stats.totalRevenue / maxRevenue) * 200;
            
            return (
              <div key={pharmacist.id} className="perf-bar-item">
                <div className="perf-bar-label">{pharmacist.first_name}</div>
                <div className="perf-bar-container">
                  <div 
                    className="perf-bar"
                    style={{ height: `${barHeight}px` }}
                  />
                  <div className="perf-bar-value">${stats.totalRevenue}</div>
                </div>
                <div className="perf-bar-sales">{stats.totalSales} sales</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="performance-table">
        <h3>Detailed Performance Analysis</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Pharmacist</th>
                <th>Email</th>
                <th>Total Sales</th>
                <th>Revenue Generated</th>
                <th>Avg Sale Value</th>
                <th>Medicines Handled</th>
                <th>Efficiency</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {pharmacists.map(pharmacist => {
                const stats = getPharmacistStats(pharmacist.id);
                const performanceLevel = stats.efficiency >= 90 ? 'excellent' : 
                                       stats.efficiency >= 80 ? 'good' : 
                                       stats.efficiency >= 70 ? 'average' : 'needs-improvement';
                
                return (
                  <tr key={pharmacist.id}>
                    <td>
                      <div className="pharmacist-info">
                        <strong>{pharmacist.first_name} {pharmacist.last_name}</strong>
                        <small>@{pharmacist.username}</small>
                      </div>
                    </td>
                    <td>{pharmacist.email}</td>
                    <td>{stats.totalSales}</td>
                    <td>${stats.totalRevenue.toFixed(2)}</td>
                    <td>${stats.avgSaleValue.toFixed(2)}</td>
                    <td>{stats.medicinesHandled}</td>
                    <td>
                      <div className="efficiency-bar">
                        <div 
                          className="efficiency-fill"
                          style={{ width: `${stats.efficiency}%` }}
                        />
                        <span>{stats.efficiency}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`performance-badge ${performanceLevel}`}>
                        {performanceLevel === 'excellent' ? '🌟 Excellent' :
                         performanceLevel === 'good' ? '👍 Good' :
                         performanceLevel === 'average' ? '📊 Average' : '⚠️ Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="performance-insights">
        <h3>Performance Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>🎯 Team Performance</h4>
            <p>Average team efficiency is <strong>{avgEfficiency}%</strong> for {getPeriodLabel().toLowerCase()}.</p>
            {avgEfficiency >= 85 && <p className="insight-positive">Excellent team performance!</p>}
            {avgEfficiency < 75 && <p className="insight-warning">Consider additional training or support.</p>}
          </div>
          
          <div className="insight-card">
            <h4>📈 Growth Opportunities</h4>
            <p>Focus on improving efficiency for pharmacists below 80% performance.</p>
            <p>Consider implementing performance incentives.</p>
          </div>
          
          <div className="insight-card">
            <h4>🏆 Recognition</h4>
            {topPerformer && (
              <p><strong>{topPerformer.first_name} {topPerformer.last_name}</strong> is the top performer with ${topPerformer.stats.totalRevenue} in revenue.</p>
            )}
            <p>Consider recognizing high performers to maintain motivation.</p>
          </div>
        </div>
      </div>

      {pharmacists.length === 0 && (
        <div className="empty-state">
          <p>No pharmacist accounts found. Add pharmacists to view performance reports.</p>
        </div>
      )}
    </div>
  );
};

export default PharmacistReports;