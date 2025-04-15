import axios, {AxiosResponse, AxiosError} from 'axios';
import Store from '../store';

const API_BASE_URL: string = 'https://gestionale-latest.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout of 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async config => {
    const token: string | null = await getAuthToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('Token scaduto o non valido. Reindirizzamento al login...');

      await Store.removeData('token');
    }
    return Promise.reject(error);
  },
);

// Function to retrieve auth token from storage
async function getAuthToken(): Promise<string | null> {
  return await Store.getData('token');
}

export default apiClient;
