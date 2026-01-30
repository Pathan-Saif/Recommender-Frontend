import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8084/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export async function register(payload) {
  return api.post("/auth/register", payload);
}
export async function login(payload) {
  return api.post("/auth/login", payload);
}
export async function listItems() {
  return api.get("/items");
}
export async function createItem(item) {
  return api.post("/items", item);
}
export async function recordInteraction(interaction) {
  return api.post("/interactions", interaction);
}
export async function getRecommendations(userId, k=10) {
  // backend endpoint: /api/recommend/{userId}?k=10
  return api.get(`/recommend/${userId}?k=${k}`);
}

export default api;
