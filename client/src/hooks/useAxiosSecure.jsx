import axios from "axios";

import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_URL,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      console.log('Current token:', token); // Debug log
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // intercept response
  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response) {
        const status = error.response.status;
        if (status === 401 || status === 403) {
          await logOut();
          navigate("/login");
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
