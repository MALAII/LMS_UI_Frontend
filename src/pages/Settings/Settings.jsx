import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { 
  FiSave, FiUser, FiBell, FiLock, FiSliders, FiGlobe, FiSmartphone, FiMonitor, FiAlertTriangle, 
  FiEdit2, FiCheckCircle, FiInfo, FiAlertCircle, FiBriefcase, FiBookOpen, FiX, FiGithub, FiLinkedin,
  FiFileText, FiCpu, FiFolder, FiAward
} from 'react-icons/fi';
import { FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { 
  logoutAllService, changePasswordService, sendVerificationEmailService, updateProfileService,
  deleteAccountService, enable2faService, confirm2faService, disable2faService 
} from '../../services/auth';
import './Settings.css';

export default function Settings({ user, logout, onUpdateUser }) {
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['profile', 'notifications', 'security', 'system'];
    return validTabs.includes(hash) ? hash : 'profile';
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dbProfileFields, setDbProfileFields] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const toStringNewline = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) return val.join('\n');
    return val;
  };

  const toStringComma = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) return val.join(', ');
    return val;
  };

  const renderLineList = (text, placeholder) => {
    if (!text) {
      return (
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
          {placeholder}
        </p>
      );
    }
    const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {lines.map((line, idx) => (
          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#334155', lineHeight: '1.4' }}>
            <span style={{ color: 'var(--primary)', marginTop: '0.2rem', display: 'flex', alignItems: 'center' }}>•</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  const parseSocialLinks = (val) => {
    const links = { portfolio: '', github: '', linkedin: '', website: '' };
    if (!val) return links;
    const str = Array.isArray(val) ? val.join('\n') : val;
    const lines = str.split('\n');
    lines.forEach(line => {
      const clean = line.trim();
      if (!clean) return;
      if (clean.toLowerCase().includes('github.com') || clean.toLowerCase().startsWith('github:')) {
        links.github = clean.replace(/^github:\s*/i, '').trim();
      } else if (clean.toLowerCase().includes('linkedin.com') || clean.toLowerCase().startsWith('linkedin:')) {
        links.linkedin = clean.replace(/^linkedin:\s*/i, '').trim();
      } else if (clean.toLowerCase().startsWith('portfolio:')) {
        links.portfolio = clean.replace(/^portfolio:\s*/i, '').trim();
      } else if (clean.toLowerCase().startsWith('website:') || clean.toLowerCase().includes('http')) {
        if (!links.portfolio && clean.toLowerCase().includes('portfolio')) {
          links.portfolio = clean.replace(/^portfolio:\s*/i, '').trim();
        } else if (!links.website) {
          links.website = clean.replace(/^website:\s*/i, '').trim();
        }
      }
    });
    return links;
  };

  const parsedSocials = parseSocialLinks(user?.social_links);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.roleLabel || '',
    phone: user?.phone || '',
    profession: user?.profession || '',
    institution: user?.institution || '',
    about: user?.about || '',
    avatar: user?.avatar || null,
    skills: toStringComma(user?.skills),
    education: toStringNewline(user?.education),
    work_experience: toStringNewline(user?.work_experience),
    resume_path: user?.resume_path || null,
    responsibilities: toStringNewline(user?.responsibilities),
    certificates: toStringNewline(user?.certificates),
    projects: toStringNewline(user?.projects),
    achievements: toStringNewline(user?.achievements),
    social_links: toStringNewline(user?.social_links),
    portfolio_url: parsedSocials.portfolio,
    github_url: parsedSocials.github,
    linkedin_url: parsedSocials.linkedin,
    website_url: parsedSocials.website,
    
    // Recruiter & Company fields
    designation: user?.designation || '',
    department: user?.department || '',
    phone_extension: user?.phone_extension || '',
    company_name: user?.company_name || '',
    company_logo: user?.company_logo || null,
    company_website: user?.company_website || '',
    company_industry: user?.company_industry || '',
    company_size: user?.company_size || '',
    company_description: user?.company_description || '',
    company_gst: user?.company_gst || '',
    company_head_office: user?.company_head_office || ''
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  const openIntroModal = () => {
    setTempProfile({ ...profile });
    setIsIntroModalOpen(true);
  };

  const openDetailsModal = () => {
    setTempProfile({ ...profile });
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
    if (user) {
      const parsedSocials = parseSocialLinks(user.social_links);
      const p = {
        name: user.name || '',
        email: user.email || '',
        role: user.roleLabel || '',
        phone: user.phone || '',
        profession: user.profession || '',
        institution: user.institution || '',
        about: user.about || '',
        avatar: user.avatar || null,
        skills: toStringComma(user.skills),
        education: toStringNewline(user.education),
        work_experience: toStringNewline(user.work_experience),
        resume_path: user.resume_path || null,
        responsibilities: toStringNewline(user.responsibilities),
        certificates: toStringNewline(user.certificates),
        projects: toStringNewline(user.projects),
        achievements: toStringNewline(user.achievements),
        social_links: toStringNewline(user.social_links),
        portfolio_url: parsedSocials.portfolio,
        github_url: parsedSocials.github,
        linkedin_url: parsedSocials.linkedin,
        website_url: parsedSocials.website,
        
        // Recruiter & Company fields
        designation: user.designation || '',
        department: user.department || '',
        phone_extension: user.phone_extension || '',
        company_name: user.company_name || '',
        company_logo: user.company_logo || null,
        company_website: user.company_website || '',
        company_industry: user.company_industry || '',
        company_size: user.company_size || '',
        company_description: user.company_description || '',
        company_gst: user.company_gst || '',
        company_head_office: user.company_head_office || ''
      };
      setProfile(p);
      setTempProfile(p);
      setIs2faEnabled(!!user.two_factor_confirmed_at);
    }
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Image size must be less than 2MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;
        try {
          const updatedProfile = {
            ...profile,
            avatar: base64,
            avatar_file: file
          };
          await updateProfileService(updatedProfile);
          setProfile(updatedProfile);
          setTempProfile(updatedProfile);
          showToast("Profile photo updated successfully!", "success");
          if (onUpdateUser) {
             onUpdateUser({
               ...user,
               avatar: base64
             });
          }
        } catch (err) {
          showToast(err.response?.data?.message || err.message || "Failed to update profile photo.", "error");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setActiveTab(getTabFromHash());

    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Scroll window back to top when switching settings tabs
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const [notifications, setNotifications] = useState({
    enrollment: true,
    submissions: true,
    forum: false,
    systemUpdates: true
  });

  const [is2faEnabled, setIs2faEnabled] = useState(!!user?.two_factor_confirmed_at);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [twoFactorMessage, setTwoFactorMessage] = useState('');

  const handleEnable2fa = async () => {
    setTwoFactorError('');
    setTwoFactorMessage('');
    try {
      const res = await enable2faService();
      const rawUrl = res.qr_code_url || res.data?.qr_code_url || '';
      const secretKey = res.secret || res.data?.secret || '';
      
      // Frontend client-side QR generation and Google Charts fallbacks are commented out for backend clarification.
      /*
      const cleanQrUrl = (url, secretVal) => {
        if (!url) {
          if (secretVal) {
            const otpAuthUri = `otpauth://totp/Redback%20Academy:${encodeURIComponent(user?.email || '')}?secret=${secretVal}&issuer=Redback%20Academy`;
            return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUri)}`;
          }
          return '';
        }
        
        const trimmed = url.trim();
        
        // If the backend returns raw SVG tags, convert to base64 Data URI
        if (trimmed.startsWith('<svg')) {
          try {
            const base64Svg = btoa(unescape(encodeURIComponent(trimmed)));
            return `data:image/svg+xml;base64,${base64Svg}`;
          } catch (e) {
            console.error("Failed to convert SVG to data URI", e);
            return '';
          }
        }
        
        // If Google Charts API is used, generate fallback QR code url since Google shut down the Charts API
        if (trimmed.includes('googleapis.com') || trimmed.includes('chart.apis.google.com')) {
          if (secretVal) {
            const otpAuthUri = `otpauth://totp/Redback%20Academy:${encodeURIComponent(user?.email || '')}?secret=${secretVal}&issuer=Redback%20Academy`;
            return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpAuthUri)}`;
          }
        }
        
        // If the backend returns a URL pointing to localhost/127.0.0.1, rewrite to backend IP
        try {
          const apiBase = axios.defaults.baseURL || '';
          if (apiBase && (trimmed.includes('localhost') || trimmed.includes('127.0.0.1'))) {
            const apiUrlObj = new URL(apiBase);
            const urlObj = new URL(trimmed);
            return `${apiUrlObj.origin}${urlObj.pathname}${urlObj.search}`;
          }
        } catch (e) {
          console.error("Failed to clean QR URL", e);
        }
        return trimmed;
      };
      */

      setSecret(secretKey);
      setQrCodeUrl(rawUrl);
    } catch (err) {
      setTwoFactorError(err.response?.data?.message || err.message || 'Unable to initialize 2FA setup.');
    }
  };

  const handleConfirm2fa = async () => {
    setTwoFactorError('');
    setTwoFactorMessage('');
    try {
      await confirm2faService(twoFactorCode);
      setTwoFactorMessage('Two-factor authentication enabled successfully.');
      setIs2faEnabled(true);
      setQrCodeUrl('');
      setSecret('');
      setTwoFactorCode('');
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          two_factor_confirmed_at: new Date().toISOString()
        });
      }
    } catch (err) {
      setTwoFactorError(err.response?.data?.message || err.message || 'Invalid confirmation code.');
    }
  };

  const handleDisable2fa = async () => {
    setTwoFactorError('');
    setTwoFactorMessage('');
    try {
      await disable2faService(twoFactorCode);
      setTwoFactorMessage('Two-factor authentication disabled.');
      setIs2faEnabled(false);
      setTwoFactorCode('');
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          two_factor_confirmed_at: null
        });
      }
    } catch (err) {
      setTwoFactorError(err.response?.data?.message || err.message || 'Invalid code.');
    }
  };

  const [isGoogleConnected, setIsGoogleConnected] = useState(true);
  const [deleteText, setDeleteText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutAllConfirm, setShowLogoutAllConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResendVerification = async () => {
    setResendingEmail(true);
    setResendSuccess(false);
    setResendError('');
    try {
      await sendVerificationEmailService();
      setResendSuccess(true);
    } catch (err) {
      setResendError(err.response?.data?.message || err.message || 'Failed to send verification notification.');
    } finally {
      setResendingEmail(false);
    }
  };

  const [sessions, setSessions] = useState([
    { id: 1, device: 'Windows 11 PC', browser: 'Chrome Browser', location: 'Mumbai, India', ip: '103.45.21.9', current: true }
  ]);

  const handleRevokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleRevokeAllSessions = async () => {
    setShowLogoutAllConfirm(false);
    try {
      await logoutAllService();
      if (logout) {
        logout(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to log out from all devices.");
    }
  };

  const handleDeleteAccountFinal = async () => {
    try {
      await deleteAccountService();
      showToast("Account deactivated successfully. Logging out...", "success");
      setTimeout(() => {
        if (logout) {
          logout(true); // Logs out locally
        }
      }, 1500);
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Failed to deactivate account.", "error");
    }
    setShowDeleteConfirm(false);
    setDeleteText('');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleTempProfileChange = (e) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleNotifToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveIntro = async (e) => {
    e.preventDefault();
    try {
      await updateProfileService(tempProfile);
      setProfile(tempProfile);
      setIsIntroModalOpen(false);
      showToast("Intro details updated successfully!", "success");
      
      const nameParts = tempProfile.name.trim().split(/\s+/);
      const initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'U';
      
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          name: tempProfile.name,
          email: tempProfile.email,
          phone: tempProfile.phone,
          profession: tempProfile.profession,
          institution: tempProfile.institution,
          about: tempProfile.about,
          avatar: tempProfile.avatar,
          initials: initials,
          designation: tempProfile.designation,
          department: tempProfile.department,
          phone_extension: tempProfile.phone_extension
        });
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Failed to update profile intro details.", "error");
    }
  };

  const handleSaveSummary = async (e) => {
    e.preventDefault();
    try {
      await updateProfileService(tempProfile);
      setProfile(tempProfile);
      setIsSummaryModalOpen(false);
      showToast("Professional summary updated successfully!", "success");
      
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          about: tempProfile.about
        });
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Failed to update professional summary.", "error");
    }
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    
    // Compile separate link fields back into social_links string
    const compiledSocials = [];
    if (tempProfile.portfolio_url) compiledSocials.push(`Portfolio: ${tempProfile.portfolio_url}`);
    if (tempProfile.github_url) compiledSocials.push(`Github: ${tempProfile.github_url}`);
    if (tempProfile.linkedin_url) compiledSocials.push(`LinkedIn: ${tempProfile.linkedin_url}`);
    if (tempProfile.website_url) compiledSocials.push(`Website: ${tempProfile.website_url}`);
    const socialLinksString = compiledSocials.join('\n');

    const profileToSave = {
      ...tempProfile,
      social_links: socialLinksString
    };

    try {
      await updateProfileService(profileToSave);
      setProfile(profileToSave);
      setIsDetailsModalOpen(false);
      showToast("Profile details updated successfully!", "success");
      
      if (onUpdateUser) {
        onUpdateUser({
          ...user,
          skills: tempProfile.skills,
          education: tempProfile.education,
          work_experience: tempProfile.work_experience,
          resume_path: tempProfile.resume_path,
          responsibilities: tempProfile.responsibilities,
          certificates: tempProfile.certificates,
          projects: tempProfile.projects,
          achievements: tempProfile.achievements,
          social_links: socialLinksString,
          portfolio_url: tempProfile.portfolio_url,
          github_url: tempProfile.github_url,
          linkedin_url: tempProfile.linkedin_url,
          website_url: tempProfile.website_url,
          company_name: tempProfile.company_name,
          company_logo: tempProfile.company_logo,
          company_website: tempProfile.company_website,
          company_industry: tempProfile.company_industry,
          company_size: tempProfile.company_size,
          company_description: tempProfile.company_description,
          company_gst: tempProfile.company_gst,
          company_head_office: tempProfile.company_head_office
        });
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || "Failed to update profile details.", "error");
    }
  };

  const handleSavePassword = async (e) => {
    if (e) e.preventDefault();
    setSecurityError('');
    setSaveSuccess(false);
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      setSecurityError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityError("New passwords do not match.");
      return;
    }
    
    try {
      await changePasswordService(currentPassword, newPassword, confirmPassword);
      setSaveSuccess(true);
      showToast("Password updated successfully!", "success");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setSecurityError(err.response.data.message || "Failed to change password.");
        showToast(err.response.data.message || "Failed to change password.", "error");
      } else {
        setSecurityError(err.message || "Failed to connect to the server.");
        showToast(err.message || "Failed to connect to the server.", "error");
      }
    }
  };

  const handleViewResume = () => {
    if (tempProfile.resume_file instanceof File) {
      const localUrl = URL.createObjectURL(tempProfile.resume_file);
      window.open(localUrl, '_blank');
    } else if (profile.resume_file instanceof File) {
      const localUrl = URL.createObjectURL(profile.resume_file);
      window.open(localUrl, '_blank');
    } else if (profile.resume_path) {
      const url = profile.resume_path.startsWith('http') 
        ? profile.resume_path 
        : `http://192.168.1.31:8000/storage/${profile.resume_path}`;
      window.open(url, '_blank');
    } else {
      showToast("No resume file available to view.", "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSaveSuccess(false);
    
    if (activeTab === 'security') {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setSecurityError("Please fill in all password fields.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (newPassword.length < 8) {
        setSecurityError("New password must be at least 8 characters.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setSecurityError("New passwords do not match.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      try {
        await changePasswordService(currentPassword, newPassword, confirmPassword);
        setSaveSuccess(true);
        showToast("Password updated successfully!", "success");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        if (err.response && err.response.data) {
          setSecurityError(err.response.data.message || "Failed to change password.");
          showToast(err.response.data.message || "Failed to change password.", "error");
        } else {
          setSecurityError(err.message || "Failed to connect to the server.");
          showToast(err.message || "Failed to connect to the server.", "error");
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Notification / System Tab save mock
      setSaveSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="settings-page">
      {/* Main Settings Panel */}
      <div className="settings-panel-container glassmorphism">
        {/* Navigation Sidebar inside Panel */}
        <aside className="settings-tabs-sidebar">
          <button 
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { window.location.hash = 'profile'; }}
          >
            <FiUser size={16} />
            <span>Profile Settings</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => { window.location.hash = 'notifications'; }}
          >
            <FiBell size={16} />
            <span>Notifications</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => { window.location.hash = 'security'; }}
          >
            <FiLock size={16} />
            <span>Security & Pass</span>
          </button>
          <button 
            className={`settings-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => { window.location.hash = 'system'; }}
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
                {/* Header row with Title */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
                  <div className="settings-header-group" style={{ margin: 0 }}>
                    <h3 className="tab-pane-title">Profile Settings</h3>
                    <p className="tab-pane-sub">Update your public profile details and background information.</p>
                  </div>
                </div>

                {/* LinkedIn-style Header Widget */}
                <div className="linkedin-profile-widget">
                  {/* Banner image */}
                  <div className="linkedin-banner-wrapper">
                    <div className="linkedin-banner-placeholder"></div>
                  </div>
                  
                  {/* Profile circle overlapping the banner */}
                  <div className="linkedin-profile-header-content">
                    {/* Pencil Edit Icon at the top-right of the details box */}
                    <button 
                      type="button" 
                      onClick={openIntroModal}
                      aria-label="Edit intro"
                      style={{
                        position: 'absolute',
                        right: '1.5rem',
                        top: '1.5rem',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        color: '#475569',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    >
                      <FiEdit2 size={16} />
                    </button>

                    <div className="linkedin-avatar-container" onClick={triggerFileSelect} style={{ cursor: 'pointer' }}>
                      <div className="linkedin-avatar-circle">
                        {profile.avatar ? (
                          <img 
                            src={profile.avatar} 
                            alt="Profile" 
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                          />
                        ) : (
                          user?.initials || 'AM'
                        )}
                      </div>
                      <button 
                        type="button" 
                        className="linkedin-avatar-add-btn" 
                        aria-label="Add photo"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileSelect();
                        }}
                      >
                        +
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAvatarChange} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                      />
                    </div>

                    <div className="linkedin-details-row">
                      <div className="linkedin-primary-info">
                        <div className="linkedin-name-row">
                          <h2 className="linkedin-name-heading">{profile.name}</h2>
                        </div>
                        <p className="linkedin-headline-heading">
                          {user?.role === 'recruiter' 
                            ? (profile.designation ? `${profile.designation}${profile.company_name ? ` at ${profile.company_name}` : ''}` : 'Academic Operations Manager')
                            : (profile.profession || 'Full Stack Web Development Learner')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Summary Card */}
                <div className="settings-section-card" style={{ position: 'relative', marginTop: '0.5rem', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text)', margin: 0 }}>Professional Summary</h4>
                    {profile.about && (
                      <button 
                        type="button" 
                        onClick={() => setIsSummaryModalOpen(true)}
                        aria-label="Edit summary"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748b',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FiEdit2 size={16} />
                      </button>
                    )}
                  </div>
                  
                  {!profile.about ? (
                    <div 
                      onClick={() => setIsSummaryModalOpen(true)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2.5rem 1.5rem',
                        border: '2px dashed #cbd5e1',
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.backgroundColor = '#fff5f5';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: '#fff5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        marginBottom: '1rem'
                      }}>
                        <FiBookOpen size={22} />
                      </div>
                      <h5 style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: '#0f172a', fontSize: '0.95rem' }}>
                        {user?.role === 'recruiter' ? 'Write a recruiter bio' : 'Write a professional summary'}
                      </h5>
                      <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', lineHeight: '1.5' }}>
                        {user?.role === 'recruiter'
                          ? 'Share your recruitment focus, company values, or hiring goals to attract top candidates.'
                          : 'Share your skills, background, or learning objectives to make your profile stand out.'}
                      </p>
                      <button 
                        type="button"
                        className="save-settings-btn"
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', width: 'auto', margin: 0 }}
                      >
                        Add Summary
                      </button>
                    </div>
                  ) : (
                    <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {profile.about}
                    </p>
                  )}
                </div>

                {/* Professional Details Section Card (Candidate/Student role only) */}
                {(user?.role === 'student' || user?.role === 'candidate') && (
                  <div className="settings-section-card" style={{ position: 'relative', marginTop: '1.5rem', textAlign: 'left', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Professional Details</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Manage your resume, credentials, skills, and background for recruiters.</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={openDetailsModal}
                        aria-label="Edit professional details"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748b',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FiEdit2 size={16} />
                      </button>
                    </div>

                    <div className="professional-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                      {/* Left Column Modules */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* 1. Resume Widget */}
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiFileText size={20} />
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Resume Attachment</h5>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Used by recruiters to screen your background</p>
                            </div>
                          </div>
                          {profile.resume_path ? (
                            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                                <span style={{ fontSize: '1.5rem', color: '#ef4444' }}>📄</span>
                                <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }} title={profile.resume_path}>
                                  {profile.resume_path}
                                </span>
                              </div>
                              <button 
                                type="button" 
                                onClick={handleViewResume}
                                style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', border: 'none', background: 'transparent', padding: 0 }}
                              >
                                View PDF
                              </button>
                            </div>
                          ) : (
                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
                              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>No resume uploaded yet.</p>
                              <button type="button" onClick={openDetailsModal} style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textDecoration: 'underline' }}>Upload Now</button>
                            </div>
                          )}
                        </div>

                        {/* 2. Skills Widget */}
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: '#e0f2fe', color: '#0284c7', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiCpu size={20} />
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Key Skills</h5>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Core technological competencies</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {profile.skills ? (
                              profile.skills.split(',').map((skill, sIdx) => (
                                <span 
                                  key={sIdx} 
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    backgroundColor: '#eff6ff',
                                    color: '#1e40af',
                                    border: '1px solid #bfdbfe',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '30px',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  {skill.trim()}
                                </span>
                              ))
                            ) : (
                              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No skills listed yet</span>
                            )}
                          </div>
                        </div>

                        {/* 3. Professional Links Widget */}
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiGlobe size={20} />
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Online Presence</h5>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Websites, repositories & portfolios</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {profile.portfolio_url && (
                              <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff', textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <FiBriefcase size={16} style={{ color: '#e11d48' }} />
                                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Portfolio Website</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Visit ↗</span>
                              </a>
                            )}
                            {profile.github_url && (
                              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff', textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <FiGithub size={16} style={{ color: '#0f172a' }} />
                                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>GitHub Profile</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Visit ↗</span>
                              </a>
                            )}
                            {profile.linkedin_url && (
                              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff', textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <FiLinkedin size={16} style={{ color: '#0077b5' }} />
                                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>LinkedIn Profile</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Visit ↗</span>
                              </a>
                            )}
                            {profile.website_url && (
                              <a href={profile.website_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff', textDecoration: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <FiGlobe size={16} style={{ color: '#64748b' }} />
                                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>Personal Website</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Visit ↗</span>
                              </a>
                            )}
                            {!profile.portfolio_url && !profile.github_url && !profile.linkedin_url && !profile.website_url && (
                              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic' }}>No professional links added yet</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column Modules */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* 4. Education Widget */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderLeft: '4px solid #4f46e5', borderRadius: '8px 16px 16px 8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <FiBookOpen size={16} style={{ color: '#4f46e5' }} />
                            <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Education</h5>
                          </div>
                          {renderLineList(profile.education, "No education details added yet.")}
                        </div>

                        {/* 5. Work Experience Widget */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderLeft: '4px solid #10b981', borderRadius: '8px 16px 16px 8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <FiBriefcase size={16} style={{ color: '#10b981' }} />
                            <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Work Experience</h5>
                          </div>
                          {renderLineList(profile.work_experience, "No experience details added yet.")}
                        </div>

                        {/* 6. Projects Widget */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderLeft: '4px solid #f59e0b', borderRadius: '8px 16px 16px 8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <FiFolder size={16} style={{ color: '#f59e0b' }} />
                            <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Projects</h5>
                          </div>
                          {renderLineList(profile.projects, "No projects listed yet.")}
                        </div>

                        {/* 7. Certificates Widget */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderLeft: '4px solid #ec4899', borderRadius: '8px 16px 16px 8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <FiAward size={16} style={{ color: '#ec4899' }} />
                            <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Certificates</h5>
                          </div>
                          {renderLineList(profile.certificates, "No certificates listed yet.")}
                        </div>

                        {/* 8. Responsibilities & Achievements */}
                        {(profile.responsibilities || profile.achievements) && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {profile.responsibilities && (
                              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                                <h6 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', margin: '0 0 0.5rem 0' }}>Responsibilities</h6>
                                {renderLineList(profile.responsibilities, "No responsibilities details.")}
                              </div>
                            )}
                            {profile.achievements && (
                              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                                <h6 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', margin: '0 0 0.5rem 0' }}>Achievements</h6>
                                {renderLineList(profile.achievements, "No achievements listed.")}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recruiter & Company Details Section Card (Recruiter role only) */}
                {user?.role === 'recruiter' && (
                  <div className="settings-section-card" style={{ position: 'relative', marginTop: '1.5rem', textAlign: 'left', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                      <div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', margin: 0, letterSpacing: '-0.5px' }}>Recruiter & Company Details</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>Manage your corporate identity, department details, and company profile.</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={openDetailsModal}
                        aria-label="Edit recruiter details"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748b',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FiEdit2 size={16} />
                      </button>
                    </div>

                    <div className="professional-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                      {/* Left Column: Recruiter Corporate Identity */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                            <div style={{ backgroundColor: '#e0f2fe', color: '#0284c7', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiUser size={20} />
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Corporate Role</h5>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Your assignment inside the organization</p>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                              <h6 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Designation</h6>
                              <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>
                                {profile.designation ? profile.designation : "No designation set"}
                              </span>
                            </div>
                            <div>
                              <h6 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Department</h6>
                              <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>
                                {profile.department ? profile.department : "No department set"}
                              </span>
                            </div>
                            <div>
                              <h6 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Extension</h6>
                              <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>
                                {profile.phone_extension ? profile.phone_extension : "No phone extension set"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Company Profile Meta (Industry, Size, GST, HQ) */}
                        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                            <div style={{ backgroundColor: '#f0fdf4', color: '#16a34a', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FiGlobe size={20} />
                            </div>
                            <div>
                              <h5 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Business Profile</h5>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Basic corporate registration & location</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                              <h6 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Industry</h6>
                              <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>
                                {profile.company_industry ? profile.company_industry : "No industry listed"}
                              </span>
                            </div>
                            <div>
                              <h6 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company Size</h6>
                              <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>
                                {profile.company_size ? `${profile.company_size} employees` : "No company size set"}
                              </span>
                            </div>
                            <div>
                              <h6 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>GST Number</h6>
                              <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>
                                {profile.company_gst ? profile.company_gst : "No GST number set"}
                              </span>
                            </div>
                            <div>
                              <h6 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Head Office Location</h6>
                              <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '600' }}>
                                {profile.company_head_office ? profile.company_head_office : "No office location set"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Company Description & Digital Presence */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Company Card Widget */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderLeft: '4px solid #4f46e5', borderRadius: '8px 16px 16px 8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <FiBriefcase size={16} style={{ color: '#4f46e5' }} />
                            <h5 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Company Entity</h5>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                              <h6 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', margin: '0 0 0.25rem 0' }}>Legal Name</h6>
                              <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                                {profile.company_name ? profile.company_name : "No company associated"}
                              </p>
                            </div>

                            {profile.company_website && (
                              <div>
                                <h6 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', margin: '0 0 0.25rem 0' }}>Website URL</h6>
                                <a 
                                  href={profile.company_website} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  style={{
                                    fontSize: '0.9rem',
                                    color: '#2563eb',
                                    fontWeight: '600',
                                    textDecoration: 'underline',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  {profile.company_website} ↗
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Company Description Widget */}
                        <div style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderLeft: '4px solid #10b981', borderRadius: '8px 16px 16px 8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <FiFileText size={16} style={{ color: '#10b981' }} />
                            <h5 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>About Company</h5>
                          </div>
                          <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-wrap', margin: 0 }}>
                            {profile.company_description ? profile.company_description : "No description provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                
                {/* 0. Email Verification Section */}
                {user && (
                  <div 
                    className="settings-section-card" 
                    style={{ 
                      border: user.email_verified_at ? '1px solid #d1fae5' : '1px solid #ffe4e6', 
                      backgroundColor: user.email_verified_at ? '#f0fdf4' : '#fff5f5' 
                    }}
                  >
                    <div className="settings-card-header-group">
                      <h4 
                        className="section-card-title" 
                        style={{ color: user.email_verified_at ? '#10b981' : '#e11d48' }}
                      >
                        {user.email_verified_at ? 'Email Verified' : 'Verify Your Email'}
                      </h4>
                      <p className="section-card-desc">
                        {user.email_verified_at 
                          ? 'Your account email address is verified. Your account is fully active.' 
                          : 'Your account email address is not verified. Please verify your email to unlock all dashboard features.'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.25rem' }}>
                      {user.email_verified_at ? (
                        <>
                          <button
                            type="button"
                            className="settings-modal-btn"
                            disabled
                            style={{ 
                              backgroundColor: '#10b981', 
                              borderColor: '#10b981', 
                              color: 'white',
                              width: 'auto', 
                              margin: 0,
                              cursor: 'default',
                              opacity: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            <FiCheckCircle size={16} />
                            <span>Verified</span>
                          </button>
                          <button
                            type="button"
                            className="settings-modal-btn cancel-btn"
                            style={{ 
                              width: 'auto', 
                              margin: 0,
                              borderColor: '#cbd5e1',
                              color: '#64748b'
                            }}
                            onClick={handleResendVerification}
                            disabled={resendingEmail}
                          >
                            {resendingEmail ? 'Sending...' : 'Resend Verification Email'}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="settings-modal-btn confirm-btn"
                          style={{ backgroundColor: '#e11d48', borderColor: '#e11d48', width: 'auto', margin: 0 }}
                          onClick={handleResendVerification}
                          disabled={resendingEmail}
                        >
                          {resendingEmail ? 'Sending...' : 'Resend Verification Email'}
                        </button>
                      )}
                      {resendSuccess && <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>Verification link sent to your inbox!</span>}
                      {resendError && <span style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 600 }}>{resendError}</span>}
                    </div>
                  </div>
                )}
                
                {/* 1. Change Password Section */}
                <div className="settings-section-card">
                  <div className="settings-card-header-group">
                    <h4 className="section-card-title">Change Password</h4>
                    <p className="section-card-desc">Update your sign-in password regularly to keep your account safe.</p>
                  </div>
                  
                  {securityError && <div className="settings-security-error-alert" style={{ gridColumn: 'span 2', color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600, textAlign: 'left', marginBottom: '0.5rem' }}>{securityError}</div>}
                  {saveSuccess && activeTab === 'security' && <div className="settings-security-success-alert" style={{ gridColumn: 'span 2', color: '#10b981', backgroundColor: '#ecfdf5', border: '1px solid #d1fae5', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600, textAlign: 'left', marginBottom: '0.5rem' }}>Password updated successfully!</div>}
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label htmlFor="curr-pass">Current Password</label>
                      <input 
                        type="password" 
                        id="curr-pass" 
                        placeholder="Enter current password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="new-pass">New Password</label>
                      <input 
                        type="password" 
                        id="new-pass" 
                        placeholder="Enter new password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirm-pass">Confirm Password</label>
                      <input 
                        type="password" 
                        id="confirm-pass" 
                        placeholder="Confirm new password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                  </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1.25rem' }}>
                    <button 
                      type="button" 
                      className="save-settings-btn" 
                      onClick={handleSavePassword}
                      style={{ width: 'auto', margin: 0 }}
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                {/* 2. Two-Factor Authentication (2FA) */}
                 <div className="settings-section-card">
                   <div className="settings-card-header-group">
                     <h4 className="section-card-title">Two-Factor Authentication (2FA)</h4>
                     <p className="section-card-desc">Add an extra layer of security to your account by requiring an authenticator code at login.</p>
                   </div>

                   {twoFactorMessage && <div className="settings-toast success" style={{ position: 'static', margin: '1rem 0', width: 'auto', display: 'flex' }}>{twoFactorMessage}</div>}
                   {twoFactorError && <div className="settings-toast error" style={{ position: 'static', margin: '1rem 0', width: 'auto', display: 'flex' }}>{twoFactorError}</div>}
                   
                   <div className="security-status-row" style={{ marginBottom: '1.5rem' }}>
                     <span className="status-label">Status:</span>
                     <span className={`status-badge ${is2faEnabled ? 'active' : 'inactive'}`}>
                       {is2faEnabled ? '✓ Enabled' : 'Disabled'}
                     </span>
                   </div>

                   {!is2faEnabled ? (
                     <div className="two-factor-setup-info" style={{ display: 'block', textAlign: 'left' }}>
                       {!qrCodeUrl ? (
                         <button 
                           type="button" 
                           className="save-settings-btn"
                           onClick={handleEnable2fa}
                         >
                           Enable 2FA Setup
                         </button>
                       ) : (
                         <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                           <div className="setup-qr-mock" style={{ flexShrink: 0, padding: '10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                             <img src={qrCodeUrl} alt="2FA QR Code" style={{ width: '180px', height: '180px', display: 'block' }} />
                           </div>
                           <div className="setup-instructions" style={{ flex: 1, minWidth: '250px' }}>
                             <h5 style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Set up Authenticator App</h5>
                             <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>
                               1. Scan this QR code with Google Authenticator or Authy.
                             </p>
                             <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1rem 0' }}>
                               Or enter secret manually: <strong style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>{secret}</strong>
                             </p>
                             <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0' }}>
                               2. Enter the 6-digit confirmation code below:
                             </p>
                             <div className="verify-code-row" style={{ display: 'flex', gap: '0.75rem' }}>
                               <input 
                                 type="text" 
                                 placeholder="000000" 
                                 maxLength="6" 
                                 className="verification-code-input" 
                                 value={twoFactorCode}
                                 onChange={(e) => setTwoFactorCode(e.target.value)}
                                 style={{ width: '120px', textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold' }}
                               />
                               <button 
                                 type="button" 
                                 className="save-settings-btn"
                                 onClick={handleConfirm2fa}
                                 disabled={twoFactorCode.length < 6}
                               >
                                 Confirm Setup
                               </button>
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                   ) : (
                     <div className="disable-section" style={{ textAlign: 'left', marginTop: '1rem' }}>
                       <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                         To deactivate two-factor authentication, please enter the current 6-digit verification code from your authenticator app below:
                       </p>
                       <div className="verify-code-row" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                         <input 
                           type="text" 
                           placeholder="000000" 
                           maxLength="6" 
                           className="verification-code-input" 
                           value={twoFactorCode}
                           onChange={(e) => setTwoFactorCode(e.target.value)}
                           style={{ width: '120px', textAlign: 'center', letterSpacing: '2px', fontWeight: 'bold' }}
                         />
                         <button 
                           type="button" 
                           className="confirm-delete-action-btn"
                           onClick={handleDisable2fa}
                           disabled={twoFactorCode.length < 6}
                           style={{ margin: 0, padding: '0.625rem 1.25rem' }}
                         >
                           Disable 2FA
                         </button>
                       </div>
                     </div>
                   )}
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
                        onClick={() => setShowLogoutAllConfirm(true)}
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
            {activeTab !== 'profile' && (
              <div className="settings-footer-actions">
                {saveSuccess && <span className="save-success-msg">Settings saved successfully!</span>}
                <button type="submit" className="save-settings-btn">
                  <FiSave size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}

          </form>
        </main>
        {/* Custom Logout All Devices Confirmation Modal */}
        {showLogoutAllConfirm && (
          <div className="settings-modal-overlay">
            <div className="settings-modal-card glassmorphism">
              <div className="settings-modal-icon-wrapper">
                <FiAlertTriangle size={24} />
              </div>
              <h4 className="settings-modal-title">Logout from All Devices</h4>
              <p className="settings-modal-desc">
                Are you sure you want to log out from all devices? This will also log you out of this current session.
              </p>
              <div className="settings-modal-actions">
                <button 
                  type="button" 
                  className="settings-modal-btn cancel-btn"
                  onClick={() => setShowLogoutAllConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="settings-modal-btn confirm-btn"
                  onClick={handleRevokeAllSessions}
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Intro Pop-up Modal */}
        {isIntroModalOpen && createPortal(
          <div 
            className="settings-modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999999,
              padding: '2rem',
              boxSizing: 'border-box'
            }}
          >
            <div 
              className="profile-edit-modal"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '680px',
                maxHeight: 'calc(100vh - 4rem)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
              }}
            >
              <div className="profile-edit-modal-header">
                <h4 className="profile-edit-modal-title">Edit intro</h4>
                <button 
                  type="button" 
                  className="profile-edit-modal-close" 
                  onClick={() => setIsIntroModalOpen(false)}
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="profile-edit-modal-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Full Name*</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={tempProfile.name}
                      onChange={handleTempProfileChange}
                      required
                    />
                  </div>
                  {user?.role === 'recruiter' ? (
                    <>
                      <div className="form-group">
                        <label htmlFor="designation">Designation</label>
                        <input 
                          type="text" 
                          id="designation" 
                          name="designation" 
                          value={tempProfile.designation || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. Hiring Manager, HR Lead"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <input 
                          type="text" 
                          id="department" 
                          name="department" 
                          value={tempProfile.department || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. Talent Acquisition, Sales"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="company_name">Company / Organization</label>
                        <input 
                          type="text" 
                          id="company_name" 
                          name="company_name" 
                          value={tempProfile.company_name || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. Redback Academy"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone_extension">Phone Extension</label>
                        <input 
                          type="text" 
                          id="phone_extension" 
                          name="phone_extension" 
                          value={tempProfile.phone_extension || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. Ext 104"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group full-width">
                        <label htmlFor="headline">Headline / Profession</label>
                        <input 
                          type="text" 
                          id="headline" 
                          name="profession" 
                          value={tempProfile.profession || ''}
                          onChange={handleTempProfileChange}
                          placeholder="Headline describing your role or focus"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="college">College / University</label>
                        <input 
                          type="text" 
                          id="college" 
                          name="institution" 
                          value={tempProfile.institution || ''}
                          onChange={handleTempProfileChange}
                        />
                      </div>
                    </>
                  )}

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={tempProfile.email}
                      onChange={handleTempProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                      type="text" 
                      id="phone" 
                      name="phone" 
                      value={tempProfile.phone}
                      onChange={handleTempProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Account Role</label>
                    <input 
                      type="text" 
                      id="role" 
                      name="role" 
                      value={tempProfile.role} 
                      disabled 
                      className="disabled-input"
                    />
                  </div>
                </div>
              </div>
              <div className="profile-edit-modal-footer">
                <button 
                  type="button" 
                  className="cancel-delete-btn" 
                  onClick={() => setIsIntroModalOpen(false)}
                  style={{ border: '1px solid var(--border)', background: 'transparent' }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="save-settings-btn" 
                  onClick={handleSaveIntro}
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Edit Summary Modal */}
        {isSummaryModalOpen && createPortal(
          <div 
            className="settings-modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999999,
              padding: '2rem',
              boxSizing: 'border-box'
            }}
          >
            <div 
              className="profile-edit-modal"
              style={{
                width: '100%',
                maxWidth: '650px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-2xl)'
              }}
            >
              <div className="profile-edit-modal-header">
                <h3 className="profile-edit-modal-title">Edit Summary</h3>
                <button 
                  type="button" 
                  className="close-modal-x"
                  onClick={() => setIsSummaryModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.25rem',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
              <div className="profile-edit-modal-body" style={{ overflowY: 'auto', padding: '1.5rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                  {user?.role === 'recruiter' 
                    ? "Add a professional overview detailing your recruiting focus, hiring goals, and organization culture."
                    : "Add a professional overview outlining your skillset, academic achievements, projects, and career aspirations."}
                </p>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="form-group full-width" style={{ margin: 0 }}>
                    <label htmlFor="modal_summary_about" style={{ fontWeight: '600' }}>Professional Summary</label>
                    <textarea 
                      id="modal_summary_about" 
                      name="about" 
                      rows="8" 
                      value={tempProfile.about || ''}
                      onChange={handleTempProfileChange}
                      placeholder={user?.role === 'recruiter' 
                        ? "e.g. Talent Acquisition Manager with 5+ years of experience leading engineering recruitment drives..." 
                        : "e.g. Aspiring Full Stack Developer with experience in React and Laravel. Looking for junior developer internships..."}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: '8px', 
                        border: '1px solid #cbd5e1', 
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="profile-edit-modal-footer">
                <button 
                  type="button" 
                  className="cancel-delete-btn" 
                  onClick={() => setIsSummaryModalOpen(false)}
                  style={{ border: '1px solid var(--border)', background: 'transparent' }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="save-settings-btn" 
                  onClick={handleSaveSummary}
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Edit Professional Details Pop-up Modal */}
        {isDetailsModalOpen && createPortal(
          <div 
            className="settings-modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999999,
              padding: '2rem',
              boxSizing: 'border-box'
            }}
          >
            <div 
              className="profile-edit-modal"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '680px',
                maxHeight: 'calc(100vh - 4rem)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid #e2e8f0'
              }}
            >
              <div className="profile-edit-modal-header">
                <h4 className="profile-edit-modal-title">Edit professional details</h4>
                <button 
                  type="button" 
                  className="profile-edit-modal-close" 
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="profile-edit-modal-content">
                <div className="form-grid">
                  {user?.role === 'recruiter' ? (
                    <>
                      {/* Company Name */}
                      <div className="form-group">
                        <label htmlFor="modal_company_name">Company Name</label>
                        <input 
                          type="text" 
                          id="modal_company_name" 
                          name="company_name" 
                          value={tempProfile.company_name || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. Redback Academy"
                        />
                      </div>

                      {/* Company Website */}
                      <div className="form-group">
                        <label htmlFor="modal_company_website">Company Website</label>
                        <input 
                          type="text" 
                          id="modal_company_website" 
                          name="company_website" 
                          value={tempProfile.company_website || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. https://redbackacademy.com"
                        />
                      </div>

                      {/* Company Industry */}
                      <div className="form-group">
                        <label htmlFor="modal_company_industry">Industry</label>
                        <input 
                          type="text" 
                          id="modal_company_industry" 
                          name="company_industry" 
                          value={tempProfile.company_industry || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. Education, E-Learning, Tech"
                        />
                      </div>

                      {/* Company Size */}
                      <div className="form-group">
                        <label htmlFor="modal_company_size">Company Size</label>
                        <select 
                          id="modal_company_size" 
                          name="company_size" 
                          value={tempProfile.company_size || ''}
                          onChange={handleTempProfileChange}
                        >
                          <option value="">Select size...</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                      </div>

                      {/* GST Number */}
                      <div className="form-group">
                        <label htmlFor="modal_company_gst">GST Number</label>
                        <input 
                          type="text" 
                          id="modal_company_gst" 
                          name="company_gst" 
                          value={tempProfile.company_gst || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. 22AAAAA0000A1Z5"
                        />
                      </div>

                      {/* Head Office Address */}
                      <div className="form-group">
                        <label htmlFor="modal_company_head_office">Head Office Location</label>
                        <input 
                          type="text" 
                          id="modal_company_head_office" 
                          name="company_head_office" 
                          value={tempProfile.company_head_office || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. Chennai, Tamil Nadu"
                        />
                      </div>

                      {/* Company Description */}
                      <div className="form-group full-width">
                        <label htmlFor="modal_company_description">Company Description</label>
                        <textarea 
                          id="modal_company_description" 
                          name="company_description" 
                          rows="4" 
                          value={tempProfile.company_description || ''}
                          onChange={handleTempProfileChange}
                          placeholder="Describe the company's core products, mission, and services..."
                        ></textarea>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group full-width">
                        <label htmlFor="resume_upload">Resume (PDF, DOCX up to 5MB)</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.25rem' }}>
                          <button 
                            type="button" 
                            className="upload-btn" 
                            style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}
                            onClick={() => document.getElementById('modal_resume_file_input').click()}
                          >
                            Upload Resume
                          </button>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {tempProfile.resume_path ? `Selected: ${tempProfile.resume_path}` : 'No resume uploaded'}
                          </span>
                          <input 
                            type="file" 
                            id="modal_resume_file_input" 
                            accept=".pdf,.doc,.docx" 
                            style={{ display: 'none' }} 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                setTempProfile(prev => ({ 
                                  ...prev, 
                                  resume_path: file.name,
                                  resume_file: file
                                }));
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="skills">Key Skills (comma separated)</label>
                        <input 
                          type="text" 
                          id="skills" 
                          name="skills" 
                          value={tempProfile.skills || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. React, Laravel, JavaScript, SQL"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="education">Education History</label>
                        <textarea 
                          id="education" 
                          name="education" 
                          rows="3" 
                          value={tempProfile.education || ''}
                          onChange={handleTempProfileChange}
                          placeholder="List your degrees, institutions, and graduation years..."
                        ></textarea>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="work_experience">Work Experience</label>
                        <textarea 
                          id="work_experience" 
                          name="work_experience" 
                          rows="3" 
                          value={tempProfile.work_experience || ''}
                          onChange={handleTempProfileChange}
                          placeholder="List your previous job roles, companies, and durations..."
                        ></textarea>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="projects">Projects</label>
                        <textarea 
                          id="projects" 
                          name="projects" 
                          rows="3" 
                          value={tempProfile.projects || ''}
                          onChange={handleTempProfileChange}
                          placeholder="List your projects, technologies used, and descriptions..."
                        ></textarea>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="certificates">Certificates</label>
                        <textarea 
                          id="certificates" 
                          name="certificates" 
                          rows="3" 
                          value={tempProfile.certificates || ''}
                          onChange={handleTempProfileChange}
                          placeholder="List your certifications, issuing organizations, and dates..."
                        ></textarea>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="responsibilities">Responsibilities</label>
                        <textarea 
                          id="responsibilities" 
                          name="responsibilities" 
                          rows="3" 
                          value={tempProfile.responsibilities || ''}
                          onChange={handleTempProfileChange}
                          placeholder="List any leadership roles, organizational activities, or volunteer work..."
                        ></textarea>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="achievements">Achievements</label>
                        <textarea 
                          id="achievements" 
                          name="achievements" 
                          rows="3" 
                          value={tempProfile.achievements || ''}
                          onChange={handleTempProfileChange}
                          placeholder="List your honors, awards, publications, or competitive success..."
                        ></textarea>
                      </div>

                      <div className="form-group">
                        <label htmlFor="portfolio_url">Portfolio URL</label>
                        <input 
                          type="text" 
                          id="portfolio_url" 
                          name="portfolio_url" 
                          value={tempProfile.portfolio_url || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. https://myportfolio.com"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="github_url">GitHub Profile URL</label>
                        <input 
                          type="text" 
                          id="github_url" 
                          name="github_url" 
                          value={tempProfile.github_url || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. https://github.com/username"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="linkedin_url">LinkedIn Profile URL</label>
                        <input 
                          type="text" 
                          id="linkedin_url" 
                          name="linkedin_url" 
                          value={tempProfile.linkedin_url || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. https://linkedin.com/in/username"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="website_url">Website URL</label>
                        <input 
                          type="text" 
                          id="website_url" 
                          name="website_url" 
                          value={tempProfile.website_url || ''}
                          onChange={handleTempProfileChange}
                          placeholder="e.g. https://mywebsite.com"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="profile-edit-modal-footer">
                <button 
                  type="button" 
                  className="cancel-delete-btn" 
                  onClick={() => setIsDetailsModalOpen(false)}
                  style={{ border: '1px solid var(--border)', background: 'transparent' }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="save-settings-btn" 
                  onClick={handleSaveDetails}
                >
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Floating Toast Notification Alert */}
        {toast.show && createPortal(
          <div className="settings-toast-container">
            <div className={`settings-toast ${toast.type}`}>
              {toast.type === 'success' && <FiCheckCircle className="settings-toast-icon success" size={18} />}
              {toast.type === 'info' && <FiInfo className="settings-toast-icon info" size={18} />}
              {toast.type === 'error' && <FiAlertCircle className="settings-toast-icon error" size={18} />}
              <span>{toast.message}</span>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
}
