import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://backend-cyv9.onrender.com/api',
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.request.use((configuracion) => {
    const token = localStorage.getItem('token');

    if (token) {
        configuracion.headers.Authorization = `Bearer ${token}`;
    }

    return configuracion;
});

export default api;