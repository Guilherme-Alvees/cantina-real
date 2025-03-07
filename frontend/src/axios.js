import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3333/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;

//Users
export const registerUser = (userData) =>
  axiosInstance.post("/users", userData);

export const loginUser = (credentials) =>
  axiosInstance.post("/login", credentials);

export const updateUser = (id, userData) =>
  axiosInstance.put(`/users/${id}`, userData);