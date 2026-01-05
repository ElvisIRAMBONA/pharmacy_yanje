import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [showRoleSelection, setShowRoleSelection] = useState(true);

  const handleRegisterSuccess = () => {
    setIsLogin(true);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
  };

  const handleBackToRoleSelection = () => {
    setShowRoleSelection(true);
    setSelectedRole('');
  };

  if (showRoleSelection) {
    return (
      <div className="auth-page">
        <div className="role-selection">
          <h2>Select Your Role</h2>
          <div className="role-cards">
            <div 
              className="role-card admin-card"
              onClick={() => handleRoleSelect('admin')}
            >
              <div className="role-icon">👨‍💼</div>
              <h3>Admin</h3>
              <p>Full system access and management</p>
            </div>
            <div 
              className="role-card pharmacist-card"
              onClick={() => handleRoleSelect('pharmacist')}
            >
              <div className="role-icon">👨‍⚕️</div>
              <h3>Pharmacist</h3>
              <p>Medicine and sales management</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-header">
        <button 
          onClick={handleBackToRoleSelection}
          className="back-btn"
        >
          ← Back to Role Selection
        </button>
        <div className="selected-role">
          <span className={`role-badge ${selectedRole}`}>
            {selectedRole === 'admin' ? '👨‍💼 Admin' : '👨‍⚕️ Pharmacist'}
          </span>
        </div>
      </div>
      
      <div className="auth-toggle">
        <button 
          className={`toggle-btn ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button 
          className={`toggle-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>
      
      {isLogin ? (
        <Login onLogin={onLogin} selectedRole={selectedRole} />
      ) : (
        <Register onRegister={handleRegisterSuccess} selectedRole={selectedRole} />
      )}
      
      {isLogin && (
        <p className="auth-switch">
          No account? 
          <button onClick={() => setIsLogin(false)} className="link-btn">
            Create account
          </button>
        </p>
      )}
      
      {!isLogin && (
        <p className="auth-switch">
          Already have an account? 
          <button onClick={() => setIsLogin(true)} className="link-btn">
            Sign in
          </button>
        </p>
      )}
    </div>
  );
};

export default AuthPage;