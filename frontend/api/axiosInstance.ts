import axios, { AxiosInstance, AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de response — gestionare centralizată a erorilor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          console.error('Cerere invalidă:', error.response.data);
          break;
        case 404:
          console.error('Resursă negăsită');
          break;
        case 500:
          console.error('Eroare de server');
          break;
        default:
          console.error('Eroare API:', error.response.data);
      }
    } else if (error.request) {
      console.error('Fără răspuns de la server:', error.request);
    } else {
      console.error('Eroare la configurarea request-ului:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;