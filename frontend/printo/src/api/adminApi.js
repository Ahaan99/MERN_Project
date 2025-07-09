// File: src/api/adminApi.js

import axios from "axios";
import { handle401 } from "./handle401";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api/admin",
  withCredentials: true,
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => handle401(error, adminApi)
);

export default adminApi;
