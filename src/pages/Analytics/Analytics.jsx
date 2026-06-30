import React, { useState } from 'react';
import { FiTrendingUp, FiActivity, FiDollarSign, FiClock, FiCalendar } from 'react-icons/fi';
import './Analytics.css';

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('monthly');

  const stats = [
    { label: 'Weekly Active Users', value: '8,421', icon: FiActivity, change: '+12.5%', isPositive: true },
    { label: 'Platform Revenue', value: '$45,820', icon: FiDollarSign, change: '+24.8%', isPositive: true },
    { label: 'Average Study Time', value: '14.2 hrs', icon: FiClock, change: '+8.3%', isPositive: true }
  ];

  // Mock engagement bars
  const engagementData = [
    { day: 'Mon', value: 42 },
    { day: 'Tue', value: 58 },
    { day: 'Wed', value: 72 },
    { day: 'Thu', value: 85 },
    { day: 'Fri', value: 64 },
    { day: 'Sat', value: 38 },
    { day: 'Sun', value: 48 }
  ];

  return (
    <div className="analytics-page">
      {/* Page Header */}
      <div className="page-title-row">
        <div>
          <h2 className="page-heading">Analytics Dashboard</h2>
          <p className="page-subheading">Monitor platform engagements, revenues, and course completions.</p>
        </div>
        
        {/* Timeframe selector */}
        <div className="timeframe-selector glassmorphism">
          <button 
            className={`timeframe-btn ${timeframe === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'yearly' ? 'active' : ''}`}
            onClick={() => setTimeframe('yearly')}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Mini metrics bar */}
      <section className="analytics-stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="analytics-stat-card glassmorphism lift-effect">
              <div className="stat-card-left">
                <span className="stat-card-label">{stat.label}</span>
                <h3 className="stat-card-value">{stat.value}</h3>
                <span className={`stat-card-trend-badge ${stat.isPositive ? 'positive' : 'negative'}`}>
                  {stat.change} from last period
                </span>
              </div>
              <div className="stat-card-right">
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Chart Layout Split */}
      <div className="charts-container-split">
        {/* SVG Area Chart: Revenue Trend */}
        <div className="chart-card glassmorphism">
          <div className="chart-header">
            <h4 className="chart-title">Revenue Performance Growth</h4>
            <span className="chart-indicator text-success">
              <FiTrendingUp size={14} style={{ marginRight: '4px' }} />
              +24% vs last month
            </span>
          </div>
          <div className="chart-body svg-chart-container">
            {/* SVG Path Curve Area Chart */}
            <svg viewBox="0 0 500 200" className="svg-area-chart" width="100%" height="220px">
              <defs>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.00"/>
                </linearGradient>
              </defs>
              {/* Background Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="0" y1="180" x2="500" y2="180" stroke="#E2E8F0" strokeWidth="2" />
              
              {/* Area Path */}
              <path 
                d="M 0,160 Q 100,120 180,80 T 320,110 T 420,50 L 500,70 L 500,180 L 0,180 Z" 
                fill="url(#chart-glow)" 
              />
              
              {/* Stroke Curve Path */}
              <path 
                d="M 0,160 Q 100,120 180,80 T 320,110 T 420,50 L 500,70" 
                fill="none" 
                stroke="#2563EB" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />

              {/* Data points */}
              <circle cx="180" cy="80" r="5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
              <circle cx="320" cy="110" r="5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
              <circle cx="420" cy="50" r="5" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3" />
            </svg>
            <div className="chart-x-labels">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* SVG Bar Chart: Weekly Student Engagement */}
        <div className="chart-card glassmorphism">
          <div className="chart-header">
            <h4 className="chart-title">Weekly Student Engagement</h4>
            <span className="chart-timeframe">Average Daily Hours</span>
          </div>
          <div className="chart-body svg-chart-container">
            <div className="bar-chart-visualization">
              {engagementData.map((data, idx) => {
                const heightPercent = data.value; // Maximum height is 100
                return (
                  <div key={idx} className="bar-column">
                    <div className="bar-track">
                      <div 
                        className="bar-fill" 
                        style={{ height: `${heightPercent}%` }}
                        title={`${data.value} hours`}
                      >
                        <span className="bar-tooltip-val">{data.value}%</span>
                      </div>
                    </div>
                    <span className="bar-label-text">{data.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Performance rankings */}
      <section className="courses-performance-rankings glassmorphism">
        <h4 className="rankings-title">Popular Subject Category Engagement</h4>
        <div className="ranking-progress-list">
          <div className="ranking-item">
            <div className="ranking-header">
              <span className="ranking-name">Fullstack Web Development</span>
              <span className="ranking-percentage">68% popularity</span>
            </div>
            <div className="ranking-track"><div className="ranking-fill" style={{ width: '68%', backgroundColor: '#2563EB' }}></div></div>
          </div>
          <div className="ranking-item">
            <div className="ranking-header">
              <span className="ranking-name">UI/UX Systems Design</span>
              <span className="ranking-percentage">54% popularity</span>
            </div>
            <div className="ranking-track"><div className="ranking-fill" style={{ width: '54%', backgroundColor: '#4F46E5' }}></div></div>
          </div>
          <div className="ranking-item">
            <div className="ranking-header">
              <span className="ranking-name">Algorithms & Problem Solving</span>
              <span className="ranking-percentage">48% popularity</span>
            </div>
            <div className="ranking-track"><div className="ranking-fill" style={{ width: '48%', backgroundColor: '#10B981' }}></div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
