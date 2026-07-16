import axios from 'axios';

// Set up base URL for Laravel Sanctum API
axios.defaults.baseURL = 'http://192.168.1.31:8000/api';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Retrieve cached token on startup to configure default authorization header
const cachedUser = localStorage.getItem('currentUser');
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
 * @param {string} phone 
 * @param {string} password 
 * @param {string} passwordConfirmation 
 * @returns {Promise<Object>} API response data
 */
export const signUpService = async (name, email, phone, password, passwordConfirmation) => {
  const response = await axios.post('/register', {
    name,
    email,
    phone,
    password,
    password_confirmation: passwordConfirmation
  });
  return response.data;
};

/**
 * Fetch currently authenticated user profile
 * @returns {Promise<Object>} API user data
 */
export const getUserProfileService = async () => {
  const response = await axios.get('/user');
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
