// Manage Auth API
import { axiosRequest } from "@/configs/axios.config";
import { ForgotFormDataType, LoginDataType, LoginFormDataType, VerifyFormDataType } from "../defination/types/auth.type";

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

  // changePass: async (formData: ForgotFormDataType) => {
  //   const url = `/auth/api/changePassword`;
  //   const data: LoginDataType = await axiosRequest.post(url, formData);
  //   return data;
  // },

};
