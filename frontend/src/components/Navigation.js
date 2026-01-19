import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';
import { notificationsAPI } from '../services/api';

const Navigation = ({ navLinks, user, userRole, onLogout, onUserUpdate, darkMode, setDarkMode, language, setLanguage }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const navRef = useRef(null);
  const dropdownRefs = useRef({});
  const notificationRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const [unreadRes, recentRes] = await Promise.all([
        notificationsAPI.getUnreadCount(),
        notificationsAPI.getRecent()
      ]);
      setUnreadCount(unreadRes.data.unread_count || 0);
      setNotifications(recentRes.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDropdownToggle = (index, event) => {
    event.stopPropagation();
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      const button = dropdownRefs.current[index];
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left
        });
      }
      setOpenDropdown(index);
    }
  };

  const handleNotificationClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      await fetchNotifications();
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'critical': return 'notification-critical';
      case 'high': return 'notification-high';
      case 'medium': return 'notification-medium';
      default: return 'notification-low';
    }
  };

  const handleUserUpdate = (updatedUser) => {
    onUserUpdate(updatedUser);
    setShowProfile(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="navbar-brand">
          <h1>🏥 Pharmacy Yanje</h1>
        </div>

        <div className="nav-scroll-container">
          <ul className="nav-links">
            {navLinks.map((link, index) => (
              <li key={index} className={`dropdown ${link.dropdown ? 'has-dropdown' : ''}`}>
                {link.dropdown ? (
                  <>
                    <button 
                      className="dropdown-toggle"
                      ref={(el) => (dropdownRefs.current[index] = el)}
                      onClick={(e) => handleDropdownToggle(index, e)}
                      type="button"
                    >
                      {link.label} <span className="dropdown-arrow">▼</span>
                    </button>
                    {openDropdown === index && (
                      <ul 
                        className="dropdown-menu show"
                        style={{
                          position: 'fixed',
                          top: dropdownPosition.top,
                          left: dropdownPosition.left,
                          minWidth: '200px'
                        }}
                      >
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
        </div>

        <div className="user-section">
          {/* Notification Bell */}
          <div className="notification-container" ref={notificationRef}>
            <button 
              className="notification-bell"
              onClick={handleNotificationClick}
              title="Notifications"
            >
              <span className="notification-icon">🔔</span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown show">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <button 
                      className="mark-all-read-btn"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.is_read ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
                        onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                      >
                        <div className="notification-content">
                          <span className="notification-title">{notification.title}</span>
                          <span className="notification-message">{notification.message}</span>
                          <span className="notification-time">{notification.time_ago || 'Just now'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

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
              <div className="user-dropdown show">
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
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          language={language}
          setLanguage={setLanguage}
        />
      )}
    </>
  );
};

export default Navigation;