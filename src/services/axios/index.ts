import axios, {AxiosResponse} from 'axios';
import Store from '../store';

const API_BASE_URL: string = 'https://gestionale-latest.onrender.com'; // Sostituisci con l'URL della tua API

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout di 10 secondi
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere il token di autenticazione se presente
apiClient.interceptors.request.use(
  async (config: any) => {
    const token: string | null = await getAuthToken();

    if (token && config.headers) {
      console.log(token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

// Interceptor per gestire le risposte e gli errori
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      console.log("Token scaduto. Effettua di nuovo l'accesso.");
      // Puoi gestire il logout o il refresh del token qui
    }
    return Promise.reject(error);
  },
);

export default apiClient;

// Funzione fittizia per ottenere il token (da implementare)
async function getAuthToken(): Promise<string | null> {
  return await Store.getData('token');
}
