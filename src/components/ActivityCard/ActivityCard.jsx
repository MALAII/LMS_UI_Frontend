import React from 'react';
import { FiUserPlus, FiFileText, FiAward, FiBookOpen, FiClock } from 'react-icons/fi';
import './ActivityCard.css';

export default function ActivityCard({ 
  type, 
  text, 
  time, 
  user, 
  meta 
}) {
  const getIcon = () => {
    switch (type) {
      case 'enrollment':
        return <FiUserPlus size={16} />;
      case 'assignment':
        return <FiFileText size={16} />;
      case 'certificate':
        return <FiAward size={16} />;
      case 'course':
        return <FiBookOpen size={16} />;
      default:
        return <FiUserPlus size={16} />;
    }
  };

  return (
    <div className="activity-card-item">
      {/* Indicator Circle */}
      <div className={`activity-card-icon-wrapper type-${type}`}>
        {getIcon()}
      </div>
      
      {/* Activity text and details */}
      <div className="activity-card-content">
        <div className="activity-card-main">
          <p className="activity-card-text">
            {text}
          </p>
          {meta && <span className="activity-card-meta badge badge-success">{meta}</span>}
        </div>
        
        {/* Timestamp */}
        <div className="activity-card-footer">
          <FiClock size={12} className="clock-icon" />
          <span className="activity-card-time">{time}</span>
        </div>
      </div>
    </div>
  );
}
