import axios from "axios";
import { API_URL } from ".";
import { getAccessToken } from "@/utils/auth.util";

const axiosRequest = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});


axiosRequest.interceptors.request.use(
  async (config: any) => {
    const token = await getAccessToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosRequest.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => Promise.reject(error)
);




export { axiosRequest };
