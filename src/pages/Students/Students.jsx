import React, { useState } from 'react';
import { FiSearch, FiUserPlus, FiFilter, FiMoreVertical, FiDownload } from 'react-icons/fi';
import './Students.css';

export default function Students() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const studentStats = [
    { label: 'Total Enrolled', value: '12,842' },
    { label: 'Avg. Attendance', value: '94.6%' },
    { label: 'Certificates Granted', value: '3,482' }
  ];

  const studentsList = [
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@gmail.com', course: 'React 19 & Vite Masterclass', progress: 68, attendance: '96%', status: 'enrolled', avatarColor: 'linear-gradient(135deg, #FF8080 0%, #FF2E2E 100%)' },
    { id: 2, name: 'Marcus Aurelius', email: 'marcus.aurelius@gmail.com', course: 'Data Structures & Algorithms', progress: 91, attendance: '98%', status: 'enrolled', avatarColor: 'linear-gradient(135deg, #80C0FF 0%, #0070F3 100%)' },
    { id: 3, name: 'Emily Davis', email: 'emily.davis@yahoo.com', course: 'Advanced UI/UX Design System', progress: 100, attendance: '100%', status: 'graduated', avatarColor: 'linear-gradient(135deg, #80F3D1 0%, #00B981 100%)' },
    { id: 4, name: 'Alex Carter', email: 'alex.carter@outlook.com', course: 'LMS Platform Building', progress: 15, attendance: '82%', status: 'enrolled', avatarColor: 'linear-gradient(135deg, #FFD180 0%, #FF9900 100%)' },
    { id: 5, name: 'Clara Smith', email: 'clara.smith@hotmail.com', course: 'React 19 & Vite Masterclass', progress: 45, attendance: '92%', status: 'enrolled', avatarColor: 'linear-gradient(135deg, #D680FF 0%, #9900FF 100%)' },
    { id: 6, name: 'John Doe', email: 'john.doe@gmail.com', course: 'Introduction to Python', progress: 8, attendance: '45%', status: 'suspended', avatarColor: 'linear-gradient(135deg, #E2E8F0 0%, #64748B 100%)' }
  ];

  // Filtering Logic
  const filteredStudents = studentsList.filter(student => {
    const matchesFilter = activeFilter === 'all' || student.status === activeFilter;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="students-page">
      {/* Page Header */}
      <div className="page-title-row">
        <div>
          <h2 className="page-heading">Students Roster</h2>
          <p className="page-subheading">Track and manage student enrollments, progress, and performance.</p>
        </div>
        <div className="action-button-group">
          <button className="export-btn">
            <FiDownload size={18} />
            <span>Export Roster</span>
          </button>
          <button className="add-student-btn">
            <FiUserPlus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <section className="students-stats-bar">
        {studentStats.map((stat, idx) => (
          <div key={idx} className="students-stat-item glassmorphism">
            <span className="students-stat-label">{stat.label}</span>
            <h4 className="students-stat-value">{stat.value}</h4>
          </div>
        ))}
      </section>

      {/* Controls Bar */}
      <div className="roster-control-bar glassmorphism">
        <div className="roster-tabs">
          <button 
            className={`roster-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Students
          </button>
          <button 
            className={`roster-tab-btn ${activeFilter === 'enrolled' ? 'active' : ''}`}
            onClick={() => setActiveFilter('enrolled')}
          >
            Active Enrolled
          </button>
          <button 
            className={`roster-tab-btn ${activeFilter === 'graduated' ? 'active' : ''}`}
            onClick={() => setActiveFilter('graduated')}
          >
            Graduated
          </button>
          <button 
            className={`roster-tab-btn ${activeFilter === 'suspended' ? 'active' : ''}`}
            onClick={() => setActiveFilter('suspended')}
          >
            Suspended
          </button>
        </div>

        <div className="roster-controls-right">
          <div className="roster-search">
            <FiSearch size={16} className="search-input-icon" />
            <input 
              type="text" 
              placeholder="Search by student name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="roster-filter-btn">
            <FiFilter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Roster Table */}
      <div className="roster-table-wrapper glassmorphism">
        <div className="table-scroll-container">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrolled Course</th>
                <th>Course Progress</th>
                <th>Attendance</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const initials = student.name.split(' ').map(n => n[0]).join('');
                  return (
                    <tr key={student.id} className="roster-row">
                      {/* Name & Email Avatar */}
                      <td>
                        <div className="student-profile-cell">
                          <div className="student-avatar" style={{ background: student.avatarColor }}>
                            {initials}
                          </div>
                          <div className="student-info-text">
                            <span className="student-name">{student.name}</span>
                            <span className="student-email">{student.email}</span>
                          </div>
                        </div>
                      </td>
                      {/* Course */}
                      <td>
                        <span className="roster-course-text">{student.course}</span>
                      </td>
                      {/* Progress */}
                      <td>
                        <div className="roster-progress-cell">
                          <div className="roster-progress-track">
                            <div 
                              className="roster-progress-fill" 
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="roster-progress-percent">{student.progress}%</span>
                        </div>
                      </td>
                      {/* Attendance */}
                      <td>
                        <span className="roster-attendance-text">{student.attendance}</span>
                      </td>
                      {/* Status */}
                      <td>
                        <span className={`badge ${
                          student.status === 'graduated' ? 'badge-success' :
                          student.status === 'enrolled' ? 'badge-primary' : 'badge-danger'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="text-center">
                        <button className="row-action-btn" aria-label="More options">
                          <FiMoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="table-empty-cell">
                    <p className="table-empty-text">No students match your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
