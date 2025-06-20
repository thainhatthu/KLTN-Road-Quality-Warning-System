// Manage Auth API
import { axiosRequest } from "@/configs/axios.config";
import { ForgotFormDataType, LoginDataType, LoginFormDataType, VerifyFormDataType } from "../defination/types/auth.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export default {
  signUp: async (formData: any) => {
    const url = `/auth/api/signup`;
    const data = await axiosRequest.post(url, formData);
    return data;
  },

  verify: async (formData: VerifyFormDataType) => {
    const url = `/auth/api/verifyEmail`;
    const data = await axiosRequest.post(url, formData);
    return data;
  },
  signIn: async (formData: LoginFormDataType): Promise<LoginDataType> => {
    const url = `/auth/api/signin`;
    const response = await axiosRequest.post<ApiResponse<LoginDataType>>(url, formData);
    return response.data?.data;
  },
  forgotPass: async (formData: ForgotFormDataType) => {
    const url = `/auth/api/forgotPassword`;
    const data = await axiosRequest.post<LoginDataType>(url, formData);
    return data;
  },

  changePass: async (formData: ForgotFormDataType) => {
    const url = `/auth/api/changePassword`;
    const response = await axiosRequest.post<ApiResponse<LoginDataType>>(url, formData);
    const data: LoginDataType = response.data?.data;
    return data;
  },

  logout: async () => {
    try {
      await AsyncStorage.clear();
      console.log("Logout successful");
    } catch (error) {
      console.error("Error when logout:", error);
      throw error;
    }
  }
};
