import { UserType } from "./user.type";

//Define type data of API respone
export type LoginFormDataType = {
  username: string;
  password: string;
};
export type LoginDataType = {
  info: UserType;
  token: string;
  role: "user" | "admin" | "technical";
};
export type VerifyFormDataType = Partial<{
  username: string;
  password: string;
  email: string;
  OTP: string;
}>;
export type ForgotFormDataType = {
  email: string;
};

// export type ChangePassFormDataType = {
//   current_password: string;
//   new_password: string;
//   confirm_password: string;
// };
