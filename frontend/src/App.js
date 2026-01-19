import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MedicinesList from './pages/MedicinesList';
import SalesList from './pages/SalesList';
import InventoryList from './pages/InventoryList';
import AdminDashboard from './pages/AdminDashboard';
import PharmacistDashboard from './pages/PharmacistDashboard';
import InvoiceSearch from './pages/InvoiceSearch';
import InvoiceManagement from './pages/InvoiceManagement';
import AddMedicine from './pages/AddMedicine';
import AddCompany from './pages/AddCompany';
import ManageCompany from './pages/ManageCompany';
import AddPharmacist from './pages/AddPharmacist';
import ManagePharmacist from './pages/ManagePharmacist';
import SystemReports from './pages/SystemReports';
import StockReports from './pages/StockReports';
import PharmacistReports from './pages/PharmacistReports';
import History from './pages/History';
import AuthPage from './components/AuthPage';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  const [loading, setLoading] = useState(true);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('userRole');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setUserRole(savedRole || null);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setUserRole(userData.role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setUser(null);
    setUserRole(null);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Navigation links based on role
  const adminLinks = [
    { path: '/admin-dashboard', label: 'Dashboard' },
    { path: '/invoice-search', label: 'Invoice Search' },
    { path: '/inventory', label: 'Medicine Inventory' },
    { 
      label: 'Pharmacy Company', 
      dropdown: [
        { path: '/company/add', label: 'Add Company' },
        { path: '/company/manage', label: 'Manage Company' }
      ]
    },
    { 
      label: 'Medicine', 
      dropdown: [
        { path: '/medicines/add', label: 'Add Medicine' },
        { path: '/medicines', label: 'Manage Medicine' }
      ]
    },
    { 
      label: 'Pharmacist', 
      dropdown: [
        { path: '/pharmacist/add', label: 'Add Pharmacist' },
        { path: '/pharmacist/manage', label: 'Manage Pharmacist' }
      ]
    },
    { 
      label: 'Reports', 
      dropdown: [
        { path: '/reports/stock', label: 'Stock Reports' },
        { path: '/reports/pharmacist', label: 'Pharmacist Reports' },
        { path: '/reports/sales', label: 'Sales Reports' }
      ]
    },
    { path: '/invoice', label: 'Invoice' },
    { path: '/history', label: 'History' }
  ];

  const pharmacistLinks = [
    { path: '/pharmacist-dashboard', label: 'Dashboard' },
    { 
      label: 'Medicine', 
      dropdown: [
        { path: '/medicines/add', label: 'Add Medicine' },
        { path: '/medicines', label: 'Manage Medicine' }
      ]
    },
    { path: '/inventory', label: 'Inventory' },
    { path: '/sales', label: 'Sales' },
    { path: '/invoice', label: 'Invoice Management' },
    { path: '/reports/stock', label: 'Stock Reports' },
    { path: '/history', label: 'History' },
  ];

  const navLinks = userRole === 'admin' ? adminLinks : pharmacistLinks;

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Navigation 
          navLinks={navLinks}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          language={language}
          setLanguage={setLanguage}
        />
        
        <main className="main-content">
          <Routes>
            {/* Role-based dashboard redirects */}
            <Route 
              path="/" 
              element={
                userRole === 'admin' 
                  ? <Navigate to="/admin-dashboard" replace /> 
                  : <Navigate to="/pharmacist-dashboard" replace />
              } 
            />
            
            {/* Admin-only routes */}
            {userRole === 'admin' && (
              <>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/invoice-search" element={<InvoiceSearch />} />
                <Route path="/company/add" element={<AddCompany />} />
                <Route path="/company/manage" element={<ManageCompany />} />
                <Route path="/medicines/add" element={<AddMedicine />} />
                <Route path="/pharmacist/add" element={<AddPharmacist />} />
                <Route path="/pharmacist/manage" element={<ManagePharmacist />} />
                <Route path="/reports/stock" element={<StockReports />} />
                <Route path="/reports/pharmacist" element={<PharmacistReports />} />
                <Route path="/reports/sales" element={<SystemReports />} />
                <Route path="/invoice" element={<InvoiceManagement />} />
              </>
            )}
            
            {/* Pharmacist-only routes */}
            {userRole === 'pharmacist' && (
              <>
                <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
                <Route path="/medicines/add" element={<AddMedicine />} />
                <Route path="/reports/stock" element={<StockReports />} />
                <Route path="/invoice" element={<InvoiceManagement />} />
              </>
            )}
            
            {/* Common routes for both roles */}
            <Route path="/medicines" element={<MedicinesList userRole={userRole} />} />
            <Route path="/inventory" element={<InventoryList userRole={userRole} />} />
            <Route path="/sales" element={<SalesList userRole={userRole} />} />
            <Route path="/history" element={<History />} />
            
            {/* Redirect unauthorized access */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
