import React, { useState, useEffect } from 'react';
import { salesAPI, medicinesAPI } from '../services/api';

const InvoiceManagement = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [sales, setSales] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Create Invoice State
  const [invoiceData, setInvoiceData] = useState({
    customer_name: '',
    payment_method: 'cash',
    discount: 0,
    items: []
  });
  
  const [newItem, setNewItem] = useState({
    medicine_id: '',
    quantity: 1,
    price: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salesResponse, medicinesResponse] = await Promise.all([
        salesAPI.getAll(),
        medicinesAPI.getAll()
      ]);
      setSales(salesResponse.data);
      setMedicines(medicinesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItemToInvoice = () => {
    if (!newItem.medicine_id || newItem.quantity <= 0) return;
    
    const medicine = medicines.find(m => m.id === parseInt(newItem.medicine_id));
    if (!medicine) return;

    const item = {
      id: Date.now(),
      medicine,
      quantity: parseInt(newItem.quantity),
      price: parseFloat(newItem.price || medicine.price)
    };

    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }));

    setNewItem({ medicine_id: '', quantity: 1, price: 0 });
  };

  const removeItem = (itemId) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const calculateTotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateFinalAmount = () => {
    return calculateTotal() - (invoiceData.discount || 0);
  };

  const createInvoice = async () => {
    if (!invoiceData.customer_name || invoiceData.items.length === 0) {
      alert('Please fill in customer name and add at least one item');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        customer_name: invoiceData.customer_name,
        payment_method: invoiceData.payment_method,
        discount: invoiceData.discount || 0,
        total_amount: calculateTotal(),
        items_data: invoiceData.items.map(item => ({
          medicine_id: item.medicine.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await salesAPI.create(saleData);
      alert('Invoice created successfully!');
      
      // Reset form
      setInvoiceData({
        customer_name: '',
        payment_method: 'cash',
        discount: 0,
        items: []
      });
      
      // Refresh sales list
      fetchData();
      setActiveTab('manage');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (saleId) => {
    try {
      const response = await salesAPI.getInvoice(saleId);
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${saleId}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Error downloading invoice');
    }
  };

  if (loading && sales.length === 0) return <div>Loading...</div>;

  return (
    <div className="invoice-management">
      <div className="page-header">
        <h2>Invoice Management</h2>
      </div>

      <div className="invoice-tabs">
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Invoice
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Invoices ({sales.length})
        </button>
      </div>

      {activeTab === 'create' && (
        <div className="create-invoice">
          <div className="invoice-form">
            <div className="form-row">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={invoiceData.customer_name}
                  onChange={(e) => setInvoiceData(prev => ({...prev, customer_name: e.target.value}))}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={invoiceData.payment_method}
                  onChange={(e) => setInvoiceData(prev => ({...prev, payment_method: e.target.value}))}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="insurance">Insurance</option>
                  <option value="transfer">Transfer</option>
                  <option value="lumicash">Lumicash</option>
                </select>
              </div>
              <div className="form-group">
                <label>Discount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={invoiceData.discount}
                  onChange={(e) => setInvoiceData(prev => ({...prev, discount: parseFloat(e.target.value) || 0}))}
                />
              </div>
            </div>

            <div className="add-item-section">
              <h3>Add Items</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Medicine</label>
                  <select
                    value={newItem.medicine_id}
                    onChange={(e) => {
                      const medicineId = e.target.value;
                      const medicine = medicines.find(m => m.id === parseInt(medicineId));
                      setNewItem(prev => ({
                        ...prev,
                        medicine_id: medicineId,
                        price: medicine ? medicine.price : 0
                      }));
                    }}
                  >
                    <option value="">Select medicine</option>
                    {medicines.map(medicine => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} - ${medicine.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({...prev, quantity: e.target.value}))}
                  />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({...prev, price: e.target.value}))}
                  />
                </div>
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button type="button" onClick={addItemToInvoice} className="btn btn-primary">
                    Add Item
                  </button>
                </div>
              </div>
            </div>

            {invoiceData.items.length > 0 && (
              <div className="invoice-items">
                <h3>Invoice Items</h3>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map(item => (
                        <tr key={item.id}>
                          <td>{item.medicine.name}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>${(item.quantity * item.price).toFixed(2)}</td>
                          <td>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="btn btn-sm btn-danger"
                              title="Remove"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="invoice-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Discount:</span>
                    <span>-${(invoiceData.discount || 0).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${calculateFinalAmount().toFixed(2)}</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    onClick={createInvoice}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    {loading ? 'Creating...' : 'Create Invoice'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="manage-invoices">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id}>
                    <td>#{sale.id}</td>
                    <td>{sale.customer_name}</td>
                    <td>{new Date(sale.date).toLocaleDateString()}</td>
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
      )}
    </div>
  );
};

export default InvoiceManagement;