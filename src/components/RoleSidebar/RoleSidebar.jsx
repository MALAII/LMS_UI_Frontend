import React from 'react';
import { FiUser, FiSearch, FiBell, FiMenu } from 'react-icons/fi';
import './RoleSidebar.css';

export default function RoleSidebar({ activePersona, onPersonaChange, user, onLoginClick, toggleSidebar }) {
  const handleNotificationClick = () => {
    if (!user && onLoginClick) {
      onLoginClick();
    }
  };

  return (
    <aside className="role-sidebar-container">
      {/* Top Branding Logo / Toggle Button */}
      <div className="role-sidebar-logo-container">
        <button 
          className="role-sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle main sidebar"
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Middle Persona / Role selectors */}
      <div className="role-sidebar-nav">
        <button
          type="button"
          className={`role-tab-btn ${activePersona === 'talent' ? 'active' : ''}`}
          onClick={() => onPersonaChange('talent')}
          title="Switch to Talent / Candidate View"
        >
          <div className="role-icon-circle">
            <FiUser size={20} />
          </div>
          <span className="role-label">Talent</span>
        </button>

        <button
          type="button"
          className={`role-tab-btn ${activePersona === 'recruiter' ? 'active' : ''}`}
          onClick={() => onPersonaChange('recruiter')}
          title="Switch to Recruiter / Employer View"
        >
          <div className="role-icon-circle">
            <FiSearch size={20} />
          </div>
          <span className="role-label">Recruiter</span>
        </button>
      </div>

      {/* Bottom Profile / Notification controls */}
      <div className="role-sidebar-footer">
        <button
          type="button"
          className="role-footer-btn notification-bell-btn"
          onClick={handleNotificationClick}
          aria-label="Notifications"
        >
          <FiBell size={20} />
          {user && <span className="notification-red-dot"></span>}
        </button>

        <div className="role-profile-avatar-container">
          {user ? (
            <div className="role-avatar-initials" title={`${user.name} (${user.roleLabel})`}>
              {user.initials}
            </div>
          ) : (
            <button
              type="button"
              className="role-guest-login-avatar"
              onClick={onLoginClick}
              title="Click to Sign In"
            >
              <FiUser size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
