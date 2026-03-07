import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../utils/TranslationContext';
import UserProfile from './UserProfile';
import { notificationsAPI } from '../services/api';
import { 
  FaHome, FaSearch, FaPills, FaBox, FaBuilding, FaPlus, FaUserMd, 
  FaChartBar, FaFileInvoice, FaHistory, FaMoneyBillWave, FaBell,
  FaChevronLeft, FaChevronRight, FaChevronDown
} from 'react-icons/fa';
import { MdDashboard, MdInventory, MdBusiness } from 'react-icons/md';

const Navigation = ({ navLinks, user, userRole, onLogout, onUserUpdate, darkMode, setDarkMode, language, setLanguage }) => {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarRef = useRef(null);
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
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDropdownToggle = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
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
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} ref={sidebarRef}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon"><FaPills /></span>
            {!sidebarCollapsed && <span className="brand-text">Pharmacy Yanje</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <ul className="nav-links">
            {navLinks.map((link, index) => (
              <li key={index} className={`nav-item ${link.dropdown ? 'has-dropdown' : ''}`}>
                {link.dropdown ? (
                  <>
                    <button 
                      className={`nav-link dropdown-toggle ${openDropdown === index ? 'active' : ''}`}
                      onClick={() => handleDropdownToggle(index)}
                      title={sidebarCollapsed ? link.label : ''}
                    >
                      <span className="nav-icon">{getNavIcon(link.label)}</span>
                      {!sidebarCollapsed && (
                        <>
                          <span className="nav-text">{link.label}</span>
                          <span className={`dropdown-arrow ${openDropdown === index ? 'open' : ''}`}><FaChevronDown /></span>
                        </>
                      )}
                    </button>
                    {openDropdown === index && (
                      <ul className="dropdown-menu">
                        {link.dropdown.map((subLink, subIndex) => (
                          <li key={subIndex}>
                            <Link 
                              to={subLink.path}
                              className="dropdown-link"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span className="dropdown-icon">{getNavIcon(subLink.label)}</span>
                              {!sidebarCollapsed && <span>{subLink.label}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link 
                    to={link.path} 
                    className="nav-link"
                    title={sidebarCollapsed ? link.label : ''}
                  >
                    <span className="nav-icon">{getNavIcon(link.label)}</span>
                    {!sidebarCollapsed && <span className="nav-text">{link.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {/* Notification Bell */}
          <div className="notification-container" ref={notificationRef}>
            <button 
              className="notification-bell"
              onClick={handleNotificationClick}
              title="Notifications"
            >
              <span className="notification-icon"><FaBell /></span>
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
        </div>
      </div>

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

// Helper function to get icons for navigation items
const getNavIcon = (label) => {
  const iconMap = {
    'Dashboard': <MdDashboard />,
    'Invoice Search': <FaSearch />,
    'Medicine Inventory': <FaPills />,
    'Inventory': <MdInventory />,
    'Pharmacy Company': <MdBusiness />,
    'Add Company': <FaPlus />,
    'Manage Company': <FaBuilding />,
    'Medicine': <FaPills />,
    'Add Medicine': <FaPlus />,
    'Manage Medicine': <FaPills />,
    'Pharmacist': <FaUserMd />,
    'Add Pharmacist': <FaPlus />,
    'Manage Pharmacist': <FaUserMd />,
    'Reports': <FaChartBar />,
    'Stock Reports': <FaChartBar />,
    'Pharmacist Reports': <FaUserMd />,
    'Sales Reports': <FaMoneyBillWave />,
    'Invoice': <FaFileInvoice />,
    'Invoice Management': <FaFileInvoice />,
    'History': <FaHistory />,
    'Sales': <FaMoneyBillWave />
  };
  return iconMap[label] || <FaHome />;
};

export default Navigation;