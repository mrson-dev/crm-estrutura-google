import axios from 'axios';

const apiClient = axios.create({
  // Você substituirá esta URL pela URL da sua API no Cloud Run
  baseURL: 'https://api.example.com/v1', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Você pode adicionar interceptors aqui para lidar com autenticação (tokens JWT)
// Exemplo:
// apiClient.interceptors.request.use(async (config) => {
//   const token = await firebase.auth().currentUser?.getIdToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default apiClient;
