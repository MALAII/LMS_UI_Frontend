import axios from 'axios';

// Set up base URL for Laravel Sanctum API
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// axios.defaults.withCredentials = true; // Commented out temporarily until Laravel backend configures supports_credentials => true in config/cors.php
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Retrieve cached token on startup to configure default authorization header
const cachedUser = sessionStorage.getItem('currentUser');
if (cachedUser) {
  try {
    const parsed = JSON.parse(cachedUser);
    if (parsed.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
    }
  } catch (e) {
    console.error("Failed to parse cached user token", e);
  }
}

/**
 * Sign In Service Call
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} API response data with user and token
 */
export const loginService = async (email, password) => {
  const response = await axios.post('/login', { email, password });
  const data = response.data;
  
  // Set default authorization header on successful login
  if (data.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  }
  
  return data;
};

/**
 * Sign Up / Registration Service Call
 * @param {string} name 
 * @param {string} email 
 * @param {string} role 'candidate' | 'recruiter'
 * @param {string} password 
 * @param {string} passwordConfirmation 
 * @returns {Promise<Object>} API response data
 */
export const signUpService = async (name, email, role, password, passwordConfirmation) => {
  // Map frontend role exactly to backend expectations ('recruiter' -> 'recruiter', others -> 'candidate')
  const backendRole = role === 'recruiter' ? 'recruiter' : 'candidate';

  const response = await axios.post('/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
    role: backendRole
  });
  return response.data;
};

/**
 * Fetch currently authenticated user profile
 * @returns {Promise<Object>} API user data
 */
export const getUserProfileService = async () => {
  const response = await axios.get('/me');
  const responseData = response.data;
  const loginData = responseData.data || responseData;
  const userObj = loginData.user || responseData.user || loginData; // fallback if Laravel resource returns direct user data
  
  if (!userObj || typeof userObj !== 'object') {
    return responseData; // fallback
  }

  // Determine role Label
  const userRole = userObj.roles?.[0]?.name?.toLowerCase() || userObj.role?.toLowerCase() || 'student';
  const mappedRole = (userRole === 'admin' || userRole === 'recruiter' || userRole === 'employer') ? 'recruiter' : 'candidate';
  const nameParts = (userObj.name || '').split(/\s+/);
  const initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'U';

  // Return mapped processed user to UI
  return {
    id: userObj.id,
    name: userObj.name,
    email: userObj.email,
    role: mappedRole,
    roleLabel: userObj.roles?.[0]?.name || (mappedRole === 'recruiter' ? 'Recruiter' : 'Student'),
    initials: initials,
    email_verified_at: userObj.email_verified_at,
    
    // Candidate / Student profile fields
    profession: userObj.profession || userObj.profile?.profession || userObj.candidate_profile?.profession || null,
    institution: userObj.institution || userObj.profile?.institution || userObj.candidate_profile?.institution || null,
    phone: userObj.phone || null,
    about: userObj.about || userObj.profile?.about || userObj.candidate_profile?.about || null,
    avatar: userObj.avatar || null,
    skills: userObj.skills || userObj.profile?.skills || userObj.candidate_profile?.skills || null,
    education: userObj.education || userObj.profile?.education || userObj.candidate_profile?.education || null,
    work_experience: userObj.work_experience || userObj.profile?.work_experience || userObj.candidate_profile?.work_experience || null,
    resume_path: userObj.resume_path || userObj.profile?.resume_path || userObj.candidate_profile?.resume_path || null,
    responsibilities: userObj.responsibilities || userObj.profile?.responsibilities || userObj.candidate_profile?.responsibilities || null,
    certificates: userObj.certificates || userObj.profile?.certificates || userObj.candidate_profile?.certificates || null,
    projects: userObj.projects || userObj.profile?.projects || userObj.candidate_profile?.projects || null,
    achievements: userObj.achievements || userObj.profile?.achievements || userObj.candidate_profile?.achievements || null,
    social_links: userObj.social_links || userObj.profile?.social_links || userObj.candidate_profile?.social_links || null,
    
    // Recruiter / Company profile fields
    designation: userObj.designation || userObj.profile?.designation || userObj.recruiter_profile?.designation || null,
    department: userObj.department || userObj.profile?.department || userObj.recruiter_profile?.department || null,
    phone_extension: userObj.phone_extension || userObj.profile?.phone_extension || userObj.recruiter_profile?.phone_extension || null,
    
    // Nested company relation fields
    company_name: userObj.company_name || userObj.profile?.company?.company_name || userObj.recruiter_profile?.company?.company_name || userObj.company?.company_name || null,
    company_logo: userObj.company_logo || userObj.profile?.company?.logo || userObj.recruiter_profile?.company?.logo || userObj.company?.logo || null,
    company_website: userObj.company_website || userObj.profile?.company?.website || userObj.recruiter_profile?.company?.website || userObj.company?.website || null,
    company_industry: userObj.company_industry || userObj.profile?.company?.industry || userObj.recruiter_profile?.company?.industry || userObj.company?.industry || null,
    company_size: userObj.company_size || userObj.profile?.company?.company_size || userObj.recruiter_profile?.company?.company_size || userObj.company?.company_size || null,
    company_description: userObj.company_description || userObj.profile?.company?.description || userObj.recruiter_profile?.company?.description || userObj.company?.description || null,
    company_gst: userObj.company_gst || userObj.profile?.company?.gst_number || userObj.recruiter_profile?.company?.gst_number || userObj.company?.gst_number || null,
    company_head_office: userObj.company_head_office || userObj.profile?.company?.head_office || userObj.recruiter_profile?.company?.head_office || userObj.company?.head_office || null
  };
};

/**
 * Request Password Reset Link
 * @param {string} email 
 * @returns {Promise<Object>} API response data
 */
export const forgotPasswordService = async (email) => {
  const response = await axios.post('/forgot-password', { email });
  return response.data;
};

/**
 * Log out from current session
 * @returns {Promise<Object>} API response data
 */
export const logoutService = async () => {
  const response = await axios.post('/logout');
  return response.data;
};

/**
 * Log out from all sessions / devices
 * @returns {Promise<Object>} API response data
 */
export const logoutAllService = async () => {
  const response = await axios.post('/logout-all');
  return response.data;
};

/**
 * Change Password Service Call
 * @param {string} currentPassword 
 * @param {string} password 
 * @param {string} passwordConfirmation 
 * @returns {Promise<Object>} API response data
 */
export const changePasswordService = async (currentPassword, password, passwordConfirmation) => {
  const response = await axios.patch('/change-password', {
    current_password: currentPassword,
    password: password,
    password_confirmation: passwordConfirmation
  });
  return response.data;
};

/**
 * Resend Email Verification Notification
 * @returns {Promise<Object>} API response data
 */
export const sendVerificationEmailService = async () => {
  const response = await axios.post('/email/resend');
  return response.data;
};

/**
 * Verify Email Link
 * @param {string|number} id 
 * @param {string} hash 
 * @param {string} searchParams expires, signature, etc.
 * @returns {Promise<Object>} API response data
 */
export const verifyEmailService = async (id, hash, searchParams) => {
  const response = await axios.get(`/email/verify/${id}/${hash}${searchParams}`);
  return response.data;
};

/**
 * Reset Password Service
 */
export const resetPasswordService = async (token, email, password, passwordConfirmation) => {
  const response = await axios.post('/reset-password', {
    token,
    email,
    password,
    password_confirmation: passwordConfirmation
  });
  return response.data;
};

/**
 * Delete / Deactivate Account
 */
export const deleteAccountService = async () => {
  const response = await axios.delete('/account');
  return response.data;
};

/**
 * Two-Factor Authentication Services
 */
export const enable2faService = async () => {
  const response = await axios.post('/2fa/enable');
  return response.data;
};

export const confirm2faService = async (code) => {
  const response = await axios.post('/2fa/confirm', { code });
  return response.data;
};

export const disable2faService = async (code) => {
  const response = await axios.post('/2fa/disable', { code });
  return response.data;
};

export const updateProfileService = async (profileData) => {
  const toArrayNewline = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    return str.split('\n').map(s => s.trim()).filter(Boolean);
  };

  const toArrayComma = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  const formData = new FormData();
  
  // Laravel PUT method spoofing inside a POST request
  formData.append('_method', 'PUT');

  // Basic Account info
  formData.append('name', profileData.name || '');
  formData.append('phone', profileData.phone || '');

  // File Uploads
  if (profileData.avatar_file instanceof File) {
    formData.append('avatar', profileData.avatar_file);
  }
  if (profileData.resume_file instanceof File) {
    formData.append('resume', profileData.resume_file);
  }

  // Candidate Profile fields (snake_case database matches & fallback text fields)
  formData.append('profession', profileData.profession || '');
  formData.append('headline', profileData.profession || '');
  formData.append('institution', profileData.institution || '');
  formData.append('about', profileData.about || '');
  formData.append('skills', toArrayComma(profileData.skills).join(', '));
  formData.append('education', toArrayNewline(profileData.education).join('\n'));
  formData.append('work_experience', toArrayNewline(profileData.work_experience).join('\n'));
  formData.append('resume_path', profileData.resume_path || '');
  formData.append('responsibilities', toArrayNewline(profileData.responsibilities).join('\n'));
  formData.append('certificates', toArrayNewline(profileData.certificates).join('\n'));
  formData.append('projects', toArrayNewline(profileData.projects).join('\n'));
  formData.append('achievements', toArrayNewline(profileData.achievements).join('\n'));
  formData.append('social_links', toArrayNewline(profileData.social_links).join('\n'));

  // Serialized array lists (supports both string column storage and dynamic relations)
  const skillsArr = toArrayComma(profileData.skills);
  skillsArr.forEach((s, i) => formData.append(`skills[${i}]`, s));
  toArrayNewline(profileData.education).forEach((e, i) => formData.append(`education[${i}]`, e));
  toArrayNewline(profileData.work_experience).forEach((w, i) => formData.append(`work_experience[${i}]`, w));
  toArrayNewline(profileData.responsibilities).forEach((r, i) => formData.append(`responsibilities[${i}]`, r));
  toArrayNewline(profileData.certificates).forEach((c, i) => formData.append(`certificates[${i}]`, c));
  toArrayNewline(profileData.projects).forEach((p, i) => formData.append(`projects[${i}]`, p));
  toArrayNewline(profileData.achievements).forEach((a, i) => formData.append(`achievements[${i}]`, a));
  toArrayNewline(profileData.social_links).forEach((sl, i) => formData.append(`social_links[${i}]`, sl));

  // Recruiter fields
  formData.append('designation', profileData.designation || '');
  formData.append('department', profileData.department || '');
  formData.append('phone_extension', profileData.phone_extension || '');
  
  // Company fields
  formData.append('company_name', profileData.company_name || '');
  formData.append('company_website', profileData.company_website || '');
  formData.append('website', profileData.company_website || '');
  formData.append('company_industry', profileData.company_industry || '');
  formData.append('industry', profileData.company_industry || '');
  formData.append('company_size', profileData.company_size || '');
  formData.append('company_description', profileData.company_description || '');
  formData.append('description', profileData.company_description || '');
  formData.append('company_gst', profileData.company_gst || '');
  formData.append('gst_number', profileData.company_gst || '');
  formData.append('company_head_office', profileData.company_head_office || '');
  formData.append('head_office', profileData.company_head_office || '');

  const response = await axios.post('/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

/**
 * Configure Axios global response interceptors for 401 Unauthorized logouts
 * @param {Function} onUnauthorized callback when token expires or is invalid
 */
export const configureAuthInterceptors = (onUnauthorized) => {
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        if (onUnauthorized) {
          onUnauthorized();
        }
      }
      return Promise.reject(error);
    }
  );
};
