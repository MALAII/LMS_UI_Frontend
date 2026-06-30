import React, { useState, useEffect, useRef } from 'react';
import { 
  FiMenu, FiSearch, FiBell, FiMessageSquare, FiChevronDown, FiUser, 
  FiSettings, FiLogOut, FiCode, FiLayers, FiDatabase, FiCpu, FiAward,
  FiBriefcase
} from 'react-icons/fi';
import './Header.css';

export default function Header({ toggleSidebar, isSidebarExpanded, logout, user, onLoginClick }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const msgRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (msgRef.current && !msgRef.current.contains(event.target)) {
        setShowMessages(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSuggestionClick = (text) => {
    setSearchValue(text);
    setShowSearchDropdown(false);
  };

  return (
    <header className="header-container">
      <div className="header-left">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <span className="logo-text">RedBack<span className="logo-accent"></span></span>
        </div>
      </div>

      {/* Center Section with Focused Dropdown Suggestions */}
      <div className="header-center" ref={searchRef}>
        <div className="search-bar">
          <FiSearch className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search Courses, Students, Instructors..." 
            aria-label="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setShowSearchDropdown(true)}
          />
          
          {/* Search Dropdown Suggestion Listings */}
          {showSearchDropdown && (
            <div className="search-dropdown glassmorphism">
              <div className="search-dropdown-header">Popular Learning Paths</div>
              <ul className="search-dropdown-list">
                <li 
                  className="search-dropdown-item"
                  onClick={() => handleSearchSuggestionClick('Development & Programming')}
                >
                  <div className="suggestion-icon-circle color-blue">
                    <FiCode size={14} />
                  </div>
                  <span className="suggestion-text">Development & Programming</span>
                </li>
                <li 
                  className="search-dropdown-item"
                  onClick={() => handleSearchSuggestionClick('UI/UX & Design Systems')}
                >
                  <div className="suggestion-icon-circle color-purple">
                    <FiLayers size={14} />
                  </div>
                  <span className="suggestion-text">UI/UX & Design Systems</span>
                </li>
                <li 
                  className="search-dropdown-item"
                  onClick={() => handleSearchSuggestionClick('Data Science & Algorithms')}
                >
                  <div className="suggestion-icon-circle color-green">
                    <FiDatabase size={14} />
                  </div>
                  <span className="suggestion-text">Data Science & Algorithms</span>
                </li>
                <li 
                  className="search-dropdown-item"
                  onClick={() => handleSearchSuggestionClick('Cloud Infrastructure & DevOps')}
                >
                  <div className="suggestion-icon-circle color-orange">
                    <FiCpu size={14} />
                  </div>
                  <span className="suggestion-text">Cloud Infrastructure & DevOps</span>
                </li>
                <li 
                  className="search-dropdown-item"
                  onClick={() => handleSearchSuggestionClick('Product Management')}
                >
                  <div className="suggestion-icon-circle color-yellow">
                    <FiAward size={14} />
                  </div>
                  <span className="suggestion-text">Product Management & Agile</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="header-right">
        {!user ? (
          <button 
            type="button" 
            className="header-login-btn" 
            onClick={onLoginClick}
          >
            Login
          </button>
        ) : (
          <>
            {/* Messages Dropdown Toggle */}
            <div className="icon-wrapper" ref={msgRef}>
              <button 
                className={`action-btn ${showMessages ? 'active' : ''}`}
                onClick={() => setShowMessages(!showMessages)}
                aria-label="Messages"
              >
                <FiMessageSquare size={20} />
                <span className="icon-badge bg-secondary">3</span>
              </button>
              
              {showMessages && (
                <div className="header-dropdown messages-dropdown glassmorphism">
                  <div className="dropdown-title">Recent Messages</div>
                  <div className="dropdown-list">
                    <div className="dropdown-item">
                      <div className="item-avatar avatar-1"></div>
                      <div className="item-content">
                        <p className="item-name">Sarah Jenkins</p>
                        <p className="item-text">Hello Professor, is the project deadline final?</p>
                        <span className="item-time">5 mins ago</span>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="item-avatar avatar-2"></div>
                      <div className="item-content">
                        <p className="item-name">Marcus Aurelio</p>
                        <p className="item-text">I have uploaded the new React 19 course notes.</p>
                        <span className="item-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="item-avatar avatar-3"></div>
                      <div className="item-content">
                        <p className="item-name">Emily Davis</p>
                        <p className="item-text">Thank you for the prompt review on Assignment 4!</p>
                        <span className="item-time">1 day ago</span>
                      </div>
                    </div>
                  </div>
                  <button className="view-all-btn">View All Messages</button>
                </div>
              )}
            </div>

            {/* Notifications Dropdown Toggle */}
            <div className="icon-wrapper" ref={notifRef}>
              <button 
                className={`action-btn ${showNotifications ? 'active' : ''}`}
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <FiBell size={20} />
                <span className="icon-badge bg-primary">4</span>
              </button>

              {showNotifications && (
                <div className="header-dropdown notifications-dropdown glassmorphism">
                  <div className="dropdown-title">Notifications</div>
                  <div className="dropdown-list">
                    <div className="dropdown-item unread">
                      <div className="notif-bullet"></div>
                      <div className="item-content">
                        <p className="item-text"><strong>John Doe</strong> enrolled in <strong>Vite Masterclass</strong></p>
                        <span className="item-time">Just now</span>
                      </div>
                    </div>
                    <div className="dropdown-item unread">
                      <div className="notif-bullet"></div>
                      <div className="item-content">
                        <p className="item-text">New assignment submitted by <strong>Clara Smith</strong></p>
                        <span className="item-time">32 mins ago</span>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="item-content">
                        <p className="item-text">Course <strong>Intro to Next.js</strong> has been published</p>
                        <span className="item-time">4 hours ago</span>
                      </div>
                    </div>
                    <div className="dropdown-item">
                      <div className="item-content">
                        <p className="item-text">Certificate generated for <strong>Alex Carter</strong></p>
                        <span className="item-time">1 day ago</span>
                      </div>
                    </div>
                  </div>
                  <button className="view-all-btn">Mark all as read</button>
                </div>
              )}
            </div>

            {/* Profile Dropdown Toggle */}
            <div className="profile-wrapper" ref={dropdownRef}>
              <button 
                className="profile-trigger" 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                aria-label="User Profile Dropdown"
              >
                <div className="user-avatar">
                  <span className="avatar-initials">{user.initials}</span>
                </div>
                <div className="user-info-text">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.roleLabel}</span>
                </div>
                <FiChevronDown className={`chevron-icon ${showProfileDropdown ? 'rotate' : ''}`} size={16} />
              </button>

              {showProfileDropdown && (
                <div className="header-dropdown profile-dropdown glassmorphism">
                  <div className="dropdown-profile-header">
                    <p className="profile-name">{user.name}</p>
                    <p className="profile-email">{user.email}</p>
                  </div>
                  <ul className="dropdown-menu-list">
                    <li>
                      <a href="/settings#profile" className="menu-link">
                        <FiUser size={16} />
                        <span>My Profile</span>
                      </a>
                    </li>
                    <li>
                      <a href="/settings#security" className="menu-link">
                        <FiSettings size={16} />
                        <span>Account Settings</span>
                      </a>
                    </li>
                    <li className="menu-divider"></li>
                    <li>
                      <button className="menu-link logout-btn-link" onClick={logout}>
                        <FiLogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
