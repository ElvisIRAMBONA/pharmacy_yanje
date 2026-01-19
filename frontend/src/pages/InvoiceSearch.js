import React, { useState, useEffect } from 'react';
import { salesAPI } from '../services/api';
import BackButton from '../components/BackButton';

const InvoiceSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('customer');
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    filterSales();
  }, [searchTerm, searchType, sales]);

  const fetchSales = async () => {
    try {
      const response = await salesAPI.getAll();
      setSales(response.data);
      setFilteredSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSales = () => {
    if (!searchTerm) {
      setFilteredSales(sales);
      return;
    }

    const filtered = sales.filter(sale => {
      switch (searchType) {
        case 'customer':
          return sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
        case 'id':
          return sale.id.toString().includes(searchTerm);
        case 'date':
          return sale.date.includes(searchTerm);
        default:
          return true;
      }
    });
    setFilteredSales(filtered);
  };

  const downloadInvoice = async (saleId) => {
    try {
      console.log('Downloading invoice for sale:', saleId);
      const response = await salesAPI.getInvoice(saleId);
      console.log('Invoice response:', response);
      
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
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="invoice-search">
      <div className="page-header">
        <BackButton />
        <h2>Invoice Search</h2>
      </div>

      <div className="search-controls">
        <div className="search-group">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
          >
            <option value="customer">Customer Name</option>
            <option value="id">Invoice ID</option>
            <option value="date">Date</option>
          </select>
          
          <input
            type="text"
            placeholder={`Search by ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <button 
            onClick={() => setSearchTerm('')}
            className="btn btn-secondary"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="search-results">
        <p>{filteredSales.length} invoice(s) found</p>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Final Amount</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(sale => (
                <tr key={sale.id}>
                  <td>#{sale.id}</td>
                  <td>{sale.customer_name}</td>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                  <td>${sale.total_amount}</td>
                  <td>${sale.final_amount}</td>
                  <td>{sale.payment_method}</td>
                  <td>
                    <button 
                      onClick={() => downloadInvoice(sale.id)}
                      className="btn btn-sm btn-primary"
                      title="Download Invoice"
                    >
                      📄
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSearch;