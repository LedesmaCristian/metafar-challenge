import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'https://api.twelvedata.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

// Request interceptor — inject API key into every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const apiKey = import.meta.env.VITE_TWELVE_DATA_API_KEY as string;

    if (!apiKey) {
      console.warn('VITE_TWELVE_DATA_API_KEY is not set in the environment.');
    }

    config.params = {
      ...config.params,
      apikey: apiKey,
    };

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor — centralised error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`[API Error] Status ${status}:`, data);
    } else if (error.request) {
      console.error('[API Error] No response received:', error.request);
    } else {
      console.error('[API Error] Request setup failed:', error.message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
