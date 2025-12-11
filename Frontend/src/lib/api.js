import axios from 'axios';

const api = axios.create({
    baseURL: window.location.hostname === 'localhost'
        ? 'http://localhost:8000/api'
        : `http://${window.location.hostname}:8000/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            // For now, we'll just let the component handle it or redirect
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

export default api;
