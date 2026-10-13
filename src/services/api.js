import axios from 'axios';

// Dirección del backend Laravel. Se puede cambiar desde el archivo .env.local.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
});

// Antes de cada petición se agrega el token de la sesión, si existe.
api.interceptors.request.use((configuracion) => {
  const token = localStorage.getItem('token');

  if (token) {
    configuracion.headers.Authorization = `Bearer ${token}`;
  }

  return configuracion;
});

export default api;
