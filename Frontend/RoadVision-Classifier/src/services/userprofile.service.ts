import { axiosRequest } from "../config/axios.config";
import {
  EditProfileDataType,
  ChangePasswordDataType,
  UploadAvatarType,
} from "../defination/types/profile.type";
import { getAccessToken } from "../utils/auth.util";
const api_url = import.meta.env.VITE_BASE_URL;

export default {
  getProfile: async ({}) => {
    const url = `/user/api/getProfile`;
    const token = getAccessToken();
    const requestUrl = `${url}?token=${token}`;
    try {
      const response = await axiosRequest.get(requestUrl);
      return response;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
  
  getAvatar: async (username: string) => {
    const url = `/user/api/getAvatar`;
    return `${api_url}${url}?username=${username}`; 
  },
  
  uploadAvatar: async (formData: UploadAvatarType) => {
    const url = `/user/api/uploadAvatar`;
    const token = getAccessToken();
    const requestUrl = `${url}?token=${token}`;
    try {
      const data = await axiosRequest.post(requestUrl, formData, {
        headers: {
          "accept": "application/json",
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
