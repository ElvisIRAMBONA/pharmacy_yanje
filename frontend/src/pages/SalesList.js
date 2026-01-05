import React, { useState, useEffect } from 'react';
import { salesAPI } from '../services/api';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await salesAPI.getAll();
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (saleId) => {
    try {
      console.log('Downloading invoice for sale:', saleId);
      
      // Show loading state
      const button = document.querySelector(`button[onclick*="${saleId}"]`);
      if (button) {
        button.disabled = true;
        button.textContent = 'Downloading...';
      }
      
      const response = await salesAPI.getInvoice(saleId);
      console.log('Invoice response status:', response.status);
      console.log('Invoice response headers:', response.headers);
      
      if (response.status === 200 && response.data) {
        // Create blob from HTML content
        const blob = new Blob([response.data], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice-${saleId}.html`);
        link.style.display = 'none';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('Invoice downloaded successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      console.error('Error details:', error.response?.data);
      alert(`Error downloading invoice: ${error.response?.data?.detail || error.message}`);
    } finally {
      // Reset button state
      const button = document.querySelector(`button[onclick*="${saleId}"]`);
      if (button) {
        button.disabled = false;
        button.textContent = 'Invoice';
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="sales-list">
      <h2>Sales</h2>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Discount</th>
              <th>Final Amount</th>
              <th>Payment Method</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{sale.customer_name}</td>
                <td>${sale.total_amount}</td>
                <td>${sale.discount}</td>
                <td>${sale.final_amount}</td>
                <td>{sale.payment_method}</td>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => downloadInvoice(sale.id)}
                    className="btn btn-primary"
                  >
                    Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesList;