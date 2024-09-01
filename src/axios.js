import axios from 'axios';

// Create an instance of Axios with a base URL
const api = axios.create({
  baseURL: 'https://sandbox.dibuiltadi.com/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  }
});

// Add a response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("access_token");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);


export default api;
