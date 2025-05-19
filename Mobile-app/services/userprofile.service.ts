import { axiosRequest } from "@/configs/axios.config";
import {
  EditProfileDataType,
  ChangePasswordDataType,
  UploadAvatarType,
} from "../defination/types/profile.type";
import { API_URL } from "@/configs";
import { getAccessToken } from "../utils/auth.util";

type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export default {
  getProfile: async (p0: {}) => {
    const url = `/user/api/getProfile`;
    const token = await getAccessToken();
    const requestUrl = `${url}?token=${token}`;
    try {
      const response = await axiosRequest.get(requestUrl);
      if (typeof response.data === "string") {
        console.warn("⚠️ Received HTML instead of JSON:", response.data);
        throw new Error("Received HTML instead of expected JSON. Check ngrok or backend.");
      }
      const responseData = response.data as ApiResponse<any>;
      return responseData.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
  getAvatar: async (username: string) => {
    const url = `/user/api/getAvatar`;
    return `${API_URL}${url}?username=${username}`;
  },

  uploadAvatar: async (formData: UploadAvatarType) => {
    const url = `/user/api/uploadAvatar`;
    const token = getAccessToken();
    const requestUrl = `${url}?token=${token}`;
    try {
      const data = await axiosRequest.post(requestUrl, formData, {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error;
    }
  },

  editProfile: async (formData: EditProfileDataType) => {
    const url = `/user/api/editProfile`;
    const token = getAccessToken();
    const requestUrl = `${url}?token=${token}`;
    try {
      const data = await axiosRequest.post(requestUrl, formData);
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  changePassword: async (formData: ChangePasswordDataType) => {
    const url = `/auth/api/changePassword`;
    try {
      const data = await axiosRequest.post(url, formData);
      return data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },
};
