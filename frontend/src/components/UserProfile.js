import React, { useState } from 'react';
import api from '../services/api';
import { languageOptions } from '../utils/translations';

const UserProfile = ({ user, onClose, onUpdate, darkMode, setDarkMode, language, setLanguage }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: user.username,
    email: user.email,
    first_name: user.first_name || '',
    last_name: user.last_name || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.put(`/users/${user.id}/`, profileData);
      setMessage('Profile updated successfully!');
      onUpdate(response.data);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/users/change-password/', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setMessage('Password changed successfully!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const selectedLanguage = languageOptions.find(opt => opt.code === language);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h3>User Settings</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="profile-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                required
                minLength="8"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                required
                minLength="8"
              />
            </div>
            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'settings' && (
          <div className="settings-form">
            {/* Dark Mode Toggle */}
            <div className="settings-section">
              <div className="settings-info">
                <h4>Dark Mode</h4>
                <p>Switch between light and dark themes</p>
              </div>
              <div className="settings-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={darkMode} 
                    onChange={handleDarkModeToggle}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="setting-value">
                  {darkMode ? '🌙 Dark' : '☀️ Light'}
                </span>
              </div>
            </div>

            {/* Language Selector */}
            <div className="settings-section">
              <div className="settings-info">
                <h4>Language</h4>
                <p>Select your preferred language</p>
              </div>
              <div className="settings-control">
                <select 
                  value={language} 
                  onChange={handleLanguageChange}
                  className="language-select"
                >
                  {languageOptions.map(option => (
                    <option key={option.code} value={option.code}>
                      {option.flag} {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Theme Preview */}
            <div className="theme-preview">
              <h4>Theme Preview</h4>
              <div className={`preview-card ${darkMode ? 'dark' : 'light'}`}>
                <div className="preview-navbar"></div>
                <div className="preview-content">
                  <div className="preview-line"></div>
                  <div className="preview-line short"></div>
                  <div className="preview-line"></div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

