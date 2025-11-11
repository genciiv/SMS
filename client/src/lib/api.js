import axios from "axios";

// Ky konfigurim bën që çdo thirrje e API-së të shkojë drejt backend-it në portin 5000
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: false, // nuk përdorim cookie, vetëm JWT në localStorage
});

// 🔐 Interceptor për shtimin automatik të tokenit në çdo kërkesë
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Interceptor për përgjigje të pasuksesshme (p.sh. token skaduar)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // nëse token-i është i pavlefshëm ose skaduar → ridrejto në login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
