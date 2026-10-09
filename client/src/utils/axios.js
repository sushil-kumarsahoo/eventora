import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers:{
        'content-type':'application/json'
    },
});

// Axios Request Interceptor
// Automatically intercepts every outgoing API request before it leaves the browser.
// If an authentication token exists in localStorage, it injects it into the 
// 'Authorization' header using the standard 'Bearer <token>' format so the 
// backend can authenticate the user.

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;