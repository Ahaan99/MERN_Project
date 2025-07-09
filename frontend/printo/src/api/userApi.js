import axios from 'axios';
import { handle401 } from './handle401';

const userApi = axios.create({
  baseURL: "http://localhost:5000/api/users", // Changed from "user" to "users"
  withCredentials: true, // Allow cookies to be sent with requests
});


userApi.interceptors.response.use(
  (response) => response,
  (error) => handle401(error, userApi)
);


export default userApi;
