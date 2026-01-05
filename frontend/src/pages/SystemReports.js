import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { salesAPI, inventoryAPI, medicinesAPI } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SystemReports = () => {
  const [salesStats, setSalesStats] = useState({});
  const [inventoryStats, setInventoryStats] = useState({});
  const [medicineStats, setMedicineStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const [dailySales, monthlySales, inventory, medicines] = await Promise.all([
        salesAPI.getDailyReport(today),
        salesAPI.getMonthlyReport(currentMonth, currentYear),
        inventoryAPI.getStats(),
        medicinesAPI.getAll()
      ]);

      setSalesStats({
        daily: dailySales.data,
        monthly: monthlySales.data
      });
      setInventoryStats(inventory.data);
      setMedicineStats({
        total: medicines.data.length,
        expired: medicines.data.filter(med => med.is_expired).length
      });
    } catch (error) {
      console.error('Error fetching reports data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading reports...</div>;

  // Chart data configurations
  const salesChartData = {
    labels: ['Today', 'This Month'],
    datasets: [
      {
        label: 'Sales Count',
        data: [salesStats.daily?.total_sales || 0, salesStats.monthly?.total_sales || 0],
        backgroundColor: ['#3498db', '#2ecc71'],
        borderColor: ['#2980b9', '#27ae60'],
        borderWidth: 1,
      },
    ],
  };

  const revenueChartData = {
    labels: ['Today', 'This Month'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [salesStats.daily?.total_amount || 0, salesStats.monthly?.total_amount || 0],
        backgroundColor: ['#e74c3c', '#f39c12'],
        borderColor: ['#c0392b', '#e67e22'],
        borderWidth: 1,
      },
    ],
  };

  const inventoryChartData = {
    labels: ['Normal Stock', 'Low Stock'],
    datasets: [
      {
        data: [
          (inventoryStats.total_items || 0) - (inventoryStats.low_stock_count || 0),
          inventoryStats.low_stock_count || 0
        ],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderColor: ['#27ae60', '#c0392b'],
        borderWidth: 2,
      },
    ],
  };

  const medicineStatusData = {
    labels: ['Active', 'Expired'],
    datasets: [
      {
        data: [
          (medicineStats.total || 0) - (medicineStats.expired || 0),
          medicineStats.expired || 0
        ],
        backgroundColor: ['#3498db', '#e74c3c'],
        borderColor: ['#2980b9', '#c0392b'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="system-reports">
      <div className="page-header">
        <h2>System Reports</h2>
      </div>

      <div className="reports-grid">
        {/* Sales Charts */}
        <div className="report-section">
          <h3>Sales Analytics</h3>
          <div className="charts-container">
            <div className="chart-wrapper">
              <h4>Sales Volume</h4>
              <Bar data={salesChartData} options={chartOptions} />
            </div>
            <div className="chart-wrapper">
              <h4>Revenue Comparison</h4>
              <Bar data={revenueChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Inventory & Medicine Status Charts */}
        <div className="report-section">
          <h3>Inventory & Medicine Status</h3>
          <div className="charts-container">
            <div className="chart-wrapper">
              <h4>Inventory Stock Status</h4>
              <Doughnut data={inventoryChartData} options={doughnutOptions} />
            </div>
            <div className="chart-wrapper">
              <h4>Medicine Status</h4>
              <Doughnut data={medicineStatusData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="report-section">
          <h3>Key Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-card sales">
              <div className="metric-icon">📊</div>
              <div className="metric-info">
                <h4>Today's Sales</h4>
                <p className="metric-value">{salesStats.daily?.total_sales || 0}</p>
                <p className="metric-label">transactions</p>
              </div>
            </div>
            
            <div className="metric-card revenue">
              <div className="metric-icon">💰</div>
              <div className="metric-info">
                <h4>Today's Revenue</h4>
                <p className="metric-value">${salesStats.daily?.total_amount || 0}</p>
                <p className="metric-label">total earnings</p>
              </div>
            </div>
            
            <div className="metric-card inventory">
              <div className="metric-icon">📦</div>
              <div className="metric-info">
                <h4>Low Stock Items</h4>
                <p className="metric-value">{inventoryStats.low_stock_count || 0}</p>
                <p className="metric-label">need attention</p>
              </div>
            </div>
            
            <div className="metric-card medicines">
              <div className="metric-icon">💊</div>
              <div className="metric-info">
                <h4>Expired Medicines</h4>
                <p className="metric-value">{medicineStats.expired || 0}</p>
                <p className="metric-label">need removal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      {salesStats.daily?.payment_methods && (
        <div className="report-section">
          <h3>Today's Payment Methods</h3>
          <div className="payment-methods">
            {Object.entries(salesStats.daily.payment_methods).map(([method, data]) => (
              <div key={method} className="payment-method-card">
                <h4>{method}</h4>
                <p><strong>Count:</strong> {data.count}</p>
                <p><strong>Amount:</strong> ${data.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Stock Items */}
      {inventoryStats.low_stock_items && inventoryStats.low_stock_items.length > 0 && (
        <div className="report-section">
          <h3>Low Stock Items</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Reorder Level</th>
                </tr>
              </thead>
              <tbody>
                {inventoryStats.low_stock_items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.medicine}</td>
                    <td>{item.category}</td>
                    <td>{item.current_stock}</td>
                    <td>{item.reorder_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemReports;