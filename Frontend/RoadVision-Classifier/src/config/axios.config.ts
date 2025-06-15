import axios from "axios";
import { getAccessToken } from "../utils/auth.util";
import { message } from "antd";
let loadingMessage: any = null;
let requestCount = 0;

const showLoading = () => {
  if (requestCount === 0 && !loadingMessage) {
    // Tạo lớp overlay
    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    overlay.style.zIndex = "100";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.color = "white";
    overlay.style.fontSize = "20px";

    // Thêm lớp overlay vào body
    document.body.appendChild(overlay);
    loadingMessage = message.loading("Loading...", 0); // Không tự động ẩn
  }
  requestCount++;
};

const handleHideOverlay = () => {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    document.body.removeChild(overlay);
  }
};
const showError = (errorMessage: string) => {
  setTimeout(() => {
    handleHideOverlay();
    message.error(errorMessage);
  }, 500);
};
// Ẩn loading
const hideLoading = () => {
  requestCount--;
  if (requestCount <= 0 && loadingMessage) {
    handleHideOverlay();

    loadingMessage(); // Ẩn thông báo
    loadingMessage = null;
    requestCount = 0;
  }
};

const BASE_URL = "https://b151-42-116-6-46.ngrok-free.app";

const axiosRequest = axios.create({
  baseURL: BASE_URL,
});

axiosRequest.interceptors.request.use((config) => {
  showLoading();

  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
axiosRequest.interceptors.response.use(
  (response) => {
    hideLoading();
    return response?.data?.data;
  },
  (error) => {
    hideLoading();

    showError(error?.response?.data?.message || "Internal Server Error");

    return Promise.reject(error); 
  }
);

export { axiosRequest };
