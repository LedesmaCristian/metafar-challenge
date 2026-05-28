import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import env from '@/config/env';
import type { TwelveDataErrorResponse } from './types';
import { ApiError } from './ApiError';

const BASE_URL = 'https://api.twelvedata.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

// Retries on network errors and 5xx responses only. 4xx errors (bad request,
// unauthorized, rate-limit) are not retried — they require user action.
axiosRetry(apiClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError) => {
    return (
      axiosRetry.isNetworkError(error) ||
      (error.response !== undefined && error.response.status >= 500)
    );
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.params = {
      ...config.params,
      apikey: env.TWELVE_DATA_API_KEY,
    };
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Twelve Data returns HTTP 200 even for errors: { status: 'error', code: 4xx }
    const body = response.data as Partial<TwelveDataErrorResponse>;
    if (body.status === 'error' && typeof body.code === 'number') {
      return Promise.reject(
        new ApiError(body.code, String(body.code), body.message ?? `API error (code ${body.code})`),
      );
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`[API Error] HTTP ${status}:`, data);
      return Promise.reject(new ApiError(status, String(status), `HTTP error ${status}`));
    }
    if (error.request) {
      console.error('[API Error] No response received:', error.message);
    } else {
      console.error('[API Error] Request setup failed:', error.message);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
