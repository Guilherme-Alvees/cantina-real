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
export const admStatus = (id, adm_user) =>
  axiosInstance.put(`/users/${id}/admin`, { adm_user });

export const getAllUsers = () => axiosInstance.get("/users");

export const registerUser = (userData) =>
  axiosInstance.post("/users", userData);

export const loginUser = (credentials) =>
  axiosInstance.post("/login", credentials);

export const updateUser = (id, userData) =>
  axiosInstance.put(`/users/${id}`, userData);

export const lastThreeOrders = (id) =>
  axiosInstance.get(`/orders/last-three/${id}`);

//Products
export const registerNewProduct = (userData) =>
  axiosInstance.post("/products", userData);

export const getAllProducts = () => axiosInstance.get("/products");

export const getFoodAndDrinks = () =>
  axiosInstance.get("/products/foods-and-drinks");

export const deleteOneProduct = (id) => axiosInstance.delete(`/products/${id}`);

export const editOneProduct = (id) => axiosInstance.put(`/products/${id}`);

//Order
export const sendOrder = (userData) => axiosInstance.post("/orders", userData);
