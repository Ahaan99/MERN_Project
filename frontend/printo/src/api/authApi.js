// api/authApi.js
import axios from "axios";
import { handle401 } from "./handle401";

const authApi = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
});

authApi.interceptors.response.use(
  (response) => response,
  (error) => handle401(error, authApi)
);

export default authApi;
