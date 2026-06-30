import React, { useState, useEffect } from 'react';
import { FiSave, FiUser, FiBell, FiLock, FiSliders, FiGlobe, FiSmartphone, FiMonitor, FiAlertTriangle } from 'react-icons/fi';
import { FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import './Settings.css';

export default function Settings({ user }) {
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['profile', 'notifications', 'security', 'system'];
    return validTabs.includes(hash) ? hash : 'profile';
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@eduvantage.com',
    role: user?.roleLabel || 'Administrator',
    phone: user?.role === 'student' ? '+1 (555) 876-5432' : '+1 (555) 234-5678',
    bio: user?.role === 'student'
      ? 'Undergraduate student and avid developer learning React 19 and UI/UX engineering.'
      : 'Academic operations director and course curator at EduVantage LMS.'
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        role: user.roleLabel,
        phone: user.role === 'student' ? '+1 (555) 876-5432' : '+1 (555) 234-5678',
        bio: user.role === 'student'
          ? 'Undergraduate student and avid developer learning React 19 and UI/UX engineering.'
          : 'Academic operations director and course curator at EduVantage LMS.'
      });
    }
  }, [user]);

  useEffect(() => {
    setActiveTab(getTabFromHash());

    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [notifications, setNotifications] = useState({
    enrollment: true,
    submissions: true,
    forum: false,
    systemUpdates: true
  });

  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const [isLinkedinConnected, setIsLinkedinConnected] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [sessions, setSessions] = useState([
    { id: 1, device: 'Windows 11 PC', browser: 'Chrome Browser', location: 'Mumbai, India', ip: '103.45.21.9', current: true },
    { id: 2, device: 'iPhone 15 Pro Max', browser: 'EduVantage App', location: 'Delhi, India', ip: '223.189.54.12', current: false },
    { id: 3, device: 'Apple MacBook Air', browser: 'Safari Browser', location: 'San Francisco, USA', ip: '8.8.8.8', current: false }
  ]);

  const handleRevokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleRevokeAllSessions = () => {
    setSessions(prev => prev.filter(s => s.current));
  };

  const handleDeleteAccountFinal = () => {
    alert('Account deactivation requested. Your request is being reviewed by system administrators.');
    setShowDeleteConfirm(false);
    setDeleteText('');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNotifToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="page-title-row">
        <div>
          <h2 className="page-heading">Platform Settings</h2>
          <p className="page-subheading">Manage personal settings and overall LMS workspace defaults.</p>
        </div>
      </div>

      {/* Main Settings Panel */}
      <div className="settings-panel-container glassmorphism">
        {/* Navigation Sidebar inside Panel */}
        <aside className="settings-tabs-sidebar">
          <button 
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FiUser size={16} />
            <span>Profile Settings</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FiBell size={16} />
            <span>Notifications</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <FiLock size={16} />
            <span>Security & Pass</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <FiSliders size={16} />
            <span>LMS Preferences</span>
          </button>
        </aside>

        {/* Content Body of Panel */}
        <main className="settings-content-body">
          <form onSubmit={handleSave}>
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="settings-tab-pane">
                <div className="settings-header-group">
                  <h3 className="tab-pane-title">Profile Settings</h3>
                  <p className="tab-pane-sub">Update your personal identification and details.</p>
                </div>
                
                <div className="profile-upload-section">
                  <div className="profile-avatar-large">{user?.initials || 'AM'}</div>
                  <div className="profile-upload-controls">
                    <button type="button" className="upload-btn">Upload Photo</button>
                    <button type="button" className="remove-btn">Remove</button>
                    <span className="upload-tip">JPG, PNG up to 2MB.</span>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={profile.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                      type="text" 
                      id="phone" 
                      name="phone" 
                      value={profile.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Account Role</label>
                    <input 
                      type="text" 
                      id="role" 
                      name="role" 
                      value={profile.role} 
                      disabled 
                      className="disabled-input"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="bio">Bio description</label>
                    <textarea 
                      id="bio" 
                      name="bio" 
                      rows="3" 
                      value={profile.bio}
                      onChange={handleProfileChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="settings-tab-pane">
                <div className="settings-header-group">
                  <h3 className="tab-pane-title">Notification Settings</h3>
                  <p className="tab-pane-sub">Control which system triggers alert you by email.</p>
                </div>
                
                <div className="toggles-list">
                  <div className="toggle-item">
                    <div className="toggle-text">
                      <span className="toggle-title">Student Enrollment Alerts</span>
                      <p className="toggle-desc">Receive email digests when new students register for courses.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.enrollment} 
                        onChange={() => handleNotifToggle('enrollment')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-text">
                      <span className="toggle-title">Assignment Submissions</span>
                      <p className="toggle-desc">Notify when assignments require review and grades.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.submissions} 
                        onChange={() => handleNotifToggle('submissions')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-text">
                      <span className="toggle-title">Forum Comments</span>
                      <p className="toggle-desc">Receive alerts when students ask questions inside forums.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.forum} 
                        onChange={() => handleNotifToggle('forum')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-text">
                      <span className="toggle-title">System Updates</span>
                      <p className="toggle-desc">Receive monthly notes on platform core features and bug fixes.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notifications.systemUpdates} 
                        onChange={() => handleNotifToggle('systemUpdates')}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="settings-tab-pane">
                <div className="settings-header-group">
                  <h3 className="tab-pane-title">Security & Password</h3>
                  <p className="tab-pane-sub">Change your sign-in details and protect your account.</p>
                </div>
                
                {/* 1. Change Password Section */}
                <div className="settings-section-card">
                  <div className="settings-card-header-group">
                    <h4 className="section-card-title">Change Password</h4>
                    <p className="section-card-desc">Update your sign-in password regularly to keep your account safe.</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label htmlFor="curr-pass">Current Password</label>
                      <input type="password" id="curr-pass" placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="new-pass">New Password</label>
                      <input type="password" id="new-pass" placeholder="••••••••" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirm-pass">Confirm Password</label>
                      <input type="password" id="confirm-pass" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                {/* 2. Two-Factor Authentication (2FA) */}
                <div className="settings-section-card">
                  <div className="section-title-row">
                    <div className="settings-card-header-group">
                      <h4 className="section-card-title">Two-Factor Authentication (2FA)</h4>
                      <p className="section-card-desc">Add an extra layer of security to your account by requiring an authenticator code at login.</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={is2faEnabled} 
                        onChange={() => setIs2faEnabled(!is2faEnabled)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="security-status-row">
                    <span className="status-label">Status:</span>
                    <span className={`status-badge ${is2faEnabled ? 'active' : 'inactive'}`}>
                      {is2faEnabled ? 'Enabled (Authenticator App)' : 'Disabled'}
                    </span>
                  </div>

                  {is2faEnabled && (
                    <div className="two-factor-setup-info">
                      <div className="setup-qr-mock">
                        <div className="qr-code-placeholder">
                          <div className="qr-square qr-tl"></div>
                          <div className="qr-square qr-tr"></div>
                          <div className="qr-square qr-bl"></div>
                          <div className="qr-center-blob"></div>
                        </div>
                      </div>
                      <div className="setup-instructions">
                        <h5>Set up Authenticator App</h5>
                        <p>1. Scan the QR code with your mobile authenticator app (Google Authenticator, Duo, or Microsoft Authenticator).</p>
                        <p>2. Enter the 6-digit code generated by the app to verify setup.</p>
                        <div className="verify-code-row">
                          <input type="text" placeholder="000 000" maxLength="6" className="verification-code-input" />
                          <button type="button" className="verify-btn">Verify Code</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Connected Accounts */}
                <div className="settings-section-card">
                  <div className="settings-card-header-group">
                    <h4 className="section-card-title">Connected Accounts</h4>
                    <p className="section-card-desc">Manage third-party social logins linked to your account.</p>
                  </div>
                  
                  <div className="social-links-list">
                    <div className="social-link-row">
                      <div className="social-link-left">
                        <div className="social-icon-wrapper color-google">
                          <FaGoogle size={18} />
                        </div>
                        <div className="social-link-details">
                          <span className="social-name">Google Account</span>
                          <span className="social-status connected">Connected ({user?.email || 'alex.morgan@eduvantage.com'})</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className={`social-disconnect-btn ${isGoogleConnected ? '' : 'connect'}`}
                        onClick={() => setIsGoogleConnected(!isGoogleConnected)}
                      >
                        {isGoogleConnected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>

                    <div className="social-link-row">
                      <div className="social-link-left">
                        <div className="social-icon-wrapper color-linkedin">
                          <FaLinkedinIn size={18} />
                        </div>
                        <div className="social-link-details">
                          <span className="social-name">LinkedIn Profile</span>
                          <span className="social-status">Not connected</span>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className={`social-disconnect-btn ${isLinkedinConnected ? '' : 'connect'}`}
                        onClick={() => setIsLinkedinConnected(!isLinkedinConnected)}
                      >
                        {isLinkedinConnected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Active Sessions / Device Logs */}
                <div className="settings-section-card">
                  <div className="section-header-with-action">
                    <div className="settings-card-header-group">
                      <h4 className="section-card-title">Active Devices & Browser Sessions</h4>
                      <p className="section-card-desc">Track and manage active sessions currently logged in to your account.</p>
                    </div>
                    {sessions.length > 1 && (
                      <button 
                        type="button" 
                        className="revoke-all-sessions-btn"
                        onClick={handleRevokeAllSessions}
                      >
                        Log out of All Other Devices
                      </button>
                    )}
                  </div>

                  <div className="sessions-list">
                    {sessions.map((session) => (
                      <div key={session.id} className="session-item-row">
                        <div className="session-item-left">
                          <div className="device-icon-wrapper">
                            {session.device.includes('iPhone') || session.device.includes('Android') ? (
                              <FiSmartphone size={18} />
                            ) : (
                              <FiMonitor size={18} />
                            )}
                          </div>
                          <div className="session-details">
                            <span className="device-name">
                              {session.device} • {session.browser}
                              {session.current && <span className="current-session-badge">Current Session</span>}
                            </span>
                            <span className="session-location">
                              <FiGlobe size={12} className="inline-icon" />
                              {session.location} • IP: {session.ip}
                            </span>
                          </div>
                        </div>
                        {!session.current && (
                          <button 
                            type="button" 
                            className="revoke-session-single-btn"
                            onClick={() => handleRevokeSession(session.id)}
                            title="Terminate session"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Danger Zone */}
                <div className="settings-section-card danger-zone-card">
                  <div className="settings-card-header-group">
                    <h4 className="section-card-title danger-title">Danger Zone</h4>
                    <p className="section-card-desc danger-desc">Permanently deactivate or delete your LMS account.</p>
                  </div>
                  
                  <div className="danger-zone-content">
                    <div className="danger-zone-message">
                      <FiAlertTriangle className="danger-icon" size={24} />
                      <div className="danger-text">
                        <h5>Delete Account Permanently</h5>
                        <p>Once deleted, all course progress, roster details, grades, and files will be wiped out from the system databases. This cannot be undone.</p>
                      </div>
                    </div>
                    
                    {showDeleteConfirm ? (
                      <div className="delete-confirm-box">
                        <p>Are you absolutely sure? Type "DELETE" to confirm.</p>
                        <div className="delete-confirm-input-row">
                          <input 
                            type="text" 
                            placeholder="Type DELETE" 
                            className="delete-txt-input" 
                            value={deleteText}
                            onChange={(e) => setDeleteText(e.target.value)}
                          />
                          <button 
                            type="button" 
                            className="confirm-delete-action-btn"
                            disabled={deleteText !== 'DELETE'}
                            onClick={handleDeleteAccountFinal}
                          >
                            Confirm Deactivation
                          </button>
                          <button 
                            type="button" 
                            className="cancel-delete-btn"
                            onClick={() => {
                              setShowDeleteConfirm(false);
                              setDeleteText('');
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="delete-account-trigger-btn"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete Account...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SYSTEM PREFERENCES TAB */}
            {activeTab === 'system' && (
              <div className="settings-tab-pane">
                <div className="settings-header-group">
                  <h3 className="tab-pane-title">LMS Workspace Preferences</h3>
                  <p className="tab-pane-sub">Global defaults for your platform operations.</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Default Platform Language</label>
                    <select defaultValue="en">
                      <option value="en">English (US)</option>
                      <option value="es">Spanish (ES)</option>
                      <option value="fr">French (FR)</option>
                      <option value="de">German (DE)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Default Course Passing Mark</label>
                    <select defaultValue="75">
                      <option value="50">50% minimum</option>
                      <option value="60">60% minimum</option>
                      <option value="75">75% minimum (Recommended)</option>
                      <option value="85">85% minimum</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Action Bar */}
            <div className="settings-footer-actions">
              {saveSuccess && <span className="save-success-msg">Settings saved successfully!</span>}
              <button type="submit" className="save-settings-btn">
                <FiSave size={16} />
                <span>Save Changes</span>
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
}
