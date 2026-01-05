import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';

const Navigation = ({ navLinks, user, userRole, onLogout, onUserUpdate }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleUserUpdate = (updatedUser) => {
    onUserUpdate(updatedUser);
    setShowProfile(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>🏥 Pharmacy Yanje</h1>
        </div>

        <ul className="nav-links">
          {navLinks.map((link, index) => (
            <li key={index} className={link.dropdown ? 'dropdown' : ''}>
              {link.dropdown ? (
                <>
                  <span 
                    className="dropdown-toggle"
                    onClick={() => handleDropdownToggle(index)}
                  >
                    {link.label} <span className="dropdown-arrow">▼</span>
                  </span>
                  {openDropdown === index && (
                    <ul className="dropdown-menu">
                      {link.dropdown.map((subLink, subIndex) => (
                        <li key={subIndex}>
                          <Link 
                            to={subLink.path}
                            onClick={() => setOpenDropdown(null)}
                          >
                            {subLink.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link to={link.path}>{link.label}</Link>
              )}
            </li>
          ))}
        </ul>

        <div className="user-section">
          <div className="user-info">
            <span className={`role-badge ${userRole}`}>
              {userRole === 'admin' ? '👨‍💼' : '👨‍⚕️'} {userRole.toUpperCase()}
            </span>
          </div>
          
          <div className="user-menu">
            <button 
              className="user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user.first_name ? user.first_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user.username}
                </span>
                <span className="user-email">{user.email}</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showUserMenu && (
              <div className="user-dropdown">
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setShowProfile(true);
                    setShowUserMenu(false);
                  }}
                >
                  <span className="item-icon">⚙️</span>
                  Settings
                </button>
                <button 
                  className="dropdown-item"
                  onClick={() => {
                    setShowProfile(true);
                    setShowUserMenu(false);
                  }}
                >
                  <span className="item-icon">👤</span>
                  Profile
                </button>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item logout-item"
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                >
                  <span className="item-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showProfile && (
        <UserProfile 
          user={user}
          onClose={() => setShowProfile(false)}
          onUpdate={handleUserUpdate}
        />
      )}
    </>
  );
};

export default Navigation;