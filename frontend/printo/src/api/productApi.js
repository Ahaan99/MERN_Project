import axios from "axios";
import { handle401 } from "./handle401";

const productApi = axios.create({
  baseURL: "http://localhost:5000/api/user/product",
  withCredentials: true, // Allow cookies to be sent with requests
});

productApi.interceptors.response.use(
  (response) => response,
  (error) => handle401(error, productApi)
);

export default productApi;
