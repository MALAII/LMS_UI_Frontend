import React from 'react';
import * as Icons from 'react-icons/fi';
import './StatsCard.css';

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendType, 
  trendLabel 
}) {
  const IconComponent = Icons[icon] || Icons.FiTrendingUp;
  const isUp = trendType === 'up';

  return (
    <div className="stats-card glassmorphism lift-effect">
      <div className="stats-card-header">
        <span className="stats-card-title">{title}</span>
        <div className={`stats-card-icon-container icon-${icon.toLowerCase()}`}>
          <IconComponent size={20} />
        </div>
      </div>
      <div className="stats-card-body">
        <h3 className="stats-card-value">{value}</h3>
      </div>
      <div className="stats-card-footer">
        <span className={`stats-card-trend ${isUp ? 'trend-up' : 'trend-down'}`}>
          {isUp ? '↑' : '↓'} {isUp ? '+' : ''}{trend}%
        </span>
        <span className="stats-card-trend-label">{trendLabel}</span>
      </div>
    </div>
  );
}
