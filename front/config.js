const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:9000/api'
    : '/api';
export default API_URL;