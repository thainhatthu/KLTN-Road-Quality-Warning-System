// Manage Auth API
import { axiosRequest } from "../config/axios.config";
import { ForgotFormDataType, LoginDataType, LoginFormDataType, VerifyFormDataType } from "../defination/types/auth.type";

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

  signIn: async (formData: LoginFormDataType) => {
    const url = `auth/api/signin`;
    const data: LoginDataType = await axiosRequest.post(url, formData);
    return data;
  },

  forgotPass: async (formData: ForgotFormDataType) => {
    const url = `/auth/api/forgotPassword`;
    const data: LoginDataType = await axiosRequest.post(url, formData);
    return data;
  },

  // changePass: async (formData: ForgotFormDataType) => {
  //   const url = `/auth/api/changePassword`;
  //   const data: LoginDataType = await axiosRequest.post(url, formData);
  //   return data;
  // },

};
