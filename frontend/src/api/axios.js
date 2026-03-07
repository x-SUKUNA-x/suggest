import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});
console.log(process.env.REACT_APP_API_URL)
// Add a request interceptor to automatically attach the auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
