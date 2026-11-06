// axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000',  // 🔁 Change if Flask is hosted elsewhere
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
